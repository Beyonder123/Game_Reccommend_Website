document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                    // Update active link (optional, can be combined with scroll spy)
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            } else if (href === 'index.html' || href === 'portfolio.html') {
                // Allow default behavior for external or other page links
                return true;
            }
        });
    });

    // Active navigation link highlighting on scroll (Scroll Spy)
    const sections = document.querySelectorAll('section[id]');
    function activateNavLink() {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', activateNavLink);
    activateNavLink(); // Initial call

    // Simple Parallax for Hero Visual (if applicable and desired)
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            // Adjust the '0.1' for more or less parallax effect
            heroVisual.style.transform = `translateY(${scrollY * 0.1}px)`;
        });
    }

    // Scroll-triggered animations for project cards or other elements
    const animatedElements = document.querySelectorAll('.project-card, .skill-category, .about-text, .about-image'); 
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Optional: unobserve after animation to save resources
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Placeholder for any specific Figma interactions if needed
    // e.g., custom dropdowns, carousels, etc.
    console.log('Portfolio JavaScript loaded and initialized.');
});