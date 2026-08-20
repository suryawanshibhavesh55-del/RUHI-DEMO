/* ==========================================================================
   RUHI PERFUMES — LUXURY FRONTEND LOGIC
   GSAP + ScrollTrigger + Lenis Smooth Scroll + Custom Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------
     1. PRELOADER & INITIAL ANIMATION TIMELINE
     -------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  const preloaderBrand = document.querySelector('.preloader-brand');
  const preloaderSubtitle = document.querySelector('.preloader-subtitle');
  const preloaderLine = document.querySelector('.preloader-line');

  if (preloader) {
    // Animate preloader items
    setTimeout(() => {
      if (preloaderBrand) {
        preloaderBrand.style.opacity = '1';
        preloaderBrand.style.transform = 'translateY(0)';
        preloaderBrand.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      }
    }, 200);

    setTimeout(() => {
      if (preloaderSubtitle) {
        preloaderSubtitle.style.opacity = '1';
        preloaderSubtitle.style.transition = 'all 0.6s ease';
      }
    }, 400);

    setTimeout(() => {
      if (preloaderLine) {
        preloaderLine.style.width = '100%';
      }
    }, 500);

    // Fade out preloader after 1.4 seconds
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      initHeroAnimations();
    }, 1500);
  } else {
    initHeroAnimations();
  }

  /* --------------------------------------------------
     2. HERO ANIMATION TIMELINE
     -------------------------------------------------- */
  function initHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCta = document.querySelector('.hero-cta');
    const heroBg = document.querySelector('.hero-bg-image');

    if (heroBg) {
      heroBg.style.transform = 'scale(1)';
    }

    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline();
      if (heroTitle) {
        tl.fromTo(heroTitle, 
          { y: 50, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }
        );
      }
      if (heroSubtitle) {
        tl.fromTo(heroSubtitle, 
          { y: 20, opacity: 0, letterSpacing: '0.2em' }, 
          { y: 0, opacity: 1, letterSpacing: '0.45em', duration: 1, ease: 'power2.out' },
          '-=0.8'
        );
      }
      if (heroCta) {
        tl.fromTo(heroCta, 
          { y: 20, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
          '-=0.6'
        );
      }
    }
  }

  /* --------------------------------------------------
     3. LENIS SMOOTH SCROLLING
     -------------------------------------------------- */
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  /* --------------------------------------------------
     4. NAVBAR SCROLL EFFECT
     -------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /* --------------------------------------------------
     5. MOBILE MENU DRAWER TOGGLE
     -------------------------------------------------- */
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileToggle && mobileOverlay) {
    mobileToggle.addEventListener('click', () => {
      mobileOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (mobileCloseBtn && mobileOverlay) {
    mobileCloseBtn.addEventListener('click', () => {
      mobileOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileOverlay) {
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  /* --------------------------------------------------
     6. CUSTOM DESKTOP CURSOR
     -------------------------------------------------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const cursorText = cursorRing ? cursorRing.querySelector('.cursor-text') : null;

  if (cursorDot && cursorRing && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function renderCursor() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Hover Targets
    const interactiveElements = document.querySelectorAll('a, button, .hover-target, .quiz-btn, .product-card');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorRing.classList.add('cursor-hover');
        if (cursorText) {
          const customText = el.getAttribute('data-cursor');
          cursorText.textContent = customText || 'VIEW';
        }
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.classList.remove('cursor-hover');
        if (cursorText) cursorText.textContent = '';
      });
    });
  }

  /* --------------------------------------------------
     7. BRAND STATEMENT WORD-BY-WORD SCROLL REVEAL
     -------------------------------------------------- */
  const statementWords = document.querySelectorAll('.word-reveal');
  if (statementWords.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -15% 0px',
      threshold: 0.1
    };

    const wordObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Stagger reveal of visible words
          statementWords.forEach((word, idx) => {
            setTimeout(() => {
              word.classList.add('active');
            }, idx * 90);
          });
          wordObserver.disconnect();
        }
      });
    }, observerOptions);

    const statementSection = document.querySelector('.brand-statement-section');
    if (statementSection) {
      wordObserver.observe(statementSection);
    }
  }

  /* --------------------------------------------------
     8. INTERACTIVE FRAGRANCE QUIZ ENGINE
     -------------------------------------------------- */
  const quizSteps = document.querySelectorAll('.quiz-step');
  const quizAnswers = {
    mood: '',
    occasion: '',
    intensity: ''
  };

  const fragrances = {
    'noir': {
      name: '01 — RUHI NOIR',
      family: 'Woody Amber',
      personality: 'Dark • Magnetic • Sophisticated',
      image: 'assets/vial_velvet_noir.jpg',
      desc: 'A deep, magnetic composition where smoky woods meet warm amber and delicate saffron.'
    },
    'meher': {
      name: '02 — MEHER',
      family: 'Floral Musk',
      personality: 'Elegant • Soft • Feminine',
      image: 'assets/vial_rose_whisper.jpg',
      desc: 'Soft florals wrapped in creamy musk, created for effortless elegance.'
    },
    'saffron': {
      name: '03 — SAFFRON VEIL',
      family: 'Oriental Floral',
      personality: 'Opulent • Mysterious • Sensual',
      image: 'assets/vial_mystic_amber.jpg',
      desc: 'A luminous veil of saffron and rose resting over rich amber woods.'
    },
    'amber': {
      name: '04 — AMBER DUSK',
      family: 'Amber Woody',
      personality: 'Warm • Addictive • Intimate',
      image: 'assets/vial_sandal_elegance.jpg',
      desc: 'Warm amber and smooth woods capture the quiet intensity of dusk.'
    },
    'aarzoo': {
      name: '05 — AARZOO',
      family: 'Fresh Floral',
      personality: 'Fresh • Romantic • Dreamy',
      image: 'assets/vial_citrus_zest.jpg',
      desc: 'A luminous floral composition with a soft, clean trail and a romantic heart.'
    }
  };

  window.selectQuizOption = function(stepNum, key, value) {
    quizAnswers[key] = value;

    // Hide current step
    const currentStep = document.getElementById(`quiz-step-${stepNum}`);
    if (currentStep) currentStep.classList.remove('active');

    const nextStepNum = stepNum + 1;
    const nextStep = document.getElementById(`quiz-step-${nextStepNum}`);

    if (nextStepNum === 4) {
      // Calculate Result
      calculateQuizResult();
    }

    if (nextStep) {
      nextStep.classList.add('active');
    }
  };

  function calculateQuizResult() {
    let resultKey = 'noir';

    if (quizAnswers.mood === 'Mysterious' || quizAnswers.intensity === 'Deep & Intense') {
      resultKey = 'noir';
    } else if (quizAnswers.mood === 'Elegant' && quizAnswers.occasion === 'Daytime Elegance') {
      resultKey = 'meher';
    } else if (quizAnswers.mood === 'Sensual' || quizAnswers.mood === 'Opulent') {
      resultKey = 'saffron';
    } else if (quizAnswers.mood === 'Warm' || quizAnswers.intensity === 'Warm & Intimate') {
      resultKey = 'amber';
    } else if (quizAnswers.mood === 'Fresh' || quizAnswers.mood === 'Romantic') {
      resultKey = 'aarzoo';
    }

    const matchedFragrance = fragrances[resultKey];
    const resultName = document.getElementById('quiz-result-name');
    const resultFamily = document.getElementById('quiz-result-family');
    const resultPersonality = document.getElementById('quiz-result-personality');
    const resultDesc = document.getElementById('quiz-result-desc');
    const resultImg = document.getElementById('quiz-result-img');

    if (resultName) resultName.textContent = matchedFragrance.name;
    if (resultFamily) resultFamily.textContent = matchedFragrance.family;
    if (resultPersonality) resultPersonality.textContent = matchedFragrance.personality;
    if (resultDesc) resultDesc.textContent = `"${matchedFragrance.desc}"`;
    if (resultImg) resultImg.src = matchedFragrance.image;
  }

  window.resetQuiz = function() {
    quizSteps.forEach(step => step.classList.remove('active'));
    const step1 = document.getElementById('quiz-step-1');
    if (step1) step1.classList.add('active');
  };

});
