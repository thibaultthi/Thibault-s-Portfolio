document.addEventListener('DOMContentLoaded', () => {
    // Theme toggling functionality
    const themeToggle = document.getElementById('theme-toggle');
    const toggleIcon = themeToggle.querySelector('.toggle-icon');
    
    // Function to set theme
    const setTheme = (theme) => {
        // Add a transition class to html to ensure all elements transition together
        document.documentElement.classList.add('theme-transitioning');
        
        // Set the theme attribute
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update the icon based on the theme
        if (theme === 'dark') {
            toggleIcon.classList.remove('fa-sun');
            toggleIcon.classList.add('fa-moon');
        } else {
            toggleIcon.classList.remove('fa-moon');
            toggleIcon.classList.add('fa-sun');
        }
        
        // Remove the transition class after the transition completes
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transitioning');
        }, 300); // Slightly longer than our CSS transition to ensure completion
    };
    
    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (prefersDark) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        themeToggle.classList.add('clicked');
        
        // Remove class after animation completes
        setTimeout(() => {
            themeToggle.classList.remove('clicked');
        }, 300);
        
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });

    // Update footer year
    const yearSpan = document.querySelector('.footer p:last-child');
    if (yearSpan) {
        yearSpan.textContent = `© ${new Date().getFullYear()} All rights reserved`;
    }

    // Navigation elements
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Add background to navbar when scrolled
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Typing animation
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        // Clear any existing content
        typingText.textContent = '';
        
        const phrases = [
            'Product Manager',
            'Problem Solver',
            'Tech Enthusiast',
            'Web Creator',
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function typeEffect() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                charIndex--;
                typingSpeed = 50;
            } else {
                charIndex++;
                typingSpeed = 100;
            }

            typingText.textContent = currentPhrase.substring(0, charIndex);

            if (!isDeleting && charIndex === currentPhrase.length) {
                // Pause at the end of typing
                isDeleting = true;
                typingSpeed = 2000; // Pause before deleting
            } else if (isDeleting && charIndex === 0) {
                // Move to next phrase
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 500; // Pause before typing next phrase
            }

            setTimeout(typeEffect, typingSpeed);
        }

        // Start typing animation immediately
        typeEffect();
    }

    // Skill progress bars animation
    const skillItems = document.querySelectorAll('.skill-item');
    
    const animateSkills = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.progress-bar');
                const progress = entry.target.dataset.progress;
                progressBar.style.transform = `scaleX(${progress / 100})`;
                observer.unobserve(entry.target);
            }
        });
    };

    const skillsObserver = new IntersectionObserver(animateSkills, {
        threshold: 0.5
    });

    skillItems.forEach(item => {
        skillsObserver.observe(item);
    });

    // Projects filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    const filterProjects = (category) => {
        projectCards.forEach(card => {
            const cardCategory = card.dataset.category;
            
            if (category === 'all' || cardCategory === category) {
                card.classList.remove('hide');
                card.classList.add('fade-in');
            } else {
                card.classList.add('hide');
                card.classList.remove('fade-in');
            }
        });
    };

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter projects
            const category = btn.dataset.filter;
            filterProjects(category);
        });
    });

    // Initialize Intersection Observer for project cards animation
    const projectsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                projectsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    projectCards.forEach(card => {
        projectsObserver.observe(card);
    });

    // Contact Form Validation and Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const formGroups = contactForm.querySelectorAll('.form-group');
        const submitBtn = contactForm.querySelector('.submit-btn');

        // Validation patterns
        const patterns = {
            name: /^[a-zA-Z\s]{2,30}$/,
            email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
            subject: /^.{2,50}$/,
            message: /^[\s\S]{10,500}$/
        };

        // Error messages
        const errorMessages = {
            name: 'Please enter a valid name (2-30 characters)',
            email: 'Please enter a valid email address',
            subject: 'Subject must be between 2-50 characters',
            message: 'Message must be between 10-500 characters'
        };

        // Validate single field
        function validateField(field) {
            const fieldName = field.getAttribute('name');
            const errorElement = field.closest('.form-group').querySelector('.error-message');
            
            if (!patterns[fieldName].test(field.value)) {
                errorElement.textContent = errorMessages[fieldName];
                errorElement.style.display = 'block';
                field.classList.add('invalid');
                return false;
            } else {
                errorElement.style.display = 'none';
                field.classList.remove('invalid');
                return true;
            }
        }

        // Add input event listeners to all fields
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            if (!input) return;

            input.addEventListener('input', () => {
                validateField(input);
            });

            input.addEventListener('blur', () => {
                if (input.value) {
                    validateField(input);
                }
            });
        });

        // Form submission
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validate all fields
            let isValid = true;
            formGroups.forEach(group => {
                const input = group.querySelector('input, textarea');
                if (!input) return;
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            if (!isValid) return;

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.querySelector('.btn-text').textContent = 'Sending...';

            try {
                // Get form data
                const formData = {
                    from_name: document.getElementById('name').value,
                    reply_to: document.getElementById('email').value,
                    subject: document.getElementById('subject').value,
                    message: document.getElementById('message').value
                };

                // Send email using EmailJS
                await emailjs.send(
                    'service_1rdct67', // Your Service ID
                    'template_7t2j5wd', // Your Template ID
                    formData,
                    'xiyq2GTzXY5dVsU24' // Public Key
                );
                
                // Show success message
                contactForm.reset();
                submitBtn.querySelector('.btn-text').textContent = 'Message Sent!';
                submitBtn.style.background = '#28a745';
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.querySelector('.btn-text').textContent = 'Send Message';
                    submitBtn.style.background = '';
                }, 3000);

            } catch (error) {
                console.error('Email error:', error);
                // Show error message
                submitBtn.disabled = false;
                submitBtn.querySelector('.btn-text').textContent = 'Error! Try Again';
                submitBtn.style.background = '#dc3545';
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.querySelector('.btn-text').textContent = 'Send Message';
                    submitBtn.style.background = '';
                }, 3000);
            }
        });
    }

    // Initialize Intersection Observer for contact section animation
    const contactSection = document.querySelector('.contact-content');
    if (contactSection) {
        const contactObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.contact-item').forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateX(0)';
                        }, index * 200);
                    });
                    contactObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        contactObserver.observe(contactSection);
        // Initialize contact items for animation
        contactSection.querySelectorAll('.contact-item').forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = 'all 0.5s ease';
        });
    }

    // Toggle mobile menu
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(link => link.classList.remove('active'));
            link.classList.add('active');
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Timeline scroll animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                timelineObserver.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, {
        threshold: 0.2, // Start animation when 20% of the item is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before the item comes into view
    });

    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
}); 