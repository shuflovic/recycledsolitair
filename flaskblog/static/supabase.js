
// supabase-config.js
const SUPABASE_URL = 'https://rigsljqkzlnemypqjlbk.supabase.co';
// The API key will be passed from the Flask backend
let SUPABASE_KEY = '';

// Function to initialize Supabase client with key from backend
function initializeSupabase(apiKey) {
    SUPABASE_KEY = apiKey;
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('Supabase client initialized successfully');
}

// Fallback initialization if key is already available
if (typeof window !== 'undefined' && window.SUPABASE_API_KEY) {
    initializeSupabase(window.SUPABASE_API_KEY);
}
