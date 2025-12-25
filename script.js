// Smooth Scroll with Offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.nav').offsetHeight;
            const targetPosition = target.offsetTop - navHeight - 40;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for Project Animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all projects
document.querySelectorAll('.project').forEach(project => {
    observer.observe(project);
});

// Navigation Active State
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

function updateActiveNav() {
    const scrollPos = window.pageYOffset + 200;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.style.color = 'var(--gray-500)';
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.style.color = 'var(--black)';
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// Header Hide/Show on Scroll
let lastScroll = 0;
const nav = document.querySelector('.nav');
const navHeight = nav.offsetHeight;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > navHeight * 2) {
        if (currentScroll > lastScroll) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
    } else {
        nav.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// Parallax Effect on Project Images
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const projects = document.querySelectorAll('.project');
    
    projects.forEach((project, index) => {
        const projectTop = project.offsetTop;
        const projectHeight = project.offsetHeight;
        const windowHeight = window.innerHeight;
        
        if (scrolled + windowHeight > projectTop && scrolled < projectTop + projectHeight) {
            const preview = project.querySelector('.preview-image');
            if (preview) {
                const speed = 0.1;
                const yPos = (scrolled - projectTop) * speed;
                preview.style.transform = `translateY(${yPos}px) scale(1.05)`;
            }
        }
    });
});

// Hover effect for project previews
const projectPreviews = document.querySelectorAll('.preview-container');

projectPreviews.forEach(preview => {
    preview.addEventListener('mousemove', (e) => {
        const rect = preview.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;
        
        const image = preview.querySelector('.preview-image');
        image.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    
    preview.addEventListener('mouseleave', () => {
        const image = preview.querySelector('.preview-image');
        image.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// Magnetic effect for contact methods
const contactMethods = document.querySelectorAll('.contact-method');

contactMethods.forEach(method => {
    method.addEventListener('mousemove', (e) => {
        const rect = method.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        method.style.transform = `translate(${deltaX * 10}px, ${deltaY * 5}px)`;
    });
    
    method.addEventListener('mouseleave', () => {
        method.style.transform = 'translate(0, 0)';
    });
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        window.scrollBy({ 
            top: window.innerHeight * 0.6, 
            behavior: 'smooth' 
        });
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        window.scrollBy({ 
            top: -window.innerHeight * 0.6, 
            behavior: 'smooth' 
        });
    }
});

// Page Load Animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.8s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Efficient Resize Handler
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        updateActiveNav();
    }, 250);
});

// Prevent text selection during rapid clicks
document.addEventListener('selectstart', (e) => {
    if (e.target.closest('.project-link') || 
        e.target.closest('.nav-menu') || 
        e.target.closest('.contact-method')) {
        e.preventDefault();
    }
});

// Console Easter Egg
const consoleStyles = {
    title: 'font-size: 24px; font-weight: 700; color: #000; margin-bottom: 8px;',
    text: 'font-size: 14px; color: #525252; line-height: 1.6;',
    link: 'font-size: 13px; color: #2563eb; text-decoration: underline;'
};

console.log('%c👋 Hello there!', consoleStyles.title);
console.log('%cThanks for taking the time to explore my work.', consoleStyles.text);
console.log('%cI\'m currently studying at Parsons and always excited to connect with fellow designers and creative minds.', consoleStyles.text);
console.log('%c\nLet\'s connect:', consoleStyles.text);
console.log('%cEmail: devswaroop04@gmail.com', consoleStyles.link);
console.log('%cLinkedIn: linkedin.com/in/dev-s-srivastava-90a651202/', consoleStyles.link);
console.log('%c\n✨ Built with care in New York', consoleStyles.text);

// Smooth scroll indicator visibility
const heroScroll = document.querySelector('.hero-scroll');
if (heroScroll) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (scrolled > 100) {
            heroScroll.style.opacity = '0';
            heroScroll.style.pointerEvents = 'none';
        } else {
            heroScroll.style.opacity = '1';
            heroScroll.style.pointerEvents = 'auto';
        }
    });
}

// Add transition to hero scroll
if (heroScroll) {
    heroScroll.style.transition = 'opacity 0.3s ease';
}