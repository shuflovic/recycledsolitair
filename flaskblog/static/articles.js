
function displayArticles() {
  const container = document.getElementById('articles-container');
  container.innerHTML = '';

  articles.forEach(article => {
    const articleDiv = document.createElement('div');
    articleDiv.className = 'article';
    articleDiv.innerHTML = `
      <h3 onclick="showArticleDetail(${article.id})">${article.title}</h3>
      <p>${article.content}</p>
    `;
    container.appendChild(articleDiv);
  });
}

// Function to show article detail
function showArticleDetail(articleId) {
  const article = articles.find(a => a.id === articleId);
  if (article) {
    document.getElementById('article-detail-content').innerHTML = article.fullContent;
    showSection('article-detail');
  }
}

// Function to add new article
function addNewArticle() {
  const title = document.getElementById('new-article-title').value.trim();
  const content = document.getElementById('new-article-content').value.trim();
  const fullContent = document.getElementById('new-article-full').value.trim();

  if (!title || !content) {
    alert('Please fill in at least the title and preview content.');
    return;
  }

  const newId = Math.max(...articles.map(a => a.id)) + 1;
  const newArticle = {
    id: newId,
    title: title,
    content: content,
    fullContent: fullContent || `<h2>${title}</h2><p>${content}</p>`
  };

  articles.push(newArticle);
  displayArticles();

  // Clear form
  document.getElementById('new-article-title').value = '';
  document.getElementById('new-article-content').value = '';
  document.getElementById('new-article-full').value = '';

  alert('Article added successfully!');
}

// Load articles when page loads
document.addEventListener('DOMContentLoaded', displayArticles);

function showSection(id) {
  const sections = document.querySelectorAll('main section');
  sections.forEach(section => section.classList.remove('visible'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('visible');
    target.scrollIntoView({ behavior: 'smooth' });
  }
}