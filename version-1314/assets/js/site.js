(function () {
  var menuButton = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".main-nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    var current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === current);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        showSlide(dotIndex);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  function applyQueryFromUrl() {
    var input = document.querySelector(".movie-filter");

    if (!input) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var query = params.get("q");

    if (query) {
      input.value = query;
    }
  }

  function setupSearch() {
    var searchInput = document.querySelector(".movie-filter");
    var yearFilter = document.querySelector(".year-filter");
    var items = Array.prototype.slice.call(document.querySelectorAll(".searchable-list .movie-card, .searchable-list .ranking-item"));

    if (!items.length) {
      return;
    }

    function filterItems() {
      var term = searchInput ? searchInput.value.trim().toLowerCase() : "";
      var year = yearFilter ? yearFilter.value : "";

      items.forEach(function (item) {
        var haystack = ((item.getAttribute("data-search") || "") + " " + (item.getAttribute("data-title") || "")).toLowerCase();
        var itemYear = item.getAttribute("data-year") || "";
        var matchTerm = !term || haystack.indexOf(term) !== -1;
        var matchYear = !year || itemYear === year;
        item.classList.toggle("hidden", !(matchTerm && matchYear));
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", filterItems);
    }

    if (yearFilter) {
      yearFilter.addEventListener("change", filterItems);
    }

    filterItems();
  }

  applyQueryFromUrl();
  setupSearch();
})();
