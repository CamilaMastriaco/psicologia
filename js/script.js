document.addEventListener("DOMContentLoaded", function() {

    try {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html'; 
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPath) {
                link.classList.add('active');
            }
        });
    } catch (error) {
        console.error("Error al resaltar el enlace activo:", error);
    }

    try {
        const animatedSections = document.querySelectorAll('.animate-on-scroll');
        if (animatedSections.length > 0) {
            const sectionObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            animatedSections.forEach(section => sectionObserver.observe(section));
        }

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
        console.error("Error en las animaciones de scroll:", error);
    }

    try {
        const langOptions = document.querySelectorAll('.lang-option');
        const translatableElements = document.querySelectorAll('[data-lang-es]');
        const whatsappTriggers = document.querySelectorAll('.whatsapp-trigger');
        const mainWhatsappButton = document.getElementById('whatsapp-link');
        const baseWhatsappHref = mainWhatsappButton ? mainWhatsappButton.getAttribute('href') : null;

        if (langOptions.length > 0) {
            let currentLang = 'es';

            function switchLanguage(lang) {
                if (!lang) return;

                translatableElements.forEach(el => {
                    const text = el.getAttribute(`data-lang-${lang}`);
                    if (text !== null) el.innerHTML = text; 
                });

                if (baseWhatsappHref) {
                    whatsappTriggers.forEach(link => {
                        const rawMessage = link.getAttribute(`data-whatsapp-${lang}`);
                        if (rawMessage) {
                            const encodedMessage = encodeURIComponent(rawMessage);
                            link.href = `${baseWhatsappHref}?text=${encodedMessage}`;
                        }
                    });
                }

                langOptions.forEach(option => {
                    option.classList.toggle('active', option.dataset.lang === lang);
                });

                document.documentElement.lang = lang;
                currentLang = lang;
            }

            langOptions.forEach(option => {
                option.addEventListener('click', () => {
                    const selectedLang = option.dataset.lang;
                    if (selectedLang !== currentLang) {
                        switchLanguage(selectedLang);
                    }
                });
            });
            
            switchLanguage('es'); 
        }
    } catch (error) {
        console.error("Error en el interruptor de idioma:", error);
    }

    // --- BLOQUE DE TRACKING DE GOOGLE ANALYTICS ---
    try {
        // --- NUEVO: TRACKING DE CLICS EN REDES SOCIALES ---
        const socialLinks = document.querySelectorAll('.social-icons a');
        socialLinks.forEach(link => {
            link.addEventListener('click', function() {
                const socialNetwork = this.dataset.social;
                if (typeof gtag === 'function' && socialNetwork) {
                    gtag('event', 'social_link_click', {
                        'event_category': 'outbound_link',
                        'social_network': socialNetwork,
                        'event_label': `Clicked ${socialNetwork} link in footer`
                    });
                    console.log(`Clic en ${socialNetwork}. Evento enviado a GA4.`);
                }
            });
        });

        // Tracking de clics en WhatsApp (ya lo tenías)
        const whatsappButtons = document.querySelectorAll('.whatsapp-trigger');
        whatsappButtons.forEach(button => {
            button.addEventListener('click', function() {
                const location = this.dataset.location || 'unknown';
                if (typeof gtag === 'function') {
                    gtag('event', 'whatsapp_click', {
                        'event_category': 'contact',
                        'button_location': location
                    });
                }
            });
        });

        // Tracking de vista de testimonios (ya lo tenías)
        const testimonialsSection = document.querySelector('#testimonios');
        let testimonialsViewed = false;
        if (testimonialsSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !testimonialsViewed) {
                        if (typeof gtag === 'function') {
                            gtag('event', 'view_testimonials', {
                                'event_category': 'engagement',
                                'event_label': 'User viewed testimonials section'
                            });
                        }
                        testimonialsViewed = true;
                        observer.unobserve(testimonialsSection);
                    }
                });
            }, { threshold: 0.5 }); 
            observer.observe(testimonialsSection);
        }
    } catch(error) {
        console.error("Error al configurar el tracking de Google Analytics:", error);
    }

    try {
        if (typeof Swiper !== 'undefined' && document.querySelector('.swiper')) {
            new Swiper('.swiper', {
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
