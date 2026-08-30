/* =============================================
   CORALUXE — Main JavaScript
   Framework-free, vanilla JS
   ============================================= */

(function () {
  'use strict';

  /* --- DOM Ready --- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNav();
    initMobileMenu();
    initHeroCarousel();
    initHeroParallax();
    initRoomHorizontalScroll();
    initFadeUp();
    initBackToTop();
    initGalleryLightbox();
  }

  /* ===== NAVIGATION ===== */
  function initNav() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    var scrollThreshold = 60;

    function onScroll() {
      if (window.scrollY > scrollThreshold) {
        nav.classList.add('nav--scrolled');
        nav.classList.remove('nav--transparent');
      } else {
        nav.classList.remove('nav--scrolled');
        nav.classList.add('nav--transparent');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ===== MOBILE MENU ===== */
  function initMobileMenu() {
    var toggle = document.querySelector('.nav__toggle');
    var links = document.querySelector('.nav__links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      toggle.classList.toggle('active');
      links.classList.toggle('open');
      document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    var navLinks = links.querySelectorAll('.nav__link');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('active');
        links.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ===== HERO CAROUSEL ===== */
  function initHeroCarousel() {
    var slides = document.querySelectorAll('.hero__slide');
    var prevBtn = document.querySelector('.hero__control--prev');
    var nextBtn = document.querySelector('.hero__control--next');
    if (slides.length < 2) return;

    var current = 0;
    var total = slides.length;
    var autoplayInterval = 5000;
    var timer = null;

    function goTo(index) {
      slides[current].classList.remove('active');
      current = (index + total) % total;
      slides[current].classList.add('active');
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAutoplay() {
      stopAutoplay();
      timer = setInterval(next, autoplayInterval);
    }

    function stopAutoplay() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); startAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { next(); startAutoplay(); });

    startAutoplay();
  }

  /* ===== HERO PARALLAX ===== */
  function initHeroParallax() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var slideImages = hero.querySelectorAll('.hero__slide img');

    function onScroll() {
      var scrolled = window.scrollY;
      var heroHeight = hero.offsetHeight;

      if (scrolled < heroHeight) {
        var parallaxOffset = scrolled * 0.3;
        slideImages.forEach(function (img) {
          img.style.transform = 'translateY(' + parallaxOffset + 'px) scale(1.1)';
        });
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ===== ROOM HORIZONTAL SCROLL ===== */
  function initRoomHorizontalScroll() {
    var track = document.querySelector('.rooms-scroll__track');
    var prevBtn = document.querySelector('.rooms-scroll__prev');
    var nextBtn = document.querySelector('.rooms-scroll__next');
    if (!track) return;

    var scrollAmount = 450;

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      });
    }

    // Mouse wheel horizontal scroll
    track.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        track.scrollBy({ left: e.deltaY, behavior: 'smooth' });
      }
    }, { passive: false });

    // Drag to scroll
    var isDragging = false;
    var startX = 0;
    var scrollLeft = 0;

    track.addEventListener('mousedown', function (e) {
      isDragging = true;
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
      track.style.cursor = 'grabbing';
    });

    track.addEventListener('mouseleave', function () {
      isDragging = false;
      track.style.cursor = 'grab';
    });

    track.addEventListener('mouseup', function () {
      isDragging = false;
      track.style.cursor = 'grab';
    });

    track.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      e.preventDefault();
      var x = e.pageX - track.offsetLeft;
      var walk = (x - startX) * 1.5;
      track.scrollLeft = scrollLeft - walk;
    });
  }

  /* ===== FADE-UP ON SCROLL ===== */
  function initFadeUp() {
    var elements = document.querySelectorAll('.fade-up');
    if (!elements.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ===== BACK TO TOP ===== */
  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;

    function onScroll() {
      if (window.scrollY > 500) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===== GALLERY LIGHTBOX (simple) ===== */
  function initGalleryLightbox() {
    var items = document.querySelectorAll('.gallery-grid__item');
    if (!items.length) return;

    // Create overlay
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(10,22,40,0.92);z-index:2000;display:flex;align-items:center;justify-content:center;opacity:0;visibility:hidden;transition:opacity 0.3s ease,visibility 0.3s ease;cursor:pointer;';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Image lightbox');

    var imgEl = document.createElement('img');
    imgEl.style.cssText = 'max-width:90vw;max-height:85vh;border-radius:8px;box-shadow:0 16px 60px rgba(0,0,0,0.4);';
    overlay.appendChild(imgEl);

    var closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = 'position:absolute;top:20px;right:30px;background:none;border:none;color:#fff;font-size:2rem;cursor:pointer;line-height:1;';
    closeBtn.setAttribute('aria-label', 'Close lightbox');
    overlay.appendChild(closeBtn);

    document.body.appendChild(overlay);

    function open(src, alt) {
      imgEl.src = src;
      imgEl.alt = alt || '';
      overlay.style.opacity = '1';
      overlay.style.visibility = 'visible';
      document.body.style.overflow = 'hidden';
    }

    function close() {
      overlay.style.opacity = '0';
      overlay.style.visibility = 'hidden';
      document.body.style.overflow = '';
    }

    items.forEach(function (item) {
      item.addEventListener('click', function () {
        var img = item.querySelector('img');
        if (img) open(img.src, img.alt);
      });
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target === closeBtn) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

})();
