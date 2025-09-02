const SUPABASE_URL = 'https://rigsljqkzlnemypqjlbk.supabase.co';
const SUPABASE_KEY = '{{ supabase_key }}'; // <-- The key is now directly here

let supabaseClient = null;

function initializeSupabase() {
    if (!supabaseClient) {
        try {
            supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            window.supabaseClient = supabaseClient;
            console.log('Supabase client initialized successfully');

            // Notify script.js that the client is ready
            if (typeof window.onSupabaseInitialized === 'function') {
                window.onSupabaseInitialized();
            }
        } catch (error) {
            console.error('Failed to initialize Supabase client:', error);
        }
    } else {
        console.log('Supabase client already initialized. Skipping.');
    }
}

// Automatically initialize when the script loads
initializeSupabase();