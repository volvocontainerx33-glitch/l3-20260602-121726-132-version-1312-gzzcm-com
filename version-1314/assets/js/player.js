function setupPlayer(options) {
  var video = document.getElementById(options.videoId);
  var button = document.getElementById(options.buttonId);
  var url = options.url;
  var started = false;
  var hlsInstance = null;

  function beginPlayback() {
    if (!video || started) {
      return;
    }

    started = true;

    if (button) {
      button.classList.add("is-hidden");
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      video.play().catch(function () {});
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hlsInstance.loadSource(url);
      hlsInstance.attachMedia(video);

      hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {});
      });

      hlsInstance.on(window.Hls.Events.ERROR, function (eventName, data) {
        if (data && data.fatal && hlsInstance) {
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hlsInstance.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hlsInstance.recoverMediaError();
          } else {
            hlsInstance.destroy();
            hlsInstance = null;
          }
        }
      });
    }
  }

  if (button) {
    button.addEventListener("click", beginPlayback);
  }

  if (video) {
    video.addEventListener("click", function () {
      if (!started) {
        beginPlayback();
      }
    });
  }
}
