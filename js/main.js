/* FG Onyenwe Transport & Logistics — site behaviour.
   Plain JavaScript, no libraries, no build step.
   Every feature is wrapped so one failure can't break the others. */
(function () {
  'use strict';

  var FLEET = [{"title": "Premium Travel", "description": "Manned by highly trained professional pilots and drivers, the FG Fleet features a diverse lineup of premium luxury passenger coaches alongside a robust logistics fleet of 10 to 80+ ton trucks, heavy-duty flatbeds, refrigerated vehicles, and specialized carriers. Passengers enjoy a first-class travel experience complete with refreshing air conditioning, extra legroom, onboard restrooms, multimedia entertainment, charging ports, and generous capacity for excess luggage.", "features": [{"label": "Air conditioning"}, {"label": "Multimedia"}, {"label": "Charging"}, {"label": "Extra Legroom"}, {"label": "Onboard Restrooms"}, {"label": "Excess luggage"}]}, {"title": "Specialized Logistics", "description": "For your commercial freight, our specialized trucks are equipped with state-of-the-art multi-zone climate control, shock-absorbing air-ride suspension for fragile materials, and real-time temperature and GPS telemetry to ensure every delicate or sensitive cargo is delivered securely and in pristine condition.", "features": [{"label": "State-of-the-art"}, {"label": "Multi-Zone Climate Control"}, {"label": "Shock-Absorbing Air-Ride Suspension for Fragile Materials"}, {"label": "Real-time temperature"}, {"label": "GPS Telemetry"}, {"label": "Security for delicate & sensitive cargo"}, {"label": "Pristine condition"}]}];

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function safe(name, fn) {
    try { fn(); } catch (e) {
      if (window.console) console.error('[' + name + ']', e);
    }
  }

  /* ---------------------------------------------------------- mobile menu */
  function mobileMenu() {
    var header = document.querySelector('header');
    if (!header) return;
    var panel = header.querySelector('.lg\\:hidden.bg-black\\/75');
    var btn = null;
    var buttons = header.querySelectorAll('button');
    for (var i = 0; i < buttons.length; i++) {
      if (buttons[i].className.indexOf('lg:hidden') !== -1) { btn = buttons[i]; break; }
    }
    if (!btn || !panel) return;

    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Toggle navigation menu');

    function setOpen(open) {
      panel.hidden = !open;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    btn.addEventListener('click', function () {
      setOpen(panel.hidden);
    });
    // close when a link inside is used, or on Escape
    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) { setOpen(false); btn.focus(); }
    });
  }

  /* ------------------------------------------------------------ accordions */
  function accordions() {
    var groups = document.querySelectorAll('[data-accordion]');
    Array.prototype.forEach.call(groups, function (group) {
      var triggers = group.querySelectorAll('[data-accordion-trigger]');
      Array.prototype.forEach.call(triggers, function (trigger) {
        trigger.addEventListener('click', function () {
          var expanded = trigger.getAttribute('aria-expanded') === 'true';
          // close every item in this group (matches the original behaviour)
          Array.prototype.forEach.call(triggers, function (t) {
            t.setAttribute('aria-expanded', 'false');
            var p = document.getElementById(t.getAttribute('aria-controls'));
            if (p) p.hidden = true;
            var c = t.querySelector('[data-icon-closed]');
            var o = t.querySelector('[data-icon-open]');
            if (c) c.hidden = false;
            if (o) o.hidden = true;
          });
          if (!expanded) {
            trigger.setAttribute('aria-expanded', 'true');
            var panel = document.getElementById(trigger.getAttribute('aria-controls'));
            if (panel) panel.hidden = false;
            var ic = trigger.querySelector('[data-icon-closed]');
            var io = trigger.querySelector('[data-icon-open]');
            if (ic) ic.hidden = true;
            if (io) io.hidden = false;
          }
        });
      });
    });
  }

  /* --------------------------------------------------------- fleet rotator */
  function fleetRotator() {
    var root = document.querySelector('[data-component="fleet"]');
    if (!root || !FLEET.length) return;
    var col = root.querySelectorAll('.grid > div')[1];
    if (!col) return;
    var title = col.querySelector('h3');
    var desc = col.querySelector('p');
    var featureRow = col.querySelector('.flex.flex-wrap');
    var dotsRow = col.querySelector('[data-fleet-dots]') ||
                  col.querySelector('.mt-8.flex.gap-2');
    var frame = root.querySelector('[data-fleet-frame]');
    var photos = frame ? frame.querySelectorAll('img') : [];
    if (!title || !desc) return;

    var index = 0;
    var timer = null;

    function paint(i) {
      var item = FLEET[i];
      if (!item) return;
      index = i;
      title.textContent = item.title;
      desc.textContent = item.description;
      if (featureRow && item.features) {
        featureRow.innerHTML = '';
        item.features.forEach(function (f, n) {
          var wrap = document.createElement('div');
          wrap.className = 'flex items-center gap-4';
          var label = document.createElement('span');
          label.textContent = f.label;
          wrap.appendChild(label);
          if (n < item.features.length - 1) {
            var sep = document.createElement('span');
            sep.className = 'h-5 w-px bg-slate-200';
            wrap.appendChild(sep);
          }
          featureRow.appendChild(wrap);
        });
      }
      // cross-fade to this slide's photo; if there are fewer photos than
      // slides, wrap so we never land on a missing one
      if (photos.length) {
        Array.prototype.forEach.call(photos, function (img, n) {
          if (n === i % photos.length) img.setAttribute('data-active', '');
          else img.removeAttribute('data-active');
        });
      }
      if (dotsRow) {
        var dots = dotsRow.querySelectorAll('button');
        Array.prototype.forEach.call(dots, function (d, n) {
          d.className = 'h-2 rounded-full transition-all duration-300 ' +
            (n === i ? 'bg-[#E84C30] w-8' : 'bg-slate-300 w-2');
        });
      }
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        paint((index + 1) % FLEET.length);
      }, 1500);
    }
    function stop() { if (timer) window.clearInterval(timer); timer = null; }

    if (dotsRow) {
      var dots = dotsRow.querySelectorAll('button');
      Array.prototype.forEach.call(dots, function (d, n) {
        d.addEventListener('click', function () { paint(n); start(); });
      });
    }
    var prev = root.querySelector('[data-fleet-prev]');
    var next = root.querySelector('[data-fleet-next]');
    function step(by) {
      paint((index + by + FLEET.length) % FLEET.length);
      start();                     // manual move earns a fresh interval
    }
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });

    // pause while the user is hovering or the tab is hidden
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });
    paint(0);
    start();
  }

  /* ------------------------------------------------------- terminal search */
  /* Cards are grouped (Nigeria / West Coast Travel). Filter on the card's own
     text so the data lives in one place — the HTML — and hide any group whose
     cards are all filtered out. */
  function terminalSearch() {
    var root = document.querySelector('[data-component="terminals"]');
    if (!root) return;
    var input = root.querySelector('input[type="search"], input');
    if (!input) return;
    var cards = root.querySelectorAll('[data-terminal]');
    var groups = root.querySelectorAll('[data-terminal-group]');
    if (!cards.length) return;

    var empty = document.createElement('div');
    empty.className = 'mt-8 rounded-2xl border border-dashed border-gray-300 ' +
      'p-8 text-center text-[#1a1a1a]/70';
    empty.textContent = 'No terminals found matching your search.';
    empty.hidden = true;
    (groups.length ? groups[groups.length - 1].parentNode : root)
      .appendChild(empty);

    function apply() {
      var q = input.value.trim().toLowerCase();
      var shown = 0;
      Array.prototype.forEach.call(cards, function (card) {
        var hay = (card.textContent || '').toLowerCase();
        var match = !q || hay.indexOf(q) !== -1;
        card.hidden = !match;
        if (match) shown++;
      });
      // hide a group heading when nothing under it survived the filter
      Array.prototype.forEach.call(groups, function (g) {
        var visible = g.querySelectorAll('[data-terminal]:not([hidden])');
        g.hidden = visible.length === 0;
      });
      empty.hidden = shown !== 0;
    }

    input.addEventListener('input', apply);
    input.addEventListener('search', apply);
  }


  /* ------------------------------------------------- "Now Open" flyer */
  function announcement() {
    var wrap = document.querySelector('[data-flyer]');
    if (!wrap) return;
    var panel = wrap.querySelector('[role="dialog"]');
    var closeBtn = wrap.querySelector('[data-flyer-close]');
    var overlay = wrap.querySelector('[data-flyer-overlay]');
    var lastFocus = null;

    // shown on every homepage load and refresh, by request. To show it only
    // once per browser session instead, restore the sessionStorage guard.

    function close() {
      wrap.hidden = true;
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    function open() {
      lastFocus = document.activeElement;
      wrap.hidden = false;
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (overlay) overlay.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !wrap.hidden) close();
    });
    // keep tabbing inside the dialog while it is open
    wrap.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || wrap.hidden || !panel) return;
      var f = panel.querySelectorAll('a[href], button:not([disabled])');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });

    window.setTimeout(open, 900);
  }

  /* ---------------------------------------------------------- quote dialog */
  function dialogs() {
    var dialog = document.querySelector('[data-dialog]');
    if (!dialog) return;
    var content = dialog.querySelector('[data-dialog-content]');
    var lastFocus = null;

    function openers() {
      // explicit hook first, then fall back to matching the label
      var out = Array.prototype.slice.call(
        document.querySelectorAll('[data-quote-open]'));
      if (out.length) return out;
      var all = document.querySelectorAll('button, a');
      Array.prototype.forEach.call(all, function (el) {
        var txt = (el.textContent || '').trim().toLowerCase();
        if (txt === 'get a quote' || txt === 'request a quote') out.push(el);
      });
      return out;
    }

    function open() {
      lastFocus = document.activeElement;
      dialog.hidden = false;
      document.body.style.overflow = 'hidden';
      var focusable = content.querySelector(
        'input, select, textarea, button, [href]');
      if (focusable) focusable.focus();
      document.addEventListener('keydown', onKey);
    }
    function close() {
      dialog.hidden = true;
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      if (lastFocus) lastFocus.focus();
    }
    function onKey(e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      // keep focus inside the dialog
      var f = content.querySelectorAll(
        'input:not([disabled]), select:not([disabled]), textarea:not([disabled]),' +
        ' button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }

    openers().forEach(function (btn) {
      btn.addEventListener('click', function (e) { e.preventDefault(); open(); });
    });
    var closeBtn = dialog.querySelector('[data-dialog-close]');
    if (closeBtn) closeBtn.addEventListener('click', close);
    var overlay = dialog.querySelector('[data-dialog-overlay]');
    if (overlay) overlay.addEventListener('click', close);
  }

  /* --------------------------------------------------------------- forms */
  /* Submissions go to FormSubmit, which forwards them to the company inbox.
     We use their /ajax/ endpoint so the page never navigates and nothing
     opens in a new tab — a status line appears under the form instead.

     ---------------------------------------------------------------------
     FORM_ENDPOINT below contains the destination address. Once FormSubmit
     has been activated it will also give you a random-string address like
       https://formsubmit.co/ajax/a1b2c3d4e5f6...
     Swapping that in keeps the real email address out of the page source,
     where address-harvesting bots can read it. Everything else stays.
     --------------------------------------------------------------------- */
  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/info@fgonyenwe.com';

  function forms() {
    var all = document.querySelectorAll('form');
    Array.prototype.forEach.call(all, function (form) {
      var isQuote = !!form.querySelector('[name="companyName"]');
      form.setAttribute('novalidate', 'novalidate');

      if (!form.querySelector('[name="_subject"]')) {
        // FormSubmit reads fields beginning with an underscore as its own
        // settings rather than as answers to forward.
        var opts = {
          _subject: isQuote
            ? 'Freight quote request — fgtransport.ng'
            : 'Website enquiry — fgtransport.ng',
          _template: 'table',     // readable layout in the inbox
          _captcha: 'false'       // a captcha page would break the ajax call
        };
        Object.keys(opts).forEach(function (k) {
          var el = document.createElement('input');
          el.type = 'hidden';
          el.name = k;
          el.value = opts[k];
          form.appendChild(el);
        });

        // FormSubmit's own honeypot: bots fill it, people never see it
        var pot = document.createElement('input');
        pot.type = 'text';
        pot.name = '_honey';
        pot.tabIndex = -1;
        pot.autocomplete = 'off';
        pot.setAttribute('aria-hidden', 'true');
        pot.style.cssText =
          'position:absolute;left:-9999px;width:1px;height:1px;opacity:0';
        form.appendChild(pot);
      }

      var status = document.createElement('p');
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      status.className = 'mt-4 text-sm font-medium';
      status.hidden = true;
      form.appendChild(status);

      function say(msg, ok) {
        status.textContent = msg;
        status.className = 'mt-4 text-sm font-medium ' +
          (ok ? 'text-green-700' : 'text-red-600');
        status.hidden = false;
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        // checked here so an empty field never triggers a page navigation
        var required = form.querySelectorAll('[required]');
        for (var i = 0; i < required.length; i++) {
          var f = required[i];
          var empty = (f.type === 'checkbox') ? !f.checked : !String(f.value).trim();
          if (empty) {
            f.setAttribute('aria-invalid', 'true');
            f.focus();
            say('Please complete all required fields.', false);
            return;
          }
          f.removeAttribute('aria-invalid');
        }

        var btn = form.querySelector('button[type="submit"]') ||
                  form.querySelector('button:not([data-dialog-close])');
        var label = btn ? btn.textContent : '';
        if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
        say('Sending…', true);

        // FormSubmit's ajax endpoint is documented as taking a JSON object,
        // so send one rather than raw FormData
        var payload = {};
        new FormData(form).forEach(function (value, key) {
          // a repeated name (checkbox group) becomes one comma-joined value
          payload[key] = (key in payload) ? payload[key] + ', ' + value : value;
        });

        fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        })
          .then(function (r) { return r.json().catch(function () { return null; }); })
          .then(function (data) {
            // FormSubmit answers with success as the string "true"
            var ok = data && String(data.success) === 'true';
            if (ok) {
              var panel = document.querySelector('[data-contact-success]');
              if (panel) {
                form.hidden = true;
                panel.hidden = false;
                panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
              } else {
                form.reset();
                say(isQuote
                  ? 'Thank you! Your quote request has been sent. Our team will be in touch shortly.'
                  : 'Thank you! Your message has been sent.', true);
              }
            } else {
              say((data && data.message) ||
                  'Sorry, something went wrong. Please email info@fgonyenwe.com.', false);
            }
          })
          .catch(function () {
            say('Could not reach the server. Please check your connection, ' +
                'or email info@fgonyenwe.com.', false);
          })
          .then(function () {
            if (btn) { btn.disabled = false; btn.textContent = label; }
          });
      });
    });
  }


  /* -------------------------------------------------------- hash scrolling */
  function hashScroll() {
    if (!window.location.hash) return;
    var el = document.querySelector(window.location.hash);
    if (el) {
      window.setTimeout(function () {
        el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

  /* ------------------------------------------------------ mark current nav */
  function markCurrentNav() {
    var path = window.location.pathname.replace(/\/$/, '') || '/';
    var links = document.querySelectorAll('header a[href^="/"]');
    Array.prototype.forEach.call(links, function (a) {
      var href = a.getAttribute('href').replace(/\/$/, '') || '/';
      if (href === path) a.setAttribute('aria-current', 'page');
    });
  }

  ready(function () {
    safe('mobileMenu', mobileMenu);
    safe('accordions', accordions);
    safe('fleetRotator', fleetRotator);
    safe('terminalSearch', terminalSearch);
    safe('dialogs', dialogs);
    safe('announcement', announcement);
    safe('forms', forms);
    safe('hashScroll', hashScroll);
    safe('markCurrentNav', markCurrentNav);
  });
})();
