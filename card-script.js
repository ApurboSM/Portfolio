// Card Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Version Toggle Functionality - Fixed
    const versionBtns = document.querySelectorAll('.version-btn');
    const cardVersions = document.querySelectorAll('.card-version');

    versionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const version = btn.getAttribute('data-version');
            
            // Update active button - remove from all first
            versionBtns.forEach(b => {
                b.classList.remove('active');
                b.style.background = 'rgba(0, 0, 0, 0.6)';
                b.style.color = 'rgba(255, 255, 255, 0.9)';
            });
            
            // Add active to clicked button
            btn.classList.add('active');
            btn.style.background = 'rgba(157, 78, 221, 0.8)';
            btn.style.color = '#ffffff';
            
            // Hide all card versions first
            cardVersions.forEach(v => {
                v.classList.remove('active');
                v.style.display = 'none';
            });
            
            // Show selected card version
            const selectedCard = document.getElementById(`card-${version}`);
            if (selectedCard) {
                selectedCard.classList.add('active');
                selectedCard.style.display = 'block';
            }
        });
    });

    // Initialize - Show only 3D version by default
    cardVersions.forEach(v => {
        v.style.display = 'none';
    });
    const defaultCard = document.getElementById('card-3d');
    if (defaultCard) {
        defaultCard.style.display = 'block';
        defaultCard.classList.add('active');
    }
    
    // Set initial button states
    versionBtns.forEach(b => {
        if (b.getAttribute('data-version') === '3d') {
            b.classList.add('active');
            b.style.background = 'rgba(157, 78, 221, 0.8)';
            b.style.color = '#ffffff';
        } else {
            b.classList.remove('active');
            b.style.background = 'rgba(0, 0, 0, 0.6)';
            b.style.color = 'rgba(255, 255, 255, 0.9)';
        }
    });

    // Enhanced Business Card Functionality with 360° Rotation on Click
    const businessCard = document.querySelector('.business-card');
    const cardContainer = document.querySelector('.card-section-container');
    const spaceBackground = document.querySelector('.space-background');
    let isCardFlipped = false;
    let currentScale = 1;
    let isRotating = false;
    let isDragging = false;
    let mouseX = 0;
    let mouseY = 0;
    let cardCenterX = 0;
    let cardCenterY = 0;
    let rotationX = 0;
    let rotationY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let clickStartTime = 0;
    let clickStartX = 0;
    let clickStartY = 0;

    if (businessCard && cardContainer) {
        // Calculate card center position
        function updateCardCenter() {
            const rect = businessCard.getBoundingClientRect();
            cardCenterX = rect.left + rect.width / 2;
            cardCenterY = rect.top + rect.height / 2;
        }

        // Update card transform with all rotations and sync space background
        function updateCardTransform() {
            const flipRotation = isCardFlipped ? 180 : 0;
            const totalRotationY = rotationY + flipRotation;
            
            // Use more stable transform values and force hardware acceleration
            businessCard.style.transform = `translate3d(0, 0, 20px) scale3d(${currentScale}, ${currentScale}, 1) rotateX(${Math.round(rotationX)}deg) rotateY(${Math.round(totalRotationY)}deg)`;

            // Simplified space background sync to reduce processing overhead
            if (spaceBackground) {
                // Use only the base rotation (without flip) for background
                const backgroundRotationX = Math.round(rotationX * 0.2); // Reduced intensity for background
                const backgroundRotationY = Math.round(rotationY * 0.1); // Only base rotation, no flip
                const backgroundScale = 1 + (currentScale - 1) * 0.05;
                
                spaceBackground.style.transform = `perspective(2000px) rotateX(${backgroundRotationX}deg) rotateY(${backgroundRotationY}deg) scale3d(${backgroundScale}, ${backgroundScale}, 1)`;
                
                // Apply individual transforms to space elements for 3D effect
                const stars = spaceBackground.querySelectorAll('.star');
                const planets = spaceBackground.querySelectorAll('.planet');
                const comets = spaceBackground.querySelectorAll('.comet');
                const nebulas = spaceBackground.querySelectorAll('.nebula');
                const shootingStars = spaceBackground.querySelectorAll('.shooting-star');
                
                // Transform stars with depth variation
                stars.forEach((star, index) => {
                    const depth = (index % 3) * 50 + 50; // Vary depth from 50px to 150px
                    const starRotationX = backgroundRotationX * (1 + index * 0.1);
                    const starRotationY = backgroundRotationY * (1 + index * 0.05);
                    
                    star.style.transform = `
                        translateZ(${depth}px)
                        rotateX(${starRotationX}deg)
                        rotateY(${starRotationY}deg)
                    `;
                });
                
                // Transform planets with orbital motion
                planets.forEach((planet, index) => {
                    const depth = 100 + index * 80; // Planets at different depths
                    const orbitalRotation = backgroundRotationY * (0.5 + index * 0.3);
                    const tiltRotation = backgroundRotationX * (0.8 + index * 0.2);
                    
                    planet.style.transform = `
                        translateZ(${depth}px)
                        rotateX(${tiltRotation}deg)
                        rotateY(${orbitalRotation}deg)
                        rotateZ(${orbitalRotation * 0.5}deg)
                    `;
                });
                
                // Transform comets with trajectory adjustment
                comets.forEach((comet, index) => {
                    const depth = 30 + index * 40;
                    const cometRotationX = backgroundRotationX * 1.2;
                    const cometRotationY = backgroundRotationY * 0.8;
                    
                    comet.style.transform = `
                        translateZ(${depth}px)
                        rotateX(${cometRotationX}deg)
                        rotateY(${cometRotationY}deg)
                    `;
                });
                
                // Transform nebulas with slow drift
                nebulas.forEach((nebula, index) => {
                    const depth = 200 + index * 100; // Nebulas in far background
                    const nebulaRotationX = backgroundRotationX * 0.2;
                    const nebulaRotationY = backgroundRotationY * 0.15;
                    
                    nebula.style.transform = `
                        translateZ(${depth}px)
                        rotateX(${nebulaRotationX}deg)
                        rotateY(${nebulaRotationY}deg)
                    `;
                });
                
                // Transform shooting stars
                shootingStars.forEach((shootingStar, index) => {
                    const depth = 20 + index * 30;
                    const shootingRotationX = backgroundRotationX * 1.5;
                    const shootingRotationY = backgroundRotationY * 1.1;
                    
                    shootingStar.style.transform = `
                        translateZ(${depth}px)
                        rotateX(${shootingRotationX}deg)
                        rotateY(${shootingRotationY}deg)
                    `;
                });
            }
        }

        // Perform 360° rotation animation
        function perform360Rotation() {
            if (isRotating) return;
            
            isRotating = true;
            businessCard.style.transition = 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            // Add 360 degrees to current rotation
            rotationY += 360;
            updateCardTransform();
            
            // Reset rotation after animation completes
            setTimeout(() => {
                rotationY = rotationY % 360; // Normalize rotation
                isRotating = false;
                businessCard.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }, 1200);
        }

        // Mouse down event for starting interaction
        businessCard.addEventListener('mousedown', (e) => {
            clickStartTime = Date.now();
            clickStartX = e.clientX;
            clickStartY = e.clientY;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
            isDragging = false;
            e.preventDefault();
        });

        // Mouse move event for drag rotation
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Check if we should start dragging
            if (clickStartTime > 0 && !isDragging) {
                const deltaX = e.clientX - clickStartX;
                const deltaY = e.clientY - clickStartY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                
                // Start dragging if mouse moved more than 8 pixels
                if (distance > 8) {
                    isDragging = true;
                    businessCard.style.cursor = 'grabbing';
                    businessCard.style.transition = 'none';
                }
            }
            
            if (isDragging) {
                // Calculate rotation based on mouse movement
                const deltaX = e.clientX - lastMouseX;
                const deltaY = e.clientY - lastMouseY;
                
                // Update rotation angles
                rotationY += deltaX * 0.8;
                rotationX -= deltaY * 0.8;
                
                // Keep vertical rotation within bounds
                rotationX = Math.max(-90, Math.min(90, rotationX));
                
                lastMouseX = e.clientX;
                lastMouseY = e.clientY;
                
                updateCardTransform();
            } else if (window.innerWidth > 768 && !isRotating && clickStartTime === 0) {
                // Subtle hover rotation when not interacting
                updateCardCenter();
                
                const deltaX = mouseX - cardCenterX;
                const deltaY = mouseY - cardCenterY;
                
                const hoverRotationY = (deltaX / window.innerWidth) * 12;
                const hoverRotationX = -(deltaY / window.innerHeight) * 8;
                
                const flipRotation = isCardFlipped ? 180 : 0;
                const totalHoverRotationX = Math.round(rotationX + hoverRotationX);
                const totalHoverRotationY = Math.round(flipRotation + rotationY + hoverRotationY);
                
                businessCard.style.transform = `translate3d(0, 0, 20px) scale3d(${currentScale}, ${currentScale}, 1) rotateX(${totalHoverRotationX}deg) rotateY(${totalHoverRotationY}deg)`;
                
                // Update background with hover effect (but not flip)
                if (spaceBackground) {
                    const backgroundRotationX = (rotationX + hoverRotationX) * 0.3;
                    const backgroundRotationY = (rotationY + hoverRotationY) * 0.2; // No flip for background
                    const backgroundScale = 1 + (currentScale - 1) * 0.1;
                    
                    spaceBackground.style.transform = `
                        perspective(2000px)
                        rotateX(${backgroundRotationX}deg)
                        rotateY(${backgroundRotationY}deg)
                        scale(${backgroundScale})
                    `;
                    
                    // Apply individual transforms to space elements for hover effect
                    const stars = spaceBackground.querySelectorAll('.star');
                    const planets = spaceBackground.querySelectorAll('.planet');
                    const comets = spaceBackground.querySelectorAll('.comet');
                    const nebulas = spaceBackground.querySelectorAll('.nebula');
                    const shootingStars = spaceBackground.querySelectorAll('.shooting-star');
                    
                    // Transform stars with depth variation
                    stars.forEach((star, index) => {
                        const depth = (index % 3) * 50 + 50;
                        const starRotationX = backgroundRotationX * (1 + index * 0.1);
                        const starRotationY = backgroundRotationY * (1 + index * 0.05);
                        
                        star.style.transform = `
                            translateZ(${depth}px)
                            rotateX(${starRotationX}deg)
                            rotateY(${starRotationY}deg)
                        `;
                    });
                    
                    // Transform planets with orbital motion
                    planets.forEach((planet, index) => {
                        const depth = 100 + index * 80;
                        const orbitalRotation = backgroundRotationY * (0.5 + index * 0.3);
                        const tiltRotation = backgroundRotationX * (0.8 + index * 0.2);
                        
                        planet.style.transform = `
                            translateZ(${depth}px)
                            rotateX(${tiltRotation}deg)
                            rotateY(${orbitalRotation}deg)
                            rotateZ(${orbitalRotation * 0.5}deg)
                        `;
                    });
                    
                    // Transform comets with trajectory adjustment
                    comets.forEach((comet, index) => {
                        const depth = 30 + index * 40;
                        const cometRotationX = backgroundRotationX * 1.2;
                        const cometRotationY = backgroundRotationY * 0.8;
                        
                        comet.style.transform = `
                            translateZ(${depth}px)
                            rotateX(${cometRotationX}deg)
                            rotateY(${cometRotationY}deg)
                        `;
                    });
                    
                    // Transform nebulas with slow drift
                    nebulas.forEach((nebula, index) => {
                        const depth = 200 + index * 100;
                        const nebulaRotationX = backgroundRotationX * 0.2;
                        const nebulaRotationY = backgroundRotationY * 0.15;
                        
                        nebula.style.transform = `
                            translateZ(${depth}px)
                            rotateX(${nebulaRotationX}deg)
                            rotateY(${nebulaRotationY}deg)
                        `;
                    });
                    
                    // Transform shooting stars
                    shootingStars.forEach((shootingStar, index) => {
                        const depth = 20 + index * 30;
                        const shootingRotationX = backgroundRotationX * 1.5;
                        const shootingRotationY = backgroundRotationY * 1.1;
                        
                        shootingStar.style.transform = `
                            translateZ(${depth}px)
                            rotateX(${shootingRotationX}deg)
                            rotateY(${shootingRotationY}deg)
                        `;
                    });
                }
            }
        });

        // Mouse up event for handling click or ending drag
        document.addEventListener('mouseup', (e) => {
            if (clickStartTime > 0) {
                const clickDuration = Date.now() - clickStartTime;
                const deltaX = e.clientX - clickStartX;
                const deltaY = e.clientY - clickStartY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                
                // Quick click = 360° rotation
                if (!isDragging && clickDuration < 250 && distance < 8) {
                    perform360Rotation();
                }
                // Long press = flip card (background stays still)
                else if (!isDragging && clickDuration >= 250 && distance < 15) {
                    isCardFlipped = !isCardFlipped;
                    // Only update card transform, background stays in current position
                    const flipRotation = isCardFlipped ? 180 : 0;
                    const totalRotationY = rotationY + flipRotation;
                    
                    businessCard.style.transform = `
                        scale(${currentScale})
                        rotateX(${rotationX}deg)
                        rotateY(${totalRotationY}deg)
                        translateZ(20px)
                    `;
                    // Background stays exactly where it is - no update
                }
                
                // Reset drag state
                if (isDragging) {
                    isDragging = false;
                    businessCard.style.cursor = 'pointer';
                    businessCard.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    updateCardTransform();
                }
                
                clickStartTime = 0;
            }
        });

        // Enhanced hover effects
        businessCard.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768 && !isDragging && !isRotating) {
                businessCard.style.transition = 'transform 0.1s ease-out';
            }
        });

        businessCard.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768 && !isDragging && !isRotating) {
                businessCard.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                updateCardTransform();
            }
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
                
                const zoomSpeed = 0.05;
                const maxScale = 1.3;
                const minScale = 0.8;
                
                if (e.deltaY < 0) {
                    // Scroll up - zoom in
                    currentScale = Math.min(currentScale + zoomSpeed, maxScale);
                } else {
                    // Scroll down - zoom out
                    currentScale = Math.max(currentScale - zoomSpeed, minScale);
                }
                
                updateCardTransform();
                
                // Add zoom classes for additional effects
                businessCard.classList.remove('zoomed-in', 'zoomed-out');
                if (currentScale > 1.1) {
                    businessCard.classList.add('zoomed-in');
                } else if (currentScale < 0.9) {
                    businessCard.classList.add('zoomed-out');
                }
            }
        }, { passive: false });

        // Keyboard controls - ensure flip doesn't affect background
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    perform360Rotation();
                    break;
                case 'f':
                case 'F':
                    e.preventDefault();
                    isCardFlipped = !isCardFlipped;
                    // Only update card, not background
                    const flipRotation = isCardFlipped ? 180 : 0;
                    const totalRotationY = rotationY + flipRotation;
                    
                    businessCard.style.transform = `
                        scale(${currentScale})
                        rotateX(${rotationX}deg)
                        rotateY(${totalRotationY}deg)
                        translateZ(20px)
                    `;
                    // Background stays exactly where it is
                    break;
                case '+':
                case '=':
                    e.preventDefault();
                    currentScale = Math.min(1.3, currentScale + 0.05);
                    updateCardTransform();
                    break;
                case '-':
                    e.preventDefault();
                    currentScale = Math.max(0.8, currentScale - 0.05);
                    updateCardTransform();
                    break;
                case 'Escape':
                    e.preventDefault();
                    // Reset all rotations and scale
                    rotationX = 0;
                    rotationY = 0;
                    currentScale = 1;
                    isCardFlipped = false;
                    updateCardTransform();
                    break;
                case 'r':
                case 'R':
                    e.preventDefault();
                    startAutoRotation();
                    break;
            }
        });

        // Auto rotation feature
        function startAutoRotation() {
            if (isRotating) {
                isRotating = false;
                businessCard.classList.remove('rotating');
                return;
            }
            
            isRotating = true;
            businessCard.classList.add('rotating');
            
            // Perform 360° rotation
            const startRotationY = rotationY;
            const targetRotationY = startRotationY + 360;
            const duration = 3000; // 3 seconds
            const startTime = Date.now();
            
            function animate() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeInOut = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                const easedProgress = easeInOut(progress);
                
                rotationY = startRotationY + (targetRotationY - startRotationY) * easedProgress;
                updateCardTransform();
                
                if (progress < 1 && isRotating) {
                    requestAnimationFrame(animate);
                } else {
                    isRotating = false;
                    businessCard.classList.remove('rotating');
                    rotationY = rotationY % 360; // Normalize rotation
                }
            }
            
            animate();
        }

        // Update card center on window resize
        window.addEventListener('resize', updateCardCenter);
        
        // Initialize card center
        updateCardCenter();

        // Mobile touch interactions
        if (window.innerWidth <= 768) {
            let touchStartY = 0;
            let touchStartX = 0;
            let touchStartTime = 0;
            let touchMoved = false;
            
            businessCard.addEventListener('touchstart', (e) => {
                touchStartY = e.touches[0].clientY;
                touchStartX = e.touches[0].clientX;
                touchStartTime = Date.now();
                touchMoved = false;
                lastMouseX = touchStartX;
                lastMouseY = touchStartY;
            });
            
            businessCard.addEventListener('touchmove', (e) => {
                touchMoved = true;
                const touch = e.touches[0];
                const deltaX = touch.clientX - lastMouseX;
                const deltaY = touch.clientY - lastMouseY;
                
                rotationY += deltaX * 0.8;
                rotationX -= deltaY * 0.8;
                
                rotationX = Math.max(-90, Math.min(90, rotationX));
                
                lastMouseX = touch.clientX;
                lastMouseY = touch.clientY;
                
                updateCardTransform();
                e.preventDefault();
            });
            
            businessCard.addEventListener('touchend', (e) => {
                const touchEndY = e.changedTouches[0].clientY;
                const touchEndX = e.changedTouches[0].clientX;
                const touchDuration = Date.now() - touchStartTime;
                const deltaY = touchStartY - touchEndY;
                const deltaX = touchStartX - touchEndX;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                
                // Quick tap = 360° rotation
                if (!touchMoved && touchDuration < 250 && distance < 20) {
                    perform360Rotation();
                }
                // Long tap = flip card (background stays still)
                else if (!touchMoved && touchDuration >= 250 && distance < 30) {
                    isCardFlipped = !isCardFlipped;
                    // Only update card transform, background stays in current position
                    const flipRotation = isCardFlipped ? 180 : 0;
                    const totalRotationY = rotationY + flipRotation;
                    
                    businessCard.style.transform = `
                        scale(${currentScale})
                        rotateX(${rotationX}deg)
                        rotateY(${totalRotationY}deg)
                        translateZ(20px)
                    `;
                    // Background stays exactly where it is - no update
                }
                // Swipe gesture for zoom
                else if (Math.abs(deltaY) > 50 && Math.abs(deltaY) > Math.abs(deltaX)) {
                    if (deltaY > 0) {
                        // Swipe up - zoom in
                        currentScale = Math.min(currentScale + 0.1, 1.3);
                    } else {
                        // Swipe down - zoom out
                        currentScale = Math.max(currentScale - 0.1, 0.8);
                    }
                    updateCardTransform();
                }
            });
        }

        // Initialize transform
        updateCardTransform();
    }

    // Cursor Trail Effect
    const createCursorTrail = () => {
        let trail = [];
        const maxTrailLength = 15;
        
        document.addEventListener('mousemove', (e) => {
            // Only show trail when over the card
            if (!businessCard) return;
            
            const cardRect = businessCard.getBoundingClientRect();
            const isOverCard = (
                e.clientX >= cardRect.left &&
                e.clientX <= cardRect.right &&
                e.clientY >= cardRect.top &&
                e.clientY <= cardRect.bottom
            );
            
            if (!isOverCard) return;
            
            trail.push({
                x: e.clientX,
                y: e.clientY,
                time: Date.now()
            });
            
            if (trail.length > maxTrailLength) {
                trail.shift();
            }
            
            // Remove old trail elements
            document.querySelectorAll('.cursor-trail').forEach(el => el.remove());
            
            // Create new trail elements
            trail.forEach((point, index) => {
                const trailElement = document.createElement('div');
                trailElement.className = 'cursor-trail';
                trailElement.style.cssText = `
                    position: fixed;
                    left: ${point.x}px;
                    top: ${point.y}px;
                    width: ${3 + index * 0.3}px;
                    height: ${3 + index * 0.3}px;
                    background: radial-gradient(circle, rgba(147, 112, 219, ${0.8 - index * 0.05}), transparent);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    transform: translate(-50%, -50%);
                    animation: trailFade 0.6s ease-out forwards;
                `;
                document.body.appendChild(trailElement);
                
                setTimeout(() => {
                    if (trailElement.parentNode) {
                        trailElement.parentNode.removeChild(trailElement);
                    }
                }, 600);
            });
        });
    };

    // Initialize cursor trail
    createCursorTrail();

    // Add CSS for trail animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes trailFade {
            0% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
            100% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.3);
            }
        }
        
        .business-card {
            cursor: pointer;
            transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .business-card.rotating {
            transition: none;
        }
    `;
    document.head.appendChild(style);
}); 