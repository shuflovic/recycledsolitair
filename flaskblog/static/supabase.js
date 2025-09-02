const SUPABASE_URL = 'https://rigsljqkzlnemypqjlbk.supabase.co';
const SUPABASE_KEY = '{{ supabase_key }}'; // This will be replaced by Flask
let supabaseClient = null;

function initializeSupabase() {
    if (!supabaseClient) {
        try {
            supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            window.supabaseClient = supabaseClient;
            console.log('Supabase client initialized successfully');
            if (typeof window.onSupabaseInitialized === 'function') {
                window.onSupabaseInitialized();
            }
        } catch (error) {
            console.error('Failed to initialize Supabase client:', error);
        }
    }
}

initializeSupabase();