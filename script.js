// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Custom Cursor
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

gsap.set([cursor, follower], { xPercent: -50, yPercent: -50 });

window.addEventListener('mousemove', (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
    gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.5 });
});

// Cursor interactions
const interactiveElements = document.querySelectorAll('a, button, .menu-toggle, .project-item');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(cursor, { scale: 2, duration: 0.3 });
        gsap.to(follower, { scale: 1.5, duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(cursor, { scale: 1, duration: 0.3 });
        gsap.to(follower, { scale: 1, duration: 0.3 });
    });
});

// Bouncing Ball Loader Animation with Progress Bar
const loaderBall = document.querySelector('.loader-ball');
const loader = document.querySelector('.loader');
const progressBar = document.querySelector('.progress-bar');
const progressText = document.querySelector('.progress-text');

// Create bounce animation
const bounceTimeline = gsap.timeline({ repeat: -1 });

bounceTimeline
    .to(loaderBall, {
        y: -100,
        duration: 0.5,
        ease: 'power2.out'
    })
    .to(loaderBall, {
        y: 0,
        duration: 0.5,
        ease: 'bounce.out'
    })
    .to(loaderBall, {
        scaleX: 1.1,
        scaleY: 0.9,
        duration: 0.1,
        ease: 'power1.inOut'
    }, '-=0.1')
    .to(loaderBall, {
        scaleX: 1,
        scaleY: 1,
        duration: 0.1,
        ease: 'power1.inOut'
    });

// Simulate loading progress (5-6 seconds)
let progress = 0;
const loadingDuration = 5500; // 5.5 seconds
const intervalTime = 50; // Update every 50ms
const incrementAmount = (100 / (loadingDuration / intervalTime));

const progressInterval = setInterval(() => {
    progress += incrementAmount + Math.random() * 2; // Add some randomness
    
    if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
        
        // Update final progress
        progressBar.style.width = '100%';
        progressText.textContent = '100%';
        
        // Stop the bounce animation
        bounceTimeline.pause();
        
        // Reset ball position and scale
        gsap.to(loaderBall, {
            y: 0,
            scaleX: 1,
            scaleY: 1,
            duration: 0.3,
            ease: 'power2.inOut',
            onComplete: () => {
                // Ball explosion animation
                const explosionTimeline = gsap.timeline({
                    onComplete: () => {
                        loader.style.display = 'none';
                        initAnimations();
                    }
                });

                explosionTimeline
                    // Rapid expansion
                    .to(loaderBall, {
                        scale: 50,
                        duration: 0.8,
                        ease: 'power2.in'
                    })
                    // Fade out the entire loader
                    .to(loader, {
                        opacity: 0,
                        duration: 0.4,
                        ease: 'power2.inOut'
                    }, '-=0.3');
            }
        });
    } else {
        // Update progress bar and text
        progressBar.style.width = progress + '%';
        progressText.textContent = Math.floor(progress) + '%';
    }
}, intervalTime);

// Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const fullscreenMenu = document.querySelector('.fullscreen-menu');
const menuLinks = document.querySelectorAll('.menu-links li');
let menuOpen = false;

menuToggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    
    if (menuOpen) {
        fullscreenMenu.style.visibility = 'visible';
        
        gsap.to(fullscreenMenu, {
            opacity: 1,
            duration: 0.6,
            ease: 'power3.inOut'
        });
        
        gsap.to('.menu-line:nth-child(1)', {
            rotation: 45,
            y: 7,
            duration: 0.4,
            ease: 'power3.inOut'
        });
        
        gsap.to('.menu-line:nth-child(2)', {
            opacity: 0,
            duration: 0.2
        });
        
        gsap.to('.menu-line:nth-child(3)', {
            rotation: -45,
            y: -7,
            duration: 0.4,
            ease: 'power3.inOut'
        });
        
        gsap.fromTo('.menu-links li', 
            {
                y: 100,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                delay: 0.2
            }
        );
        
    } else {
        gsap.to('.menu-links li', {
            y: -50,
            opacity: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: 'power3.in'
        });
        
        gsap.to(fullscreenMenu, {
            opacity: 0,
            duration: 0.5,
            delay: 0.3,
            ease: 'power3.inOut',
            onComplete: () => {
                fullscreenMenu.style.visibility = 'hidden';
            }
        });
        
        gsap.to('.menu-line:nth-child(1)', {
            rotation: 0,
            y: 0,
            duration: 0.4,
            ease: 'power3.inOut'
        });
        
        gsap.to('.menu-line:nth-child(2)', {
            opacity: 1,
            duration: 0.2,
            delay: 0.1
        });
        
        gsap.to('.menu-line:nth-child(3)', {
            rotation: 0,
            y: 0,
            duration: 0.4,
            ease: 'power3.inOut'
        });
    }
});

// Close menu on link click
menuLinks.forEach(link => {
    link.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.querySelector('a').getAttribute('href');
        
        menuOpen = false;
        
        gsap.to('.menu-links li', {
            y: -50,
            opacity: 0,
            duration: 0.4,
            stagger: 0.05
        });
        
        gsap.to(fullscreenMenu, {
            opacity: 0,
            duration: 0.5,
            delay: 0.2,
            onComplete: () => {
                fullscreenMenu.style.visibility = 'hidden';
                
                const target = document.querySelector(targetId);
                if (target) {
                    gsap.to(window, {
                        duration: 1.5,
                        scrollTo: {
                            y: target,
                            offsetY: 0
                        },
                        ease: 'power3.inOut'
                    });
                }
            }
        });
        
        gsap.to('.menu-line:nth-child(1)', {
            rotation: 0,
            y: 0,
            duration: 0.4
        });
        
        gsap.to('.menu-line:nth-child(2)', {
            opacity: 1,
            duration: 0.2
        });
        
        gsap.to('.menu-line:nth-child(3)', {
            rotation: 0,
            y: 0,
            duration: 0.4
        });
    });
});


// Theme Transition Based on Scroll Position
// function initThemeTransitions() {
//     const body = document.body;
//     const skillsSection = document.querySelector('#skills');
//     const footer = document.querySelector('footer');
    
//     // Create ScrollTrigger for dark theme (starts at skills section)
//     ScrollTrigger.create({
//         trigger: skillsSection,
//         start: 'top 50%',
//         end: () => `${footer.offsetTop - window.innerHeight / 2}`,
//         onEnter: () => {
//             body.classList.add('dark-theme');
//         },
//         onLeave: () => {
//             body.classList.remove('dark-theme');
//         },
//         onEnterBack: () => {
//             body.classList.add('dark-theme');
//         },
//         onLeaveBack: () => {
//             body.classList.remove('dark-theme');
//         }
//     });
// }

// Initialize Animations
function initAnimations() {
    // Initialize theme transitions
    // initThemeTransitions();
    
    // Hero animations
    const heroTl = gsap.timeline();
    
    heroTl
        .from('.hero-label', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out'
        }, 0)
        .from('.word', {
            y: '100%',
            duration: 1,
            stagger: 0.15,
            ease: 'power4.out'
        }, 0.2)
        .from('.hero-subtitle', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power3.out'
        }, 0.6)
        .from('.scroll-down', {
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, 0.8);
    
    // Floating text parallax
    gsap.to('.floating-text', {
        yPercent: 50,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        }
    });
    
    // Section animations
    gsap.utils.toArray('.section-label').forEach(label => {
        gsap.from(label, {
            opacity: 0,
            x: -30,
            duration: 1,
            scrollTrigger: {
                trigger: label,
                start: 'top 85%',
                end: 'top 65%',
                scrub: 1
            }
        });
    });
    
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                end: 'top 60%',
                scrub: 1
            }
        });
    });
    
    // About section
    ScrollTrigger.create({
        trigger: '.about-image-wrapper',
        start: 'top 70%',
        onEnter: () => {
            gsap.to('.image-overlay', {
                scaleY: 0,
                duration: 1.2,
                ease: 'power4.inOut'
            });
        }
    });
    
    gsap.utils.toArray('.about-text p').forEach((p, i) => {
        gsap.from(p, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            scrollTrigger: {
                trigger: p,
                start: 'top 80%',
                end: 'top 60%',
                scrub: 1
            }
        });
    });
    
    // Image parallax
    gsap.to('.about-image img', {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
            trigger: '.about-image-wrapper',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        }
    });

    // Skills grid animation
    gsap.utils.toArray('.skill-item').forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%'
            },
            opacity: 0,
            y: 80,
            duration: 1,
            delay: (index % 3) * 0.15,
            ease: 'power3.out'
        });
    });

    // Projects hover with image preview
    const projectItems = document.querySelectorAll('.project-item');
    const projectPreview = document.querySelector('.project-image-preview');
    const projectIcons = ['🎯', '🔢', '🌤️', '✂️', '💼', '🍕', '💕'];

    projectItems.forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%'
            },
            opacity: 0,
            x: -100,
            duration: 1,
            ease: 'power3.out'
        });

        item.addEventListener('mouseenter', (e) => {
            projectPreview.textContent = projectIcons[index];
            gsap.to(projectPreview, {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                ease: 'power2.out'
            });
        });

        item.addEventListener('mousemove', (e) => {
            gsap.to(projectPreview, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(projectPreview, {
                opacity: 0,
                scale: 0.8,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
    });

    // Awards animation
    gsap.utils.toArray('.award-item').forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%'
            },
            opacity: 0,
            x: index % 2 === 0 ? -50 : 50,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Contact section animations
    gsap.from('.contact-title', {
        scrollTrigger: {
            trigger: '.contact-content',
            start: 'top 75%'
        },
        opacity: 0,
        y: 100,
        duration: 1.2,
        ease: 'power4.out'
    });

    gsap.from('.contact-email', {
        scrollTrigger: {
            trigger: '.contact-content',
            start: 'top 70%'
        },
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
    });

    gsap.from('.social-link', {
        scrollTrigger: {
            trigger: '.contact-content',
            start: 'top 70%'
        },
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        delay: 0.5,
        ease: 'power2.out'
    });

    // Footer animation
    gsap.from('footer', {
        scrollTrigger: {
            trigger: 'footer',
            start: 'top 90%'
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
    });

    // Magnetic effect for contact email
    const contactEmail = document.querySelector('.contact-email');
    contactEmail.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(this, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    contactEmail.addEventListener('mouseleave', function() {
        gsap.to(this, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)'
        });
    });

    // Stagger reveal for project numbers
    gsap.utils.toArray('.project-number').forEach(num => {
        gsap.from(num, {
            scrollTrigger: {
                trigger: num,
                start: 'top 90%'
            },
            opacity: 0,
            scale: 0,
            duration: 0.6,
            ease: 'back.out(1.7)'
        });
    });
}

// Smooth scroll for hash links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if (!this.closest('.menu-links')) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: {
                        y: target,
                        offsetY: 0
                    },
                    ease: 'power3.inOut'
                });
            }
        }
    });
});