document.addEventListener("DOMContentLoaded", function() {
    
    // --- LÓGICA DE ANIMACIÓN GENERAL (PARA SECCIONES) ---
    try {
        const animatedSections = document.querySelectorAll('.animate-on-scroll');
        if (animatedSections.length > 0) {
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        // Opcional: deja de observar una vez animado
                        sectionObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            animatedSections.forEach(section => sectionObserver.observe(section));
        }
    } catch (error) {
        console.error("Error en la animación de scroll de secciones:", error);
    }

    // --- LÓGICA DE ANIMACIÓN ESCALONADA (PARA LA LISTA) ---
    try {
        const staggerItems = document.querySelectorAll('.stagger-item');
        if (staggerItems.length > 0) {
            const itemObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            staggerItems.forEach(item => itemObserver.observe(item));
        }
    } catch (error) {
        console.error("Error en la animación de la lista:", error);
    }

    // --- LÓGICA DEL INTERRUPTOR DE IDIOMA (VERSIÓN FINAL Y ROBUSTA) ---
    try {
        const langOptions = document.querySelectorAll('.lang-option');
        const translatableElements = document.querySelectorAll('[data-lang-es]');
        const whatsappTriggers = document.querySelectorAll('.whatsapp-trigger');

        if (langOptions.length > 0 && translatableElements.length > 0) {
            let currentLang = 'es';

            function switchLanguage(lang) {
                if (!lang) return;

                // Actualiza textos
                translatableElements.forEach(el => {
                    const text = el.dataset[`lang${lang.charAt(0).toUpperCase() + lang.slice(1)}`];
                    if (text !== undefined) el.innerHTML = text;
                });

                // Actualiza TODOS los links de WhatsApp
                whatsappTriggers.forEach(link => {
                    const baseHref = "https://wa.me/5491140695035"; // REEMPLAZAR
                    const rawMessage = link.dataset[`whatsapp-${lang}`];
                    if (rawMessage) {
                        const encodedMessage = encodeURIComponent(rawMessage);
                        link.href = `${baseHref}?text=${encodedMessage}`;
                    }
                });

                // Actualiza el interruptor visualmente
                langOptions.forEach(option => {
                    option.classList.toggle('active', option.dataset.lang === lang);
                });

                document.documentElement.lang = lang;
                currentLang = lang;
            }

            // Añade el evento de click a cada opción del interruptor
            langOptions.forEach(option => {
                option.addEventListener('click', () => {
                    const selectedLang = option.dataset.lang;
                    if (selectedLang !== currentLang) {
                        switchLanguage(selectedLang);
                    }
                });
            });
            
            // Inicializa la página en español
            switchLanguage('es'); 
        }
    } catch (error) {
        console.error("Error en el interruptor de idioma:", error);
    }

    // --- LÓGICA DEL CARRUSEL DE TESTIMONIOS ---
    try {
        if (typeof Swiper !== 'undefined' && document.querySelector('.swiper')) {
            const swiper = new Swiper('.swiper', {
                loop: true,
                grabCursor: true,
                autoplay: { delay: 5000, disableOnInteraction: false },
                pagination: { el: '.swiper-pagination', clickable: true },
                navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
                breakpoints: {
                    640: { slidesPerView: 1, spaceBetween: 20 },
                    768: { slidesPerView: 2, spaceBetween: 30 },
                    1024: { slidesPerView: 3, spaceBetween: 30 },
                }
            });
        }
    } catch (error) {
        console.error("No se pudo inicializar el carrusel Swiper:", error);
    }
});

document.addEventListener("DOMContentLoaded", () => {
  const phoneNumber = "5491140695035";

  function updateWhatsappLinks(lang) {
    document.querySelectorAll(".whatsapp-trigger").forEach((btn) => {
      const message = btn.getAttribute(`data-whatsapp-${lang}`);
      const encodedMessage = encodeURIComponent(message);
      btn.setAttribute("href", `https://wa.me/${phoneNumber}?text=${encodedMessage}`);
    });
  }

  // Inicializar con el idioma por defecto (el <html lang="es">)
  let currentLang = document.documentElement.lang || "es";
  updateWhatsappLinks(currentLang);

  // Cambio de idioma
  document.querySelectorAll(".lang-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentLang = btn.dataset.lang;
      document.documentElement.setAttribute("lang", currentLang);

      // Cambiar botones activos
      document.querySelectorAll(".lang-option").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Actualizar textos dinámicos
      document.querySelectorAll("[data-lang-es]").forEach((el) => {
        const newText = el.getAttribute(`data-lang-${currentLang}`);
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          el.placeholder = newText;
        } else {
          el.textContent = newText;
        }
      });

      // Actualizar links de WhatsApp
      updateWhatsappLinks(currentLang);
    });
  });
});

