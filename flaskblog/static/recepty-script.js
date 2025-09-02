let recepty = [];

// Load recipes from Supabase
async function loadReceptyFromDB() {
    try {
        const { data, error } = await supabaseClient
            .from('recepty') // Using 'recepty' table in Supabase
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error loading recepty:', error);
            loadDummyRecepty(); // Fallback to dummy data
            return;
        }

        recepty = data.map(recept => ({
            id: recept.id,
            title: recept.title,
            content: recept.content,
            fullContent: recept.full_content || `<h2>${recept.title}</h2><p>${recept.content}</p>`,
            imageUrl: recept.image_url || ''
        }));

        displayRecepty();
    } catch (err) {
        console.error('Database connection error:', err);
        loadDummyRecepty();
    }
}

// Fallback dummy data for recipes
function loadDummyRecepty() {
    recepty = [
        {
            id: 1,
            title: "Classic Pancakes",
            content: "Start your day with fluffy, homemade pancakes. This simple recipe is a crowd-pleaser and easy to customize with your favorite toppings.",
            fullContent: `
                <h2>Classic Pancakes</h2>
                <p>A simple recipe for delicious, fluffy pancakes.</p>
                <h3>Ingredients:</h3>
                <ul>
                    <li>1 cup all-purpose flour</li>
                    <li>2 tablespoons sugar</li>
                    <li>2 teaspoons baking powder</li>
                    <li>1/2 teaspoon salt</li>
                    <li>1 egg</li>
                    <li>1 cup milk</li>
                    <li>2 tablespoons melted butter</li>
                </ul>
                <h3>Instructions:</h3>
                <p>Combine dry ingredients. In another bowl, mix egg, milk, and melted butter. Pour wet ingredients into dry and whisk until just combined. Cook on a hot griddle until golden brown.</p>
            `,
            imageUrl: ''
        },
        {
            id: 2,
            title: "Simple Spaghetti Bolognese",
            content: "A rich and savory meat sauce served over spaghetti. This classic Italian-American dish is perfect for a comforting family dinner.",
            fullContent: `
                <h2>Simple Spaghetti Bolognese</h2>
                <p>A classic recipe for a hearty and flavorful meat sauce.</p>
                <h3>Ingredients:</h3>
                <ul>
                    <li>1 lb ground beef</li>
                    <li>1 onion, chopped</li>
                    <li>2 cloves garlic, minced</li>
                    <li>1 can (28 oz) crushed tomatoes</li>
                    <li>1 teaspoon dried oregano</li>
                    <li>Salt and pepper to taste</li>
                    <li>Cooked spaghetti for serving</li>
                </ul>
                <h3>Instructions:</h3>
                <p>In a large skillet, cook ground beef, onion, and garlic until meat is browned. Drain fat. Stir in crushed tomatoes, oregano, salt, and pepper. Bring to a simmer, then reduce heat and let it simmer for at least 30 minutes. Serve over hot spaghetti.</p>
            `,
            imageUrl: ''
        }
    ];
    displayRecepty();
}

// Function to display recipes
function displayRecepty() {
    const container = document.getElementById('recepty-container');
    if (!container) return; // Exit if container doesn't exist on the page
    container.innerHTML = '';

    recepty.forEach(recept => {
        const receptDiv = document.createElement('div');
        receptDiv.className = 'recept'; // Use 'recept' for styling

        receptDiv.innerHTML = `
            <h3>${recept.title}</h3>
            <p>${recept.content}</p>
            ${recept.imageUrl ? `<img src="${recept.imageUrl}" alt="Recipe Image" style="max-width:100%; border-radius: 10px; margin-top: 10px;">` : ''}
            <button onclick="showReceptDetail(${recept.id})">View Recipe</button>
        `;

        container.appendChild(receptDiv);
    });
}

// Function to show recipe detail
function showReceptDetail(receptId) {
    const recept = recepty.find(r => r.id === receptId);
    if (recept) {
        const html = `
            ${recept.imageUrl ? `<img src="${recept.imageUrl}" alt="Recipe Image" style="max-width:100%; border-radius: 10px; margin-bottom: 20px;">` : ''}
            ${recept.fullContent}
        `;
        document.getElementById('recept-detail-content').innerHTML = html;
        showSection('recept-detail');
    }
}

// Function to add a new recipe
async function addNewRecept() {
    const title = document.getElementById('new-recept-title').value.trim();
    const content = document.getElementById('new-recept-content').value.trim();
    const fullContent = document.getElementById('new-recept-full').value.trim();
    const imageFile = document.getElementById('recept-image').files[0];

    if (!title || !content) {
        alert('Please fill in at least the title and preview content.');
        return;
    }

    let imageUrl = '';

    // Upload image if selected (uses the same 'recycle' bucket)
    if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `recept-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabaseClient
            .storage
            .from('recycle')
            .upload(filePath, imageFile);

        if (uploadError) {
            console.error('Image upload failed:', uploadError.message);
            alert('Image upload failed. Please try again.');
            return;
        }

        const { data: publicUrlData } = supabaseClient
            .storage
            .from('recycle')
            .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
    }

    // Insert recipe into the 'recepty' table in Supabase
    const { data, error } = await supabaseClient
        .from('recepty')
        .insert([{
            title,
            content,
            full_content: fullContent || `<h2>${title}</h2><p>${content}</p>`,
            image_url: imageUrl
        }])
        .select()
        .single();

    if (error || !data) {
        console.error('Supabase insert error:', error?.message);
        alert('Error saving recipe. Check console for details.');
        return;
    }

    const newRecept = {
        id: data.id,
        title: data.title,
        content: data.content,
        fullContent: data.full_content,
        imageUrl: data.image_url
    };

    recepty.unshift(newRecept);
    displayRecepty();

    // Clear form
    document.getElementById('new-recept-title').value = '';
    document.getElementById('new-recept-content').value = '';
    document.getElementById('new-recept-full').value = '';
    document.getElementById('recept-image').value = '';

    alert('Recipe saved successfully!');
}

document.addEventListener('DOMContentLoaded', () => {
    loadReceptyFromDB();
});