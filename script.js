/**
 * GHARSEPUJA (गृहात् पूजा) — Interactive Logic & Audio Engine
 * Your Temple. Your Seva. From Home.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('show');
      mobileToggle.textContent = navMenu.classList.contains('show') ? '✕' : '☰';
    });

    // Close mobile menu when clicking any link or action button inside it
    navMenu.querySelectorAll('a, button').forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navMenu.classList.remove('show');
          mobileToggle.textContent = '☰';
        }
      });
    });
  }

  // 2. Currency Switcher (INR ₹ / USD $)
  const currencyBtns = document.querySelectorAll('.currency-btn');
  const priceElements = document.querySelectorAll('[data-inr][data-usd]');
  let currentCurrency = 'INR';

  currencyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currencyBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCurrency = btn.getAttribute('data-curr');

      priceElements.forEach(el => {
        if (currentCurrency === 'USD') {
          el.textContent = '$' + el.getAttribute('data-usd');
        } else {
          el.textContent = '₹' + el.getAttribute('data-inr');
        }
      });

      showToast(`Currency switched to ${currentCurrency === 'USD' ? 'USD ($)' : 'INR (₹)'}`);
    });
  });

  // 3. Web Audio API Meditative Diya & Temple Bell Generator
  let audioCtx = null;
  let isDiyaPlaying = false;
  let oscillatorDrone = null;
  let gainDrone = null;
  const diyaBtn = document.getElementById('diyaSoundToggle');

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
  }

  function playTempleBell() {
    initAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    // Sacred Ghanta/Bell overtone ~ 784Hz (G5) with harmonics
    osc.frequency.setValueAtTime(784, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(392, audioCtx.currentTime + 2.5);

    gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3.0);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 3.0);
  }

  function toggleAmbientSound() {
    initAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!isDiyaPlaying) {
      // Start soft 432Hz sacred Om drone
      oscillatorDrone = audioCtx.createOscillator();
      gainDrone = audioCtx.createGain();

      oscillatorDrone.type = 'triangle';
      oscillatorDrone.frequency.setValueAtTime(216, audioCtx.currentTime); // A3 / 432Hz octave

      gainDrone.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gainDrone.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 2);

      oscillatorDrone.connect(gainDrone);
      gainDrone.connect(audioCtx.destination);
      oscillatorDrone.start();

      playTempleBell();
      isDiyaPlaying = true;
      if (diyaBtn) {
        diyaBtn.classList.add('playing');
        diyaBtn.innerHTML = '<span>🪔</span> Diya Glow: Active (Bell 🔔)';
      }
      showToast('🪔 Temple Sanctum Chime & Ambient Glow Activated');
    } else {
      if (gainDrone) {
        gainDrone.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
        setTimeout(() => {
          if (oscillatorDrone) oscillatorDrone.stop();
        }, 800);
      }
      isDiyaPlaying = false;
      if (diyaBtn) {
        diyaBtn.classList.remove('playing');
        diyaBtn.innerHTML = '<span>🪔</span> Diya Glow & Bell';
      }
      showToast('Ambient sound paused');
    }
  }

  if (diyaBtn) {
    diyaBtn.addEventListener('click', toggleAmbientSound);
  }

  // 4. Interactive Live Sankalp Certificate Live Preview
  const devoteeNameInput = document.getElementById('sankalpName');
  const gotraInput = document.getElementById('sankalpGotra');
  const cityInput = document.getElementById('sankalpCity');
  const sevaSelect = document.getElementById('sankalpSeva');
  const purposeSelect = document.getElementById('sankalpPurpose');

  const previewName = document.getElementById('previewDevoteeName');
  const previewGotra = document.getElementById('previewGotra');
  const previewCity = document.getElementById('previewCity');
  const previewSeva = document.getElementById('previewSevaTitle');
  const previewPurpose = document.getElementById('previewPurpose');

  function updateSankalpPreview() {
    if (previewName) previewName.textContent = devoteeNameInput.value.trim() || 'Anoop & Sunita Sharma';
    if (previewGotra) previewGotra.textContent = gotraInput.value.trim() || 'Kashyap Gotra';
    if (previewCity) previewCity.textContent = cityInput.value.trim() || 'Bangalore (Original: Varanasi)';
    if (previewSeva && sevaSelect) previewSeva.textContent = sevaSelect.options[sevaSelect.selectedIndex].text;
    if (previewPurpose && purposeSelect) previewPurpose.textContent = purposeSelect.options[purposeSelect.selectedIndex].text;
  }

  [devoteeNameInput, gotraInput, cityInput, sevaSelect, purposeSelect].forEach(input => {
    if (input) {
      input.addEventListener('input', updateSankalpPreview);
      input.addEventListener('change', updateSankalpPreview);
    }
  });

  // 5. Live Darshan Modal & Simulated Stream
  const openDarshanBtns = document.querySelectorAll('.open-darshan-modal');
  const darshanModal = document.getElementById('darshanModal');
  const closeDarshanBtn = document.getElementById('closeDarshanModal');
  const liveViewerCount = document.getElementById('darshanViewerCount');

  let viewerInterval = null;

  openDarshanBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (darshanModal) {
        darshanModal.classList.add('show');
        playTempleBell();
        // Simulate live viewers fluctuating
        if (liveViewerCount) {
          viewerInterval = setInterval(() => {
            const base = 5420;
            const variance = Math.floor(Math.random() * 45) - 20;
            liveViewerCount.textContent = (base + variance).toLocaleString();
          }, 3500);
        }
      }
    });
  });

  if (closeDarshanBtn && darshanModal) {
    closeDarshanBtn.addEventListener('click', () => {
      darshanModal.classList.remove('show');
      if (viewerInterval) clearInterval(viewerInterval);
    });
  }

  // 6. Temple Partner Modal
  const openPartnerBtns = document.querySelectorAll('.open-partner-modal');
  const partnerModal = document.getElementById('partnerModal');
  const closePartnerBtn = document.getElementById('closePartnerModal');

  openPartnerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (partnerModal) partnerModal.classList.add('show');
    });
  });

  if (closePartnerBtn && partnerModal) {
    closePartnerBtn.addEventListener('click', () => {
      partnerModal.classList.remove('show');
    });
  }

  // Close modals on backdrop click
  window.addEventListener('click', (e) => {
    if (e.target === darshanModal) {
      darshanModal.classList.remove('show');
      if (viewerInterval) clearInterval(viewerInterval);
    }
    if (e.target === partnerModal) {
      partnerModal.classList.remove('show');
    }
  });

  // 7. Services Filter Tabs
  const serviceTabs = document.querySelectorAll('.services-filter-tabs .filter-tab-btn');
  const serviceCards = document.querySelectorAll('.service-card[data-category]');

  serviceTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      serviceTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-filter');

      serviceCards.forEach(card => {
        if (cat === 'all' || card.getAttribute('data-category').includes(cat)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 8. Temple Filter & Search
  const templeSearchInput = document.getElementById('templeSearchInput');
  const templeCards = document.querySelectorAll('.temple-card');

  if (templeSearchInput) {
    templeSearchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      templeCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const loc = card.querySelector('.temple-location').textContent.toLowerCase();
        if (title.includes(q) || loc.includes(q)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // 9. Early Access Waitlist Form Submission & Ticket Generation
  const waitlistForm = document.getElementById('waitlistForm');
  const waitlistTabDevotee = document.getElementById('waitlistTabDevotee');
  const waitlistTabTemple = document.getElementById('waitlistTabTemple');
  const devoteeFormFields = document.getElementById('devoteeFormFields');
  const templeFormFields = document.getElementById('templeFormFields');
  const confirmationCard = document.getElementById('waitlistConfirmation');
  const confirmationTicketNum = document.getElementById('confirmTicketNumber');
  const confirmationName = document.getElementById('confirmDevoteeName');
  const shareWhatsAppBtn = document.getElementById('shareWhatsAppBtn');

  if (waitlistTabDevotee && waitlistTabTemple) {
    waitlistTabDevotee.addEventListener('click', () => {
      waitlistTabDevotee.classList.add('active');
      waitlistTabTemple.classList.remove('active');
      devoteeFormFields.style.display = 'block';
      templeFormFields.style.display = 'none';
    });

    waitlistTabTemple.addEventListener('click', () => {
      waitlistTabTemple.classList.add('active');
      waitlistTabDevotee.classList.remove('active');
      devoteeFormFields.style.display = 'none';
      templeFormFields.style.display = 'block';
    });
  }

  if (waitlistForm) {
    waitlistForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const isDevotee = waitlistTabDevotee.classList.contains('active');
      const name = isDevotee
        ? document.getElementById('wlName').value.trim()
        : document.getElementById('wlTempleName').value.trim();

      const randomPriority = Math.floor(1000 + Math.random() * 9000);
      const ticketID = isDevotee ? `GP-DEVOTEE-#${randomPriority}` : `GP-TEMPLE-#${randomPriority}`;

      if (confirmationTicketNum) confirmationTicketNum.textContent = ticketID;
      if (confirmationName) confirmationName.textContent = name;

      // Setup WhatsApp Share Link
      if (shareWhatsAppBtn) {
        const text = encodeURIComponent(`I just joined the early-access priority list for GharSePuja (गृहात् पूजा) — India's digital gateway to authentic temple darshan, personalized puja, and prasad delivery. Join here: https://gharsepuja.com`);
        shareWhatsAppBtn.href = `https://wa.me/?text=${text}`;
      }

      waitlistForm.style.display = 'none';
      if (confirmationCard) confirmationCard.classList.add('show');
      playTempleBell();
      showToast('🙏 Congratulations! Your early access priority token has been issued.');
    });
  }

  // Temple Partner Modal Form
  const partnerModalForm = document.getElementById('partnerModalForm');
  if (partnerModalForm) {
    partnerModalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      partnerModal.classList.remove('show');
      playTempleBell();
      showToast('🛕 Temple partnership inquiry received. Our team will contact you within 24 hours.');
      partnerModalForm.reset();
    });
  }

  // 10. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // 11. Toast Notification Utility
  function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>🕉️</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Make showToast accessible globally
  window.showToast = showToast;
  window.playTempleBell = playTempleBell;
});
