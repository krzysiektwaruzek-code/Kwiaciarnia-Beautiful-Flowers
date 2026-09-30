/* Kwiaciarnia Beautiful Flowers — skrypty strony
   Bez zależności. Każdy moduł działa niezależnie i sam sprawdza, czy element istnieje. */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     KONFIGURACJA (dane potwierdzone — patrz docs/FAKTY.md)
     ------------------------------------------------------------------ */
  var CONFIG = {
    timeZone: 'Europe/Warsaw',
    // Godziny otwarcia, identyczne codziennie (pn–nd 8:00–18:00), w minutach od północy
    openMinutes: 8 * 60,
    closeMinutes: 18 * 60,
    openLabel: '8:00',
    closeLabel: '18:00',
    phoneDisplay: '509 396 670',
    // Dni wyjątkowe (np. święta), format 'RRRR-MM-DD'. Uzupełnij, gdy klient poda daty.
    closedDates: []
  };

  var $ = function (selector, root) { return (root || document).querySelector(selector); };
  var $$ = function (selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); };

  /* ------------------------------------------------------------------
     Nagłówek: cień po przewinięciu
     ------------------------------------------------------------------ */
  function initHeader() {
    var header = $('[data-header]');
    if (!header) return;
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------
     Menu mobilne
     ------------------------------------------------------------------ */
  function initNav() {
    var toggle = $('[data-nav-toggle]');
    var nav = $('#nav');
    if (!toggle || !nav) return;

    var background = $$('main, .site-footer, .mobile-bar');
    var mq = window.matchMedia('(max-width: 47.99rem)');

    function setOpen(open, returnFocus) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
      nav.classList.toggle('is-open', open);
      document.documentElement.classList.toggle('menu-open', open);
      background.forEach(function (el) { el.inert = open; });
      if (!open && returnFocus) toggle.focus();
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, true);
    });
    var onBreakpoint = function () { if (!mq.matches) setOpen(false); };
    if (mq.addEventListener) mq.addEventListener('change', onBreakpoint);
    else mq.addListener(onBreakpoint);
  }

  /* ------------------------------------------------------------------
     Pojawianie się elementów przy przewijaniu
     ------------------------------------------------------------------ */
  function initReveal() {
    var items = $$('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
     Podświetlenie aktywnej sekcji w menu
     ------------------------------------------------------------------ */
  function initScrollSpy() {
    if (!('IntersectionObserver' in window)) return;
    var links = $$('.nav__link[href^="#"]');
    var map = {};
    links.forEach(function (link) { map[link.getAttribute('href').slice(1)] = link; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = map[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.removeAttribute('aria-current'); });
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(map).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) io.observe(section);
    });
  }

  /* ------------------------------------------------------------------
     Godziny otwarcia: dzisiejszy dzień i aktualny status (czas polski)
     ------------------------------------------------------------------ */
  function warsawNow() {
    var parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: CONFIG.timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
      weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date());
    var get = function (type) { return parts.filter(function (p) { return p.type === type; })[0].value; };
    var weekdays = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return {
      day: weekdays[get('weekday')],
      minutes: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10),
      date: get('year') + '-' + get('month') + '-' + get('day')
    };
  }

  function initHours() {
    var table = $('[data-hours]');
    var status = $('[data-open-status]');
    var statusText = $('[data-open-status-text]');
    var now;
    try { now = warsawNow(); } catch (err) { return; } // starsza przeglądarka: zostaje treść statyczna

    if (table) {
      var row = $('tr[data-day="' + now.day + '"]', table);
      if (row) {
        row.classList.add('is-today');
        row.setAttribute('aria-current', 'date');
        var badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = 'Dziś';
        $('th', row).appendChild(badge);
      }
    }

    if (!status || !statusText) return;
    var state, text;
    if (CONFIG.closedDates.indexOf(now.date) !== -1) {
      state = 'closed'; text = 'Dziś nieczynne';
    } else if (now.minutes >= CONFIG.openMinutes && now.minutes < CONFIG.closeMinutes) {
      state = 'open'; text = 'Teraz otwarte · do ' + CONFIG.closeLabel;
    } else if (now.minutes < CONFIG.openMinutes) {
      state = 'closed'; text = 'Teraz zamknięte · otwieramy dziś o ' + CONFIG.openLabel;
    } else {
      state = 'closed'; text = 'Teraz zamknięte · otwieramy jutro o ' + CONFIG.openLabel;
    }
    status.setAttribute('data-state', state);
    statusText.textContent = text;
  }

  /* ------------------------------------------------------------------
     Mapa Google ładowana dopiero po kliknięciu (szybkość + prywatność)
     ------------------------------------------------------------------ */
  function initMap() {
    var map = $('[data-map]');
    var button = $('[data-map-load]');
    var placeholder = $('[data-map-placeholder]');
    if (!map || !button || !placeholder) return;

    button.addEventListener('click', function () {
      var frame = document.createElement('iframe');
      frame.src = map.getAttribute('data-src');
      frame.title = 'Mapa Google: Kwiaciarnia Beautiful Flowers, ul. Cedrowa 40, Gdańsk';
      frame.loading = 'lazy';
      frame.referrerPolicy = 'no-referrer-when-downgrade';
      frame.setAttribute('allowfullscreen', '');
      map.appendChild(frame);
      placeholder.remove();
      frame.focus();
    });
  }

  /* ------------------------------------------------------------------
     Formularz kontaktowy (frontend). Wysyłka działa dopiero po wpisaniu
     adresu usługi w atrybucie data-endpoint formularza.
     ------------------------------------------------------------------ */
  function initForm() {
    var form = $('[data-contact-form]');
    if (!form) return;
    var status = $('[data-form-status]', form);
    var submit = $('button[type="submit"]', form);

    var validators = {
      name: function (v) { return v.trim().length >= 2 ? '' : 'Podaj swoje imię.'; },
      contact: function (v) {
        var value = v.trim();
        if (!value) return 'Podaj numer telefonu lub adres e-mail.';
        var isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
        var digits = value.replace(/[\s()+-]/g, '');
        var isPhone = /^\d{9,15}$/.test(digits);
        return isEmail || isPhone ? '' : 'Wpisz poprawny numer telefonu lub adres e-mail.';
      },
      message: function (v) { return v.trim().length >= 10 ? '' : 'Napisz kilka słów (minimum 10 znaków).'; },
      consent: function (v, field) { return field.checked ? '' : 'Zaznacz zgodę, aby wysłać wiadomość.'; }
    };

    function setError(field, message) {
      var error = document.getElementById(field.id + '-err');
      if (!error) return;
      error.textContent = message;
      error.hidden = !message;
      if (message) field.setAttribute('aria-invalid', 'true');
      else field.removeAttribute('aria-invalid');
    }

    function validateField(field) {
      var check = validators[field.name];
      if (!check) return true;
      var message = check(field.value, field);
      setError(field, message);
      return !message;
    }

    function showStatus(state, message) {
      status.setAttribute('data-state', state);
      status.textContent = message;
    }

    Object.keys(validators).forEach(function (name) {
      var field = form.elements[name];
      if (!field) return;
      field.addEventListener('blur', function () { if (field.value || field.type === 'checkbox') validateField(field); });
      field.addEventListener(field.type === 'checkbox' ? 'change' : 'input', function () {
        if (field.getAttribute('aria-invalid') === 'true') validateField(field);
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var firstInvalid = null;
      Object.keys(validators).forEach(function (name) {
        var field = form.elements[name];
        if (field && !validateField(field) && !firstInvalid) firstInvalid = field;
      });
      if (firstInvalid) {
        showStatus('error', 'Sprawdź zaznaczone pola formularza.');
        firstInvalid.focus();
        return;
      }

      // Pole-pułapka dla botów: udajemy sukces, nic nie wysyłamy.
      if (form.elements._gotcha && form.elements._gotcha.value) {
        showStatus('success', 'Dziękujemy! Wiadomość została wysłana.');
        form.reset();
        return;
      }

      var endpoint = (form.getAttribute('data-endpoint') || '').trim();
      if (!endpoint) {
        showStatus('info', 'Formularz nie jest jeszcze aktywny, więc wiadomość nie została wysłana. Zadzwoń pod numer ' + CONFIG.phoneDisplay + '.');
        return;
      }

      submit.disabled = true;
      showStatus('info', 'Wysyłanie…');
      fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (response) {
          if (!response.ok) throw new Error('HTTP ' + response.status);
          showStatus('success', 'Dziękujemy! Wiadomość została wysłana.');
          form.reset();
        })
        .catch(function () {
          showStatus('error', 'Nie udało się wysłać wiadomości. Spróbuj ponownie lub zadzwoń pod numer ' + CONFIG.phoneDisplay + '.');
        })
        .then(function () { submit.disabled = false; });
    });
  }

  initHeader();
  initNav();
  initReveal();
  initScrollSpy();
  initHours();
  initMap();
  initForm();
})();
