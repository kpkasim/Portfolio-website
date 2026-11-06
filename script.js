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
}

themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
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

// --- INTERACTIVE WAVE PLAYGROUND ---
const waveCanvas = document.getElementById('waveCanvas');
const waveSpeedSlider = document.getElementById('waveSpeed');
const waveMotionToggle = document.getElementById('waveMotionToggle');
const waveMotionText = document.getElementById('waveMotionText');

if (waveCanvas) {
    const ctx = waveCanvas.getContext('2d');
    let animationFrameId;
    let time = 0;
    let isPaused = false;
    let speed = 1.0;

    let baseFreq = 0.008;
    let targetFreq = 0.008;
    let currentFreq = 0.008;

    let baseAmp = 32;
    let targetAmp = 32;
    let currentAmp = 32;

    function resizeCanvas() {
        const rect = waveCanvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        waveCanvas.width = rect.width * dpr;
        waveCanvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse movement interaction
    waveCanvas.addEventListener('mousemove', (e) => {
        const rect = waveCanvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const normX = Math.max(0, Math.min(1, mouseX / rect.width));
        const normY = Math.max(0, Math.min(1, mouseY / rect.height));

        // Modulate frequency and amplitude
        targetFreq = 0.004 + normX * 0.016;
        targetAmp = 18 + (1 - normY) * 38;
    });

    waveCanvas.addEventListener('mouseleave', () => {
        targetFreq = baseFreq;
        targetAmp = baseAmp;
    });

    // Speed slider
    if (waveSpeedSlider) {
        waveSpeedSlider.addEventListener('input', (e) => {
            speed = parseFloat(e.target.value) || 1.0;
        });
    }

    // Pause/Resume Motion Toggle
    if (waveMotionToggle) {
        waveMotionToggle.addEventListener('click', () => {
            isPaused = !isPaused;
            if (isPaused) {
                if (waveMotionText) waveMotionText.textContent = 'Play motion';
                waveMotionToggle.innerHTML = '<span id="waveMotionText">Play motion</span> <span class="wave-motion-symbol">▶</span>';
            } else {
                waveMotionToggle.innerHTML = '<span id="waveMotionText">Pause motion</span> <span class="wave-motion-symbol">II</span>';
            }
        });
    }

    // Render Loop
    function draw() {
        const rect = waveCanvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const centerY = height / 2;

        ctx.clearRect(0, 0, width, height);

        // Smooth interpolation
        currentFreq += (targetFreq - currentFreq) * 0.05;
        currentAmp += (targetAmp - currentAmp) * 0.05;

        // Faint background harmonics
        const harmonicWaves = [
            { freqMul: 0.8, ampMul: 0.6, phase: 0.5, color: 'rgba(50, 95, 180, 0.18)', width: 1.2 },
            { freqMul: 1.2, ampMul: 0.8, phase: 1.2, color: 'rgba(55, 110, 205, 0.22)', width: 1.2 },
            { freqMul: 0.9, ampMul: 0.7, phase: 2.1, color: 'rgba(60, 120, 225, 0.28)', width: 1.4 },
            { freqMul: 1.1, ampMul: 0.9, phase: 3.4, color: 'rgba(65, 130, 240, 0.35)', width: 1.5 }
        ];

        harmonicWaves.forEach(w => {
            ctx.beginPath();
            ctx.strokeStyle = w.color;
            ctx.lineWidth = w.width;
            ctx.shadowBlur = 0;

            for (let x = 0; x <= width; x += 3) {
                const y = centerY + Math.sin(x * currentFreq * w.freqMul + time * 0.8 + w.phase) * (currentAmp * w.ampMul);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        });

        // Main highlighted vibrant wave
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(78, 145, 255, 1)';
        ctx.lineWidth = 2.8;
        ctx.shadowColor = 'rgba(78, 145, 255, 0.7)';
        ctx.shadowBlur = 10;

        let dotX = width * 0.58;
        let dotY = centerY;

        for (let x = 0; x <= width; x += 2) {
            const y = centerY + Math.sin(x * currentFreq + time) * currentAmp;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);

            if (Math.abs(x - dotX) < 2) {
                dotY = y;
            }
        }
        ctx.stroke();

        // Glowing orange/coral dot (as in screenshot)
        ctx.shadowColor = 'rgba(255, 120, 75, 0.8)';
        ctx.shadowBlur = 12;

        // Outer subtle halo
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 120, 75, 0.25)';
        ctx.arc(dotX, dotY, 9, 0, Math.PI * 2);
        ctx.fill();

        // Inner solid dot
        ctx.beginPath();
        ctx.fillStyle = '#ff7849';
        ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
        ctx.fill();

        // White core reflection
        ctx.beginPath();
        ctx.fillStyle = '#ffffff';
        ctx.arc(dotX - 1, dotY - 1, 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        if (!isPaused) {
            time += 0.025 * speed;
        }

        animationFrameId = requestAnimationFrame(draw);
    }

    draw();
}

