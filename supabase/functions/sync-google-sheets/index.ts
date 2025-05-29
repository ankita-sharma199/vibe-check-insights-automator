
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GoogleSheetsRow {
  timestamp: string;
  employeeName: string;
  department: string;
  satisfactionScore: number;
  happinessIndex: number;
  teamDynamicsScore: number;
  leadershipScore: number;
  growthOpportunitiesScore: number;
  companyCultureScore: number;
  openComments: string;
}

interface SentimentResult {
  score: number;
  label: 'positive' | 'neutral' | 'negative';
}

async function getGoogleSheetsAccessToken(): Promise<string> {
  const serviceAccountJson = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON');
  if (!serviceAccountJson) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not found');
  }

  const serviceAccount = JSON.parse(serviceAccountJson);
  
  // Create JWT for Google OAuth2
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  // Simple JWT creation (in production, use proper JWT library)
  const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payloadB64 = btoa(JSON.stringify(payload));
  
  // For simplicity, we'll use Google's token endpoint directly
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: await createJWT(header, payloadB64, serviceAccount.private_key),
    }),
  });

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

async function createJWT(header: string, payload: string, privateKey: string): Promise<string> {
  // This is a simplified JWT creation - in production use proper crypto
  const data = `${header}.${payload}`;
  
  // Import the private key
  const key = await crypto.subtle.importKey(
    'pkcs8',
    new TextEncoder().encode(privateKey.replace(/-----BEGIN PRIVATE KEY-----|\n|-----END PRIVATE KEY-----/g, '')),
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  );

  // Sign the data
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(data)
  );

  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
  return `${data}.${signatureB64}`;
}

async function fetchGoogleSheetsData(accessToken: string): Promise<GoogleSheetsRow[]> {
  const sheetsId = Deno.env.get('GOOGLE_SHEETS_ID');
  const range = 'Form Responses 1!A:K'; // Adjust range based on your sheet structure
  
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetsId}/values/${range}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();
  const rows = data.values || [];
  
  // Skip header row and map data
  return rows.slice(1).map((row: string[]) => ({
    timestamp: row[0] || '',
    employeeName: row[1] || '',
    department: row[2] || '',
    satisfactionScore: parseInt(row[3]) || 0,
    happinessIndex: parseInt(row[4]) || 0,
    teamDynamicsScore: parseInt(row[5]) || 0,
    leadershipScore: parseInt(row[6]) || 0,
    growthOpportunitiesScore: parseInt(row[7]) || 0,
    companyCultureScore: parseInt(row[8]) || 0,
    openComments: row[9] || '',
  }));
}

async function analyzeSentiment(text: string): Promise<SentimentResult> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey || !text.trim()) {
    return { score: 0, label: 'neutral' };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Analyze the sentiment of employee feedback. Return a JSON object with "score" (number between -1 and 1) and "label" (positive, neutral, or negative). Be concise.'
          },
          {
            role: 'user',
            content: `Analyze this employee feedback: "${text}"`
          }
        ],
        temperature: 0.1,
        max_tokens: 100,
      }),
    });

    const result = await response.json();
    const content = result.choices[0].message.content;
    
    // Parse the JSON response
    try {
      const sentimentData = JSON.parse(content);
      return {
        score: Math.max(-1, Math.min(1, sentimentData.score || 0)),
        label: ['positive', 'neutral', 'negative'].includes(sentimentData.label) 
          ? sentimentData.label 
          : 'neutral'
      };
    } catch {
      // Fallback: simple keyword-based analysis
      const positiveWords = ['good', 'great', 'excellent', 'love', 'amazing', 'fantastic'];
      const negativeWords = ['bad', 'terrible', 'hate', 'awful', 'poor', 'disappointing'];
      
      const lowerText = text.toLowerCase();
      const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
      const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
      
      if (positiveCount > negativeCount) {
        return { score: 0.5, label: 'positive' };
      } else if (negativeCount > positiveCount) {
        return { score: -0.5, label: 'negative' };
      }
      return { score: 0, label: 'neutral' };
    }
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return { score: 0, label: 'neutral' };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting Google Sheets sync...');
    
    // Initialize Supabase client with service role key
    const supabaseUrl = 'https://dsdxwfdvpydztxkbjqfb.supabase.co';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseServiceKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY not found');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get access token for Google Sheets
    const accessToken = await getGoogleSheetsAccessToken();
    console.log('Got Google Sheets access token');

    // Fetch data from Google Sheets
    const sheetsData = await fetchGoogleSheetsData(accessToken);
    console.log(`Fetched ${sheetsData.length} rows from Google Sheets`);

    // Get the latest timestamp from our database to avoid duplicates
    const { data: latestEntry } = await supabase
      .from('employee_feedback')
      .select('timestamp')
      .order('timestamp', { ascending: false })
      .limit(1);

    const latestTimestamp = latestEntry?.[0]?.timestamp || '1970-01-01T00:00:00Z';
    console.log(`Latest timestamp in DB: ${latestTimestamp}`);

    // Process and insert new data
    const newEntries = [];
    
    for (const row of sheetsData) {
      if (!row.timestamp) continue;
      
      // Parse timestamp and check if it's newer than our latest entry
      const rowTimestamp = new Date(row.timestamp);
      if (rowTimestamp <= new Date(latestTimestamp)) continue;

      // Analyze sentiment for open comments
      const sentiment = await analyzeSentiment(row.openComments);
      
      const entry = {
        timestamp: rowTimestamp.toISOString(),
        employee_name: row.employeeName,
        department: row.department,
        satisfaction_score: row.satisfactionScore,
        happiness_index: row.happinessIndex,
        team_dynamics_score: row.teamDynamicsScore,
        leadership_score: row.leadershipScore,
        growth_opportunities_score: row.growthOpportunitiesScore,
        company_culture_score: row.companyCultureScore,
        open_comments: row.openComments,
        sentiment_score: sentiment.score,
        sentiment_label: sentiment.label,
      };

      newEntries.push(entry);
    }

    console.log(`Processing ${newEntries.length} new entries`);

    // Insert new entries into database
    if (newEntries.length > 0) {
      const { data, error } = await supabase
        .from('employee_feedback')
        .insert(newEntries);

      if (error) {
        console.error('Database insert error:', error);
        throw error;
      }

      console.log(`Successfully inserted ${newEntries.length} new entries`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: newEntries.length,
        message: `Successfully processed ${newEntries.length} new entries`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in sync-google-sheets function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
