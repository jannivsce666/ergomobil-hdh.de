// Premium interactions: nav toggle, smooth scroll, hero gallery, services slideshow,
// reveal fallback, contact form feedback, AOS + GLightbox init
(function () {
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.getElementById('site-nav');
  const header = document.querySelector('.site-header');
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Lazy Loading for Hero Gallery Images
  const lazyLoadHeroImages = () => {
    const heroItems = document.querySelectorAll('.hero-gallery-item[data-bg]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const item = entry.target;
            const bgUrl = item.getAttribute('data-bg');
            
            // Preload image
            const img = new Image();
            img.onload = () => {
              item.style.backgroundImage = `url('${bgUrl}')`;
              item.removeAttribute('data-bg');
              item.classList.add('loaded');
            };
            img.src = bgUrl;
            
            observer.unobserve(item);
          }
        });
      }, {
        rootMargin: '50px' // Start loading 50px before visible
      });
      
      heroItems.forEach(item => imageObserver.observe(item));
    } else {
      // Fallback for older browsers
      heroItems.forEach(item => {
        const bgUrl = item.getAttribute('data-bg');
        item.style.backgroundImage = `url('${bgUrl}')`;
        item.removeAttribute('data-bg');
      });
    }
  };

  // Initialize lazy loading on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', lazyLoadHeroImages);
  } else {
    lazyLoadHeroImages();
  }

  // Mobile Navigation Toggle
  if (navToggle && siteNav) {
    console.log('Navigation elements found, setting up mobile menu');
    console.log('Nav toggle element:', navToggle);
    console.log('Site nav element:', siteNav);
    
    // nav toggle click is handled by the consolidated handler further below
    
    // Close menu when clicking nav links
    const navLinks = siteNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navToggle.contains(e.target) && !siteNav.contains(e.target)) {
        siteNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  } else {
    console.log('Navigation elements not found:', {navToggle, siteNav});
  }

  // Header scroll effect
  if (header) {
    let lastScrollY = window.scrollY;
    const updateHeader = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader(); // Initial call
  }

  // Hero Gallery Animation
  let heroGalleryIndex = 0;
  const galleryItems = document.querySelectorAll('.hero-gallery-item');
  function rotateGallery() {
    if (!galleryItems.length) return;
    galleryItems.forEach(item => item.classList.remove('active'));
    heroGalleryIndex = (heroGalleryIndex + 1) % galleryItems.length;
    galleryItems[heroGalleryIndex].classList.add('active');
  }
  if (galleryItems.length > 0) setInterval(rotateGallery, 4500);

  // Services Slideshow
  let currentSlideIndex = 0;
  const slides = document.querySelectorAll('.services-slide');
  const slideBtns = document.querySelectorAll('.slide-btn');

  window.showSlide = function(index) {
    slides.forEach(s => s.classList.remove('active'));
    slideBtns.forEach(b => b.classList.remove('active'));
    slides[index].classList.add('active');
    slideBtns[index].classList.add('active');
    currentSlideIndex = index;
  }
  window.changeSlide = function(direction) {
    const newIndex = (currentSlideIndex + direction + slides.length) % slides.length;
    window.showSlide(newIndex);
  }
  window.currentSlide = function(index) { window.showSlide(index - 1); }
  if (slides.length > 0) setInterval(() => changeSlide(1), 6500);

  // Gallery Slideshow
  let currentGallerySlideIndex = 0;
  const gallerySlides = document.querySelectorAll('.gallery-slide');
  const galleryBtns = document.querySelectorAll('.gallery-btn');

  window.showGallerySlide = function(index) {
    gallerySlides.forEach(s => s.classList.remove('active'));
    galleryBtns.forEach(b => b.classList.remove('active'));
    gallerySlides[index].classList.add('active');
    galleryBtns[index].classList.add('active');
    currentGallerySlideIndex = index;
  }
  window.changeGallerySlide = function(direction) {
    const newIndex = (currentGallerySlideIndex + direction + gallerySlides.length) % gallerySlides.length;
    window.showGallerySlide(newIndex);
  }
  window.currentGallerySlide = function(index) { window.showGallerySlide(index - 1); }
  if (gallerySlides.length > 0) setInterval(() => changeGallerySlide(1), 5000);

  // Qualifications Slideshow (for about page)
  let currentQualIndex = 0;
  const qualSlides = document.querySelectorAll('.qual-slide');
  const qualBtns = document.querySelectorAll('.qual-btn');

  window.showQualSlide = function(index) {
    qualSlides.forEach(s => s.classList.remove('active'));
    qualBtns.forEach(b => b.classList.remove('active'));
    if (qualSlides[index]) qualSlides[index].classList.add('active');
    if (qualBtns[index]) qualBtns[index].classList.add('active');
    currentQualIndex = index;
  }
  window.changeQualSlide = function(direction) {
    const newIndex = (currentQualIndex + direction + qualSlides.length) % qualSlides.length;
    window.showQualSlide(newIndex);
  }
  window.currentQualSlide = function(index) { window.showQualSlide(index - 1); }
  if (qualSlides.length > 0) setInterval(() => changeQualSlide(1), 4000);

  // Quotes Slideshow (for about page)
  let currentQuoteIndex = 0;
  const quoteSlides = document.querySelectorAll('.quote-slide');
  const quoteBtns = document.querySelectorAll('.quote-btn');

  window.showQuoteSlide = function(index) {
    quoteSlides.forEach(s => s.classList.remove('active'));
    quoteBtns.forEach(b => b.classList.remove('active'));
    if (quoteSlides[index]) quoteSlides[index].classList.add('active');
    if (quoteBtns[index]) quoteBtns[index].classList.add('active');
    currentQuoteIndex = index;
  }
  window.changeQuoteSlide = function(direction) {
    const newIndex = (currentQuoteIndex + direction + quoteSlides.length) % quoteSlides.length;
    window.showQuoteSlide(newIndex);
  }
  window.currentQuoteSlide = function(index) { window.showQuoteSlide(index - 1); }
  if (quoteSlides.length > 0) setInterval(() => changeQuoteSlide(1), 8000);

  // Mobile nav toggle
  function closeNav(){ siteNav.classList.remove('open'); navToggle?.setAttribute('aria-expanded','false'); }
  function openNav(){ siteNav.classList.add('open'); navToggle?.setAttribute('aria-expanded','true'); }
  navToggle?.addEventListener('click', () => {
    const isOpen = siteNav.classList.contains('open');
    isOpen ? closeNav() : openNav();
  });
  siteNav?.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', closeNav));

  // Smooth scroll offset for sticky header
  const headerHeight = () => header?.offsetHeight || 0;
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const hash = anchor.getAttribute('href');
      if (!hash || hash === '#' || hash.length < 2) return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - (headerHeight() + 8);
      window.scrollTo({ top: y, behavior: 'smooth' });
      history.pushState(null, '', hash);
    });
  });

  // Header style on scroll
  const onScroll = () => {
    const scrolled = window.scrollY > 6;
    header?.classList.toggle('scrolled', scrolled);
  };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Reveal fallback
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => obs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  // Contact form handling with Web3Forms
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');
  
  if (form && feedback && submitBtn) {
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    const isNetlifyForm = form.hasAttribute('data-netlify') || !!form.querySelector('input[name="form-name"]');

    // If Netlify redirected back with success flag, show modal and clean URL.
    try {
      const url = new URL(window.location.href);
      const hasSuccessParam = url.searchParams.get('success') === '1';
      const hasSuccessHash = (url.hash || '') === '#success';
      if (hasSuccessParam || hasSuccessHash) {
        showSuccessModal();
        url.searchParams.delete('success');
        url.hash = '';
        window.history.replaceState({}, document.title, url.pathname + (url.searchParams.toString() ? `?${url.searchParams.toString()}` : '') + url.hash);
      }
    } catch {
      // ignore
    }
    
    form.addEventListener('submit', async (e) => {
      // For Netlify Forms, use AJAX submit to avoid page navigation/404 and keep our modal UX.
      if (isNetlifyForm) {
        e.preventDefault();

        if (typeof form.reportValidity === 'function' && !form.reportValidity()) {
          return;
        }

        const formData = new FormData(form);
        const urlEncoded = new URLSearchParams();
        for (const [key, value] of formData.entries()) {
          if (typeof value === 'string') urlEncoded.set(key, value);
        }

        submitBtn.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (btnSpinner) btnSpinner.style.display = 'inline';
        feedback.style.display = 'none';

        try {
          const response = await fetch('/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
              'Accept': 'text/html'
            },
            body: urlEncoded.toString()
          });

          if (response.ok) {
            showSuccessModal();
          } else {
            const text = await response.text();
            throw new Error(`HTTP ${response.status}${text ? `: ${text.slice(0, 200)}` : ''}`);
          }
        } catch (error) {
          console.error('Netlify form submission error:', error);
          feedback.style.display = 'block';
          feedback.style.color = '#cf6e64';
          feedback.textContent = 'Es gab einen Fehler beim Senden. Bitte versuchen Sie es erneut oder rufen Sie uns an.';
        } finally {
          submitBtn.disabled = false;
          if (btnText) btnText.style.display = 'inline';
          if (btnSpinner) btnSpinner.style.display = 'none';
        }
        return;
      }

      e.preventDefault(); // Prevent default form submission

      // Use native HTML validation UI for required fields
      if (typeof form.reportValidity === 'function' && !form.reportValidity()) {
        return;
      }
      
      // Validierung
      const formData = new FormData(form);
      const name = formData.get('name')?.toString().trim();
      const email = formData.get('email')?.toString().trim();
      const message = formData.get('message')?.toString().trim();
      const consent = formData.get('consent');
      
      if (!name || !email || !message || !consent) {
        feedback.style.display = 'block';
        feedback.style.color = '#cf6e64';
        feedback.textContent = 'Bitte alle Pflichtfelder (*) ausfüllen und der Verarbeitung zustimmen.';
        return;
      }
      
      // Keep payload minimal; server will set Reply-To based on the provided email
      
      // Zeige Ladeanzeige
      submitBtn.disabled = true;
      if (btnText) btnText.style.display = 'none';
      if (btnSpinner) btnSpinner.style.display = 'inline';
      feedback.style.display = 'none';
      
      // Submit form via fetch
      try {
        const endpoint = form.getAttribute('action') || '/api/contact';
        const urlEncoded = new URLSearchParams();
        for (const [key, value] of formData.entries()) {
          if (typeof value === 'string') urlEncoded.set(key, value);
        }
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
          body: urlEncoded.toString()
        });

        const responseText = await response.text();
        let result;
        try {
          result = JSON.parse(responseText);
        } catch {
          result = null;
        }

        if (response.ok && result && result.success) {
          // Zeige Success Modal
          showSuccessModal();
        } else {
          const details = [];
          if (result?.message) details.push(result.message);
          if (Array.isArray(result?.errors) && result.errors.length) {
            details.push(result.errors.join(' | '));
          }
          if (!result && responseText) {
            details.push(responseText.slice(0, 200));
          }
          const statusInfo = `HTTP ${response.status}`;
          throw new Error(`${statusInfo}${details.length ? `: ${details.join(' — ')}` : ''}`);
        }
      } catch (error) {
        console.error('Form submission error:', error);
        feedback.style.display = 'block';
        feedback.style.color = '#cf6e64';
        const rawMessage = (error && error.message) ? String(error.message) : '';
        const isFailedToFetch = /failed to fetch/i.test(rawMessage);
        feedback.textContent = isFailedToFetch
          ? 'Senden fehlgeschlagen (Verbindung/CORS). Hinweis: Wenn Sie die Seite direkt als Datei öffnen, funktioniert das Senden oft nicht. Bitte über eine Website/localhost aufrufen und erneut senden.'
          : (rawMessage ? `Es gab einen Fehler beim Senden: ${rawMessage}` : 'Es gab einen Fehler beim Senden. Bitte versuchen Sie es erneut oder rufen Sie uns an.');
        
        // Reset button
        submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnSpinner) btnSpinner.style.display = 'none';
      }
    });
  }
  
  // Success Modal Function
  function showSuccessModal() {
    const modal = document.getElementById('successModal');
    const countdownEl = document.getElementById('countdown');
    
    if (!modal) return;
    
    // Show modal
    modal.style.display = 'flex';
    
    // Countdown and redirect
    let countdown = 3;
    countdownEl.textContent = countdown;
    
    const countdownInterval = setInterval(() => {
      countdown--;
      countdownEl.textContent = countdown;
      
      if (countdown <= 0) {
        clearInterval(countdownInterval);
        window.location.href = 'index.html';
      }
    }, 1000);
  }

  // Init AOS (if loaded)
  window.addEventListener('DOMContentLoaded', () => {
    if (window.AOS) AOS.init({ once: true, duration: 700, easing: 'ease-out-cubic' });
    if (window.GLightbox) GLightbox({ selector: '.glightbox' });
  });
})();

// Contact Form: Prefilled messages based on prescription selection
(function () {
  const prescriptionSelect = document.getElementById('prescription');
  const concernSelect = document.getElementById('anliegen');
  const nameInput = document.getElementById('name');
  const messageTextarea = document.getElementById('message');

  if (!prescriptionSelect || !concernSelect || !messageTextarea) return;

  let lastAutoTemplate = '';

  function buildTemplate() {
    const prescriptionValue = (prescriptionSelect.value || '').toLowerCase();
    const hasPrescription = prescriptionValue.includes('ja');
    const concernValue = (concernSelect.value || '').toLowerCase();
    const isAppointment = concernValue.includes('termin');
    const name = (nameInput?.value || '').trim();

    const greeting = 'Guten Tag,';
    const signature = name ? `Mit freundlichen Grüßen\n${name}` : 'Mit freundlichen Grüßen';

    if (isAppointment) {
      const prescriptionLine = hasPrescription
        ? 'Ich habe bereits ein Rezept.'
        : 'Ich habe noch kein Rezept. Bitte teilen Sie mir mit, wie ich am besten vorgehen soll.';

      return `${greeting}\n\nich benötige einen Termin. ${prescriptionLine}\n\n${signature}`;
    }

    // Allgemeine Frage
    const prescriptionNote = hasPrescription ? 'Rezept vorhanden.' : 'Rezept nicht vorhanden.';
    return `${greeting}\n\nich habe eine allgemeine Frage und bitte um Rückmeldung.\n\n${prescriptionNote}\n\n${signature}`;
  }

  function applyTemplateFromSelection() {
    const nextTemplate = buildTemplate();

    const current = messageTextarea.value.trim();
    const canAutofill = current.length === 0 || current === lastAutoTemplate;

    if (canAutofill) {
      messageTextarea.value = nextTemplate;
      lastAutoTemplate = nextTemplate;
    }
  }

  prescriptionSelect.addEventListener('change', applyTemplateFromSelection);
  concernSelect.addEventListener('change', applyTemplateFromSelection);
  if (nameInput) nameInput.addEventListener('input', applyTemplateFromSelection);
  applyTemplateFromSelection();
})();

// FAQ Toggle Function for Index Page
function toggleFAQ(button) {
  const faqItem = button.parentElement;
  const answer = faqItem.querySelector('.faq-answer');
  const icon = button.querySelector('.faq-icon');
  const isActive = faqItem.classList.contains('active');
  
  // Close all other FAQs
  document.querySelectorAll('.faq-item').forEach(item => {
    if (item !== faqItem) {
      item.classList.remove('active');
      const otherAnswer = item.querySelector('.faq-answer');
      const otherIcon = item.querySelector('.faq-icon');
      if (otherAnswer) otherAnswer.style.maxHeight = null;
      if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
    }
  });
  
  // Toggle current FAQ
  if (isActive) {
    faqItem.classList.remove('active');
    answer.style.maxHeight = null;
    icon.style.transform = 'rotate(0deg)';
  } else {
    faqItem.classList.add('active');
    answer.style.maxHeight = (answer.scrollHeight + 50) + 'px';
    icon.style.transform = 'rotate(180deg)';
  }
}