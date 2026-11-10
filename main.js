/* Wag n' Wash — mobile menu, scroll-spy, lightbox, booking form, today highlight */
(function () {
  'use strict';

  /* ---- Mobile menu: instant open/close (no transition on the transform) ---- */
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-mobile-menu]');
  function setMenu(open) {
    if (!toggle || !menu) return;
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(!menu.classList.contains('open'));
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { setMenu(false); closeLightbox(); }
    });
  }

  /* ---- Scroll-spy ---- */
  var navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  var sections = [];
  navLinks.forEach(function (a) {
    var el = document.querySelector(a.getAttribute('href'));
    if (el) sections.push({ link: a, el: el });
  });
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sections.forEach(function (s) {
          s.link.classList.toggle('active', s.el === entry.target);
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { spy.observe(s.el); });
  }

  /* ---- Today highlight in the hours table ---- */
  var today = new Date().getDay();
  document.querySelectorAll('.hours tr[data-day]').forEach(function (tr) {
    if (parseInt(tr.getAttribute('data-day'), 10) === today) tr.classList.add('today');
  });

  /* ---- Lightbox ---- */
  var figures = Array.prototype.slice.call(document.querySelectorAll('.gallery-grid figure'));
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lightbox-img');
  var lbCaption = document.getElementById('lightbox-caption');
  var current = -1;
  function openLightbox(i) {
    current = i;
    var fig = figures[i];
    lbImg.src = fig.getAttribute('data-full');
    lbImg.alt = fig.querySelector('img').alt;
    lbCaption.textContent = fig.getAttribute('data-caption') || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    current = -1;
  }
  function stepLightbox(d) {
    if (current < 0) return;
    openLightbox((current + d + figures.length) % figures.length);
  }
  figures.forEach(function (fig, i) {
    fig.addEventListener('click', function () { openLightbox(i); });
    fig.setAttribute('tabindex', '0');
    fig.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
    });
  });
  if (lightbox) {
    lightbox.querySelector('.lb-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lb-prev').addEventListener('click', function () { stepLightbox(-1); });
    lightbox.querySelector('.lb-next').addEventListener('click', function () { stepLightbox(1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'ArrowLeft') stepLightbox(-1);
      if (e.key === 'ArrowRight') stepLightbox(1);
    });
  }

  /* ---- Booking form -> mailto the salon ---- */
  var form = document.getElementById('booking-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var get = function (id) { return (document.getElementById(id).value || '').trim(); };
      var subject = 'Booking request — ' + get('f-service') + ' (' + get('f-dog') + ')';
      var body = [
        'Hello Wag n\' Wash,',
        '',
        'I would like to book a ' + get('f-service') + ' for my dog.',
        '',
        'Name: ' + get('f-name'),
        'Phone: ' + get('f-phone'),
        'Dog: ' + get('f-dog'),
        'Service: ' + get('f-service'),
        'Preferred day: ' + get('f-day'),
        'Anything you should know: ' + (get('f-msg') || '—'),
        '',
        'Thanks!'
      ].join('\n');
      window.location.href = 'mailto:wagnwashgrooming@hotmail.com'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(body);
    });
  }

  /* ---- Footer year ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
