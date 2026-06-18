(function () {
  'use strict';

  /* THEME */
  const themeBtn = document.querySelector('.theme-btn');
  const themeIcon = themeBtn?.querySelector('i');
  const saved = localStorage.getItem('theme') || 'light';

  document.documentElement.setAttribute('data-theme', saved);
  if (themeIcon) {
    themeIcon.className = saved === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }

  themeBtn?.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    if (themeIcon) {
      themeIcon.className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  });

  /* MOBILE NAV */
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.nav-links');

  menuBtn?.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    navLinks?.classList.toggle('open');
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      menuBtn?.classList.remove('active');
      navLinks?.classList.remove('open');
    });
  });

  /* ACTIVE LINK */
  const sections = document.querySelectorAll('section[id]');
  const anchors = document.querySelectorAll('.nav-links a');

  function setActive() {
    let id = '';
    sections.forEach(s => {
      const top = s.offsetTop - 130;
      const bot = top + s.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bot) id = s.getAttribute('id');
    });
    anchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + id);
    });
  }

  window.addEventListener('scroll', setActive);
  window.addEventListener('load', setActive);

  /* TYPING */
  const typing = document.querySelector('.typing');
  if (typing) {
    const words = ['Graphic Designer', 'Frontend Developer', 'Photographer'];
    let wi = 0, ci = 0, del = false, pause = false;

    function type() {
      if (pause) { setTimeout(type, 2200); pause = false; return; }
      const w = words[wi];
      typing.textContent = del ? w.substring(0, ci - 1) : w.substring(0, ci + 1);
      del ? ci-- : ci++;
      if (!del && ci === w.length) { pause = true; del = true; setTimeout(type, 2200); return; }
      if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; }
      setTimeout(type, del ? 40 : 90);
    }
    type();
  }

  /* COUNTERS */
  const stats = document.querySelectorAll('.stat-num');
  let counted = false;

  function countUp() {
    if (counted) return;
    stats.forEach(el => {
      const target = parseInt(el.getAttribute('data-count'));
      let cur = 0;
      const step = Math.ceil(target / 50);
      function tick() {
        cur += step;
        if (cur >= target) { el.textContent = target + '+'; return; }
        el.textContent = cur;
        requestAnimationFrame(tick);
      }
      tick();
    });
    counted = true;
  }

  /* SCROLL REVEAL */
  const revealEls = document.querySelectorAll(
    '.service-card, .work-item, .about-text, .contact-form, .contact-details'
  );

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        if (e.target.classList.contains('about-text')) countUp();
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => {
    el.classList.add('reveal');
    obs.observe(el);
  });

  /* FILTER */
  const filters = document.querySelectorAll('.filter');
  const items = document.querySelectorAll('.work-item');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = btn.getAttribute('data-filter');
      items.forEach(it => {
        it.classList.toggle('hidden', val !== 'all' && it.getAttribute('data-category') !== val);
      });
    });
  });

  /* CONTACT FORM */
  const form = document.getElementById('contactForm');
  const msg = document.querySelector('.form-msg');

  form?.addEventListener('submit', (e) => {
    const btn = form.querySelector('.btn-send');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    setTimeout(() => {
      msg.className = 'form-msg success';
      msg.textContent = 'Thanks for reaching out! I\'ll get back to you soon.';
      form.reset();
      btn.disabled = false;
      btn.innerHTML = '<i class="far fa-paper-plane"></i> Send Message';
      setTimeout(() => { msg.className = 'form-msg'; msg.textContent = ''; }, 5000);
    }, 1000);
  });

})();
