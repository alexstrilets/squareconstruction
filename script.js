/* Square Construction — UI helpers: navbar state, active nav link,
   FAQ accordion, footer year, quote-form fallback. */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var navbar = document.querySelector('.navbar');
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    /* Shrink the navbar once the page scrolls */
    function onScroll() {
      if (!navbar) return;
      navbar.classList.toggle('navbar-scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Highlight the nav link for the section in view */
    var links = Array.prototype.slice.call(document.querySelectorAll('.navbar .nav-link'));
    var sections = links
      .map(function (a) { return document.querySelector(a.getAttribute('href')); })
      .filter(Boolean);
    if ('IntersectionObserver' in window && sections.length) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
          });
        });
      }, { rootMargin: '-40% 0px -55% 0px' });
      sections.forEach(function (s) { observer.observe(s); });
    }

    /* FAQ accordion — real buttons, aria-expanded drives the CSS */
    document.querySelectorAll('.faq-question').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        document.querySelectorAll('.faq-question').forEach(function (other) {
          other.setAttribute('aria-expanded', 'false');
        });
        btn.setAttribute('aria-expanded', String(!open));
      });
    });

    /* Quote form: warn loudly if the delivery endpoint is still a placeholder */
    var form = document.getElementById('quote-form');
    var status = document.getElementById('form-status');
    if (form && status && form.action.indexOf('YOUR_FORM_ID') !== -1) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        status.textContent = 'Heads up: the form is not wired to an inbox yet — set the Formspree/EmailJS endpoint (see the comment in index.html) before launch.';
        status.className = 'form-status error';
      });
    }
  });
})();
