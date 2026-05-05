(function () {
  'use strict';

  var CONSENT_KEY = 'ergomobil_cookie_consent_v1';
  var MEASUREMENT_ID = 'G-2J69MCQ994';
  var GA_SRC = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);

  function ensureGtag() {
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== 'function') {
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
    }
  }

  function updateConsent(granted) {
    ensureGtag();
    window.gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
  }

  function loadGoogleAnalytics() {
    if (window.__gaLoaded) return;
    if (document.querySelector('script[data-ga-loader="true"]')) return;

    var script = document.createElement('script');
    script.async = true;
    script.src = GA_SRC;
    script.dataset.gaLoader = 'true';
    script.onload = function () {
      ensureGtag();
      window.gtag('config', MEASUREMENT_ID, {
        anonymize_ip: true,
        transport_type: 'beacon'
      });
      window.__gaLoaded = true;
    };

    document.head.appendChild(script);
  }

  function getStoredConsent() {
    try {
      return window.localStorage.getItem(CONSENT_KEY);
    } catch (error) {
      return null;
    }
  }

  function setStoredConsent(value) {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch (error) {
      // Intentionally empty: some browsers block storage in strict modes.
    }
  }

  function buildBanner() {
    if (document.getElementById('cookie-consent-banner')) return;

    var banner = document.createElement('section');
    banner.id = 'cookie-consent-banner';
    banner.className = 'cookie-consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Cookie-Einstellungen');
    banner.hidden = true;

    banner.innerHTML = [
      '<div class="cookie-consent__content">',
      '  <p class="cookie-consent__title"><i class="fa-solid fa-shield-heart" aria-hidden="true"></i> Datenschutz-Einstellungen</p>',
      '  <p class="cookie-consent__text">Wir nutzen optionale Analyse-Cookies (Google Analytics), um die Website zu verbessern. Erst nach Ihrer Zustimmung wird Analytics aktiviert.</p>',
      '  <p class="cookie-consent__links"><a href="/datenschutz.html">Mehr in der Datenschutzerklärung</a></p>',
      '  <div class="cookie-consent__actions">',
      '    <button type="button" class="btn ghost cookie-consent__btn" data-consent="declined">Nur notwendige Cookies</button>',
      '    <button type="button" class="btn primary cookie-consent__btn" data-consent="accepted">Analytics akzeptieren</button>',
      '  </div>',
      '</div>'
    ].join('');

    document.body.appendChild(banner);

    banner.querySelectorAll('[data-consent]').forEach(function (button) {
      button.addEventListener('click', function () {
        var choice = button.getAttribute('data-consent');
        setStoredConsent(choice);

        if (choice === 'accepted') {
          updateConsent(true);
          loadGoogleAnalytics();
        } else {
          updateConsent(false);
        }

        hideBanner();
        updateSettingsButtonVisibility();
      });
    });
  }

  function buildSettingsButton() {
    if (document.getElementById('cookie-settings-btn')) return;

    var button = document.createElement('button');
    button.id = 'cookie-settings-btn';
    button.className = 'cookie-settings-btn';
    button.type = 'button';
    button.setAttribute('aria-label', 'Cookie-Einstellungen öffnen');
    button.textContent = 'Cookie-Einstellungen';
    button.hidden = true;

    button.addEventListener('click', function () {
      showBanner();
    });

    document.body.appendChild(button);
  }

  function showBanner() {
    var banner = document.getElementById('cookie-consent-banner');
    if (!banner) return;

    banner.hidden = false;
    document.body.classList.add('cookie-banner-open');
  }

  function hideBanner() {
    var banner = document.getElementById('cookie-consent-banner');
    if (!banner) return;

    banner.hidden = true;
    document.body.classList.remove('cookie-banner-open');
  }

  function updateSettingsButtonVisibility() {
    var button = document.getElementById('cookie-settings-btn');
    if (!button) return;

    var hasChoice = !!getStoredConsent();
    button.hidden = !hasChoice;
  }

  function applyInitialConsent() {
    var stored = getStoredConsent();

    if (stored === 'accepted') {
      updateConsent(true);
      loadGoogleAnalytics();
      hideBanner();
      return;
    }

    if (stored === 'declined') {
      updateConsent(false);
      hideBanner();
      return;
    }

    showBanner();
  }

  window.openCookieSettings = function () {
    showBanner();
  };

  document.addEventListener('DOMContentLoaded', function () {
    ensureGtag();
    buildBanner();
    buildSettingsButton();
    applyInitialConsent();
    updateSettingsButtonVisibility();
  });
})();
