(function () {
  function all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupMenu() {
    var button = document.querySelector('.menu-toggle');
    if (!button) {
      return;
    }
    button.addEventListener('click', function () {
      document.body.classList.toggle('menu-open');
    });
  }

  function setupHero() {
    var root = document.querySelector('[data-hero]');
    if (!root) {
      return;
    }
    var slides = all('.hero-slide', root);
    var dots = all('.hero-dot', root);
    var index = 0;
    var timer = null;

    function show(next) {
      if (!slides.length) {
        return;
      }
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        window.clearInterval(timer);
        show(Number(dot.getAttribute('data-slide')) || 0);
        start();
      });
    });

    show(0);
    start();
  }

  function setupFilters() {
    var inputs = all('.filter-input');
    inputs.forEach(function (input) {
      var scope = input.closest('.content-section') || document;
      var cards = all('.movie-card', scope);
      var params = new URLSearchParams(window.location.search);
      var initial = params.get('q') || '';
      if (input.classList.contains('search-query') && initial) {
        input.value = initial;
      }

      function apply() {
        var value = input.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var text = card.getAttribute('data-search') || card.textContent.toLowerCase();
          card.classList.toggle('hidden-card', value && text.indexOf(value) === -1);
        });
      }

      input.addEventListener('input', apply);
      apply();
    });
  }

  window.initPlayer = function (sourceUrl) {
    var video = document.getElementById('moviePlayer');
    var shell = document.getElementById('playerBox');
    var button = document.querySelector('.player-start');
    if (!video || !shell || !button || !sourceUrl) {
      return;
    }
    var loaded = false;
    var hls = null;

    function load() {
      if (loaded) {
        return;
      }
      loaded = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = sourceUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(sourceUrl);
        hls.attachMedia(video);
      } else {
        video.src = sourceUrl;
      }
    }

    function play() {
      load();
      shell.classList.add('is-playing');
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          shell.classList.remove('is-playing');
        });
      }
    }

    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      play();
    });

    shell.addEventListener('click', function (event) {
      if (event.target === shell || event.target === video) {
        play();
      }
    });

    video.addEventListener('play', function () {
      shell.classList.add('is-playing');
    });

    video.addEventListener('pause', function () {
      shell.classList.remove('is-playing');
    });

    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
      }
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupHero();
    setupFilters();
  });
}());
