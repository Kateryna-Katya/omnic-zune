document.addEventListener("DOMContentLoaded", () => {

  // 1. Инициализация библиотек
  gsap.registerPlugin(ScrollTrigger);

  // Инициализация Lenis (Плавный скролл)
  const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
  });

  function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // --- МОБИЛЬНОЕ МЕНЮ ---
  const burgerBtn = document.getElementById('burger-btn');
  const navMenu = document.getElementById('nav-menu');
  const icon = burgerBtn?.querySelector('i'); // Проверка на существование
  const navLinks = document.querySelectorAll('.header__link, .header__cta.mobile-only');

  if (burgerBtn) {
      burgerBtn.addEventListener('click', () => {
          navMenu.classList.toggle('is-open');
          if (icon) {
              if (navMenu.classList.contains('is-open')) {
                  icon.classList.remove('fa-bars-staggered');
                  icon.classList.add('fa-xmark');
              } else {
                  icon.classList.remove('fa-xmark');
                  icon.classList.add('fa-bars-staggered');
              }
          }
      });
  }

  navLinks.forEach(link => {
      link.addEventListener('click', () => {
          navMenu.classList.remove('is-open');
          if (icon) {
              icon.classList.remove('fa-xmark');
              icon.classList.add('fa-bars-staggered');
          }
      });
  });

  // Хедер при скролле
  window.addEventListener('scroll', () => {
      const header = document.querySelector('.header');
      if (header) {
          if (window.scrollY > 50) {
              header.style.background = 'rgba(14, 14, 16, 0.95)';
          } else {
              header.style.background = 'rgba(14, 14, 16, 0.85)';
          }
      }
  });

  // --- HERO 3D (Three.js) ---
  const initThreeJS = () => {
      const container = document.getElementById('canvas-container');
      if (!container) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 20;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);

      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 1500;
      const posArray = new Float32Array(particlesCount * 3);

      for(let i = 0; i < particlesCount * 3; i++) {
          const r = 12 * Math.cbrt(Math.random());
          const theta = Math.random() * 2 * Math.PI;
          const phi = Math.acos(2 * Math.random() - 1);

          const x = r * Math.sin(phi) * Math.cos(theta);
          const y = r * Math.sin(phi) * Math.sin(theta);
          const z = r * Math.cos(phi);

          posArray[i * 3] = x;
          posArray[i * 3 + 1] = y;
          posArray[i * 3 + 2] = z;
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

      const material = new THREE.PointsMaterial({
          size: 0.08,
          color: 0xD4FF00,
          transparent: true,
          opacity: 0.8,
      });

      const particlesMesh = new THREE.Points(particlesGeometry, material);
      scene.add(particlesMesh);

      let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;

      document.addEventListener('mousemove', (event) => {
          mouseX = (event.clientX - windowHalfX);
          mouseY = (event.clientY - windowHalfY);
      });

      const animate = () => {
          requestAnimationFrame(animate);
          targetX = mouseX * 0.001;
          targetY = mouseY * 0.001;
          particlesMesh.rotation.y += 0.002;
          particlesMesh.rotation.x += 0.001;
          particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
          particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);
          renderer.render(scene, camera);
      };
      animate();

      window.addEventListener('resize', () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
      });
  };
  initThreeJS();

  // --- STICKY SCROLL (About) ---
  gsap.utils.toArray('.info-card').forEach((card, i) => {
      gsap.from(card, {
          scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse"
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1
      });
  });

  // --- PARALLAX EFFECT (Benefits) ---
  const parallaxItems = document.querySelectorAll('.parallax-item');
  if (parallaxItems.length > 0) {
      parallaxItems.forEach((item) => {
          const speed = item.getAttribute('data-speed') || 0.5;

          gsap.to(item, {
              y: -100 * parseFloat(speed),
              ease: "none",
              scrollTrigger: {
                  trigger: item.closest('section'),
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1
              }
          });
      });
  }

  const dividers = document.querySelectorAll('.divider');
  dividers.forEach((divider) => {
      gsap.from(divider, {
          scaleX: 0,
          opacity: 0,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
              trigger: divider,
              start: "top 90%",
              toggleActions: "play none none reverse"
          }
      });
  });

  // --- ACCORDION INNOVATIONS ---
  const accordionItems = document.querySelectorAll('.accordion__item');
  const previewItems = document.querySelectorAll('.preview-item');

  accordionItems.forEach(item => {
      item.addEventListener('click', () => {
          accordionItems.forEach(i => i.classList.remove('active'));
          previewItems.forEach(p => p.classList.remove('active'));
          item.classList.add('active');
          const targetId = item.getAttribute('data-target');
          const targetPreview = document.getElementById(targetId);
          if (targetPreview) {
              targetPreview.classList.add('active');
          }
      });
  });

  // --- BLOG ANIMATION (Исправлено местоположение) ---
  // Проверяем, есть ли секция, чтобы избежать ошибок
  if (document.querySelector('.blog-grid')) {
      gsap.from(".blog-card", {
          scrollTrigger: {
              trigger: ".blog-grid",
              start: "top 80%", // Чуть раньше срабатывает
          },
          y: 50,
          opacity: 0, // Начинаем с полной прозрачности
          duration: 0.8,
          stagger: 0.2, // Задержка между карточками
          clearProps: "all" // Очищаем стили после анимации (важно для hover!)
      });
  }
// --- FORM VALIDATION & CAPTCHA ---
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');
const captchaQuestion = document.getElementById('captcha-question');
const captchaInput = document.getElementById('captcha-input');

// 1. Генерация случайной капчи
const num1 = Math.floor(Math.random() * 10) + 1; // 1-10
const num2 = Math.floor(Math.random() * 10) + 1; // 1-10
captchaQuestion.textContent = `${num1} + ${num2} = ?`;
const correctAnswer = num1 + num2;

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Останавливаем стандартную отправку

        // 2. Проверка капчи
        if (parseInt(captchaInput.value) !== correctAnswer) {
            alert("Ошибка в математическом примере! Попробуйте еще раз.");
            captchaInput.value = '';
            captchaInput.focus();
            captchaInput.style.borderColor = "red";
            return;
        }

        // 3. Имитация отправки (AJAX)
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Отправка...';
        btn.style.opacity = '0.7';

        setTimeout(() => {
            // Скрываем форму, показываем успех
            contactForm.style.display = 'none';
            successMessage.classList.add('visible');

            // Сохранение выбора Cookies (если нужно, но тут мы просто сохраняем факт отправки)
            localStorage.setItem('formSubmitted', 'true');
        }, 1500);
    });

    // Сброс красной рамки при вводе
    captchaInput.addEventListener('input', () => {
         captchaInput.style.borderColor = 'var(--border-color)';
    });
}
// --- COOKIE POPUP ---
const cookiePopup = document.getElementById('cookie-popup');
const acceptBtn = document.getElementById('accept-cookies');
const declineBtn = document.getElementById('decline-cookies');

// Проверяем, был ли выбор ранее
if (!localStorage.getItem('cookieConsent')) {
    // Показываем с задержкой 2 секунды
    setTimeout(() => {
        cookiePopup.classList.add('show');
    }, 2000);
}

if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'true');
        cookiePopup.classList.remove('show');
    });
}

if (declineBtn) {
    declineBtn.addEventListener('click', () => {
        // Просто скрываем, не сохраняя согласие
        cookiePopup.classList.remove('show');
    });
}
}); // <-- ВОТ ЗДЕСЬ конец функции DOMContentLoaded