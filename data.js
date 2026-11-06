/**
 * data.js - Shared Portfolio Data Store & Hydration Engine
 * Auto-generated via MQ Admin Panel
 */

const DEFAULT_PORTFOLIO_DATA = {
    "profile": {
        "name": "Muhammed Qasim",
        "role": "Multidisciplinary Designer",
        "heroSubtitle": "Hey, I'm a",
        "heroTitle": "Multidisciplinary<br>Designer X",
        "heroHeadline": "Shaping ideas<br>into reality.",
        "heroDescription": "Data-driven strategies and visually stunning designs that grow brands, boost visibility, and maximize ROI.",
        "aboutTitle": "Smart Strategies<br>Real Results<br>Meaningful Growth",
        "aboutDescription": "I combine creativity, technical skills, and AI-powered workflows to help your brand grow sustainably. From editing to graphic design, videography, and 3D modeling, I bring a multidisciplinary edge to every project.",
        "email": "kpkasim205@gmail.com",
        "phone": "+91 8606 1505 77",
        "phoneRaw": "+918606150577",
        "whatsapp": "https://wa.me/918606150577",
        "instagram": "https://instagram.com/mq_ads_",
        "pinterest": "https://pin.it/5X84F8n4U",
        "linkedin": "https://linkedin.com/in/MQ-Ads"
    },
    "works": [
        {
            "id": "w1",
            "title": "Commercial Reel",
            "type": "youtube",
            "url": "https://www.youtube.com/embed/LoBlCMDNKiE?rel=0&modestbranding=1&controls=0&autoplay=1&mute=1&loop=1&playlist=LoBlCMDNKiE",
            "category": "Video Production",
            "row": 1
        },
        {
            "id": "w2",
            "title": "Brand Visuals",
            "type": "instagram",
            "url": "https://www.instagram.com/p/DbgaO2shH4f/embed",
            "category": "Graphic Design",
            "row": 1
        },
        {
            "id": "w3",
            "title": "Creative Concept",
            "type": "instagram",
            "url": "https://www.instagram.com/p/Cxz4Z0mhsUM/embed",
            "category": "Graphic Design",
            "row": 1
        },
        {
            "id": "w4",
            "title": "Motion Campaign",
            "type": "youtube",
            "url": "https://www.youtube.com/embed/_ks_4cDSsfc?rel=0&modestbranding=1&controls=0&autoplay=1&mute=1&loop=1&playlist=_ks_4cDSsfc",
            "category": "Video Production",
            "row": 1
        },
        {
            "id": "w5",
            "title": "Social Ads",
            "type": "instagram",
            "url": "https://www.instagram.com/p/DY2vChtkzrM/embed",
            "category": "AI Workflows",
            "row": 1
        },
        {
            "id": "w6",
            "title": "Product Showcase",
            "type": "instagram",
            "url": "https://www.instagram.com/p/CnDh_IHBDIl/embed",
            "category": "3D Visualization",
            "row": 1
        },
        {
            "id": "w7",
            "title": "Cinematic Cut",
            "type": "youtube",
            "url": "https://www.youtube.com/embed/vk0n3NJtLBU?rel=0&modestbranding=1&controls=0&autoplay=1&mute=1&loop=1&playlist=vk0n3NJtLBU",
            "category": "Video Production",
            "row": 1
        },
        {
            "id": "w8",
            "title": "Poster Artwork",
            "type": "instagram",
            "url": "https://www.instagram.com/p/Dc57Yv-CW5O/embed",
            "category": "Graphic Design",
            "row": 2
        },
        {
            "id": "w9",
            "title": "Promo Teaser",
            "type": "youtube",
            "url": "https://www.youtube.com/embed/2Jnd6A86mDk?rel=0&modestbranding=1&controls=0&autoplay=1&mute=1&loop=1&playlist=2Jnd6A86mDk",
            "category": "Video Production",
            "row": 2
        },
        {
            "id": "w10",
            "title": "Typography Design",
            "type": "instagram",
            "url": "https://www.instagram.com/p/Dc54Y9ZCaER/embed",
            "category": "Graphic Design",
            "row": 2
        },
        {
            "id": "w11",
            "title": "3D Motion Render",
            "type": "instagram",
            "url": "https://www.instagram.com/p/DXhfKkpOFM3/embed",
            "category": "3D Visualization",
            "row": 2
        },
        {
            "id": "w12",
            "title": "Editorial Design",
            "type": "instagram",
            "url": "https://www.instagram.com/p/DZ0Qz-LTAk2/embed",
            "category": "Graphic Design",
            "row": 2
        },
        {
            "id": "w13",
            "title": "Digital Art Piece",
            "type": "instagram",
            "url": "https://www.instagram.com/p/DZX1BN3E8wM/embed",
            "category": "AI Workflows",
            "row": 2
        },
        {
            "id": "w14",
            "title": "Visual Branding",
            "type": "instagram",
            "url": "https://www.instagram.com/p/Dc55xJQiXmS/embed",
            "category": "Graphic Design",
            "row": 2
        }
    ]
};

const STORAGE_KEY = 'mq_portfolio_data';

// Helper: Get active data
function getPortfolioData() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return {
                profile: { ...DEFAULT_PORTFOLIO_DATA.profile, ...(parsed.profile || {}) },
                works: Array.isArray(parsed.works) && parsed.works.length > 0 ? parsed.works : DEFAULT_PORTFOLIO_DATA.works
            };
        }
    } catch (e) {
        console.warn("Could not load from localStorage, using defaults", e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
}

// Helper: Save data
function savePortfolioData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: data }));
        return true;
    } catch (e) {
        console.error("Error saving portfolio data:", e);
        return false;
    }
}

// Helper: Reset to defaults
function resetPortfolioData() {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: DEFAULT_PORTFOLIO_DATA }));
    return DEFAULT_PORTFOLIO_DATA;
}

// Helper: Smart URL Parser for YouTube & Instagram & Images
function parseMediaUrl(inputUrl, detectedType) {
    if (!inputUrl) return { url: '', type: detectedType || 'image' };
    const raw = inputUrl.trim();

    if (raw.startsWith('data:image/') || raw.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i)) {
        return { url: raw, type: 'image' };
    }

    const ytMatch = raw.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
        const id = ytMatch[1];
        const embedUrl = `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&controls=0&autoplay=1&mute=1&loop=1&playlist=${id}`;
        return { url: embedUrl, type: 'youtube', id };
    }

    const igMatch = raw.match(/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
    if (igMatch && igMatch[1]) {
        const code = igMatch[1];
        const embedUrl = `https://www.instagram.com/p/${code}/embed`;
        return { url: embedUrl, type: 'instagram', code };
    }

    return { url: raw, type: detectedType || 'image' };
}

// Hydrate index.html elements
function hydrateIndexPage() {
    const data = getPortfolioData();
    const p = data.profile;
    if (!p) return;

    document.querySelectorAll('.js-profile-email').forEach(el => {
        el.textContent = p.email;
        if (el.tagName.toLowerCase() === 'a') {
            el.href = `mailto:${p.email}`;
        }
    });
    const emailLink = document.querySelector('.editorial-email-link');
    if (emailLink) {
        emailLink.innerHTML = `${p.email} <span class="external-arrow">↗</span>`;
        emailLink.href = `mailto:${p.email}`;
    }

    document.querySelectorAll('.js-profile-whatsapp').forEach(el => {
        el.href = p.whatsapp || `https://wa.me/${(p.phoneRaw || p.phone || '').replace(/[^0-9]/g, '')}`;
    });

    document.querySelectorAll('.js-profile-instagram').forEach(el => {
        el.href = p.instagram;
    });

    document.querySelectorAll('.js-profile-phone').forEach(el => {
        el.href = `tel:${p.phoneRaw || p.phone.replace(/\s+/g, '')}`;
        const span = el.querySelector('.js-phone-text');
        if (span) {
            span.textContent = p.phone;
        } else {
            const icon = el.querySelector('i');
            const arrow = el.querySelector('span');
            el.innerHTML = '';
            if (icon) el.appendChild(icon);
            el.append(` ${p.phone} `);
            if (arrow) el.appendChild(arrow);
        }
    });

    document.querySelectorAll('.js-profile-pinterest').forEach(el => {
        el.href = p.pinterest;
    });

    document.querySelectorAll('.js-profile-linkedin').forEach(el => {
        el.href = p.linkedin;
    });

    const heroSub = document.querySelector('.hero-left .subtitle');
    if (heroSub && p.heroSubtitle) heroSub.innerHTML = p.heroSubtitle;

    const heroTitle = document.querySelector('.hero-left .title');
    if (heroTitle && p.heroTitle) heroTitle.innerHTML = p.heroTitle;

    const heroRightH2 = document.querySelector('.hero-right h2');
    if (heroRightH2 && p.heroHeadline) heroRightH2.innerHTML = p.heroHeadline;

    const heroRightP = document.querySelector('.hero-right p');
    if (heroRightP && p.heroDescription) heroRightP.innerHTML = p.heroDescription;

    const aboutTitle = document.querySelector('.approach-title');
    if (aboutTitle && p.aboutTitle) aboutTitle.innerHTML = p.aboutTitle;

    const aboutDesc = document.querySelector('.approach-desc');
    if (aboutDesc && p.aboutDescription) aboutDesc.innerHTML = p.aboutDescription;
}

// Generate single work item HTML
function renderWorkItemHTML(item) {
    if (item.type === 'image') {
        return `
            <div class="mq-item" data-id="${item.id}">
                <img src="${item.url}" alt="${item.title || 'Work'}" loading="lazy" style="width:100%; height:100%; object-fit:cover; display:block;">
            </div>
        `;
    } else if (item.type === 'youtube') {
        return `
            <div class="mq-item" data-id="${item.id}">
                <iframe src="${item.url}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen loading="lazy"></iframe>
            </div>
        `;
    } else {
        return `
            <div class="mq-item" data-id="${item.id}">
                <iframe src="${item.url}" frameborder="0" scrolling="no" allowtransparency="true" loading="lazy"></iframe>
            </div>
        `;
    }
}

// Hydrate works.html marquee
function hydrateWorksPage() {
    const data = getPortfolioData();
    const trackLeft = document.querySelector('.track-left');
    const trackRight = document.querySelector('.track-right');

    if (!trackLeft && !trackRight) return;

    const row1Items = data.works.filter(w => parseInt(w.row) === 1);
    const row2Items = data.works.filter(w => parseInt(w.row) === 2);

    const actualRow1 = row1Items.length > 0 ? row1Items : data.works.slice(0, Math.ceil(data.works.length / 2));
    const actualRow2 = row2Items.length > 0 ? row2Items : data.works.slice(Math.ceil(data.works.length / 2));

    if (trackLeft && actualRow1.length > 0) {
        const group1Html = actualRow1.map(renderWorkItemHTML).join('\n');
        trackLeft.innerHTML = `<!-- Group 1 -->\n${group1Html}\n<!-- Duplicate Group 1 -->\n${group1Html}`;
    }

    if (trackRight && actualRow2.length > 0) {
        const group2Html = actualRow2.map(renderWorkItemHTML).join('\n');
        trackRight.innerHTML = `<!-- Group 2 -->\n${group2Html}\n<!-- Duplicate Group 2 -->\n${group2Html}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    hydrateIndexPage();
    hydrateWorksPage();
});

window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
        hydrateIndexPage();
        hydrateWorksPage();
    }
});
