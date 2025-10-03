document.addEventListener("DOMContentLoaded", function() {

    try {
        const currentUrl = window.location.href;
        const navLinks = document.querySelectorAll('nav a');

        navLinks.forEach(link => link.classList.remove('active'));

        let bestMatch = null;
        navLinks.forEach(link => {
            if (currentUrl.startsWith(link.href)) {
                if (!bestMatch || link.href.length > bestMatch.href.length) {
                    bestMatch = link;
                }
            }
        });

        if (bestMatch) {
            bestMatch.classList.add('active');
        } else {
            if (currentUrl.includes('/posts/')) {
                navLinks.forEach(link => {
                    if (link.getAttribute('href').includes('blog')) {
                        link.classList.add('active');
                    }
                });
            }
        }
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
                const text = el.dataset[`lang${lang.charAt(0).toUpperCase() + lang.slice(1)}`];
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
            try {
                const titleElement = document.querySelector('title');
                if (titleElement) {
                    const key = `title${lang.charAt(0).toUpperCase() + lang.slice(1)}`;
                    const newTitle = titleElement.dataset[key];
                    
                    if (newTitle) {
                        titleElement.textContent = newTitle;
                    }
                }
            } catch (error) {
                console.error("Error al actualizar el título de la página:", error);
            }
            
            
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

    try {
        const shareContainer = document.getElementById('share-buttons-container');

        if (shareContainer) {
            const postUrl = encodeURIComponent(window.location.href);
            const postTitle = encodeURIComponent(document.title.split('|')[0].trim());

            const socialNetworks = [
                { name: 'Facebook', icon: 'fab fa-facebook-f', class: 'share-facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${postUrl}` },
                { name: 'WhatsApp', icon: 'fab fa-whatsapp', class: 'share-whatsapp', url: `https://api.whatsapp.com/send?text=${postTitle}%20${postUrl}` },
                { name: 'LinkedIn', icon: 'fab fa-linkedin-in', class: 'share-linkedin', url: `https://www.linkedin.com/shareArticle?mini=true&url=${postUrl}&title=${postTitle}` },
                { name: 'X', icon: 'fab fa-twitter', class: 'share-x', url: `https://twitter.com/intent/tweet?url=${postUrl}&text=${postTitle}` },
                { name: 'Email', icon: 'fas fa-envelope', class: 'share-email', url: `mailto:?subject=${postTitle}&body=Te recomiendo leer este artículo: ${postUrl}` },
                { name: 'Copiar', icon: 'fas fa-copy', class: 'share-copy', url: '#' }
            ];

            let buttonsHTML = '';
            socialNetworks.forEach(network => {
                buttonsHTML += `
                    <a href="${network.url}" class="share-button ${network.class}" target="_blank" rel="noopener noreferrer" title="Compartir en ${network.name}">
                        <i class="${network.icon}"></i>
                        <span>${network.name}</span>
                    </a>
                `;
            });

            shareContainer.innerHTML = buttonsHTML;

            const copyButton = shareContainer.querySelector('.share-copy');
            if (copyButton) {
                copyButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    const urlToCopy = decodeURIComponent(postUrl);
                    navigator.clipboard.writeText(urlToCopy).then(() => {
                        const originalText = copyButton.querySelector('span').textContent;
                        copyButton.querySelector('span').textContent = '¡Copiado!';
                        setTimeout(() => {
                            copyButton.querySelector('span').textContent = originalText;
                        }, 2000);
                    }).catch(err => {
                        console.error('Error al copiar el enlace: ', err);
                        alert('No se pudo copiar el enlace.');
                    });
                });
            }
        }
    } catch (error) {
        console.error("Error al generar botones de compartir:", error);
    }
});

try {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
} catch (error) {
    console.error("Error al actualizar el año del copyright:", error);
};

document.addEventListener('DOMContentLoaded', () => {
    try {
        const banner = document.getElementById('cookie-consent-banner');
        const acceptBtn = document.getElementById('cookie-consent-accept');
        const rejectBtn = document.getElementById('cookie-consent-reject');
        
        const getGaId = () => {
            const gaScriptTag = document.querySelector('script[src*="googletagmanager.com/gtag/js?id="]');
            if (gaScriptTag) {
                const url = new URL(gaScriptTag.src);
                return url.searchParams.get('id');
            }
            return null;
        };

        const GA_ID = getGaId();

        const loadGoogleAnalytics = () => {
            if (!GA_ID) {
                console.warn("Google Analytics ID no encontrado en el HTML. Asegúrate de que el deploy.yml lo está inyectando.");
                return;
            }
            
            if (typeof gtag === 'function') return;

            
            const gascript = document.createElement('script');
            gascript.async = true;
            gascript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
            document.head.appendChild(gascript);

            const gascriptConfig = document.createElement('script');
            gascriptConfig.innerHTML = `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
            `;
            document.head.appendChild(gascriptConfig);
            console.log("Consentimiento otorgado. Google Analytics activado.");
        };

        const hideBanner = (consentType) => {
            localStorage.setItem('cookie_consent', consentType);
            banner.classList.remove('active');
        };

        acceptBtn.addEventListener('click', () => {
            hideBanner('granted');
            loadGoogleAnalytics();
        });

        rejectBtn.addEventListener('click', () => {
            hideBanner('rejected');
        });

        const consentStatus = localStorage.getItem('cookie_consent');

        if (consentStatus === 'granted') {
            loadGoogleAnalytics();
        } else if (!consentStatus) { 
            setTimeout(() => {
                banner.classList.add('active');
            }, 1000);
        }

    } catch (error) {
        console.error("Error en la lógica del banner de cookies:", error);
    }
});