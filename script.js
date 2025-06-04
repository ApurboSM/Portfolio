// Typing effect
document.addEventListener('DOMContentLoaded', function() {
    // Hide loader after page loads with a smoother transition
    setTimeout(() => {
        const loader = document.querySelector('.loader-wrapper');
        loader.classList.add('fade-out');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 800);
    }, 2000);

    const typed = new Typed('.typed-text', {
        strings: ['Web Developer', 'ML Engineer', 'MERN Developer'],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true,
        cursorChar: '|',
        fadeOut: true,
        fadeOutClass: 'typed-fade-out',
        fadeOutDelay: 500
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.floating-nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Reveal on Scroll
    function reveal() {
        const reveals = document.querySelectorAll('.reveal');
        
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }

    // Handle Scroll Events
    window.addEventListener('scroll', () => {
        reveal();
    });

    // Initial check for elements in view
    reveal();

    // Lazy Loading Images
    document.addEventListener('DOMContentLoaded', () => {
        const lazyImages = document.querySelectorAll('.lazy-load');
        
        lazyImages.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
            }
        });
    });

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add this inside your DOMContentLoaded event listener
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Enhanced Business Card Functionality with Mouse-Following Rotation
    const businessCard = document.querySelector('.business-card');
    const cardContainer = document.querySelector('.card-section-container');
    let isCardFlipped = false;
    let currentScale = 1;
    let isRotating = false;
    let mouseX = 0;
    let mouseY = 0;
    let cardCenterX = 0;
    let cardCenterY = 0;

    if (businessCard && cardContainer) {
        // Calculate card center position
        function updateCardCenter() {
            const rect = businessCard.getBoundingClientRect();
            cardCenterX = rect.left + rect.width / 2;
            cardCenterY = rect.top + rect.height / 2;
        }

        // Mouse-following 360° rotation
        function handleMouseMove(e) {
            if (window.innerWidth > 768) {
                mouseX = e.clientX;
                mouseY = e.clientY;
                
                updateCardCenter();
                
                // Calculate rotation based on mouse position relative to card center
                const deltaX = mouseX - cardCenterX;
                const deltaY = mouseY - cardCenterY;
                
                // Convert to rotation angles (more sensitive)
                const rotationY = (deltaX / window.innerWidth) * 60; // Max 60 degrees
                const rotationX = -(deltaY / window.innerHeight) * 30; // Max 30 degrees
                
                // Apply rotation with current flip state and scale
                const flipRotation = isCardFlipped ? 180 : 0;
                businessCard.style.transform = `
                    scale(${currentScale}) 
                    rotateY(${flipRotation + rotationY}deg) 
                    rotateX(${rotationX}deg)
                    translateZ(20px)
                `;
            }
        }

        // Add mouse move listener to the entire card section
        cardContainer.addEventListener('mousemove', handleMouseMove);
        
        // Update card center on window resize
        window.addEventListener('resize', updateCardCenter);
        
        // Initialize card center
        updateCardCenter();

        // Enhanced hover effects
        businessCard.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                businessCard.style.transition = 'transform 0.1s ease-out';
            }
        });

        businessCard.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) {
                businessCard.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                // Return to neutral position
                const flipRotation = isCardFlipped ? 180 : 0;
                businessCard.style.transform = `
                    scale(${currentScale}) 
                    rotateY(${flipRotation}deg) 
                    rotateX(0deg)
                    translateZ(0px)
                `;
            }
        });

        // Click to Flip
        businessCard.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (!isCardFlipped) {
                isCardFlipped = true;
            } else {
                isCardFlipped = false;
            }
            
            // Maintain current mouse rotation when flipping
            updateCardCenter();
            const deltaX = mouseX - cardCenterX;
            const deltaY = mouseY - cardCenterY;
            const rotationY = (deltaX / window.innerWidth) * 60;
            const rotationX = -(deltaY / window.innerHeight) * 30;
            const flipRotation = isCardFlipped ? 180 : 0;
            
            businessCard.style.transform = `
                scale(${currentScale}) 
                rotateY(${flipRotation + rotationY}deg) 
                rotateX(${rotationX}deg)
                translateZ(20px)
            `;
        });

        // Scroll to Zoom (only when hovering over the card)
        let isHoveringCard = false;
        
        businessCard.addEventListener('mouseenter', () => {
            isHoveringCard = true;
        });
        
        businessCard.addEventListener('mouseleave', () => {
            isHoveringCard = false;
        });

        // Handle wheel events for zooming
        document.addEventListener('wheel', (e) => {
            if (isHoveringCard) {
                e.preventDefault();
                
                const zoomSpeed = 0.1;
                const maxScale = 1.8;
                const minScale = 0.4;
                
                if (e.deltaY < 0) {
                    // Scroll up - zoom in
                    currentScale = Math.min(currentScale + zoomSpeed, maxScale);
                } else {
                    // Scroll down - zoom out
                    currentScale = Math.max(currentScale - zoomSpeed, minScale);
                }
                
                // Apply zoom with current rotation
                updateCardCenter();
                const deltaX = mouseX - cardCenterX;
                const deltaY = mouseY - cardCenterY;
                const rotationY = (deltaX / window.innerWidth) * 60;
                const rotationX = -(deltaY / window.innerHeight) * 30;
                const flipRotation = isCardFlipped ? 180 : 0;
                
                businessCard.style.transform = `
                    scale(${currentScale}) 
                    rotateY(${flipRotation + rotationY}deg) 
                    rotateX(${rotationX}deg)
                    translateZ(20px)
                `;
                
                // Add zoom classes for additional effects
                businessCard.classList.remove('zoomed-in', 'zoomed-out');
                if (currentScale > 1.2) {
                    businessCard.classList.add('zoomed-in');
                } else if (currentScale < 0.8) {
                    businessCard.classList.add('zoomed-out');
                }
            }
        }, { passive: false });

        // Mobile touch interactions
        if (window.innerWidth <= 768) {
            let touchStartY = 0;
            let touchStartX = 0;
            
            businessCard.addEventListener('touchstart', (e) => {
                touchStartY = e.touches[0].clientY;
                touchStartX = e.touches[0].clientX;
            });
            
            businessCard.addEventListener('touchend', (e) => {
                const touchEndY = e.changedTouches[0].clientY;
                const touchEndX = e.changedTouches[0].clientX;
                const deltaY = touchStartY - touchEndY;
                const deltaX = touchStartX - touchEndX;
                
                // If it's a swipe gesture
                if (Math.abs(deltaY) > 50 || Math.abs(deltaX) > 50) {
                    if (Math.abs(deltaY) > Math.abs(deltaX)) {
                        // Vertical swipe - zoom
                        if (deltaY > 0) {
                            // Swipe up - zoom in
                            currentScale = Math.min(currentScale + 0.2, 1.6);
                        } else {
                            // Swipe down - zoom out
                            currentScale = Math.max(currentScale - 0.2, 0.6);
                        }
                        const flipRotation = isCardFlipped ? 180 : 0;
                        businessCard.style.transform = `scale(${currentScale}) rotateY(${flipRotation}deg)`;
                    } else {
                        // Horizontal swipe - flip
                        if (!isCardFlipped) {
                            businessCard.style.transform = `scale(${currentScale}) rotateY(180deg)`;
                            isCardFlipped = true;
                        } else {
                            businessCard.style.transform = `scale(${currentScale}) rotateY(0deg)`;
                            isCardFlipped = false;
                        }
                    }
                } else {
                    // Tap - simple flip
                    if (!isCardFlipped) {
                        businessCard.style.transform = `scale(${currentScale}) rotateY(180deg)`;
                        isCardFlipped = true;
                    } else {
                        businessCard.style.transform = `scale(${currentScale}) rotateY(0deg)`;
                        isCardFlipped = false;
                    }
                }
            });
        }

        // Reset card on double-click
        businessCard.addEventListener('dblclick', () => {
            currentScale = 1;
            isCardFlipped = false;
            businessCard.style.transform = 'scale(1) rotateY(0deg) rotateX(0deg) translateZ(0px)';
            businessCard.classList.remove('zoomed-in', 'zoomed-out');
        });

        // Keyboard controls (when card is focused)
        businessCard.setAttribute('tabindex', '0');
        businessCard.addEventListener('keydown', (e) => {
            switch(e.key) {
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    // Flip card
                    if (!isCardFlipped) {
                        isCardFlipped = true;
                    } else {
                        isCardFlipped = false;
                    }
                    
                    // Maintain current rotation
                    updateCardCenter();
                    const deltaX = mouseX - cardCenterX;
                    const deltaY = mouseY - cardCenterY;
                    const rotationY = (deltaX / window.innerWidth) * 60;
                    const rotationX = -(deltaY / window.innerHeight) * 30;
                    const flipRotation = isCardFlipped ? 180 : 0;
                    
                    businessCard.style.transform = `
                        scale(${currentScale}) 
                        rotateY(${flipRotation + rotationY}deg) 
                        rotateX(${rotationX}deg)
                        translateZ(20px)
                    `;
                    break;
                case '+':
                case '=':
                    e.preventDefault();
                    // Zoom in
                    currentScale = Math.min(currentScale + 0.1, 1.8);
                    updateCardCenter();
                    const deltaXPlus = mouseX - cardCenterX;
                    const deltaYPlus = mouseY - cardCenterY;
                    const rotationYPlus = (deltaXPlus / window.innerWidth) * 60;
                    const rotationXPlus = -(deltaYPlus / window.innerHeight) * 30;
                    const flipRotationPlus = isCardFlipped ? 180 : 0;
                    businessCard.style.transform = `
                        scale(${currentScale}) 
                        rotateY(${flipRotationPlus + rotationYPlus}deg) 
                        rotateX(${rotationXPlus}deg)
                        translateZ(20px)
                    `;
                    break;
                case '-':
                case '_':
                    e.preventDefault();
                    // Zoom out
                    currentScale = Math.max(currentScale - 0.1, 0.4);
                    updateCardCenter();
                    const deltaXMinus = mouseX - cardCenterX;
                    const deltaYMinus = mouseY - cardCenterY;
                    const rotationYMinus = (deltaXMinus / window.innerWidth) * 60;
                    const rotationXMinus = -(deltaYMinus / window.innerHeight) * 30;
                    const flipRotationMinus = isCardFlipped ? 180 : 0;
                    businessCard.style.transform = `
                        scale(${currentScale}) 
                        rotateY(${flipRotationMinus + rotationYMinus}deg) 
                        rotateX(${rotationXMinus}deg)
                        translateZ(20px)
                    `;
                    break;
                case 'Escape':
                    e.preventDefault();
                    // Reset card
                    currentScale = 1;
                    isCardFlipped = false;
                    businessCard.style.transform = 'scale(1) rotateY(0deg) rotateX(0deg) translateZ(0px)';
                    businessCard.classList.remove('zoomed-in', 'zoomed-out');
                    break;
            }
        });
    }

    // Enhanced parallax effect for card section
    window.addEventListener('scroll', () => {
        const cardSection = document.querySelector('#card');
        if (cardSection) {
            const rect = cardSection.getBoundingClientRect();
            const scrolled = window.pageYOffset;
            const isInView = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isInView) {
                const yPos = -(scrolled * 0.05);
                cardSection.style.backgroundPosition = `center ${yPos}px`;
                
                // Parallax effect for particles
                const particles = document.querySelectorAll('.particle');
                particles.forEach((particle, index) => {
                    const speed = (index + 1) * 0.02;
                    particle.style.transform = `translateY(${scrolled * speed}px)`;
                });
            }
        }
    });

    // Cursor trail effect (optional enhancement)
    const createCursorTrail = () => {
        const cardContainer = document.querySelector('.card-section-container');
        if (!cardContainer) return;

        let mouseX = 0;
        let mouseY = 0;
        let trails = [];

        cardContainer.addEventListener('mousemove', (e) => {
            mouseX = e.clientX - cardContainer.getBoundingClientRect().left;
            mouseY = e.clientY - cardContainer.getBoundingClientRect().top;

            // Create trail dot
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.cssText = `
                position: absolute;
                left: ${mouseX}px;
                top: ${mouseY}px;
                width: 4px;
                height: 4px;
                background: radial-gradient(circle, #8FD9A8, transparent);
                border-radius: 50%;
                pointer-events: none;
                z-index: 10;
                opacity: 0.8;
                transform: translate(-50%, -50%);
            `;
            
            cardContainer.appendChild(trail);
            trails.push(trail);

            // Animate and remove trail
            setTimeout(() => {
                trail.style.opacity = '0';
                trail.style.transform = 'translate(-50%, -50%) scale(0)';
                setTimeout(() => {
                    if (trail.parentNode) {
                        trail.parentNode.removeChild(trail);
                    }
                    trails = trails.filter(t => t !== trail);
                }, 300);
            }, 100);

            // Limit number of trails
            if (trails.length > 10) {
                const oldTrail = trails.shift();
                if (oldTrail && oldTrail.parentNode) {
                    oldTrail.parentNode.removeChild(oldTrail);
                }
            }
        });
    };

    // Initialize cursor trail on desktop only
    if (window.innerWidth > 768) {
        createCursorTrail();
    }
});

// Navbar Functions
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navbar links
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle internal links (starting with #)
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Close mobile menu if open
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                        bsCollapse.hide();
                    }
                    
                    // Smooth scroll to target
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Highlight active navbar link on scroll
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100; // Offset for fixed navbar
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current section's nav link
                const activeLink = document.querySelector(`.navbar-nav .nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    // Update active link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Update active link on page load
    updateActiveNavLink();
    
    // Navbar background opacity on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 26, 0.98)';
            navbar.style.boxShadow = '0 2px 25px rgba(0, 0, 0, 0.4)';
        } else {
            navbar.style.background = 'rgba(10, 10, 26, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        }
    });
}); 