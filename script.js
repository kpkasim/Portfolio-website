// --- Custom Cursor ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Add a slight delay to the outline for a smooth effect
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// --- Navbar Mobile Menu ---
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
            }
        });
    });
}

// Burger animation styles
const style = document.createElement('style');
style.innerHTML = `
    .burger.toggle .line1 {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    .burger.toggle .line2 {
        opacity: 0;
    }
    .burger.toggle .line3 {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(style);

navSlide();

// --- Smooth Scrolling ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

document.getElementById('year').textContent = new Date().getFullYear();

// --- Theme Toggle (Checkbox based) ---
const themeCheckbox = document.getElementById('theme-toggle-checkbox');
const htmlElement = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', savedTheme);
if(savedTheme === 'dark') {
    themeCheckbox.checked = false; // Slider is on the left (Sun)
} else {
    themeCheckbox.checked = true;  // Slider is on the right (Moon)
}

themeCheckbox.addEventListener('change', (e) => {
    if (e.target.checked) {
        // Switched to Light mode
        htmlElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    } else {
        // Switched to Dark mode
        htmlElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
});


// --- Intersection Observer for Fade-Up Animations ---
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach((el) => {
    observer.observe(el);
});


// --- Contact Form & Modal Logic ---
const contactForm = document.getElementById('contactForm');
const popupModal = document.getElementById('popupModal');
const closeModalBtn = document.getElementById('closeModal');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        popupModal.classList.add('show');
        contactForm.reset();
    });
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        popupModal.classList.remove('show');
    });
}

window.addEventListener('click', (e) => {
    if (e.target === popupModal) {
        popupModal.classList.remove('show');
    }
});
