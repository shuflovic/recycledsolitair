const SUPABASE_URL = 'https://rigsljqkzlnemypqjlbk.supabase.co';
let supabaseClient = null;

function initializeSupabase() {
    if (!supabaseClient && window.SUPABASE_API_KEY) {
        try {
            supabaseClient = supabase.createClient(SUPABASE_URL, window.SUPABASE_API_KEY);
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

// Initialize when DOM is ready and API key is available
document.addEventListener('DOMContentLoaded', function() {
    // Check if API key is available, if not wait a bit
    if (window.SUPABASE_API_KEY) {
        initializeSupabase();
    } else {
        setTimeout(initializeSupabase, 100);
    }
});