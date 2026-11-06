/**
 * admin.js - Logic for Muhammed Qasim Portfolio Admin Dashboard
 */

document.addEventListener('DOMContentLoaded', () => {
    // Current state
    let portfolioData = getPortfolioData();
    let currentFilter = 'all';
    let uploadedImageDataUrl = '';

    // =========================================================
    // 1. AUTHENTICATION & LOGIN
    // =========================================================
    const loginOverlay = document.getElementById('loginOverlay');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminPinInput = document.getElementById('adminPinInput');
    const togglePwdBtn = document.getElementById('togglePwdBtn');
    const togglePwdIcon = document.getElementById('togglePwdIcon');
    const logoutBtn = document.getElementById('logoutBtn');

    function getStoredPin() {
        return localStorage.getItem('mq_admin_pin') || 'admin123';
    }

    function checkAuth() {
        const isLoggedIn = sessionStorage.getItem('mq_admin_logged_in') === 'true';
        if (isLoggedIn) {
            loginOverlay.classList.add('hidden');
        } else {
            loginOverlay.classList.remove('hidden');
            if (adminPinInput) adminPinInput.focus();
        }
    }

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputPin = adminPinInput.value.trim();
            const validPin = getStoredPin();

            // Accept validPin or master PIN admin123 (case-insensitive)
            if (inputPin === validPin || inputPin.toLowerCase() === 'admin123' || inputPin.toLowerCase() === validPin.toLowerCase()) {
                sessionStorage.setItem('mq_admin_logged_in', 'true');
                loginOverlay.classList.add('hidden');
                adminPinInput.value = '';
                showToast('Welcome back, Muhammed Qasim!', 'success');
                initDashboard();
            } else {
                showToast('Incorrect PIN! Try entering: admin123', 'error');
                adminPinInput.select();
            }
        });
    }

    // Auto-fill pin on click
    const autoFillPinBtn = document.getElementById('autoFillPinBtn');
    if (autoFillPinBtn && adminPinInput) {
        autoFillPinBtn.addEventListener('click', () => {
            adminPinInput.value = 'admin123';
            showToast('PIN filled: admin123', 'success');
            adminPinInput.focus();
        });
    }

    // Reset PIN to admin123
    const resetLoginPinBtn = document.getElementById('resetLoginPinBtn');
    if (resetLoginPinBtn && adminPinInput) {
        resetLoginPinBtn.addEventListener('click', () => {
            localStorage.setItem('mq_admin_pin', 'admin123');
            adminPinInput.value = 'admin123';
            showToast('PIN reset to admin123! Click Unlock Dashboard.', 'success');
            adminPinInput.focus();
        });
    }

    if (togglePwdBtn && adminPinInput) {
        togglePwdBtn.addEventListener('click', () => {
            const isPassword = adminPinInput.type === 'password';
            adminPinInput.type = isPassword ? 'text' : 'password';
            togglePwdIcon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('mq_admin_logged_in');
            loginOverlay.classList.remove('hidden');
            showToast('Logged out successfully', 'success');
        });
    }

    // =========================================================
    // 2. SIDEBAR & TAB SWITCHING
    // =========================================================
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const pageTitle = document.getElementById('pageTitle');
    const pageSubtitle = document.getElementById('pageSubtitle');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const adminSidebar = document.getElementById('adminSidebar');

    const tabMeta = {
        overview: {
            title: 'Dashboard Overview',
            subtitle: 'Overview of works, media, and quick actions'
        },
        works: {
            title: 'Works & Media Gallery',
            subtitle: 'Add, edit, and organize YouTube videos, Instagram posts & images'
        },
        profile: {
            title: 'Profile & Contact Details',
            subtitle: 'Update phone numbers, WhatsApp, Instagram, and bio descriptions'
        },
        settings: {
            title: 'Settings & Data Backup',
            subtitle: 'Security PIN, export/import data, and system preferences'
        }
    };

    function switchTab(tabKey) {
        navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.tab === tabKey);
        });
        tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `tab-${tabKey}`);
        });

        if (tabMeta[tabKey]) {
            if (pageTitle) pageTitle.textContent = tabMeta[tabKey].title;
            if (pageSubtitle) pageSubtitle.textContent = tabMeta[tabKey].subtitle;
        }

        if (adminSidebar.classList.contains('open')) {
            adminSidebar.classList.remove('open');
        }

        // Re-render relevant parts
        if (tabKey === 'works') {
            renderWorksGrid();
        } else if (tabKey === 'profile') {
            populateProfileForms();
        } else if (tabKey === 'overview') {
            renderOverview();
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            switchTab(item.dataset.tab);
        });
    });

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            adminSidebar.classList.toggle('open');
        });
    }

    // Shortcuts from overview
    const quickAddVideoBtn = document.getElementById('quickAddVideoBtn');
    if (quickAddVideoBtn) {
        quickAddVideoBtn.addEventListener('click', () => {
            openWorkModal();
        });
    }
    const quickEditLinksBtn = document.getElementById('quickEditLinksBtn');
    if (quickEditLinksBtn) {
        quickEditLinksBtn.addEventListener('click', () => {
            switchTab('profile');
        });
    }
    const seeAllWorksBtn = document.getElementById('seeAllWorksBtn');
    if (seeAllWorksBtn) {
        seeAllWorksBtn.addEventListener('click', () => {
            switchTab('works');
        });
    }

    // =========================================================
    // 3. OVERVIEW TAB
    // =========================================================
    function renderOverview() {
        portfolioData = getPortfolioData();
        const works = portfolioData.works || [];

        const totalWorks = works.length;
        const totalYt = works.filter(w => w.type === 'youtube').length;
        const totalIg = works.filter(w => w.type === 'instagram').length;
        const totalImg = works.filter(w => w.type === 'image').length;

        const statTotalWorks = document.getElementById('statTotalWorks');
        const statYoutube = document.getElementById('statYoutube');
        const statInstagram = document.getElementById('statInstagram');
        const statImages = document.getElementById('statImages');

        if (statTotalWorks) statTotalWorks.textContent = totalWorks;
        if (statYoutube) statYoutube.textContent = totalYt;
        if (statInstagram) statInstagram.textContent = totalIg;
        if (statImages) statImages.textContent = totalImg;

        // Populate recent works (first 4 items)
        const recentContainer = document.getElementById('overviewRecentWorks');
        if (recentContainer) {
            recentContainer.innerHTML = '';
            const previewWorks = works.slice(0, 4);
            if (previewWorks.length === 0) {
                recentContainer.innerHTML = `<p style="color:var(--text-dim); grid-column: 1/-1;">No works found. Click 'Add New Video / Work' to get started!</p>`;
            } else {
                previewWorks.forEach(work => {
                    recentContainer.appendChild(createWorkCardElement(work, false));
                });
            }
        }
    }

    // =========================================================
    // 4. WORKS & MEDIA TAB (CRUD)
    // =========================================================
    const fullWorksGrid = document.getElementById('fullWorksGrid');
    const filterChips = document.querySelectorAll('.toolbar-filters .filter-chip');
    const countAll = document.getElementById('countAll');

    function renderWorksGrid() {
        portfolioData = getPortfolioData();
        const works = portfolioData.works || [];

        if (countAll) countAll.textContent = works.length;

        let filtered = works;
        if (currentFilter === 'row1') {
            filtered = works.filter(w => parseInt(w.row) === 1);
        } else if (currentFilter === 'row2') {
            filtered = works.filter(w => parseInt(w.row) === 2);
        } else if (currentFilter === 'youtube') {
            filtered = works.filter(w => w.type === 'youtube');
        } else if (currentFilter === 'instagram') {
            filtered = works.filter(w => w.type === 'instagram');
        } else if (currentFilter === 'image') {
            filtered = works.filter(w => w.type === 'image');
        }

        fullWorksGrid.innerHTML = '';
        if (filtered.length === 0) {
            fullWorksGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-glass);">
                    <i class="fas fa-folder-open" style="font-size: 2.5rem; color: var(--text-dim); margin-bottom: 12px; display: block;"></i>
                    <p style="color: var(--text-muted); font-size: 1rem;">No works found in this filter.</p>
                </div>
            `;
            return;
        }

        filtered.forEach(work => {
            fullWorksGrid.appendChild(createWorkCardElement(work, true));
        });
    }

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentFilter = chip.dataset.filter;
            renderWorksGrid();
        });
    });

    function createWorkCardElement(work, fullActions = true) {
        const card = document.createElement('div');
        card.className = 'work-card';
        card.dataset.id = work.id;

        // Preview content
        let previewHtml = '';
        if (work.type === 'image') {
            previewHtml = `<img src="${work.url}" alt="${work.title}" loading="lazy">`;
        } else if (work.type === 'youtube') {
            previewHtml = `<iframe src="${work.url}" frameborder="0" allow="encrypted-media" loading="lazy"></iframe>`;
        } else {
            previewHtml = `<iframe src="${work.url}" frameborder="0" scrolling="no" loading="lazy"></iframe>`;
        }

        // Type badge label & class
        let typeClass = work.type;
        let typeIcon = work.type === 'youtube' ? 'fab fa-youtube' : (work.type === 'instagram' ? 'fab fa-instagram' : 'fas fa-image');
        let typeName = work.type === 'youtube' ? 'YouTube' : (work.type === 'instagram' ? 'Instagram' : 'Image');

        card.innerHTML = `
            <div class="work-preview-wrap">
                <span class="work-type-badge ${typeClass}">
                    <i class="${typeIcon}"></i> ${typeName}
                </span>
                <span class="work-row-tag">Row ${work.row}</span>
                ${previewHtml}
            </div>
            <div class="work-body">
                <div class="work-title" title="${work.title}">${work.title}</div>
                <div class="work-category"><i class="fas fa-tag"></i> ${work.category || 'General'}</div>
                ${fullActions ? `
                <div class="work-actions">
                    <button type="button" class="btn-card-action move" title="Move to Row ${work.row === 1 ? '2' : '1'}">
                        <i class="fas fa-arrows-up-down"></i> Row ${work.row === 1 ? '2' : '1'}
                    </button>
                    <button type="button" class="btn-card-action edit" title="Edit this work">
                        <i class="fas fa-pen-to-square"></i> Edit
                    </button>
                    <button type="button" class="btn-card-action delete" title="Delete work">
                        <i class="fas fa-trash-can"></i>
                    </button>
                </div>
                ` : ''}
            </div>
        `;

        if (fullActions) {
            // Move Row
            const moveBtn = card.querySelector('.btn-card-action.move');
            if (moveBtn) {
                moveBtn.addEventListener('click', () => {
                    work.row = work.row === 1 ? 2 : 1;
                    savePortfolioData(portfolioData);
                    showToast(`Moved "${work.title}" to Row ${work.row}`, 'success');
                    renderWorksGrid();
                    renderOverview();
                });
            }

            // Edit
            const editBtn = card.querySelector('.btn-card-action.edit');
            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    openWorkModal(work);
                });
            }

            // Delete
            const deleteBtn = card.querySelector('.btn-card-action.delete');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    if (confirm(`Are you sure you want to delete "${work.title}"?`)) {
                        portfolioData.works = portfolioData.works.filter(w => w.id !== work.id);
                        savePortfolioData(portfolioData);
                        showToast(`Deleted "${work.title}"`, 'success');
                        renderWorksGrid();
                        renderOverview();
                    }
                });
            }
        }

        return card;
    }

    // =========================================================
    // 5. ADD / EDIT WORK MODAL LOGIC
    // =========================================================
    const workModal = document.getElementById('workModal');
    const openAddWorkModalBtn = document.getElementById('openAddWorkModalBtn');
    const closeWorkModalBtn = document.getElementById('closeWorkModalBtn');
    const cancelWorkModalBtn = document.getElementById('cancelWorkModalBtn');
    const workForm = document.getElementById('workForm');
    const editWorkId = document.getElementById('editWorkId');
    const workModalTitle = document.getElementById('workModalTitle');
    const saveWorkSubmitBtn = document.getElementById('saveWorkSubmitBtn');

    const typeRadios = document.querySelectorAll('.type-radio-card');
    const workTitle = document.getElementById('workTitle');
    const workMediaUrl = document.getElementById('workMediaUrl');
    const workRow = document.getElementById('workRow');
    const workCategory = document.getElementById('workCategory');
    const urlLabelText = document.getElementById('urlLabelText');
    const imageUploadGroup = document.getElementById('imageUploadGroup');
    const fileDropZone = document.getElementById('fileDropZone');
    const workImageFileInput = document.getElementById('workImageFileInput');
    const modalLivePreviewBox = document.getElementById('modalLivePreviewBox');
    const modalPreviewContainer = document.getElementById('modalPreviewContainer');

    function getSelectedType() {
        const checked = document.querySelector('input[name="mediaType"]:checked');
        return checked ? checked.value : 'youtube';
    }

    function setMediaType(type) {
        typeRadios.forEach(card => {
            const radio = card.querySelector('input');
            const isMatch = card.dataset.type === type;
            radio.checked = isMatch;
            card.classList.toggle('selected', isMatch);
        });

        if (type === 'youtube') {
            urlLabelText.textContent = 'YouTube Video Link / URL';
            workMediaUrl.placeholder = 'e.g. https://youtu.be/... or https://youtube.com/watch?v=...';
            imageUploadGroup.style.display = 'none';
        } else if (type === 'instagram') {
            urlLabelText.textContent = 'Instagram Post Link';
            workMediaUrl.placeholder = 'e.g. https://instagram.com/p/... or /reel/...';
            imageUploadGroup.style.display = 'none';
        } else {
            urlLabelText.textContent = 'Image URL / Web Link';
            workMediaUrl.placeholder = 'e.g. https://... or leave empty if uploading below';
            imageUploadGroup.style.display = 'block';
        }
        updateModalPreview();
    }

    typeRadios.forEach(card => {
        card.addEventListener('click', () => {
            setMediaType(card.dataset.type);
        });
    });

    function updateModalPreview() {
        const type = getSelectedType();
        const rawUrl = uploadedImageDataUrl || workMediaUrl.value.trim();

        if (!rawUrl) {
            modalLivePreviewBox.style.display = 'none';
            modalPreviewContainer.innerHTML = '';
            return;
        }

        const parsed = parseMediaUrl(rawUrl, type);
        modalLivePreviewBox.style.display = 'block';

        if (parsed.type === 'image') {
            modalPreviewContainer.innerHTML = `<img src="${parsed.url}" alt="Preview" style="max-height: 100%; max-width: 100%; object-fit: contain;">`;
        } else if (parsed.type === 'youtube') {
            modalPreviewContainer.innerHTML = `<iframe src="${parsed.url}" frameborder="0" allow="encrypted-media" style="width: 100%; height: 100%;"></iframe>`;
        } else {
            modalPreviewContainer.innerHTML = `<iframe src="${parsed.url}" frameborder="0" scrolling="no" style="width: 100%; height: 100%;"></iframe>`;
        }
    }

    if (workMediaUrl) {
        workMediaUrl.addEventListener('input', () => {
            uploadedImageDataUrl = '';
            updateModalPreview();
        });
    }

    // Image Upload Handling
    if (fileDropZone && workImageFileInput) {
        fileDropZone.addEventListener('click', () => workImageFileInput.click());

        fileDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileDropZone.style.borderColor = 'var(--primary)';
        });
        fileDropZone.addEventListener('dragleave', () => {
            fileDropZone.style.borderColor = '';
        });
        fileDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            fileDropZone.style.borderColor = '';
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleImageFile(e.dataTransfer.files[0]);
            }
        });

        workImageFileInput.addEventListener('change', () => {
            if (workImageFileInput.files && workImageFileInput.files[0]) {
                handleImageFile(workImageFileInput.files[0]);
            }
        });
    }

    function handleImageFile(file) {
        if (!file.type.startsWith('image/')) {
            showToast('Please select a valid image file', 'error');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImageDataUrl = e.target.result;
            workMediaUrl.value = uploadedImageDataUrl;
            updateModalPreview();
            showToast('Image uploaded successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }

    function openWorkModal(work = null) {
        uploadedImageDataUrl = '';
        if (work) {
            editWorkId.value = work.id;
            workModalTitle.innerHTML = `<i class="fas fa-pen-to-square" style="color:var(--primary); margin-right:8px;"></i> Edit Work`;
            saveWorkSubmitBtn.innerHTML = `<i class="fas fa-check"></i> Update Work`;
            workTitle.value = work.title || '';
            workMediaUrl.value = work.url || '';
            workRow.value = work.row || 1;
            workCategory.value = work.category || 'Graphic Design';
            setMediaType(work.type || 'youtube');
        } else {
            editWorkId.value = '';
            workModalTitle.innerHTML = `<i class="fas fa-plus-circle" style="color:var(--primary); margin-right:8px;"></i> Add New Video / Work`;
            saveWorkSubmitBtn.innerHTML = `<i class="fas fa-check"></i> Add to Portfolio`;
            workForm.reset();
            setMediaType('youtube');
            modalLivePreviewBox.style.display = 'none';
        }
        workModal.classList.add('show');
    }

    function closeWorkModal() {
        workModal.classList.remove('show');
        uploadedImageDataUrl = '';
    }

    if (openAddWorkModalBtn) openAddWorkModalBtn.addEventListener('click', () => openWorkModal());
    if (closeWorkModalBtn) closeWorkModalBtn.addEventListener('click', closeWorkModal);
    if (cancelWorkModalBtn) cancelWorkModalBtn.addEventListener('click', closeWorkModal);

    // Save Work (Add / Edit)
    if (workForm) {
        workForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = editWorkId.value.trim();
            const type = getSelectedType();
            const rawUrl = uploadedImageDataUrl || workMediaUrl.value.trim();
            const title = workTitle.value.trim();
            const row = parseInt(workRow.value) || 1;
            const category = workCategory.value;

            if (!rawUrl) {
                showToast('Please enter a media URL or upload an image', 'error');
                return;
            }

            const parsed = parseMediaUrl(rawUrl, type);

            portfolioData = getPortfolioData();
            if (!portfolioData.works) portfolioData.works = [];

            if (id) {
                // Update
                const index = portfolioData.works.findIndex(w => w.id === id);
                if (index !== -1) {
                    portfolioData.works[index] = {
                        ...portfolioData.works[index],
                        title,
                        type: parsed.type,
                        url: parsed.url,
                        row,
                        category
                    };
                    showToast(`Updated "${title}" successfully!`, 'success');
                }
            } else {
                // Add new item at front
                const newWork = {
                    id: 'w_' + Date.now(),
                    title,
                    type: parsed.type,
                    url: parsed.url,
                    row,
                    category
                };
                portfolioData.works.unshift(newWork);
                showToast(`Added "${title}" to Portfolio Row ${row}!`, 'success');
            }

            savePortfolioData(portfolioData);
            closeWorkModal();
            renderWorksGrid();
            renderOverview();
        });
    }

    // =========================================================
    // 6. PROFILE & CONTACT DETAILS
    // =========================================================
    const contactDetailsForm = document.getElementById('contactDetailsForm');
    const heroBioForm = document.getElementById('heroBioForm');

    function populateProfileForms() {
        portfolioData = getPortfolioData();
        const p = portfolioData.profile || {};

        // Contact
        const profPhone = document.getElementById('profPhone');
        const profWhatsapp = document.getElementById('profWhatsapp');
        const profInstagram = document.getElementById('profInstagram');
        const profEmail = document.getElementById('profEmail');
        const profPinterest = document.getElementById('profPinterest');
        const profLinkedin = document.getElementById('profLinkedin');

        if (profPhone) profPhone.value = p.phone || '';
        if (profWhatsapp) profWhatsapp.value = p.whatsapp || '';
        if (profInstagram) profInstagram.value = p.instagram || '';
        if (profEmail) profEmail.value = p.email || '';
        if (profPinterest) profPinterest.value = p.pinterest || '';
        if (profLinkedin) profLinkedin.value = p.linkedin || '';

        // Hero & Bio
        const profHeroSubtitle = document.getElementById('profHeroSubtitle');
        const profHeroTitle = document.getElementById('profHeroTitle');
        const profHeroHeadline = document.getElementById('profHeroHeadline');
        const profHeroDesc = document.getElementById('profHeroDesc');
        const profAboutTitle = document.getElementById('profAboutTitle');
        const profAboutDesc = document.getElementById('profAboutDesc');

        if (profHeroSubtitle) profHeroSubtitle.value = p.heroSubtitle || '';
        if (profHeroTitle) profHeroTitle.value = p.heroTitle || '';
        if (profHeroHeadline) profHeroHeadline.value = p.heroHeadline || '';
        if (profHeroDesc) profHeroDesc.value = p.heroDescription || '';
        if (profAboutTitle) profAboutTitle.value = p.aboutTitle || '';
        if (profAboutDesc) profAboutDesc.value = p.aboutDescription || '';
    }

    if (contactDetailsForm) {
        contactDetailsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            portfolioData = getPortfolioData();
            if (!portfolioData.profile) portfolioData.profile = {};

            const phoneVal = document.getElementById('profPhone').value.trim();
            const phoneDigits = phoneVal.replace(/[^0-9]/g, '');

            portfolioData.profile.phone = phoneVal;
            portfolioData.profile.phoneRaw = phoneDigits ? `+${phoneDigits}` : phoneVal;
            portfolioData.profile.whatsapp = document.getElementById('profWhatsapp').value.trim() || `https://wa.me/${phoneDigits}`;
            portfolioData.profile.instagram = document.getElementById('profInstagram').value.trim();
            portfolioData.profile.email = document.getElementById('profEmail').value.trim();
            portfolioData.profile.pinterest = document.getElementById('profPinterest').value.trim();
            portfolioData.profile.linkedin = document.getElementById('profLinkedin').value.trim();

            savePortfolioData(portfolioData);
            showToast('Contact & Social links updated successfully!', 'success');
        });
    }

    if (heroBioForm) {
        heroBioForm.addEventListener('submit', (e) => {
            e.preventDefault();
            portfolioData = getPortfolioData();
            if (!portfolioData.profile) portfolioData.profile = {};

            portfolioData.profile.heroSubtitle = document.getElementById('profHeroSubtitle').value.trim();
            portfolioData.profile.heroTitle = document.getElementById('profHeroTitle').value.trim();
            portfolioData.profile.heroHeadline = document.getElementById('profHeroHeadline').value.trim();
            portfolioData.profile.heroDescription = document.getElementById('profHeroDesc').value.trim();
            portfolioData.profile.aboutTitle = document.getElementById('profAboutTitle').value.trim();
            portfolioData.profile.aboutDescription = document.getElementById('profAboutDesc').value.trim();

            savePortfolioData(portfolioData);
            showToast('Hero & Bio texts updated successfully!', 'success');
        });
    }

    // =========================================================
    // 7. SETTINGS, PIN & BACKUP
    // =========================================================
    const changePinForm = document.getElementById('changePinForm');
    const exportDataBtn = document.getElementById('exportDataBtn');
    const importDataInput = document.getElementById('importDataInput');
    const resetDefaultsBtn = document.getElementById('resetDefaultsBtn');

    if (changePinForm) {
        changePinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newPin = document.getElementById('newPin').value.trim();
            const confirmPin = document.getElementById('confirmPin').value.trim();

            if (!newPin) {
                showToast('PIN cannot be empty', 'error');
                return;
            }
            if (newPin !== confirmPin) {
                showToast('New PINs do not match!', 'error');
                return;
            }

            localStorage.setItem('mq_admin_pin', newPin);
            changePinForm.reset();
            showToast('Security PIN changed successfully!', 'success');
        });
    }

    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', () => {
            portfolioData = getPortfolioData();
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(portfolioData, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `mq-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
            showToast('Portfolio data exported successfully!', 'success');
        });
    }

    if (importDataInput) {
        importDataInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const parsed = JSON.parse(event.target.result);
                    if (parsed && (parsed.works || parsed.profile)) {
                        savePortfolioData(parsed);
                        showToast('Data restored successfully!', 'success');
                        setTimeout(() => location.reload(), 1000);
                    } else {
                        showToast('Invalid backup file format', 'error');
                    }
                } catch (err) {
                    showToast('Failed to parse JSON file', 'error');
                }
            };
            reader.readAsText(file);
        });
    }

    if (resetDefaultsBtn) {
        resetDefaultsBtn.addEventListener('click', () => {
            if (confirm('Warning: This will reset all your works and details back to original website defaults. Continue?')) {
                resetPortfolioData();
                showToast('Reset to original website defaults', 'success');
                setTimeout(() => location.reload(), 1000);
            }
        });
    }

    // =========================================================
    // 8. GITHUB LIVE CLOUD SYNC & DATA.JS GENERATOR
    // =========================================================
    const pushToGithubBtn = document.getElementById('pushToGithubBtn');
    const downloadDataJsBtn = document.getElementById('downloadDataJsBtn');
    const headerSyncGithubBtn = document.getElementById('headerSyncGithubBtn');
    const ghRepoInput = document.getElementById('ghRepo');
    const ghTokenInput = document.getElementById('ghToken');

    // Pre-fill GitHub credentials if saved
    if (ghTokenInput) {
        ghTokenInput.value = localStorage.getItem('mq_gh_token') || '';
    }
    if (ghRepoInput) {
        ghRepoInput.value = localStorage.getItem('mq_gh_repo') || 'kpkasim/Portfolio-website';
    }

    function generateDataJsFileContent(data) {
        return `/**
 * data.js - Shared Portfolio Data Store & Hydration Engine
 * Auto-generated via MQ Admin Panel
 */

const DEFAULT_PORTFOLIO_DATA = ${JSON.stringify(data, null, 4)};

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

    if (raw.startsWith('data:image/') || raw.match(/\\.(jpeg|jpg|gif|png|webp|svg)(\\?.*)?$/i)) {
        return { url: raw, type: 'image' };
    }

    const ytMatch = raw.match(/(?:youtu\\.be\\/|youtube\\.com\\/(?:embed\\/|v\\/|watch\\?v=|shorts\\/|watch\\?.+&v=))([\\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
        const id = ytMatch[1];
        const embedUrl = \`https://www.youtube.com/embed/\${id}?rel=0&modestbranding=1&controls=0&autoplay=1&mute=1&loop=1&playlist=\${id}\`;
        return { url: embedUrl, type: 'youtube', id };
    }

    const igMatch = raw.match(/instagram\\.com\\/(?:p|reel)\\/([A-Za-z0-9_-]+)/);
    if (igMatch && igMatch[1]) {
        const code = igMatch[1];
        const embedUrl = \`https://www.instagram.com/p/\${code}/embed\`;
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
            el.href = \`mailto:\${p.email}\`;
        }
    });
    const emailLink = document.querySelector('.editorial-email-link');
    if (emailLink) {
        emailLink.innerHTML = \`\${p.email} <span class="external-arrow">↗</span>\`;
        emailLink.href = \`mailto:\${p.email}\`;
    }

    document.querySelectorAll('.js-profile-whatsapp').forEach(el => {
        el.href = p.whatsapp || \`https://wa.me/\${(p.phoneRaw || p.phone || '').replace(/[^0-9]/g, '')}\`;
    });

    document.querySelectorAll('.js-profile-instagram').forEach(el => {
        el.href = p.instagram;
    });

    document.querySelectorAll('.js-profile-phone').forEach(el => {
        el.href = \`tel:\${p.phoneRaw || p.phone.replace(/\\s+/g, '')}\`;
        const span = el.querySelector('.js-phone-text');
        if (span) {
            span.textContent = p.phone;
        } else {
            const icon = el.querySelector('i');
            const arrow = el.querySelector('span');
            el.innerHTML = '';
            if (icon) el.appendChild(icon);
            el.append(\` \${p.phone} \`);
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
        return \`
            <div class="mq-item" data-id="\${item.id}">
                <img src="\${item.url}" alt="\${item.title || 'Work'}" loading="lazy" style="width:100%; height:100%; object-fit:cover; display:block;">
            </div>
        \`;
    } else if (item.type === 'youtube') {
        return \`
            <div class="mq-item" data-id="\${item.id}">
                <iframe src="\${item.url}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen loading="lazy"></iframe>
            </div>
        \`;
    } else {
        return \`
            <div class="mq-item" data-id="\${item.id}">
                <iframe src="\${item.url}" frameborder="0" scrolling="no" allowtransparency="true" loading="lazy"></iframe>
            </div>
        \`;
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
        const group1Html = actualRow1.map(renderWorkItemHTML).join('\\n');
        trackLeft.innerHTML = \`<!-- Group 1 -->\\n\${group1Html}\\n<!-- Duplicate Group 1 -->\\n\${group1Html}\`;
    }

    if (trackRight && actualRow2.length > 0) {
        const group2Html = actualRow2.map(renderWorkItemHTML).join('\\n');
        trackRight.innerHTML = \`<!-- Group 2 -->\\n\${group2Html}\\n<!-- Duplicate Group 2 -->\\n\${group2Html}\`;
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
`;
    }

    async function pushChangesToGitHub() {
        const rawToken = (ghTokenInput ? ghTokenInput.value.trim() : '') || localStorage.getItem('mq_gh_token') || '';
        const token = rawToken.replace(/^(Bearer|token)\s+/i, '').replace(/["']/g, '').trim();
        const repo = (ghRepoInput ? ghRepoInput.value.trim() : '') || localStorage.getItem('mq_gh_repo') || 'kpkasim/Portfolio-website';

        if (!token) {
            switchTab('settings');
            showToast('Please enter your GitHub Token to sync live!', 'error');
            if (ghTokenInput) ghTokenInput.focus();
            return;
        }

        localStorage.setItem('mq_gh_token', token);
        localStorage.setItem('mq_gh_repo', repo);

        showToast('Connecting to GitHub API...', 'success');

        try {
            const filePath = 'data.js';
            const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;
            const authHeader = `Bearer ${token}`;

            // 1. Fetch current SHA
            const getRes = await fetch(apiUrl, {
                headers: {
                    'Authorization': authHeader,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (getRes.status === 401) {
                showToast('GitHub Error: Bad credentials (Token is invalid or expired)', 'error');
                return;
            }

            let sha = null;
            if (getRes.ok) {
                const fileData = await getRes.json();
                sha = fileData.sha;
            }

            // 2. Generate updated content
            const activeData = getPortfolioData();
            const fileString = generateDataJsFileContent(activeData);
            const encodedContent = btoa(unescape(encodeURIComponent(fileString)));

            // 3. Commit via PUT
            const putRes = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': authHeader,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'Update portfolio works and details via Admin Panel',
                    content: encodedContent,
                    sha: sha
                })
            });

            if (putRes.ok) {
                showToast('🚀 Pushed to GitHub! Changes will be live across all PCs in 1 minute.', 'success');
            } else {
                const errJson = await putRes.json();
                showToast(`GitHub Error: ${errJson.message || 'Check your token permissions'}`, 'error');
            }
        } catch (err) {
            showToast(`Sync Failed: ${err.message}`, 'error');
        }
    }

    if (pushToGithubBtn) {
        pushToGithubBtn.addEventListener('click', (e) => {
            e.preventDefault();
            pushChangesToGitHub();
        });
    }

    if (headerSyncGithubBtn) {
        headerSyncGithubBtn.addEventListener('click', () => {
            const savedToken = localStorage.getItem('mq_gh_token') || (ghTokenInput ? ghTokenInput.value.trim() : '');
            if (!savedToken) {
                switchTab('settings');
                showToast('Enter your GitHub token below to enable 1-click cloud sync', 'error');
            } else {
                pushChangesToGitHub();
            }
        });
    }

    if (downloadDataJsBtn) {
        downloadDataJsBtn.addEventListener('click', () => {
            const activeData = getPortfolioData();
            const jsContent = generateDataJsFileContent(activeData);
            const blob = new Blob([jsContent], { type: 'application/javascript;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'data.js';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            showToast('Downloaded updated data.js!', 'success');
        });
    }

    // =========================================================
    // 9. TOAST NOTIFICATION UTILITY
    // =========================================================
    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const iconClass = type === 'success' ? 'fas fa-circle-check' : 'fas fa-circle-exclamation';
        toast.innerHTML = `<i class="${iconClass}"></i> <span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // Initialize
    function initDashboard() {
        renderOverview();
        renderWorksGrid();
        populateProfileForms();
    }

    checkAuth();
    if (sessionStorage.getItem('mq_admin_logged_in') === 'true') {
        initDashboard();
    }
});
