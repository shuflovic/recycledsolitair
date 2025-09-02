// supabase-config.js
const SUPABASE_URL = 'https://rigsljqkzlnemypqjlbk.supabase.co';
const SUPABASE_KEY = '';

// Initialize the Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Export the client if using modules
// export { supabaseClient };