// --- Custom Cursor ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });
}

// --- Smooth Scrolling for Navigation ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            
            // Update active state in nav pills
            const parentPill = this.closest('.nav-pill');
            if(parentPill) {
                parentPill.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                this.classList.add('active');
            }
        }
    });
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

// --- Dark Mode Toggle ---
const themeToggles = document.querySelectorAll('.theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';

if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggles.forEach(toggle => {
        toggle.innerHTML = '<i class="fas fa-sun"></i>';
    });
}

themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeToggles.forEach(t => t.innerHTML = '<i class="fas fa-moon"></i>');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggles.forEach(t => t.innerHTML = '<i class="fas fa-sun"></i>');
        }
    });
});
// --- Contact Form & Google Form Logic ---
const contactForm = document.getElementById('contactForm');
const popupModal = document.getElementById('popupModal');
const closeModalBtn = document.getElementById('closeModal');

if (contactForm) {
    // 1. Create a hidden iframe to receive the Google Form response silently
    const iframe = document.createElement('iframe');
    iframe.name = 'hidden_iframe';
    iframe.id = 'hidden_iframe';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    // 2. Create a hidden form pointing to Google Forms
    const gForm = document.createElement('form');
    gForm.action = 'https://docs.google.com/forms/d/e/1FAIpQLSf-r0SukmNLLiy5Q2bQQdxhqrpVWYHOm-XG2KnuPYeFVxZLkw/formResponse';
    gForm.method = 'POST';
    gForm.target = 'hidden_iframe';
    gForm.style.display = 'none';
    
    // Google Form entry names
    const entryNames = ['entry.1990858110', 'entry.1001712759', 'entry.510023503', 'entry.1795259233'];
    const hiddenInputs = entryNames.map(name => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        gForm.appendChild(input);
        return input;
    });
    document.body.appendChild(gForm);

    let isSubmitting = false;

    // 3. When the iframe loads, it means the form was submitted
    iframe.addEventListener('load', function() {
        if (isSubmitting) {
            popupModal.classList.add('show');
            contactForm.reset();
            isSubmitting = false;
        }
    });

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default UI form submission
        
        // 4. Map UI form values to hidden Google Form
        const formData = new FormData(contactForm);
        hiddenInputs[0].value = formData.get('name');
        hiddenInputs[1].value = formData.get('email');
        hiddenInputs[2].value = formData.get('phone');
        hiddenInputs[3].value = formData.get('message');

        isSubmitting = true;
        gForm.submit(); // Submit the hidden form
    });
}

// Close Modal when clicking the close button
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        popupModal.classList.remove('show');
    });
}

// Close Modal when clicking outside the modal content
window.addEventListener('click', (e) => {
    if (e.target === popupModal) {
        popupModal.classList.remove('show');
    }
});
