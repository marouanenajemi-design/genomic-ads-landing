/* ================================================
   GENOMIC LANDING — MAIN JAVASCRIPT
   ================================================ */

(function () {
  'use strict';

  /* ---- STATE ---- */
  let currentLang = 'ar';

  /* ---- DOM REFS ---- */
  const html        = document.documentElement;
  const navbar      = document.getElementById('navbar');
  const navLinks    = document.getElementById('navLinks');
  const hamburger   = document.getElementById('hamburger');
  const langToggle  = document.getElementById('langToggle');
  const form        = document.getElementById('registrationForm');

  /* ================================================
     LANGUAGE SWITCHER
  ================================================ */
  function setLanguage(lang) {
    currentLang = lang;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    /* Toggle active pill */
    langToggle.querySelector('.lang-ar').classList.toggle('active', lang === 'ar');
    langToggle.querySelector('.lang-fr').classList.toggle('active', lang === 'fr');

    /* Translate all [data-ar] / [data-fr] elements */
    document.querySelectorAll('[data-ar]').forEach(el => {
      const text = el.getAttribute('data-' + lang);
      if (text !== null) {
        /* Buttons / anchors with a child SVG — update the text node only */
        const svgChild = el.querySelector('svg');
        if (svgChild) {
          const spanChild = el.querySelector('span[data-ar]');
          if (spanChild) {
            spanChild.textContent = spanChild.getAttribute('data-' + lang) || spanChild.textContent;
          }
        } else if (el.tagName === 'INPUT' || el.tagName === 'OPTION') {
          /* placeholders / option text */
          if (el.tagName === 'OPTION') el.textContent = text;
          el.setAttribute('placeholder', text);
        } else {
          el.textContent = text;
        }
      }
    });

    /* Translate form placeholders */
    updateFormPlaceholders(lang);
  }

  function updateFormPlaceholders(lang) {
    const placeholders = {
      ar: { fullName: 'أدخل اسمك الكامل', phone: '0600000000', city: 'مثال: طنجة' },
      fr: { fullName: 'Entrez votre nom complet', phone: '0600000000', city: 'Ex: Tanger' }
    };
    const p = placeholders[lang];
    const fullName = document.getElementById('fullName');
    const phone    = document.getElementById('phone');
    const city     = document.getElementById('city');
    if (fullName) fullName.placeholder = p.fullName;
    if (phone)    phone.placeholder    = p.phone;
    if (city)     city.placeholder     = p.city;
  }

  langToggle.addEventListener('click', () => {
    setLanguage(currentLang === 'ar' ? 'fr' : 'ar');
  });

  /* ================================================
     MOBILE MENU
  ================================================ */
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  /* Close menu on nav link click */
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });

  /* ================================================
     NAVBAR SCROLL EFFECT
  ================================================ */
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 20);

    /* Auto-close mobile menu on scroll */
    if (Math.abs(scrollY - lastScroll) > 50) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    }
    lastScroll = scrollY;
  }, { passive: true });

  /* ================================================
     SMOOTH SCROLL
  ================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ================================================
     FAQ ACCORDION
  ================================================ */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-a');
      const isOpen = item.classList.contains('open');

      /* Close all */
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-a').classList.remove('open');
      });

      /* Toggle clicked */
      if (!isOpen) {
        item.classList.add('open');
        answer.classList.add('open');
      }
    });
  });

  /* ================================================
     PROGRAM CARDS — CLICK TO PRE-SELECT PROGRAM
  ================================================ */
  document.querySelectorAll('.program-card').forEach(card => {
    const btn = card.querySelector('.btn-program');
    if (!btn) return;
    btn.addEventListener('click', e => {
      e.preventDefault();
      /* Pre-select the program in the form */
      const programAr = card.getAttribute('data-program-ar');
      const programFr = card.getAttribute('data-program-fr');
      const select = document.getElementById('program');
      if (select && programAr && programFr) {
        const matchValue = programAr + ' / ' + programFr;
        Array.from(select.options).forEach(opt => {
          if (opt.value === matchValue) opt.selected = true;
        });
      }
      /* Smooth scroll to form */
      const registerSection = document.getElementById('register');
      if (registerSection) {
        const offset = navbar.offsetHeight + 8;
        const top = registerSection.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ================================================
     FORM VALIDATION & WHATSAPP REDIRECT
  ================================================ */
  function showError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const err   = document.getElementById(errorId);
    if (field) field.classList.add('error');
    if (err)   err.textContent = message;
  }
  function clearError(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const err   = document.getElementById(errorId);
    if (field) field.classList.remove('error');
    if (err)   err.textContent = '';
  }

  /* Live clear errors */
  ['fullName', 'phone', 'city'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => clearError(id, id === 'fullName' ? 'nameError' : id === 'phone' ? 'phoneError' : 'cityError'));
  });
  const branchSel = document.getElementById('branch');
  if (branchSel) branchSel.addEventListener('change', () => clearError('branch', 'branchError'));
  const progSelect = document.getElementById('program');
  if (progSelect) progSelect.addEventListener('change', () => clearError('program', 'programError'));

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    /* Null-safe field reads — console.warn if an element is absent */
    const nameEl    = document.getElementById('fullName');
    const phoneEl   = document.getElementById('phone');
    const cityEl    = document.getElementById('city');
    const branchEl  = document.getElementById('branch');
    const programEl = document.getElementById('program');

    if (!nameEl)    console.warn('[Genomic Form] Field not found: #fullName');
    if (!phoneEl)   console.warn('[Genomic Form] Field not found: #phone');
    if (!cityEl)    console.warn('[Genomic Form] Field not found: #city');
    if (!programEl) console.warn('[Genomic Form] Field not found: #program');

    const nameVal    = nameEl    ? nameEl.value.trim()    : '';
    const phoneVal   = phoneEl   ? phoneEl.value.trim()   : '';
    const cityVal    = cityEl    ? cityEl.value.trim()     : '';
    const branchVal  = branchEl && branchEl.selectedIndex > 0
      ? (branchEl.options[branchEl.selectedIndex].getAttribute('data-' + currentLang) || branchEl.value)
      : '';
    const programVal = programEl ? programEl.value.trim() : '';

    /* Validation messages */
    const msg = {
      ar: {
        nameReq:    'الرجاء إدخال اسمك الكامل',
        phoneReq:   'الرجاء إدخال رقم الهاتف',
        phoneInv:   'رقم الهاتف غير صحيح',
        cityReq:    'الرجاء إدخال مدينتك',
        branchReq:  'الرجاء اختيار الفرع',
        programReq: 'الرجاء اختيار برنامج'
      },
      fr: {
        nameReq:    'Veuillez entrer votre nom complet',
        phoneReq:   'Veuillez entrer votre numéro de téléphone',
        phoneInv:   'Numéro de téléphone invalide',
        cityReq:    'Veuillez entrer votre ville',
        branchReq:  'Veuillez choisir une filiale',
        programReq: 'Veuillez choisir un programme'
      }
    };
    const m = msg[currentLang];

    /* Name */
    if (!nameVal) {
      showError('fullName', 'nameError', m.nameReq);
      valid = false;
    } else { clearError('fullName', 'nameError'); }

    /* Phone */
    const phoneClean = phoneVal.replace(/[\s\-().+]/g, '');
    if (!phoneVal) {
      showError('phone', 'phoneError', m.phoneReq);
      valid = false;
    } else if (!/^[0-9]{8,15}$/.test(phoneClean)) {
      showError('phone', 'phoneError', m.phoneInv);
      valid = false;
    } else { clearError('phone', 'phoneError'); }

    /* City — only validate if the field is present in the DOM */
    if (cityEl && !cityVal) {
      showError('city', 'cityError', m.cityReq);
      valid = false;
    } else if (cityEl) { clearError('city', 'cityError'); }

    /* Branch */
    if (!branchVal) {
      showError('branch', 'branchError', m.branchReq);
      valid = false;
    } else { clearError('branch', 'branchError'); }

    /* Program */
    if (!programVal) {
      showError('program', 'programError', m.programReq);
      valid = false;
    } else { clearError('program', 'programError'); }

    if (!valid) return;

    /* Route to the correct branch phone number */
    const waNumbers = { tanger: '212600136142', taroudant: '212772584951' };
    const branchKey = branchEl ? branchEl.value : 'tanger';
    const waNumber  = waNumbers[branchKey] || waNumbers.tanger;

    /* Build WhatsApp message — all fields + language label */
    let waMessage;
    if (currentLang === 'ar') {
      waMessage =
        `السلام عليكم،\n` +
        `أريد التسجيل في معهد جينوميك الخاص.\n\n` +
        `• الاسم الكامل: ${nameVal}\n` +
        `• الهاتف: ${phoneVal}\n` +
        (cityVal ? `• المدينة: ${cityVal}\n` : '') +
        `• الفرع: ${branchVal}\n` +
        `• البرنامج: ${programVal}\n` +
        `• اللغة: عربي\n\n` +
        `شكراً جزيلاً!`;
    } else {
      waMessage =
        `Bonjour,\n` +
        `Je souhaite m'inscrire à l'Institut Genomic Privé.\n\n` +
        `• Nom complet: ${nameVal}\n` +
        `• Téléphone: ${phoneVal}\n` +
        (cityVal ? `• Ville: ${cityVal}\n` : '') +
        `• Filiale: ${branchVal}\n` +
        `• Programme: ${programVal}\n` +
        `• Langue: Français\n\n` +
        `Merci !`;
    }

    const waUrl = 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(waMessage);

    /* Meta Pixel — fire tracking before redirect */
    if (typeof fbq === 'function') {
      fbq('track', 'Lead');
      fbq('trackCustom', 'WhatsAppLead', { branch: branchKey, program: programVal });
      if (branchKey === 'tanger')    fbq('trackCustom', 'TangerLead');
      if (branchKey === 'taroudant') fbq('trackCustom', 'TaroudantLead');
    }

    console.log('Lead sent:', branchKey, '→', waNumber);

    /* Reset form immediately, then open WA after pixel has time to fire */
    form.reset();
    setTimeout(() => {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }, 500);
  });

  /* ================================================
     SCROLL REVEAL
  ================================================ */
  const revealTargets = [
    '.trust-item',
    '.program-card',
    '.why-card',
    '.testi-card',
    '.faq-item',
    '.branch-card',
    '.contact-card',
    '.register-left',
    '.register-right'
  ];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  function initReveal() {
    document.querySelectorAll(revealTargets.join(',')).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 4) * 0.08 + 's';
      observer.observe(el);
    });
  }

  /* ================================================
     INIT
  ================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    setLanguage('ar');
    updateFormPlaceholders('ar');
    initReveal();
  });

  /* Fallback for fast DOMContentLoaded */
  if (document.readyState !== 'loading') {
    setLanguage('ar');
    updateFormPlaceholders('ar');
    initReveal();
  }

  /* ================================================
     TESTIMONIALS CAROUSEL
  ================================================ */
  (function () {
    const outer  = document.getElementById('carouselOuter');
    const track  = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsWrap = document.getElementById('carouselDots');
    if (!outer || !track) return;

    const cards = track.querySelectorAll('.testi-card');
    const total = cards.length;
    let current = 0;
    let autoTimer = null;

    function getVisible() {
      if (window.innerWidth <= 480) return 1;
      if (window.innerWidth <= 768) return 2;
      return 3;
    }

    function cardWidth() {
      const vis = getVisible();
      return (outer.offsetWidth - 24 * (vis - 1)) / vis;
    }

    function maxIdx() { return total - getVisible(); }

    function buildDots() {
      dotsWrap.innerHTML = '';
      const count = maxIdx() + 1;
      for (let i = 0; i < count; i++) {
        const d = document.createElement('button');
        d.className = 'carousel-dot' + (i === current ? ' active' : '');
        d.setAttribute('aria-label', 'Slide ' + (i + 1));
        d.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(d);
      }
    }

    function updateDots() {
      dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function goTo(idx) {
      const max = maxIdx();
      current = Math.max(0, Math.min(idx, max));
      track.style.transform = 'translateX(-' + current * (cardWidth() + 24) + 'px)';
      updateDots();
      if (prevBtn) prevBtn.disabled = current === 0;
      if (nextBtn) nextBtn.disabled = current >= max;
      resetAuto();
    }

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => {
        goTo(current >= maxIdx() ? 0 : current + 1);
      }, 4000);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

    let touchX = 0;
    outer.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    outer.addEventListener('touchend', e => {
      const diff = touchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    }, { passive: true });

    let resizeT;
    window.addEventListener('resize', () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(() => { buildDots(); goTo(Math.min(current, maxIdx())); }, 150);
    });

    buildDots();
    goTo(0);
  })();

})();
