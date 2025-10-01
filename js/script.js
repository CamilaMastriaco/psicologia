document.addEventListener("DOMContentLoaded", function() {

    try {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('nav a').forEach(link => {
            if (link.getAttribute('href').endsWith(currentPath)) {
                link.classList.add('active');
            }
        });
    } catch (error) {
        console.error("Error al resaltar el enlace activo:", error);
    }

    try {
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        };
        const observerOptions = { threshold: 0.1 };
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        document.querySelectorAll('.animate-on-scroll, .stagger-item').forEach(el => observer.observe(el));
    } catch (error) {
        console.error("Error en las animaciones de scroll:", error);
    }

    try {
        const testimonialsCarousel = document.querySelector('#testimonios-carousel');
        if (testimonialsCarousel) {
            new Swiper(testimonialsCarousel, {
                loop: true,
                grabCursor: true,
                autoplay: { delay: 5000, disableOnInteraction: false },
                pagination: { el: '.swiper-pagination', clickable: true },
                navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
                slidesPerView: 1.2,
                spaceBetween: 15,
                centeredSlides: true,
                breakpoints: {
                    768: { slidesPerView: 2, spaceBetween: 30, centeredSlides: false },
                    1024: { slidesPerView: 3, spaceBetween: 30, centeredSlides: false },
                }
            });
        }
    } catch (error) {
        console.error("Error al inicializar carrusel de testimonios:", error);
    }

    try {
        const blogCarousels = document.querySelectorAll('.blog-carousel');
        if (blogCarousels.length > 0) {
            blogCarousels.forEach(carousel => {
                new Swiper(carousel, {
                    grabCursor: true,
                    slidesPerView: 1.2,
                    spaceBetween: 15,
                    navigation: {
                        nextEl: carousel.querySelector('.swiper-button-next'),
                        prevEl: carousel.querySelector('.swiper-button-prev'),
                    },
                    breakpoints: {
                        640: { slidesPerView: 2, spaceBetween: 20 },
                        960: { slidesPerView: 3, spaceBetween: 30 },
                    }
                });
            });
        }
    } catch (error) {
        console.error("Error al inicializar carruseles del blog:", error);
    }

    try {
        const langOptions = document.querySelectorAll('.lang-option');
        const translatableElements = document.querySelectorAll('[data-lang-es]');
        const whatsappTriggers = document.querySelectorAll('.whatsapp-trigger');
        const baseWhatsappHref = "https://wa.me/5491140695035";

        const savedLang = localStorage.getItem('preferredLanguage') || 'es';

        function switchLanguage(lang) {
            if (!lang) return;

            translatableElements.forEach(el => {
                const text = el.dataset[`lang${lang.charAt(0).toUpperCase() + lang.slice(1)}`]; // ej. dataset.langEs
                if (text) el.innerHTML = text;
            });

            whatsappTriggers.forEach(link => {
                const rawMessage = link.dataset[`whatsapp${lang.charAt(0).toUpperCase() + lang.slice(1)}`];
                if (rawMessage) {
                    link.href = `${baseWhatsappHref}?text=${encodeURIComponent(rawMessage)}`;
                }
            });

            langOptions.forEach(option => {
                option.classList.toggle('active', option.dataset.lang === lang);
            });

            document.documentElement.lang = lang;
        }

        langOptions.forEach(option => {
            option.addEventListener('click', () => {
                const selectedLang = option.dataset.lang;
                switchLanguage(selectedLang);
                localStorage.setItem('preferredLanguage', selectedLang);
            });
        });

        switchLanguage(savedLang);
    } catch (error) {
        console.error("Error en el interruptor de idioma:", error);
    }

    try {
        document.querySelectorAll('.social-icons a').forEach(link => {
            link.addEventListener('click', function() {
                const socialNetwork = this.dataset.social;
                if (typeof gtag === 'function' && socialNetwork) {
                    gtag('event', 'social_link_click', {
                        'social_network': socialNetwork
                    });
                }
            });
        });

        document.querySelectorAll('.whatsapp-trigger').forEach(button => {
            button.addEventListener('click', function() {
                const location = this.dataset.location || 'unknown';
                if (typeof gtag === 'function') {
                    gtag('event', 'whatsapp_click', {
                        'button_location': location
                    });
                }
            });
        });
    } catch (error) {
        console.error("Error al configurar el tracking de GA4:", error);
    }
});