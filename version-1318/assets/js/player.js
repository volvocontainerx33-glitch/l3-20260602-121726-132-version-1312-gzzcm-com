(function () {
    var video = document.querySelector('.site-video');
    var startButton = document.querySelector('[data-video-start]');
    var status = document.querySelector('[data-player-status]');

    if (!video || !startButton) {
        return;
    }

    var hlsSource = video.getAttribute('data-hls');
    var mp4Source = video.getAttribute('data-mp4');
    var hlsInstance = null;
    var sourceReady = false;

    function setStatus(text) {
        if (status) {
            status.textContent = text;
        }
    }

    function attachSource() {
        if (sourceReady) {
            return;
        }
        sourceReady = true;

        if (window.location.protocol !== 'file:' && window.Hls && window.Hls.isSupported() && hlsSource) {
            hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: false });
            hlsInstance.loadSource(hlsSource);
            hlsInstance.attachMedia(video);
            hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                setStatus('播放准备完成');
            });
            hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                if (data && data.fatal && mp4Source) {
                    hlsInstance.destroy();
                    hlsInstance = null;
                    video.src = mp4Source;
                    setStatus('播放准备完成');
                }
            });
            return;
        }

        if (hlsSource && video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = hlsSource;
            setStatus('原生 播放准备完成');
            return;
        }

        if (mp4Source) {
            video.src = mp4Source;
            setStatus('播放准备完成');
        }
    }

    function playVideo() {
        attachSource();
        startButton.classList.add('is-hidden');
        video.play().then(function () {
            setStatus('正在播放');
        }).catch(function () {
            startButton.classList.remove('is-hidden');
            setStatus('请再次点击播放');
        });
    }

    startButton.addEventListener('click', playVideo);
    video.addEventListener('click', function () {
        if (video.paused) {
            playVideo();
        }
    });
    video.addEventListener('play', function () {
        startButton.classList.add('is-hidden');
        setStatus('正在播放');
    });
    video.addEventListener('pause', function () {
        if (!video.ended) {
            startButton.classList.remove('is-hidden');
            setStatus('已暂停');
        }
    });
    video.addEventListener('ended', function () {
        startButton.classList.remove('is-hidden');
        setStatus('播放结束');
    });
})();
