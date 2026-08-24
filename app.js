/* ==========================================================================
   RUHI PERFUMES — LUXURY FRONTEND LOGIC & DYNAMIC PRODUCT MANAGEMENT INTEGRATION
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

    function attachCursorListeners() {
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
    attachCursorListeners();
    window.attachCursorListeners = attachCursorListeners;
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
     8. DYNAMIC PRODUCT FETCHING & RENDERING (MONGODB API)
     -------------------------------------------------- */
  let activeProductsList = [];

  async function fetchAndRenderPublicProducts() {
    const grid = document.getElementById('public-products-grid');
    if (!grid) return;

    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('API request failed');

      const products = await res.json();
      if (!Array.isArray(products) || products.length === 0) return;

      activeProductsList = products;
      grid.innerHTML = ''; // Clear default container

      products.forEach((p, idx) => {
        const productNumberStr = String(idx + 1).padStart(2, '0');
        const imgUrl = p.imageUrl || 'assets/hd/bottle_01.png';
        const sizeBadge = p.sizeML || '8ML';
        const family = p.family || 'SIGNATURE COMPOSITION';
        const personality = p.personality || 'Dark • Mysterious • Sophisticated';
        const desc = p.description || '';
        
        // Notes Pyramid
        const notes = p.notesPyramid || {};
        const topNotes = notes.top || 'Smoked Cardamom, Black Pepper';
        const heartNotes = notes.heart || 'Oud, Saffron, Turkish Rose';
        const baseNotes = notes.base || 'Dark Amber, Sandalwood, Musk';

        // Customized WhatsApp Order Link
        const waMsg = encodeURIComponent(`Hello RUHI PERFUMES, I am interested in ordering ${p.productName} ${sizeBadge} from your Signature Collection.`);
        const waUrl = `https://wa.me/918688202010?text=${waMsg}`;

        const article = document.createElement('article');
        article.className = 'product-card hover-target';
        article.setAttribute('data-cursor', `${productNumberStr} ${p.productName.replace('RUHI ', '')}`);

        article.innerHTML = `
          <div class="product-image-container">
            <span class="product-number">${productNumberStr}</span>
            <span class="product-badge">${sizeBadge} EDITION</span>
            <img src="${imgUrl}" alt="${p.productName} Perfume Bottle" class="product-image">
          </div>
          <div class="product-info">
            <span class="product-family">${family.toUpperCase()}</span>
            <h3 class="product-name">${p.productName}</h3>
            <div class="product-personality">${personality}</div>
            <p class="product-description">${desc}</p>
            
            <div class="notes-pyramid">
              <div class="note-row"><span class="note-label">TOP:</span><span class="note-val">${topNotes}</span></div>
              <div class="note-row"><span class="note-label">HEART:</span><span class="note-val">${heartNotes}</span></div>
              <div class="note-row"><span class="note-label">BASE:</span><span class="note-val">${baseNotes}</span></div>
            </div>

            <a href="${waUrl}" target="_blank" class="btn-primary btn-whatsapp-order">
              ORDER ON WHATSAPP →
            </a>
          </div>
        `;

        grid.appendChild(article);
      });

      if (window.attachCursorListeners) {
        window.attachCursorListeners();
      }
    } catch (err) {
      console.warn('Notice: Using fallback products render.', err);
    }
  }

  fetchAndRenderPublicProducts();

  /* --------------------------------------------------
     9. INTERACTIVE DISCOVERY QUIZ ENGINE
     -------------------------------------------------- */
  const quizSteps = document.querySelectorAll('.quiz-step');
  const quizAnswers = { mood: '', occasion: '', intensity: '' };

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
    let matchedProduct = null;

    if (activeProductsList.length > 0) {
      // Find dynamic match from MongoDB products
      if (quizAnswers.mood === 'DeepDark') {
        matchedProduct = activeProductsList.find(p => p.productName.includes('VANTA')) || activeProductsList[0];
      } else if (quizAnswers.mood === 'Mysterious') {
        matchedProduct = activeProductsList.find(p => p.productName.includes('NOXEN') || p.productName.includes('NYVOR')) || activeProductsList[1];
      } else if (quizAnswers.mood === 'DarkLuxury') {
        matchedProduct = activeProductsList.find(p => p.productName.includes('VELOR')) || activeProductsList[2];
      } else if (quizAnswers.mood === 'Bold') {
        matchedProduct = activeProductsList.find(p => p.productName.includes('ZAYRON') || p.productName.includes('VEXOR')) || activeProductsList[3];
      } else if (quizAnswers.mood === 'Intense') {
        matchedProduct = activeProductsList.find(p => p.productName.includes('DRAEVEN')) || activeProductsList[4];
      } else if (quizAnswers.mood === 'Royal') {
        matchedProduct = activeProductsList.find(p => p.productName.includes('SOVREN')) || activeProductsList[7] || activeProductsList[0];
      } else {
        matchedProduct = activeProductsList[0];
      }
    }

    const name = matchedProduct ? matchedProduct.productName : '01 — RUHI VANTA';
    const family = matchedProduct ? matchedProduct.family : 'AMBER LEATHER';
    const personality = matchedProduct ? matchedProduct.personality : 'Deep • Dark • Sophisticated';
    const desc = matchedProduct ? `"${matchedProduct.description}"` : '"An intense, dark composition of smoked leather and midnight oud."';
    const image = matchedProduct ? (matchedProduct.imageUrl || 'assets/hd/bottle_01.png') : 'assets/hd/bottle_01.png';
    const size = matchedProduct ? (matchedProduct.sizeML || '8ML') : '8ML';

    const resultName = document.getElementById('quiz-result-name');
    const resultFamily = document.getElementById('quiz-result-family');
    const resultPersonality = document.getElementById('quiz-result-personality');
    const resultDesc = document.getElementById('quiz-result-desc');
    const resultImg = document.getElementById('quiz-result-img');
    const resultWaBtn = document.getElementById('quiz-result-wa-btn');

    if (resultName) resultName.textContent = name;
    if (resultFamily) resultFamily.textContent = family;
    if (resultPersonality) resultPersonality.textContent = personality;
    if (resultDesc) resultDesc.textContent = desc;
    if (resultImg) resultImg.src = image;

    if (resultWaBtn) {
      const encodedMsg = encodeURIComponent(`Hello RUHI PERFUMES, I completed your Discovery Quiz and matched with ${name} (${size}). I would like to order a sample.`);
      resultWaBtn.href = `https://wa.me/918688202010?text=${encodedMsg}`;
    }
  }

  window.resetQuiz = function() {
    quizSteps.forEach(step => step.classList.remove('active'));
    const step1 = document.getElementById('quiz-step-1');
    if (step1) step1.classList.add('active');
  };

});
