/**
 * Mika Editing House - Interactive JavaScript
 * Smooth scrolling, modals, animations, and more
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initReviewsSlider();
    initPortfolioModal();
    initContactForm();
    initIntersectionObserver();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect for navbar
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Smooth scroll to sections
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    // Close mobile menu
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                    
                    // Smooth scroll
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Scroll effects and parallax
 */
function initScrollEffects() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    window.addEventListener('scroll', () => {
        // Hide scroll indicator after scrolling
        if (window.pageYOffset > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    });
}

/**
 * Reviews slider functionality
 */
function initReviewsSlider() {
    const track = document.getElementById('reviewsTrack');
    const prevBtn = document.getElementById('prevReview');
    const nextBtn = document.getElementById('nextReview');
    const dotsContainer = document.getElementById('sliderDots');
    const cards = track.querySelectorAll('.review-card');
    
    let currentIndex = 0;
    let cardsToShow = getCardsToShow();
    let maxIndex = Math.max(0, cards.length - cardsToShow);
    
    // Create dots
    function createDots() {
        dotsContainer.innerHTML = '';
        const totalDots = maxIndex + 1;
        
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('div');
            dot.className = `slider-dot ${i === currentIndex ? 'active' : ''}`;
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    // Get cards to show based on viewport
    function getCardsToShow() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1024) return 2;
        return 3;
    }
    
    // Update slider position
    function updateSlider() {
        const cardWidth = cards[0].offsetWidth + 24; // Including gap
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        
        // Update dots
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    
    // Navigation functions
    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        updateSlider();
    }
    
    function nextSlide() {
        currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
        updateSlider();
    }
    
    function prevSlide() {
        currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
        updateSlider();
    }
    
    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Auto-play
    let autoPlayInterval = setInterval(nextSlide, 5000);
    
    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    track.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(nextSlide, 5000);
    });
    
    // Handle resize
    window.addEventListener('resize', () => {
        cardsToShow = getCardsToShow();
        maxIndex = Math.max(0, cards.length - cardsToShow);
        currentIndex = Math.min(currentIndex, maxIndex);
        createDots();
        updateSlider();
    });
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
    
    // Initialize
    createDots();
    updateSlider();
}

/**
 * Portfolio modal functionality
 */
function initPortfolioModal() {
    const modal = document.getElementById('portfolioModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = modal.querySelector('.modal-overlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalCategory = document.getElementById('modalCategory');
    const modalDescription = document.getElementById('modalDescription');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // Project data
    const projectData = {
        wedding: {
            title: 'Royal Wedding Film',
            category: 'Wedding Cinematography',
            description: 'A beautiful cinematic wedding film capturing the magical moments of a royal celebration. Our team crafted a timeless narrative with stunning colour grading, elegant transitions, and a carefully curated soundtrack that perfectly complements the emotional journey of the couple.'
        },
        corporate: {
            title: 'Corporate Brand Film',
            category: 'Corporate Video',
            description: 'A dynamic brand film showcasing the company\'s vision, values, and achievements. This project featured professional interviews, B-roll footage, motion graphics, and a powerful voiceover that effectively communicates the brand story to stakeholders and customers.'
        },
        social: {
            title: 'Viral Reel Campaign',
            category: 'Social Media Content',
            description: 'A series of engaging Instagram Reels designed to maximize reach and engagement. Each reel was carefully edited with trending transitions, music sync, and dynamic text overlays optimized for the platform\'s algorithm and viewer retention.'
        },
        event: {
            title: 'Annual Conference Highlights',
            category: 'Event Coverage',
            description: 'Comprehensive coverage of a large-scale corporate conference, including keynote speeches, panel discussions, and networking moments. The final highlight reel captures the energy and key takeaways of the event in a compelling 3-minute video.'
        },
        music: {
            title: 'Music Video Production',
            category: 'Music Video',
            description: 'A visually striking music video featuring creative cinematography, precise beat synchronization, and innovative visual effects. Our colour grading gives the video its distinctive aesthetic that perfectly matches the artist\'s vision and musical style.'
        },
        documentary: {
            title: 'Documentary Short',
            category: 'Documentary',
            description: 'A compelling documentary short that tells a powerful story through authentic interviews and evocative visuals. Our post-production work includes careful pacing, atmospheric sound design, and subtle colour treatment that enhances the emotional impact.'
        }
    };
    
    // Open modal
    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const category = item.dataset.category;
            const data = projectData[category] || {
                title: 'Project Title',
                category: 'Category',
                description: 'Project description will appear here.'
            };
            
            modalTitle.textContent = data.title;
            modalCategory.textContent = data.category;
            modalDescription.textContent = data.description;
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal functions
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/**
 * Contact form handling
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.name || !data.email || !data.message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

/**
 * Show notification toast
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        padding: '16px 24px',
        background: type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6',
        color: '#fff',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        zIndex: '3000',
        animation: 'slideIn 0.3s ease',
        fontFamily: 'var(--font-body)'
    });
    
    // Add close button styles
    const closeBtn = notification.querySelector('.notification-close');
    Object.assign(closeBtn.style, {
        background: 'none',
        border: 'none',
        color: '#fff',
        fontSize: '20px',
        cursor: 'pointer',
        padding: '0',
        lineHeight: '1'
    });
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Close functionality
    closeBtn.addEventListener('click', () => notification.remove());
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add notification animations to document
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

/**
 * Intersection Observer for scroll animations
 */
function initIntersectionObserver() {
    // Add fade-in classes to elements
    const animateElements = [
        ...document.querySelectorAll('.section-header'),
        ...document.querySelectorAll('.service-card'),
        ...document.querySelectorAll('.portfolio-item'),
        ...document.querySelectorAll('.review-card'),
        ...document.querySelectorAll('.info-card'),
        ...document.querySelectorAll('.contact-form-container'),
        ...document.querySelectorAll('.about-content'),
        ...document.querySelectorAll('.about-visual'),
        ...document.querySelectorAll('.stat-card')
    ];
    
    animateElements.forEach((el, index) => {
        el.classList.add('fade-in');
        // Add stagger to groups
        if (el.classList.contains('service-card') || 
            el.classList.contains('portfolio-item') ||
            el.classList.contains('stat-card')) {
            const groupIndex = index % 6;
            el.classList.add(`stagger-${groupIndex + 1}`);
        }
    });
    
    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements
    animateElements.forEach(el => observer.observe(el));
}

/**
 * Utility: Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

