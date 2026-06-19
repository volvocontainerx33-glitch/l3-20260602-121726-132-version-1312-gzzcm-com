(function () {
    var header = document.querySelector('[data-header]');
    var menuToggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');
    var backTop = document.querySelector('[data-back-top]');

    function updateScrollState() {
        if (header) {
            header.classList.toggle('is-scrolled', window.scrollY > 20);
        }
        if (backTop) {
            backTop.classList.toggle('is-visible', window.scrollY > 420);
        }
    }

    window.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    if (backTop) {
        backTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    document.querySelectorAll('.site-search').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            var input = form.querySelector('input[name="q"]');
            if (!input || !input.value.trim()) {
                event.preventDefault();
            }
        });
    });

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var index = 0;
        var timer = null;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function startTimer() {
            timer = window.setInterval(function () {
                showSlide(index + 1);
            }, 5200);
        }

        function resetTimer() {
            if (timer) {
                window.clearInterval(timer);
            }
            startTimer();
        }

        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(index - 1);
                resetTimer();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                showSlide(index + 1);
                resetTimer();
            });
        }
        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                showSlide(dotIndex);
                resetTimer();
            });
        });
        startTimer();
    }

    var list = document.querySelector('[data-card-list]');
    if (list) {
        var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));
        var searchInput = document.querySelector('[data-local-search]');
        var filters = Array.prototype.slice.call(document.querySelectorAll('[data-filter-field]'));
        var querySource = document.querySelector('[data-query-source]');

        if (querySource) {
            var params = new URLSearchParams(window.location.search);
            var query = params.get('q');
            if (query) {
                querySource.value = query;
            }
        }

        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }

        function applyFilters() {
            var queryText = normalize(searchInput ? searchInput.value : '');
            var activeFilters = filters.map(function (select) {
                return {
                    field: select.getAttribute('data-filter-field'),
                    value: normalize(select.value)
                };
            }).filter(function (item) {
                return item.value;
            });

            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-tags'),
                    card.textContent
                ].join(' '));
                var matchesQuery = !queryText || haystack.indexOf(queryText) !== -1;
                var matchesFilters = activeFilters.every(function (filter) {
                    var fieldValue = normalize(card.getAttribute('data-' + filter.field));
                    return fieldValue.indexOf(filter.value) !== -1;
                });
                card.classList.toggle('is-filtered-out', !(matchesQuery && matchesFilters));
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', applyFilters);
        }
        filters.forEach(function (select) {
            select.addEventListener('change', applyFilters);
        });
        applyFilters();
    }
})();
