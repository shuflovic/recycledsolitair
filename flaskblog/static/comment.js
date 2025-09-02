
// Comment functionality for development page
console.log('Comment script loaded');

document.addEventListener('DOMContentLoaded', function() {
    const commentInput = document.getElementById('comments');
    const tableBody = document.getElementById('commentDataTableBody1');

    // Load existing comments
    async function loadComments() {
        const { data, error } = await supabaseClient
            .from('comments')
            .select('id, name, comment');

        if (error) {
            console.error('Error loading comments:', error);
            return;
        }

        tableBody.innerHTML = '';
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${row.name}</td><td>${row.comment}</td>`;
            tableBody.appendChild(tr);
        });
    }

    // Add new comment when user presses Enter
    commentInput.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault(); // Prevent default behavior (e.g., adding newline)
            const commentText = commentInput.value.trim();
            if (!commentText) return;

            const { data, error } = await supabaseClient
                .from('comments')
                .insert([{ name: 'Anonymous', comment: commentText }]);

            if (error) {
                console.error('Failed to add comment:', error);
            } else {
                commentInput.value = '';
                loadComments();
            }
        }
    });

    // Load on page load
    document.addEventListener('DOMContentLoaded', loadComments);

    document.getElementById('submitComment').addEventListener('click', async () => {
        const commentText = commentInput.value.trim();
        if (!commentText) return;

        const { data, error } = await supabaseClient
            .from('comments')
            .insert([{ name: 'Anonymous', comment: commentText }]);

        if (error) {
            console.error('Failed to add comment:', error);
        } else {
            commentInput.value = '';
            loadComments();
        }
    });
});
