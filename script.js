// DOM Elements
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('nav-menu');
const hamburger = document.getElementById('hamburger');
const themeToggle = document.getElementById('theme-toggle');
const backToTop = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.updateThemeIcon();
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
        this.updateThemeIcon();
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    updateThemeIcon() {
        const icon = themeToggle.querySelector('i');
        if (this.currentTheme === 'light') {
            icon.className = 'fas fa-moon';
        } else {
            icon.className = 'fas fa-sun';
        }
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateActiveLink();
    }

    bindEvents() {
        // Mobile menu toggle
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navMenu.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Update navbar on scroll
        window.addEventListener('scroll', () => {
            this.handleScroll();
            this.updateActiveLink();
        });
    }

    handleScroll() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.createObserver();
        this.addAnimationClasses();
    }

    createObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, this.observerOptions);
    }

    addAnimationClasses() {
        // Add animation classes to elements
        const animationElements = [
            { selector: '.section-header', class: 'fade-in-up' },
            { selector: '.about-text', class: 'fade-in-left' },
            { selector: '.about-skills', class: 'fade-in-right' },
            { selector: '.project-card', class: 'fade-in-up' },
            { selector: '.service-card', class: 'fade-in-up' },
            { selector: '.contact-info', class: 'fade-in-left' },
            { selector: '.contact-form-container', class: 'fade-in-right' },
            { selector: '.timeline-item', class: 'fade-in-left' }
        ];

        animationElements.forEach(({ selector, class: className }) => {
            document.querySelectorAll(selector).forEach((element, index) => {
                element.classList.add(className);
                element.style.transitionDelay = `${index * 0.1}s`;
                this.observer.observe(element);
            });
        });
    }
}

// Back to Top Button
class BackToTopManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleScroll();
    }

    bindEvents() {
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    handleScroll() {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
}

// Contact Form Management
class ContactFormManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearError(input);
            });
        });
    }

    handleSubmit() {
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Clear previous errors
        this.clearAllErrors();
        
        // Validate form
        const isValid = this.validateForm(data);
        
        if (isValid) {
            this.submitForm(data);
        }
    }

    validateForm(data) {
        let isValid = true;
        
        // Name validation
        if (!data.name || data.name.trim().length < 2) {
            this.showError('name', 'Name must be at least 2 characters long');
            isValid = false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            this.showError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Subject validation
        if (!data.subject || data.subject.trim().length < 3) {
            this.showError('subject', 'Subject must be at least 3 characters long');
            isValid = false;
        }
        
        // Message validation
        if (!data.message || data.message.trim().length < 10) {
            this.showError('message', 'Message must be at least 10 characters long');
            isValid = false;
        }
        
        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        
        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    this.showError(fieldName, 'Name must be at least 2 characters long');
                    return false;
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    this.showError(fieldName, 'Please enter a valid email address');
                    return false;
                }
                break;
            case 'subject':
                if (value.length < 3) {
                    this.showError(fieldName, 'Subject must be at least 3 characters long');
                    return false;
                }
                break;
            case 'message':
                if (value.length < 10) {
                    this.showError(fieldName, 'Message must be at least 10 characters long');
                    return false;
                }
                break;
        }
        
        this.clearError(field);
        return true;
    }

    showError(fieldName, message) {
        const field = contactForm.querySelector(`[name="${fieldName}"]`);
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        formGroup.classList.add('error');
        errorElement.textContent = message;
    }

    clearError(field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error');
    }

    clearAllErrors() {
        const formGroups = contactForm.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('error');
        });
    }

    async submitForm(data) {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        
        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        
        try {
            // Create mailto link with form data
            const subject = encodeURIComponent(data.subject);
            const body = encodeURIComponent(
                `Name: ${data.name}\n` +
                `Email: ${data.email}\n\n` +
                `Message:\n${data.message}`
            );
            
            const mailtoLink = `mailto:giulio6686@gmail.com?subject=${subject}&body=${body}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            this.showSuccessMessage();
            
            // Reset form
            setTimeout(() => {
                contactForm.reset();
            }, 1000);
            
        } catch (error) {
            console.error('Error submitting form:', error);
            this.showErrorMessage('An error occurred while sending your message. Please try again.');
        } finally {
            // Hide loading state
            setTimeout(() => {
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
            }, 2000);
        }
    }

    showSuccessMessage() {
        const message = this.createNotification('Message sent successfully! Your email client should open shortly.', 'success');
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    showErrorMessage(text) {
        const message = this.createNotification(text, 'error');
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    createNotification(text, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${text}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            animation: slideInRight 0.3s ease-out;
        `;
        
        return notification;
    }
}

// Utility Functions
class Utils {
    static debounce(func, wait) {
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

    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// Performance Optimization
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.optimizeScrollEvents();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    optimizeScrollEvents() {
        // Use throttled scroll events for better performance
        const throttledScroll = Utils.throttle(() => {
            // Handle scroll events here
        }, 16); // ~60fps

        window.addEventListener('scroll', throttledScroll, { passive: true });
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    const themeManager = new ThemeManager();
    const navigationManager = new NavigationManager();
    const scrollAnimations = new ScrollAnimations();
    const backToTopManager = new BackToTopManager();
    const contactFormManager = new ContactFormManager();
    const performanceOptimizer = new PerformanceOptimizer();

    // Theme toggle event
    themeToggle.addEventListener('click', () => {
        themeManager.toggleTheme();
    });

    // Add dynamic styles for notifications
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            padding: 0.25rem;
            margin-left: auto;
            border-radius: 0.25rem;
            transition: background-color 0.15s ease;
        }
        
        .notification-close:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
    `;
    document.head.appendChild(notificationStyles);

    // Handle external links
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });

    // Add loading states for interactive elements
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                this.style.minWidth = this.offsetWidth + 'px';
            }
        });
    });

    document.querySelectorAll('.project-image-slider, .prototype-slider').forEach(slider => {
        let currentIndex = 0;
        const images = slider.querySelectorAll('.slider-image');
        const totalImages = images.length;

        const randomizeInterval = () => Math.floor(Math.random() * 3000) + 4000; // Random interval between 4s and 7s

        const slideImages = () => {
            currentIndex = (currentIndex + 1) % totalImages;
            slider.querySelector('.slider').style.transform = `translateX(-${currentIndex * 100}%)`;
            setTimeout(slideImages, randomizeInterval());
        };

        setTimeout(slideImages, randomizeInterval());
    });
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden
        document.title = 'Come back! - Giulio Piana';
    } else {
        // Page is visible
        document.title = 'Giulio Piana - Senior Game Developer';
    }
});

// Add error handling for images
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
        console.warn('Image failed to load:', e.target.src);
    }
}, true);

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
    
    // Navigate sections with arrow keys
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const sections = Array.from(document.querySelectorAll('section[id]'));
        const currentSection = sections.find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom > 100;
        });
        
        if (currentSection) {
            const currentIndex = sections.indexOf(currentSection);
            let nextIndex;
            
            if (e.key === 'ArrowDown') {
                nextIndex = Math.min(currentIndex + 1, sections.length - 1);
            } else {
                nextIndex = Math.max(currentIndex - 1, 0);
            }
            
            if (nextIndex !== currentIndex) {
                sections[nextIndex].scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
});
         
