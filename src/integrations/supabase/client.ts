// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dsdxwfdvpydztxkbjqfb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZHh3ZmR2cHlkenR4a2JqcWZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MDg1MTAsImV4cCI6MjA2NDA4NDUxMH0.urN1sXDoCYoANC7OAG1McxqZeeCV19Yr6ts_CMZMYJI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);