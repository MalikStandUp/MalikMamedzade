document.addEventListener("DOMContentLoaded", () => {
  initBurger();
  initReveal();
  initParallaxCards();
  renderHomeShows();
  renderFeaturedPost();
  renderFeaturedProducts();
  initCountdown();
  renderHeroNextShow();
});

function initBurger() {
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");

  if (!burger || !nav) return;

  burger.addEventListener("click", () => {
    burger.classList.toggle("is-active");
    nav.classList.toggle("is-active");
  });
}

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

function initParallaxCards() {
  const cards = document.querySelectorAll(".parallax-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * 10;
      const rotateX = ((centerY - y) / centerY) * 10;

      card.style.transform = `
        perspective(1200px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-6px)
        scale(1.02)
      `;

      card.style.boxShadow = `
        0 30px 80px rgba(0, 0, 0, 0.35),
        0 10px 30px rgba(143, 92, 255, 0.18)
      `;

      const glow = card.querySelector(".hero-card__glow");
      if (glow) {
        glow.style.opacity = "1";
        glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.22), rgba(143,92,255,0.16) 22%, rgba(0,0,0,0) 60%)`;
      }
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = `
        perspective(1200px)
        rotateX(0deg)
        rotateY(0deg)
        translateY(0)
        scale(1)
      `;

      card.style.boxShadow = "";

      const glow = card.querySelector(".hero-card__glow");
      if (glow) {
        glow.style.opacity = "0";
      }
    });
  });
}

function getActiveShows() {
  return showsData
    .filter(show => show.active)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

function renderHeroNextShow() {
  const heroNextShow = document.getElementById("heroNextShow");
  const nextShow = getActiveShows()[0];

  if (!heroNextShow || !nextShow) return;

  heroNextShow.innerHTML = `
    <div>
      <span>Ближайшее шоу</span>
      <strong>${formatHeroDate(nextShow.date)} • ${nextShow.city}</strong>
    </div>
    <a href="shows.html" class="mini-link">Детали</a>
  `;
}

function renderHomeShows() {
  const grid = document.getElementById("homeShowsGrid");
  const nextShowInfo = document.getElementById("nextShowInfo");
  if (!grid) return;

  const activeShows = getActiveShows().slice(0, 3);

  grid.innerHTML = activeShows.map(show => {
    const day = formatDay(show.date);
    const month = formatMonth(show.date);

    return `
      <article class="show-card reveal revealed">
        <div class="show-card__date">
          <span>${day}</span>
          <small>${month}</small>
        </div>
        <div class="show-card__body">
          <div class="show-card__meta">${show.city} • ${show.format}</div>
          <h3>${show.title}</h3>
          <p>${show.description}</p>
          <div class="show-card__actions">
            <a href="${show.link || "#"}" class="text-link">Подробнее</a>
            <span class="status ${show.status === "Скоро" ? "status--hot" : ""}">
              ${show.status || ""}
            </span>
          </div>
        </div>
      </article>
    `;
  }).join("");

  const next = activeShows[0];
  if (next && nextShowInfo) {
    nextShowInfo.innerHTML = `
      <p><strong>Дата:</strong> ${formatLongDate(next.date)}</p>
      <p><strong>Город:</strong> ${next.city}</p>
      <p><strong>Формат:</strong> ${next.format}</p>
    `;
  }
}

function renderFeaturedPost() {
  const container = document.getElementById("featuredPost");
  if (!container) return;

  const activePost = postsData.find(post => post.active) || postsData[0];
  if (!activePost) return;

  container.innerHTML = `
    <article class="featured-post-card reveal revealed">
      <div class="featured-post-card__image">
        <img src="${activePost.image}" alt="${activePost.title}">
      </div>
      <div class="featured-post-card__body">
        <span class="media-label">${activePost.date}</span>
        <h3>${activePost.title}</h3>
        <p>${activePost.excerpt}</p>
        <a href="blog.html" class="btn btn--ghost">Читать все публикации</a>
      </div>
    </article>
  `;
}

function renderFeaturedProducts() {
  const container = document.getElementById("featuredProducts");
  if (!container) return;

  const featuredProducts = productsData.filter(product => product.featured);

  container.innerHTML = `
    <div class="merch-slider__track">
      ${featuredProducts.map(product => `
        <article class="product-card reveal revealed">
          <div class="product-card__image">
            <img src="${product.image}" alt="${product.title}">
          </div>
          <div class="product-card__body">
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <div class="product-card__bottom">
              <strong>${product.price}</strong>
              <a href="shop.html" class="btn btn--ghost">В магазин</a>
            </div>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function initCountdown() {
  const nextShow = getActiveShows()[0];
  if (!nextShow) return;

  const targetDate = new Date(nextShow.date).getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) return;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    setText("days", String(days).padStart(2, "0"));
    setText("hours", String(hours).padStart(2, "0"));
    setText("minutes", String(minutes).padStart(2, "0"));
    setText("seconds", String(seconds).padStart(2, "0"));
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function formatLongDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function formatHeroDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long"
  });
}

function formatDay(dateString) {
  const date = new Date(dateString);
  return String(date.getDate()).padStart(2, "0");
}

function formatMonth(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("ru-RU", { month: "short" }).replace(".", "");
}