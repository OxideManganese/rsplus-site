function insertNews(posts) {
  const container = document.querySelector('.section.section--posts .section__content');
  if (!container || !Array.isArray(posts)) return;

  // очищаем секцию перед вставкой
  container.innerHTML = '';

  posts.forEach(post => {
    const article = document.createElement('article');
    article.className = 'wide-content-block wide-content-block--news';

    article.innerHTML = `
      <div class="wide-content-block__content">
        <h3 class="wide-content-block__title">${post.title}</h3>
        <p>${post.text}</p>
        <div class="wide-content-block__information">
          <a href="${post.link}" target="_blank">${post.link}</a> | ${post.date}
        </div>
      </div>
      <div class="wide-content-block__media">
        <img class="wide-content-block__image" src="${post.image}" alt="${post.title}">
      </div>
    `;

    container.appendChild(article);
  });
}
