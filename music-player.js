/**
 * music-player.js
 * Finds all .music-player elements rendered by timeline.js
 * and initialises a custom retro audio player for each.
 */
(function () {
  'use strict';

  function initPlayers() {
    document.querySelectorAll('.music-player').forEach(initPlayer);
  }

  function initPlayer(el) {
    const src = el.dataset.src;
    const title = el.dataset.title || 'Unknown Track';
    if (!src) return;

    const audio = new Audio(src);
    let isPlaying = false;

    el.innerHTML =
      '<div class="mp-header">' +
        '<span class="mp-note">&#9835;</span>' +
        '<span class="mp-title">' + escapeHtml(title) + '</span>' +
      '</div>' +
      '<div class="mp-controls">' +
        '<button class="mp-play-btn" aria-label="Play/Pause">[ &#9654; PLAY ]</button>' +
        '<div class="mp-progress-wrap" role="slider" aria-label="Seek" tabindex="0">' +
          '<div class="mp-progress-bar">' +
            '<div class="mp-progress-fill"></div>' +
          '</div>' +
        '</div>' +
        '<span class="mp-time">0:00 / 0:00</span>' +
      '</div>' +
      '<div class="mp-volume-row">' +
        '<span class="mp-vol-label">VOL:</span>' +
        '<input type="range" class="mp-vol-slider" min="0" max="1" step="0.05" value="1" aria-label="Volume">' +
      '</div>';

    const playBtn    = el.querySelector('.mp-play-btn');
    const progressWrap = el.querySelector('.mp-progress-wrap');
    const progressBar  = el.querySelector('.mp-progress-bar');
    const progressFill = el.querySelector('.mp-progress-fill');
    const timeEl     = el.querySelector('.mp-time');
    const volSlider  = el.querySelector('.mp-vol-slider');

    playBtn.addEventListener('click', function () {
      if (isPlaying) {
        audio.pause();
      } else {
        // Pause all other players first
        document.querySelectorAll('.music-player').forEach(function (other) {
          if (other !== el) {
            var otherAudio = other._audio;
            if (otherAudio && !otherAudio.paused) otherAudio.pause();
          }
        });
        audio.play().catch(function () {});
      }
    });

    audio.addEventListener('play', function () {
      isPlaying = true;
      playBtn.innerHTML = '[ &#9646;&#9646; STOP ]';
    });

    audio.addEventListener('pause', function () {
      isPlaying = false;
      playBtn.innerHTML = '[ &#9654; PLAY ]';
    });

    audio.addEventListener('ended', function () {
      isPlaying = false;
      playBtn.innerHTML = '[ &#9654; PLAY ]';
      progressFill.style.width = '0%';
    });

    audio.addEventListener('timeupdate', function () {
      var pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      progressFill.style.width = pct + '%';
      timeEl.textContent = fmtTime(audio.currentTime) + ' / ' + fmtTime(audio.duration || 0);
    });

    audio.addEventListener('error', function () {
      el.querySelector('.mp-header').insertAdjacentHTML(
        'afterend',
        '<p class="mp-error">[ ERROR: could not load audio ]</p>'
      );
      playBtn.disabled = true;
    });

    // Seek on click
    progressWrap.addEventListener('click', function (e) {
      var rect = progressBar.getBoundingClientRect();
      var pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      if (audio.duration) audio.currentTime = pct * audio.duration;
    });

    // Volume
    volSlider.addEventListener('input', function () {
      audio.volume = parseFloat(volSlider.value);
    });

    // Expose audio ref so other players can pause it
    el._audio = audio;
  }

  function fmtTime(secs) {
    if (!isFinite(secs) || isNaN(secs)) return '0:00';
    var m = Math.floor(secs / 60);
    var s = Math.floor(secs % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlayers);
  } else {
    initPlayers();
  }
})();
