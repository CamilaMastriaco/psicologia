document.addEventListener("DOMContentLoaded", function() {

    // --- LÓGICA MEJORADA PARA EL ENLACE ACTIVO DEL MENÚ ---
    try {
        const currentUrl = window.location.href;
        const navLinks = document.querySelectorAll('nav a');

        // Primero, quitar la clase 'active' de todos los enlaces
        navLinks.forEach(link => link.classList.remove('active'));

        // Encontrar el enlace que mejor coincida con la URL actual
        let bestMatch = null;
        navLinks.forEach(link => {
            // link.href devuelve la URL completa y resuelta por el navegador
            if (currentUrl.startsWith(link.href)) {
                if (!bestMatch || link.href.length > bestMatch.href.length) {
                    bestMatch = link;
                }
            }
        });

        // Si encontramos una coincidencia, le añadimos la clase 'active'
        if (bestMatch) {
            bestMatch.classList.add('active');
        } else {
            // Si no hay coincidencia directa (ej. en una página de post),
            // marcamos "Blog" como activo si la URL contiene "/posts/".
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

    // --- ANIMACIONES DE SCROLL ---
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

    // --- CARRUSEL DE TESTIMONIOS ---
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

    // --- CARRUSELES DEL BLOG ---
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

    // --- INTERRUPTOR DE IDIOMA ---
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

    // --- TRACKING DE GOOGLE ANALYTICS 4 ---
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

    // --- BOTONES PARA COMPARTIR EN REDES SOCIALES (PARA PÁGINAS DE POSTS) ---
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

const yearSpan = document.querySelector('.copy'); 
if (yearSpan) {
    yearSpan.innerHTML = `&copy; ${new Date().getFullYear()} Camila Mastriaco. Todos los derechos reservados.`;
}