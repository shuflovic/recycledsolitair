
// Comment functionality for development page
console.log('Comment script loaded');

let commentInput, tableBody;

// Store the original callback and extend it
const originalCallback = window.onSupabaseInitialized;
window.onSupabaseInitialized = function() {
    if (originalCallback) originalCallback();
    console.log('Supabase initialized, loading comments...');
    loadComments(); // Load comments when Supabase is ready
};

document.addEventListener('DOMContentLoaded', function() {
    commentInput = document.getElementById('comments');
    tableBody = document.getElementById('commentDataTableBody1');

    if (!commentInput || !tableBody) {
        console.error('Comment elements not found');
        return;
    }

    // Load existing comments
    async function loadComments() {
        if (!window.supabaseClient) {
            console.error('Supabase client not initialized yet, waiting...');
            setTimeout(loadComments, 500); // Try again in 500ms
            return;
        }

        try {
            console.log('Loading comments from database...');
            const { data, error } = await window.supabaseClient
                .from('comments')
                .select('id, name, comment')
                .order('id', { ascending: false });

            if (error) {
                console.error('Error loading comments:', error);
                return;
            }

            console.log('Comments loaded:', data);
            tableBody.innerHTML = '';
            data.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${row.name}</td><td>${row.comment}</td>`;
                tableBody.appendChild(tr);
            });
        } catch (err) {
            console.error('Database connection error:', err);
        }
    }

    // Make loadComments globally accessible
    window.loadComments = loadComments;

    // Add new comment when user presses Enter
    commentInput.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
            await addComment();
        }
    });

    // Add comment function
    async function addComment() {
        const commentText = commentInput.value.trim();
        if (!commentText) {
            console.log('No comment text entered');
            return;
        }

        if (!window.supabaseClient) {
            console.error('Supabase client not available');
            alert('Database not ready, please try again in a moment');
            return;
        }

        try {
            console.log('Adding comment:', commentText);
            const { data, error } = await window.supabaseClient
                .from('comments')
                .insert([{ name: 'Anonymous', comment: commentText }])
                .select();

            if (error) {
                console.error('Failed to add comment:', error);
                alert('Failed to add comment: ' + error.message);
            } else {
                console.log('Comment added successfully:', data);
                commentInput.value = '';
                loadComments();
            }
        } catch (err) {
            console.error('Database connection error:', err);
            alert('Database connection error');
        }
    }

    // Submit button click handler
    const submitButton = document.getElementById('submitComment');
    if (submitButton) {
        submitButton.addEventListener('click', addComment);
    }

    // Initial load attempt (will retry if Supabase not ready)
    if (window.supabaseClient) {
        loadComments();
    }
});
