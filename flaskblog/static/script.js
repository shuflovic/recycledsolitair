let articles = [];

  // Load articles from Supabase
  async function loadArticlesFromDB() {
    try {
      const { data, error } = await supabaseClient
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading articles:', error);
        // Fallback to dummy data if database fails
        loadDummyArticles();
        return;
      }

articles = data.map(article => ({
  id: article.id,
  title: article.title,
  content: article.content,
  fullContent: article.full_content || `<h2>${article.title}</h2><p>${article.content}</p>`,
  imageUrl: article.image_url || ''
}));


      displayArticles();
    } catch (err) {
      console.error('Database connection error:', err);
      loadDummyArticles();
    }
  }

  // Fallback dummy data (in case database is not available)
  function loadDummyArticles() {
    articles = [
      {
        id: 1,
        title: "5 Creative Ways to Upcycle Old Furniture",
        content: "Don't throw away that old chair or table! With a little creativity and some basic tools, you can transform worn-out furniture into stunning statement pieces. Sand, paint, and reupholster to give new life to forgotten treasures.",
        fullContent: `
          <h2>5 Creative Ways to Upcycle Old Furniture</h2>
          <p>Don't throw away that old chair or table! With a little creativity and some basic tools, you can transform worn-out furniture into stunning statement pieces.</p>

          <h3>1. Sand and Paint</h3>
          <p>Start with a good sanding to remove old finishes. Apply primer, then paint in bold colors or create interesting patterns with stencils.</p>

          <h3>2. Reupholster Seats</h3>
          <p>Replace worn fabric with vibrant new materials. Choose durable fabrics that match your décor style.</p>

          <h3>3. Add New Hardware</h3>
          <p>Switch out old handles and knobs for modern alternatives. This simple change can completely transform the look.</p>

          <h3>4. Mix and Match Styles</h3>
          <p>Combine vintage pieces with modern elements for an eclectic, personalized look that tells a story.</p>

          <h3>5. Create Multi-Purpose Pieces</h3>
          <p>Turn an old dresser into a TV stand, or transform a ladder into a bookshelf. Think outside the box!</p>
        `
      },
      {
        id: 2,
        title: "Plastic Bottle Garden: Growing Green from Waste",
        content: "Turn plastic bottles into a thriving vertical garden! Cut, drill drainage holes, and hang them to create an eco-friendly growing space. Perfect for herbs, small vegetables, and flowers while reducing plastic waste.",
        fullContent: `
          <h2>Plastic Bottle Garden: Growing Green from Waste</h2>
          <p>Turn plastic bottles into a thriving vertical garden! This sustainable gardening method is perfect for small spaces and helps reduce plastic waste.</p>

          <h3>Materials Needed</h3>
          <p>Large plastic bottles (2L soda bottles work great), drill, potting soil, seeds or seedlings, and rope or wire for hanging.</p>

          <h3>Step-by-Step Process</h3>
          <p>Cut openings in the bottles, drill drainage holes in the bottom, fill with soil, and plant your seeds. Hang them in a sunny location.</p>

          <h3>Best Plants to Grow</h3>
          <p>Herbs like basil, mint, and cilantro thrive in bottle gardens. Small vegetables like lettuce and cherry tomatoes also work well.</p>

          <h3>Maintenance Tips</h3>
          <p>Water regularly but avoid overwatering. Rotate bottles occasionally for even growth. Harvest frequently to encourage new growth.</p>
        `
      }
    ];
    displayArticles();
  }

  // Function to display articles
function displayArticles() {
  const container = document.getElementById('articles-container');
  container.innerHTML = '';

  articles.forEach(article => {
    const articleDiv = document.createElement('div');
    articleDiv.className = 'article';

    articleDiv.innerHTML = `
      <h3>${article.title}</h3>
      <p>${article.content}</p>
      ${article.imageUrl ? `<img src="${article.imageUrl}" alt="Article Image" style="max-width:100%; border-radius: 10px; margin-top: 10px;">` : ''}
      <button onclick="showArticleDetail(${article.id})">Read more</button>
    `;

    container.appendChild(articleDiv);
  });
}


  // Function to show article detail
function showArticleDetail(articleId) {
  const article = articles.find(a => a.id === articleId);
  if (article) {
    const html = `
      ${article.imageUrl ? `<img src="${article.imageUrl}" alt="Article Image" style="max-width:100%; border-radius: 10px; margin-bottom: 20px;">` : ''}
      ${article.fullContent}
    `;
    document.getElementById('article-detail-content').innerHTML = html;
    showSection('article-detail');
  }
}

  // Function to add new article
 async function addNewArticle() {
  const title = document.getElementById('new-article-title').value.trim();
  const content = document.getElementById('new-article-content').value.trim();
  const fullContent = document.getElementById('new-article-full').value.trim();
  const imageFile = document.getElementById('article-image').files[0];

  if (!title || !content) {
    alert('Please fill in at least the title and preview content.');
    return;
  }

  let imageUrl = '';

  // Upload image if selected
  if (imageFile) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabaseClient
      .storage
      .from('recycle')
      .upload(filePath, imageFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Image upload failed:', uploadError.message);
      alert('Image upload failed. Try a different file.');
      return;
    }

    const { data: publicUrlData } = supabaseClient
      .storage
      .from('recycle')
      .getPublicUrl(filePath);

    imageUrl = publicUrlData.publicUrl;
  }

  // Insert article into DB
  const { data, error } = await supabaseClient
    .from('articles')
    .insert([
      {
        title,
        content,
        full_content: fullContent || `<h2>${title}</h2><p>${content}</p>`,
        image_url: imageUrl
      }
    ])
    .select()
    .single(); // helps avoid [0] and undefined handling

  if (error || !data) {
    console.error('Supabase insert error:', error?.message, error?.details);
    alert('Error saving article. Check console for details.');
    return;
  }

  // All good — add to UI
  const newArticle = {
    id: data.id,
    title: data.title,
    content: data.content,
    fullContent: data.full_content,
    imageUrl: data.image_url
  };

  articles.unshift(newArticle);
  displayArticles();

  // Clear form
  document.getElementById('new-article-title').value = '';
  document.getElementById('new-article-content').value = '';
  document.getElementById('new-article-full').value = '';
  document.getElementById('article-image').value = '';

  alert('Article with image saved successfully!');
}

  // Load articles when page loads
  document.addEventListener('DOMContentLoaded', loadArticlesFromDB);

  function showSection(id) {
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => section.classList.remove('visible'));
    const target = document.getElementById(id);
    if (target) {
      target.classList.add('visible');
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }