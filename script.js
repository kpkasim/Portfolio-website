const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    // Toggle Nav
    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');

        // Burger Animation
        burger.classList.toggle('toggle');
    });

    // Close nav when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
            }
        });
    });
}

// Add burger animation css dynamically
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

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Update Year dynamically
document.getElementById('year').textContent = new Date().getFullYear();


// --- Theme Toggle Logic ---
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = themeToggleBtn.querySelector('i');
const htmlElement = document.documentElement;

// Check for saved theme in local storage, else default to dark based on user image preference
const savedTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}


// --- Contact Form & Modal Logic ---
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
    // Important: Removed /u/0/ from URL to ensure it doesn't break if not logged into Google
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
