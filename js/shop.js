document.addEventListener("DOMContentLoaded", () => {
  initReveal();

  const grid = document.getElementById("shopGrid");
  const searchInput = document.getElementById("shopSearch");
  const filterButtons = document.querySelectorAll(".filter-btn");

  let currentCategory = "all";
  let currentSearch = "";

  function renderProducts() {
    const filtered = productsData.filter(product => {
      const matchCategory =
        currentCategory === "all" || product.category === currentCategory;

      const matchSearch =
        product.title.toLowerCase().includes(currentSearch.toLowerCase());

      return matchCategory && matchSearch;
    });

    grid.innerHTML = filtered.map(product => `
      <article class="product-card reveal revealed">
        <div class="product-card__image">
          <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="product-card__body">
          <h3>${product.title}</h3>
          <p>${product.description}</p>
          <div class="product-card__bottom">
            <strong>${product.price}</strong>
            <a href="${product.link}" class="btn btn--ghost">Купить</a>
          </div>
        </div>
      </article>
    `).join("");

    initReveal();
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearch = e.target.value;
      renderProducts();
    });
  }

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      currentCategory = button.dataset.category;
      renderProducts();
    });
  });

  renderProducts();
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