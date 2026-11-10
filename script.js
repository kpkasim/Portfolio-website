// --- Custom Cursor (Desktop / Fine Pointer Only) ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (cursorDot && cursorOutline) {
    if (isFinePointer) {
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
    } else {
        cursorDot.style.display = 'none';
        cursorOutline.style.display = 'none';
    }
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

// --- Dark Mode / Light Mode System ---
window.toggleSiteTheme = window.toggleSiteTheme || function(e) {
    if (e) {
        try { e.preventDefault(); e.stopPropagation(); } catch(err) {}
    }
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    try { localStorage.setItem('theme', nextTheme); } catch(err) {}
};

document.querySelectorAll('.theme-toggle').forEach(toggle => {
    toggle.onclick = window.toggleSiteTheme;
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

// --- EDITORIAL DIRECT MESSAGE TOGGLE ---
const toggleDirectMsg = document.getElementById('toggleDirectMsg');
const collapsibleForm = document.getElementById('collapsibleFormContainer');
const formToggleArrow = document.getElementById('formToggleArrow');

if (toggleDirectMsg && collapsibleForm) {
    toggleDirectMsg.addEventListener('click', () => {
        const isHidden = collapsibleForm.style.display === 'none' || collapsibleForm.style.display === '';
        collapsibleForm.style.display = isHidden ? 'block' : 'none';
        if (formToggleArrow) {
            formToggleArrow.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
        }
    });
}


// --- Cinematic Laser Intro Controller ---
const cinematicIntro = document.getElementById('cinematicIntro');
const skipIntroBtn = document.getElementById('skipIntroBtn');

if (cinematicIntro) {
    let introFinished = false;

    // Temporarily lock body scroll during the intro
    document.body.style.overflow = 'hidden';

    const finishIntro = () => {
        if (introFinished) return;
        introFinished = true;

        cinematicIntro.classList.add('fade-out');
        document.body.style.overflow = '';

        setTimeout(() => {
            cinematicIntro.style.display = 'none';
        }, 950);
    };

    // Auto-transition to hero section after ~4.8s
    const autoTimer = setTimeout(finishIntro, 4800);

    // Skip button click
    if (skipIntroBtn) {
        skipIntroBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            clearTimeout(autoTimer);
            finishIntro();
        });
    }

    // Click anywhere on overlay to skip
    cinematicIntro.addEventListener('click', () => {
        clearTimeout(autoTimer);
        finishIntro();
    });

    // Keyboard shortcut (Escape or Space) to skip
    window.addEventListener('keydown', (e) => {
        if (!introFinished && (e.key === 'Escape' || e.code === 'Space')) {
            clearTimeout(autoTimer);
            finishIntro();
        }
    });
}

