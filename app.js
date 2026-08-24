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
     8. 10 SIGNATURE FRAGRANCES DISCOVERY QUIZ ENGINE
     -------------------------------------------------- */
  const quizSteps = document.querySelectorAll('.quiz-step');
  const quizAnswers = {
    mood: '',
    occasion: '',
    intensity: ''
  };

  const fragrances = {
    'vanta': {
      name: '01 — RUHI VANTA',
      family: 'Amber Leather',
      personality: 'Deep • Dark • Sophisticated',
      image: 'assets/hd/bottle_01.png',
      desc: 'An intense, dark composition of smoked leather, midnight oud and warm amber for profound sophistication.'
    },
    'noxen': {
      name: '02 — RUHI NOXEN',
      family: 'Oriental Woody',
      personality: 'Mysterious • Powerful',
      image: 'assets/hd/bottle_02.png',
      desc: 'Enigmatic labdanum and smoked incense wrapped in rich black amber and guaiac wood.'
    },
    'velor': {
      name: '03 — RUHI VELOR',
      family: 'Velvet Musk',
      personality: 'Dark Luxury',
      image: 'assets/hd/bottle_03.png',
      desc: 'Sumptuous rum accord, dark violet, and rich tobacco leaves resting over velvety musk and vanilla.'
    },
    'zayron': {
      name: '04 — RUHI ZAYRON',
      family: 'Spicy Oud',
      personality: 'Bold • Commanding',
      image: 'assets/hd/bottle_04.png',
      desc: 'Commanding Cambodian oud infused with nutmeg, smoked birch, and ambergris for effortless authority.'
    },
    'draeven': {
      name: '05 — RUHI DRAEVEN',
      family: 'Smoky Amber',
      personality: 'Intense • Enigmatic',
      image: 'assets/hd/bottle_05.png',
      desc: 'Dark plum and smoked frankincense melting into patchouli and rich bourbon vanilla.'
    },
    'vexor': {
      name: '06 — RUHI VEXOR',
      family: 'Aromatic Woody',
      personality: 'Sharp • Rebellious',
      image: 'assets/hd/bottle_01.png',
      desc: 'A sharp, rebellious fusion of crushed black pepper, vetiver root, and smoked cedarwood.'
    },
    'aurev': {
      name: '07 — RUHI AUREV',
      family: 'Imperial Floral',
      personality: 'Elegant • Exclusive',
      image: 'assets/hd/bottle_02.png',
      desc: 'Golden saffron and imperial rose grounded in white sandalwood and royal amber.'
    },
    'sovren': {
      name: '08 — RUHI SOVREN',
      family: 'Regal Woods',
      personality: 'Royal • Dominant',
      image: 'assets/hd/bottle_03.png',
      desc: 'Regal royal oud, myrrh, and rich ebony wood designed for dominant, regal presence.'
    },
    'nyvor': {
      name: '09 — RUHI NYVOR',
      family: 'Gourmand Amber',
      personality: 'Mysterious • Seductive',
      image: 'assets/hd/bottle_04.png',
      desc: 'Sensual black cherry, vanilla orchid, and dark musk that leaves an intoxicating, seductive trail.'
    },
    'zevaro': {
      name: '10 — RUHI ZEVARO',
      family: 'Smoked Leather',
      personality: 'Powerful • Sophisticated',
      image: 'assets/hd/bottle_05.png',
      desc: 'Smoked birch, leather accord, and dark amber resin crafted for quiet power.'
    }
  };

  window.selectQuizOption = function(stepNum, key, value) {
    quizAnswers[key] = value;

    const currentStep = document.getElementById(`quiz-step-${stepNum}`);
    if (currentStep) currentStep.classList.remove('active');

    const nextStepNum = stepNum + 1;
    const nextStep = document.getElementById(`quiz-step-${nextStepNum}`);

    if (nextStepNum === 4) {
      calculateQuizResult();
    }

    if (nextStep) {
      nextStep.classList.add('active');
    }
  };

  function calculateQuizResult() {
    let resultKey = 'vanta';

    if (quizAnswers.mood === 'DeepDark') {
      resultKey = quizAnswers.intensity === 'OudLeather' ? 'vanta' : 'zevaro';
    } else if (quizAnswers.mood === 'Mysterious') {
      resultKey = quizAnswers.occasion === 'Evening' ? 'noxen' : 'nyvor';
    } else if (quizAnswers.mood === 'DarkLuxury') {
      resultKey = 'velor';
    } else if (quizAnswers.mood === 'Bold') {
      resultKey = quizAnswers.intensity === 'OudLeather' ? 'zayron' : 'vexor';
    } else if (quizAnswers.mood === 'Intense') {
      resultKey = 'draeven';
    } else if (quizAnswers.mood === 'Elegant') {
      resultKey = 'aurev';
    } else if (quizAnswers.mood === 'Royal') {
      resultKey = 'sovren';
    } else {
      resultKey = 'vanta';
    }

    const matchedFragrance = fragrances[resultKey];
    const resultName = document.getElementById('quiz-result-name');
    const resultFamily = document.getElementById('quiz-result-family');
    const resultPersonality = document.getElementById('quiz-result-personality');
    const resultDesc = document.getElementById('quiz-result-desc');
    const resultImg = document.getElementById('quiz-result-img');
    const resultWaBtn = document.getElementById('quiz-result-wa-btn');

    if (resultName) resultName.textContent = matchedFragrance.name;
    if (resultFamily) resultFamily.textContent = matchedFragrance.family;
    if (resultPersonality) resultPersonality.textContent = matchedFragrance.personality;
    if (resultDesc) resultDesc.textContent = `"${matchedFragrance.desc}"`;
    if (resultImg) resultImg.src = matchedFragrance.image;
    if (resultWaBtn) {
      const encodedMsg = encodeURIComponent(`Hello RUHI Perfumes, I completed your Discovery Quiz and matched with ${matchedFragrance.name} (${matchedFragrance.personality}). I would like to order a sample.`);
      resultWaBtn.href = `https://wa.me/918688202010?text=${encodedMsg}`;
    }
  }

  window.resetQuiz = function() {
    quizSteps.forEach(step => step.classList.remove('active'));
    const step1 = document.getElementById('quiz-step-1');
    if (step1) step1.classList.add('active');
  };

});
