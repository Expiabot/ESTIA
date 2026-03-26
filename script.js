document.addEventListener('DOMContentLoaded', () => {

    // 1. Navigation Scrolled State
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 3. Scroll Reveal Animations (Optimized with IntersectionObserver)
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Reveals when 15% of the element is visible
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Mouse Hover Effect for Service Cards (Dynamic gradient)
    const cards = document.querySelectorAll('.service-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            // Utilisation des pixels pour un effet plus précis sur le dégradé radial
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 5. Form Submission via Webhook n8n
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            // Fonction pour remettre le bouton à son état initial après 3 secondes
            const resetBtnState = () => {
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.style.opacity = '1';
                }, 3000);
            };

            btn.textContent = 'Envoi en cours...';
            btn.style.opacity = '0.8';

            // Webhook n8n integration (Obscurci via Base64 pour contrer les petits bots)
            const pt1 = "aHR0cHM6Ly90eW5pc2hhLXNwYWRpY2VvdXMtbWF1ZGllLm5ncm9rLWZyZWUuZGV2L3dlYmhvb2s=";
            const pt2 = "LzJlNmZjYzAzLWE3OWEtNGM3Zi1iN2JiLWE4NmM0YzA0ZGVlNA==";
            const webhookUrl = atob(pt1) + atob(pt2);

            fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nom: contactForm.querySelector('#name').value,
                    email: contactForm.querySelector('#email').value,
                    message: contactForm.querySelector('#message').value
                }),
            })
                .then(response => {
                    if (response.ok) {
                        // Succès : ton code de changement de couleur verte
                        btn.textContent = 'Demande envoyée !';
                        btn.style.background = '#10b981';
                        contactForm.reset();
                    } else {
                        btn.textContent = 'Erreur d\'envoi';
                        btn.style.background = '#ef4444'; // Rouge
                    }
                })
                .catch(error => {
                    console.error('Erreur:', error);
                    btn.textContent = 'Erreur réseau';
                    btn.style.background = '#ef4444'; // Rouge
                })
                .finally(() => {
                    // Toujours remettre à zéro à la fin, qu'il y ait erreur ou succès
                    resetBtnState();
                });
        });
    }

});
