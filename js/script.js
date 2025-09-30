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

        const savedLang = localStorage.getItem('preferredLanguage') || 'es';

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
        const testimonialsCarousel = document.querySelector('#testimonios .swiper');
        if (testimonialsCarousel) {
            new Swiper(testimonialsCarousel, {
                loop: true,
                grabCursor: true,
                autoplay: { delay: 5000, disableOnInteraction: false },
                pagination: { el: '.swiper-pagination', clickable: true },
                navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
                slidesPerView: 1,
                spaceBetween: 20,
                breakpoints: {
                    768: { slidesPerView: 2, spaceBetween: 30 },
                    1024: { slidesPerView: 3, spaceBetween: 30 },
                }
            });
        }
    
        const categoryTitles = document.querySelectorAll('.category-title');
        categoryTitles.forEach(title => {
            title.addEventListener('click', () => {
                title.classList.toggle('active');
    
                const content = title.nextElementSibling;
                if (content && content.classList.contains('collapsible-content')) {
                    content.classList.toggle('active');
    
                    const swiperContainer = content.querySelector('.swiper');
                    if (swiperContainer && !swiperContainer.swiper) {
                        new Swiper(swiperContainer, {
                            grabCursor: true,
                            slidesPerView: 1,
                            spaceBetween: 20,
                            navigation: {
                                nextEl: swiperContainer.querySelector('.swiper-button-next'),
                                prevEl: swiperContainer.querySelector('.swiper-button-prev'),
                            },
                            breakpoints: {
                                640: { slidesPerView: 2, spaceBetween: 20 },
                                960: { slidesPerView: 3, spaceBetween: 30 },
                            }
                        });
                    }
                }
            });
        });
    
    } catch (error) {
        console.error("No se pudo inicializar un carrusel Swiper o el acordeón:", error);
    }

    try {
        const testimonialsCarousel = document.querySelector('#testimonios .swiper');
        if (testimonialsCarousel) {
            new Swiper(testimonialsCarousel, {
                loop: true,
                grabCursor: true,
                autoplay: { delay: 5000, disableOnInteraction: false },
                pagination: { el: '.swiper-pagination', clickable: true },
                navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
                slidesPerView: 1.25,
                spaceBetween: 15,
                centeredSlides: true,
                breakpoints: {
                    768: { slidesPerView: 2, spaceBetween: 30, centeredSlides: false },
                    1024: { slidesPerView: 3, spaceBetween: 30, centeredSlides: false },
                }
            });
        }
    
        const blogCarousels = document.querySelectorAll('.blog-carousel');
        blogCarousels.forEach(carousel => {
            new Swiper(carousel, {
                grabCursor: true,
                slidesPerView: 1.25, 
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
    
        const categoryTitles = document.querySelectorAll('.category-title');
        categoryTitles.forEach(title => {
            const content = title.nextElementSibling;
            if (content) {
                title.addEventListener('click', () => {
                    title.classList.toggle('active');
                    if (content.style.display === "block") {
                        content.style.display = "none";
                    } else {
                        content.style.display = "block";
                    }
                });
            }
        });
    
    } catch (error) {
        console.error("Error al inicializar Swiper o el acordeón:", error);
    }
});