document.addEventListener("DOMContentLoaded", () => {
  initReveal();

  const grid = document.getElementById("allPostsGrid");
  if (!grid) return;

  grid.innerHTML = postsData.map(post => `
    <article class="blog-card reveal revealed ${post.active ? "blog-card--active" : ""}">
      <div class="blog-card__image">
        <img src="${post.image}" alt="${post.title}">
      </div>
      <div class="blog-card__body">
        <span class="media-label">${post.date}</span>
        ${post.active ? '<span class="blog-badge">Актуально</span>' : ''}
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
        <a href="${post.link}" class="btn btn--ghost">Открыть</a>
      </div>
    </article>
  `).join("");
});

function initReveal() {
  const revealItems = document.querySelectorAll(".reveal");

  if (!revealItems.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
}