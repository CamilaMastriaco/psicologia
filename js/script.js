document.addEventListener("DOMContentLoaded", function() {

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

        if (langOptions.length > 0) {
            let currentLang = 'es';

            function switchLanguage(lang) {
                if (!lang) return;

                // 1. Traducir textos
                translatableElements.forEach(el => {
                    const text = el.getAttribute(`data-lang-${lang}`);
                    if (text !== null) el.innerHTML = text; 
                });

                whatsappTriggers.forEach(link => {
                    const baseHref = "https://wa.me/5491140695035";
                    const rawMessage = link.getAttribute(`data-whatsapp-${lang}`);
                    if (rawMessage) {
                        const encodedMessage = encodeURIComponent(rawMessage);
                        link.href = `${baseHref}?text=${encodedMessage}`;
                    }
                });

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

    try {
        const whatsappButtons = document.querySelectorAll('.whatsapp-trigger');
        whatsappButtons.forEach(button => {
            button.addEventListener('click', function() {
                console.log('WhatsApp clicked. Sending event to GA4...'); 
                if (typeof gtag === 'function') {
                    gtag('event', 'whatsapp_click', {
                        'event_category': 'contact',
                        'event_label': 'WhatsApp Button Clicked'
                    });
                } else {
                    console.log('gtag function not found.');
                }
            });
        });
    } catch(error) {
        console.error("Error al configurar el tracking de WhatsApp:", error);
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
