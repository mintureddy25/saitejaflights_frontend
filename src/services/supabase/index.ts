// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jzrisvwferxhpijyiqcr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6cmlzdndmZXJ4aHBpanlpcWNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5OTYyNjUsImV4cCI6MjA1ODU3MjI2NX0.CIpgntY3I9_OfD1h-gUuRFMiz4FgAyf4d4IVSqp0hmI'; // Make sure to keep it secure

export const supabase = createClient(supabaseUrl, supabaseKey);
