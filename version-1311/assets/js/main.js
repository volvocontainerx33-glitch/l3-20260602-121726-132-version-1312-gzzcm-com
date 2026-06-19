(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.getElementById('mainNav');

    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;

        function showSlide(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
            });
        });

        if (slides.length > 1) {
            setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }
    }

    function normalize(value) {
        return (value || '').toString().trim().toLowerCase();
    }

    function filterCards(options) {
        var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
        var keyword = normalize(options.keyword);
        var year = normalize(options.year);
        var channel = normalize(options.channel);

        cards.forEach(function (card) {
            var title = normalize(card.getAttribute('data-title'));
            var region = normalize(card.getAttribute('data-region'));
            var type = normalize(card.getAttribute('data-type'));
            var cardYear = normalize(card.getAttribute('data-year'));
            var tags = normalize(card.getAttribute('data-tags'));
            var cardChannel = normalize(card.getAttribute('data-channel'));
            var text = [title, region, type, cardYear, tags, cardChannel].join(' ');
            var visible = true;

            if (keyword && text.indexOf(keyword) === -1) {
                visible = false;
            }

            if (year && cardYear !== year) {
                visible = false;
            }

            if (channel && cardChannel !== channel) {
                visible = false;
            }

            card.classList.toggle('is-filtered-out', !visible);
        });
    }

    var libraryInput = document.getElementById('librarySearch');
    var channelFilter = document.getElementById('channelFilter');
    var yearFilter = document.getElementById('yearFilter');

    if (libraryInput) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';
        libraryInput.value = query;

        function runLibraryFilter() {
            filterCards({
                keyword: libraryInput.value,
                year: yearFilter ? yearFilter.value : '',
                channel: channelFilter ? channelFilter.value : ''
            });
        }

        libraryInput.addEventListener('input', runLibraryFilter);
        if (yearFilter) {
            yearFilter.addEventListener('change', runLibraryFilter);
        }
        if (channelFilter) {
            channelFilter.addEventListener('change', runLibraryFilter);
        }
        runLibraryFilter();
    }

    var categoryInput = document.querySelector('.category-search');
    var localYearFilter = document.querySelector('.local-year-filter');

    if (categoryInput) {
        function runCategoryFilter() {
            filterCards({
                keyword: categoryInput.value,
                year: localYearFilter ? localYearFilter.value : '',
                channel: ''
            });
        }

        categoryInput.addEventListener('input', runCategoryFilter);
        if (localYearFilter) {
            localYearFilter.addEventListener('change', runCategoryFilter);
        }
    }
})();
