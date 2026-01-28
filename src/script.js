// Initialize Bootstrap components
document.addEventListener('DOMContentLoaded', function() {
    
    // Banner Slider
    const bannerPrev = document.getElementById('bannerPrev');
    const bannerNext = document.getElementById('bannerNext');
    const bannerText = document.getElementById('bannerText');

    const bannerMessages = [
        'Biggest celebration offer 30% off on Anarkali collection',
        'New arrivals - Oversized T-shirts collection',
        'Free shipping on orders above ₹999'
    ];

    let currentBannerIndex = 0;

    function updateBanner() {
        bannerText.textContent = bannerMessages[currentBannerIndex];
    }

    if (bannerNext && bannerPrev) {
        bannerNext.addEventListener('click', () => {
            currentBannerIndex = (currentBannerIndex + 1) % bannerMessages.length;
            updateBanner();
        });

        bannerPrev.addEventListener('click', () => {
            currentBannerIndex = (currentBannerIndex - 1 + bannerMessages.length) % bannerMessages.length;
            updateBanner();
        });

        // Auto-rotate banner every 5 seconds
        setInterval(() => {
            currentBannerIndex = (currentBannerIndex + 1) % bannerMessages.length;
            updateBanner();
        }, 5000);
    }

    // Add to Cart functionality
    const cartButtons = document.querySelectorAll('.btn-cart');
    let cartCount = 0;
    const cartBadge = document.querySelector('.cart-badge');

    cartButtons.forEach(button => {
        button.addEventListener('click', function() {
            cartCount++;
            
            // Update cart badge
            if (cartBadge) {
                cartBadge.textContent = cartCount;
                cartBadge.classList.remove('d-none');
            }
            
            // Visual feedback
            const originalText = this.textContent;
            this.textContent = 'Added!';
            this.classList.remove('btn-primary');
            this.classList.add('btn-success');
            
            // Reset after 1.5 seconds
            setTimeout(() => {
                this.textContent = originalText;
                this.classList.remove('btn-success');
                this.classList.add('btn-primary');
            }, 1500);
            
            // Show Bootstrap toast
            showToast('Product added to cart!', 'success');
        });
    });

    // Newsletter submission
    const newsletterSubmit = document.getElementById('newsletterSubmit');
    const newsletterEmail = document.getElementById('newsletterEmail');

    if (newsletterSubmit && newsletterEmail) {
        newsletterSubmit.addEventListener('click', () => {
            const email = newsletterEmail.value.trim();
            
            if (email && isValidEmail(email)) {
                showToast('Thank you for subscribing!', 'success');
                newsletterEmail.value = '';
            } else {
                showToast('Please enter a valid email address', 'danger');
            }
        });

        // Allow Enter key to submit
        newsletterEmail.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                newsletterSubmit.click();
            }
        });
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Bootstrap Toast notification system
    function showToast(message, type = 'success') {
        const toastElement = document.getElementById('liveToast');
        const toastMessage = document.getElementById('toastMessage');
        const toastHeader = toastElement.querySelector('.toast-header');
        
        if (toastElement && toastMessage) {
            // Update message
            toastMessage.textContent = message;
            
            // Update color based on type
            toastHeader.classList.remove('bg-success', 'bg-danger');
            toastHeader.classList.add(`bg-${type}`);
            
            // Show toast using Bootstrap
            const toast = new bootstrap.Toast(toastElement, {
                delay: 3000
            });
            toast.show();
        }
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Active navigation link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    function updateActiveLink() {
        let current = '';
        const scrollPosition = window.pageYOffset + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for fade-in animation
    document.querySelectorAll('.product-card, .offer-card, .blog-card, .feature-card').forEach(el => {
        el.classList.add('fade-in');
        scrollObserver.observe(el);
    });

    // Handle wishlist icon clicks
    const wishlistBtn = document.querySelectorAll('.icon-btn')[1];
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', () => {
            const svg = wishlistBtn.querySelector('svg path');
            if (svg) {
                if (svg.getAttribute('fill') === '#ed4b4b') {
                    svg.setAttribute('fill', 'none');
                    showToast('Removed from wishlist', 'success');
                } else {
                    svg.setAttribute('fill', '#ed4b4b');
                    showToast('Added to wishlist', 'success');
                }
            }
        });
    }

    // Navbar collapse on mobile when clicking a link
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse) {
        const navbarLinks = navbarCollapse.querySelectorAll('.nav-link');
        navbarLinks.forEach(link => {
            link.addEventListener('click', () => {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: false
                });
                bsCollapse.hide();
            });
        });
    }

    // Add hover effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Performance: Throttle scroll events
    function throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply throttle to scroll event
    window.addEventListener('scroll', throttle(updateActiveLink, 100));

    // Back to top button (optional enhancement)
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'btn btn-primary rounded-circle position-fixed bottom-0 end-0 m-4';
    backToTopBtn.style.cssText = 'display: none; width: 50px; height: 50px; z-index: 1000; font-size: 24px;';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Console log for debugging
    console.log('Clothum E-commerce website with Bootstrap loaded successfully!');
    console.log('Features: Banner slider, Add to cart, Newsletter subscription, Smooth scrolling, Lazy loading, Bootstrap components');
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page is hidden - pausing animations');
    } else {
        console.log('Page is visible - resuming animations');
    }
});

// Service Worker Registration (optional for PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(error => console.log('SW registration failed:', error));
    });
}
