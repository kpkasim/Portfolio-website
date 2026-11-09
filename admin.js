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

            if (inputPin === validPin) {
                sessionStorage.setItem('mq_admin_logged_in', 'true');
                loginOverlay.classList.add('hidden');
                adminPinInput.value = '';
                showToast('Welcome back, Muhammed Qasim!', 'success');
                initDashboard();
            } else {
                showToast('Incorrect PIN! Access denied.', 'error');
                adminPinInput.select();
            }
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
        featured: {
            title: 'Featured Projects (Grid & Categories)',
            subtitle: 'Add, edit, and organize portfolio grid cards across Graphic Design, 3D, and Video'
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

    const bottomNavItems = document.querySelectorAll('.mobile-bottom-bar .bottom-nav-item');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');
    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

    function closeSidebar() {
        if (adminSidebar) adminSidebar.classList.remove('open');
        if (sidebarBackdrop) sidebarBackdrop.classList.remove('show');
    }

    function openSidebar() {
        if (adminSidebar) adminSidebar.classList.add('open');
        if (sidebarBackdrop) sidebarBackdrop.classList.add('show');
    }

    function switchTab(tabKey) {
        navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.tab === tabKey);
        });
        bottomNavItems.forEach(item => {
            item.classList.toggle('active', item.dataset.tab === tabKey);
        });
        tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `tab-${tabKey}`);
        });

        if (tabMeta[tabKey]) {
            if (pageTitle) pageTitle.textContent = tabMeta[tabKey].title;
            if (pageSubtitle) pageSubtitle.textContent = tabMeta[tabKey].subtitle;
        }

        closeSidebar();

        // Re-render relevant parts
        if (tabKey === 'featured') {
            populateFeaturedHeaderForm();
            renderCategoryPillsManager();
            renderDynamicFpFiltersBar();
            populateFpCategoryDropdown();
            renderFeaturedProjectsGrid();
        } else if (tabKey === 'works') {
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

    bottomNavItems.forEach(item => {
        item.addEventListener('click', () => {
            switchTab(item.dataset.tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', openSidebar);
    }
    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener('click', closeSidebar);
    }
    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', closeSidebar);
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
        const featuredProjects = portfolioData.featuredProjects || [];

        const totalWorks = works.length;
        const totalYt = works.filter(w => w.type === 'youtube').length;
        const totalIg = works.filter(w => w.type === 'instagram').length;
        const totalImg = works.filter(w => w.type === 'image').length;

        const statFeaturedProjects = document.getElementById('statFeaturedProjects');
        const statTotalWorks = document.getElementById('statTotalWorks');
        const statYoutube = document.getElementById('statYoutube');
        const statInstagram = document.getElementById('statInstagram');
        const statImages = document.getElementById('statImages');

        if (statFeaturedProjects) statFeaturedProjects.textContent = featuredProjects.length;
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
    // 3.5. FEATURED PROJECTS TAB (CRUD FOR MASONRY GRID)
    // =========================================================
    let currentFpFilter = 'All';
    const featuredProjectsGrid = document.getElementById('featuredProjectsGrid');
    const fpCountAll = document.getElementById('fpCountAll');
    const openAddFpModalBtn = document.getElementById('openAddFpModalBtn');
    const quickAddFpBtn = document.getElementById('quickAddFpBtn');
    const featuredProjectModal = document.getElementById('featuredProjectModal');
    const closeFpModalBtn = document.getElementById('closeFpModalBtn');
    const cancelFpModalBtn = document.getElementById('cancelFpModalBtn');
    const featuredProjectForm = document.getElementById('featuredProjectForm');
    const editFpId = document.getElementById('editFpId');
    const fpModalTitle = document.getElementById('fpModalTitle');
    const fpTitle = document.getElementById('fpTitle');
    const fpCategory = document.getElementById('fpCategory');
    const fpAspectType = document.getElementById('fpAspectType');
    const fpMediaType = document.getElementById('fpMediaType');
    const fpLink = document.getElementById('fpLink');
    const fpImage = document.getElementById('fpImage');
    const fpImageFileInput = document.getElementById('fpImageFileInput');
    const fpFileDropZone = document.getElementById('fpFileDropZone');
    const fpLivePreviewBox = document.getElementById('fpLivePreviewBox');
    const fpPreviewContainer = document.getElementById('fpPreviewContainer');
    const fpClient = document.getElementById('fpClient');
    const fpYear = document.getElementById('fpYear');
    const fpTools = document.getElementById('fpTools');
    const fpDescription = document.getElementById('fpDescription');

    // Helper: Extract YouTube ID
    function extractYouTubeId(url) {
        if (!url || typeof url !== 'string') return null;
        const trimmed = url.trim();
        const thumbMatch = trimmed.match(/(?:img\.youtube\.com\/vi|i[0-9]?\.ytimg\.com\/vi(?:_webp)?)\/([a-zA-Z0-9_-]{11})/i);
        if (thumbMatch && thumbMatch[1]) return thumbMatch[1];
        const urlMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|live\/|watch\?.+&v=))([a-zA-Z0-9_-]{11})/i);
        if (urlMatch && urlMatch[1]) return urlMatch[1];
        return null;
    }

    // Helper: Auto-heal & sanitize featured project objects
    function sanitizeFeaturedProject(project) {
        if (!project || typeof project !== 'object') return project;
        const rawImage = project.image || '';
        const rawLink = project.linkUrl || project.videoUrl || '';

        const ytId = extractYouTubeId(rawLink) || extractYouTubeId(rawImage);
        if (ytId) {
            project.mediaType = 'youtube';
            project.videoUrl = `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=0&enablejsapi=1&rel=0`;
            if (!project.linkUrl || !project.linkUrl.startsWith('http') || extractYouTubeId(project.linkUrl)) {
                project.linkUrl = `https://www.youtube.com/watch?v=${ytId}`;
            }
            project.image = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
        } else if (rawImage.includes('behance.net') || rawLink.includes('behance.net')) {
            project.mediaType = 'behance';
            if (!project.linkUrl && rawImage.includes('behance.net')) {
                project.linkUrl = rawImage;
            }
            if (project.image && project.image.includes('behance.net')) {
                project.image = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80';
            }
        } else if (project.linkUrl && !project.mediaType) {
            project.mediaType = 'link';
        }
        return project;
    }

    // --- Dynamic Category Pills & Header Management ---
    function getActiveCategories() {
        portfolioData = getPortfolioData();
        const sec = portfolioData.featuredSection || {};
        if (Array.isArray(sec.categories) && sec.categories.length > 0) {
            return sec.categories;
        }
        return ["Graphic Design", "3D Motion", "Brand Identity", "Video Editing", "AI Workflows"];
    }

    function populateFeaturedHeaderForm() {
        portfolioData = getPortfolioData();
        const sec = portfolioData.featuredSection || {};
        const fpHeaderTitle = document.getElementById('fpHeaderTitle');
        const fpHeaderBadge = document.getElementById('fpHeaderBadge');
        const fpHeaderSubtitle = document.getElementById('fpHeaderSubtitle');

        if (fpHeaderTitle) fpHeaderTitle.value = sec.title || 'Projects';
        if (fpHeaderBadge) fpHeaderBadge.value = sec.badge || 'CURATED ARCHIVE & CASE STUDIES';
        if (fpHeaderSubtitle) fpHeaderSubtitle.value = sec.subtitle || 'High-impact 3D animation, brand identity, and commercial video production built for scaling modern creative ventures.';
    }

    const featuredHeaderForm = document.getElementById('featuredHeaderForm');
    if (featuredHeaderForm) {
        featuredHeaderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fpHeaderTitle = document.getElementById('fpHeaderTitle');
            const fpHeaderBadge = document.getElementById('fpHeaderBadge');
            const fpHeaderSubtitle = document.getElementById('fpHeaderSubtitle');

            portfolioData = getPortfolioData();
            if (!portfolioData.featuredSection) {
                portfolioData.featuredSection = {};
            }
            portfolioData.featuredSection.title = fpHeaderTitle ? fpHeaderTitle.value.trim() : 'Projects';
            portfolioData.featuredSection.badge = fpHeaderBadge ? fpHeaderBadge.value.trim() : 'CURATED ARCHIVE & CASE STUDIES';
            portfolioData.featuredSection.subtitle = fpHeaderSubtitle ? fpHeaderSubtitle.value.trim() : '';

            savePortfolioData(portfolioData);
            showToast('Projects header saved successfully!', 'success');
        });
    }

    function renderCategoryPillsManager() {
        const container = document.getElementById('categoryPillsManagerList');
        if (!container) return;
        const categories = getActiveCategories();
        const projects = (getPortfolioData().featuredProjects || []);

        container.innerHTML = '';
        categories.forEach(cat => {
            const count = projects.filter(p => p.category === cat).length;
            const chip = document.createElement('div');
            chip.className = 'cat-pill-item';
            chip.innerHTML = `
                <span>${cat}</span>
                <span class="cat-pill-count">${count}</span>
                <button type="button" class="cat-pill-remove" title="Remove '${cat}' filter pill">&times;</button>
            `;
            const removeBtn = chip.querySelector('.cat-pill-remove');
            if (removeBtn) {
                removeBtn.addEventListener('click', () => {
                    if (categories.length <= 1) {
                        showToast('At least one category pill must remain.', 'error');
                        return;
                    }
                    if (confirm(`Remove category filter pill "${cat}"? (Existing projects with this category will be preserved).`)) {
                        portfolioData = getPortfolioData();
                        portfolioData.featuredSection = portfolioData.featuredSection || {};
                        portfolioData.featuredSection.categories = getActiveCategories().filter(c => c !== cat);
                        savePortfolioData(portfolioData);
                        showToast(`Removed filter pill "${cat}"`, 'success');
                        if (currentFpFilter === cat) currentFpFilter = 'All';
                        renderCategoryPillsManager();
                        renderDynamicFpFiltersBar();
                        populateFpCategoryDropdown();
                        renderFeaturedProjectsGrid();
                    }
                });
            }
            container.appendChild(chip);
        });
    }

    const addCategoryForm = document.getElementById('addCategoryForm');
    const newCategoryInput = document.getElementById('newCategoryInput');
    if (addCategoryForm && newCategoryInput) {
        addCategoryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newCat = newCategoryInput.value.trim();
            if (!newCat) return;

            portfolioData = getPortfolioData();
            portfolioData.featuredSection = portfolioData.featuredSection || {};
            const categories = [...getActiveCategories()];

            if (categories.some(c => c.toLowerCase() === newCat.toLowerCase())) {
                showToast(`Category "${newCat}" already exists!`, 'error');
                return;
            }

            categories.push(newCat);
            portfolioData.featuredSection.categories = categories;
            savePortfolioData(portfolioData);
            newCategoryInput.value = '';
            showToast(`Added new category filter "${newCat}"!`, 'success');

            renderCategoryPillsManager();
            renderDynamicFpFiltersBar();
            populateFpCategoryDropdown();
        });
    }

    function renderDynamicFpFiltersBar() {
        const bar = document.getElementById('dynamicFpFiltersBar');
        if (!bar) return;
        const categories = getActiveCategories();
        const projects = (getPortfolioData().featuredProjects || []);

        bar.innerHTML = '';

        // "All" filter chip
        const allBtn = document.createElement('button');
        allBtn.type = 'button';
        allBtn.className = `filter-chip ${currentFpFilter === 'All' ? 'active' : ''}`;
        allBtn.innerHTML = `All (<span id="fpCountAll">${projects.length}</span>)`;
        allBtn.addEventListener('click', () => {
            currentFpFilter = 'All';
            bar.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
            allBtn.classList.add('active');
            renderFeaturedProjectsGrid();
        });
        bar.appendChild(allBtn);

        // Category pills
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `filter-chip ${currentFpFilter === cat ? 'active' : ''}`;
            btn.textContent = cat;
            btn.addEventListener('click', () => {
                currentFpFilter = cat;
                bar.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderFeaturedProjectsGrid();
            });
            bar.appendChild(btn);
        });
    }

    function populateFpCategoryDropdown(selectedVal = null) {
        if (!fpCategory) return;
        const categories = getActiveCategories();
        const currentVal = selectedVal || fpCategory.value || categories[0];

        fpCategory.innerHTML = '';
        categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat;
            opt.textContent = cat;
            if (cat === currentVal) opt.selected = true;
            fpCategory.appendChild(opt);
        });

        // If currentVal isn't in active categories, preserve it as archived
        if (currentVal && !categories.includes(currentVal)) {
            const opt = document.createElement('option');
            opt.value = currentVal;
            opt.textContent = `${currentVal} (Archived)`;
            opt.selected = true;
            fpCategory.appendChild(opt);
        }
    }

    function renderFeaturedProjectsGrid() {
        portfolioData = getPortfolioData();
        const list = portfolioData.featuredProjects || [];

        if (fpCountAll) fpCountAll.textContent = list.length;

        let filtered = list;
        if (currentFpFilter && currentFpFilter !== 'All') {
            filtered = list.filter(p => p.category === currentFpFilter);
        }

        if (!featuredProjectsGrid) return;
        featuredProjectsGrid.innerHTML = '';

        if (filtered.length === 0) {
            featuredProjectsGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-glass);">
                    <i class="fas fa-layer-group" style="font-size: 2.5rem; color: #7B8AF4; margin-bottom: 12px; display: block;"></i>
                    <p style="color: var(--text-muted); font-size: 1rem;">No projects found in category "${currentFpFilter}".</p>
                    <button type="button" class="btn-primary-action" id="emptyAddFpBtn" style="margin-top: 15px; background: #7B8AF4; border-color: #7B8AF4;">
                        <i class="fas fa-plus"></i> Add ${currentFpFilter === 'All' ? 'New' : currentFpFilter} Project
                    </button>
                </div>
            `;
            const emptyAddFpBtn = document.getElementById('emptyAddFpBtn');
            if (emptyAddFpBtn) {
                emptyAddFpBtn.addEventListener('click', () => openFeaturedProjectModal());
            }
            return;
        }

        filtered.forEach(project => {
            featuredProjectsGrid.appendChild(createFeaturedProjectCardElement(project));
        });
    }

    function createFeaturedProjectCardElement(rawProject) {
        const project = sanitizeFeaturedProject({ ...rawProject });
        const card = document.createElement('div');
        card.className = 'work-card';
        card.dataset.id = project.id;
        card.style.borderColor = 'rgba(123, 138, 244, 0.25)';

        let aspectBadgeText = project.aspectLabel || (
            project.aspectType === 'vertical' || project.aspectType === '9:16' ? '9:16 Vertical' :
            (project.aspectType === 'landscape' ? '16:9 Landscape' :
            (project.aspectType === 'square' ? '1:1 Square' : '3:4 Portrait'))
        );

        let mediaTypeBadge = '';
        if (project.mediaType === 'youtube' || project.videoUrl) {
            mediaTypeBadge = `<span class="work-type-badge" style="background: rgba(255, 0, 0, 0.2); color: #ff4d4f; border: 1px solid rgba(255, 0, 0, 0.4);"><i class="fab fa-youtube"></i> YouTube Video</span>`;
        } else if (project.mediaType === 'behance' || (project.linkUrl && project.linkUrl.includes('behance'))) {
            mediaTypeBadge = `<span class="work-type-badge" style="background: rgba(0, 87, 255, 0.2); color: #3b82f6; border: 1px solid rgba(0, 87, 255, 0.4);"><i class="fab fa-behance"></i> Behance Case Study</span>`;
        } else if (project.linkUrl) {
            mediaTypeBadge = `<span class="work-type-badge" style="background: rgba(123, 138, 244, 0.2); color: #7B8AF4; border: 1px solid rgba(123, 138, 244, 0.4);"><i class="fas fa-link"></i> Project Link</span>`;
        } else {
            mediaTypeBadge = `<span class="work-type-badge" style="background: rgba(123, 138, 244, 0.2); color: #7B8AF4; border: 1px solid rgba(123, 138, 244, 0.4);"><i class="fas fa-palette"></i> ${project.category}</span>`;
        }

        const fallbackImg = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
        const displayImage = project.image || fallbackImg;

        card.innerHTML = `
            <div class="work-preview-wrap" style="height: 200px; background: #0F111A; position: relative;">
                ${mediaTypeBadge}
                <span class="work-row-tag" style="background: rgba(0,0,0,0.6);">${aspectBadgeText}</span>
                <img src="${displayImage}" alt="${project.title}" onerror="this.onerror=null; this.src='${fallbackImg}';" loading="lazy" style="width:100%; height:100%; object-fit:cover;">
                ${(project.mediaType === 'youtube' || project.videoUrl) ? `
                    <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none;">
                        <div style="width: 44px; height: 44px; border-radius: 50%; background: rgba(255,0,0,0.85); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; box-shadow: 0 0 15px rgba(255,0,0,0.5);">
                            <i class="fas fa-play" style="margin-left: 3px;"></i>
                        </div>
                    </div>
                ` : ''}
            </div>
            <div class="work-body">
                <div class="work-title" style="color:#ffffff; font-weight:600;" title="${project.title}">${project.title}</div>
                <div class="work-category" style="color: #7B8AF4;">
                    <i class="fas fa-folder"></i> ${project.category} â€¢ ${project.year || '2026'}
                </div>
                ${project.linkUrl ? `
                    <div style="font-size: 0.74rem; color: #7B8AF4; margin-bottom: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        <i class="fas fa-arrow-up-right-from-square"></i> <a href="${project.linkUrl}" target="_blank" style="color: #7B8AF4; text-decoration: underline;" onclick="event.stopPropagation();">${project.linkUrl}</a>
                    </div>
                ` : ''}
                <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 10px; line-height: 1.4; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                    ${project.description || 'No description provided.'}
                </div>
                <div class="work-actions">
                    <button type="button" class="btn-card-action edit" title="Edit this project" style="color: #7B8AF4; border-color: rgba(123, 138, 244, 0.4);">
                        <i class="fas fa-pen-to-square"></i> Edit
                    </button>
                    <button type="button" class="btn-card-action delete" title="Delete project">
                        <i class="fas fa-trash-can"></i>
                    </button>
                </div>
            </div>
        `;

        const editBtn = card.querySelector('.btn-card-action.edit');
        if (editBtn) {
            editBtn.addEventListener('click', () => openFeaturedProjectModal(project));
        }

        const deleteBtn = card.querySelector('.btn-card-action.delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                if (confirm(`Are you sure you want to delete "${project.title}" from Featured Projects?`)) {
                    portfolioData.featuredProjects = (portfolioData.featuredProjects || []).filter(p => p.id !== project.id);
                    savePortfolioData(portfolioData);
                    showToast(`Deleted "${project.title}"`, 'success');
                    renderFeaturedProjectsGrid();
                    renderOverview();
                }
            });
        }

        return card;
    }

    function openFeaturedProjectModal(rawProject = null) {
        if (!featuredProjectModal) return;
        featuredProjectForm.reset();
        const project = rawProject ? sanitizeFeaturedProject({ ...rawProject }) : null;
        populateFpCategoryDropdown(project ? project.category : (currentFpFilter !== 'All' ? currentFpFilter : null));

        if (project) {
            fpModalTitle.innerHTML = `<i class="fas fa-pen-to-square" style="color:#7B8AF4; margin-right:8px;"></i> Edit Featured Project`;
            editFpId.value = project.id;
            fpTitle.value = project.title || '';
            fpCategory.value = project.category || (getActiveCategories()[0] || 'Graphic Design');
            fpAspectType.value = (project.aspectType === '9:16' ? 'vertical' : project.aspectType) || 'portrait';
            if (fpMediaType) fpMediaType.value = project.mediaType || (project.videoUrl ? 'youtube' : (project.linkUrl && project.linkUrl.includes('behance') ? 'behance' : 'image'));
            if (fpLink) fpLink.value = project.linkUrl || project.videoUrl || '';
            fpImage.value = project.image || '';
            fpClient.value = project.client || '';
            fpYear.value = project.year || '2026';
            fpTools.value = Array.isArray(project.tools) ? project.tools.join(', ') : (project.tools || '');
            fpDescription.value = project.description || '';
            updateFpLivePreview();
        } else {
            fpModalTitle.innerHTML = `<i class="fas fa-plus-circle" style="color:#7B8AF4; margin-right:8px;"></i> Add New Featured Project`;
            editFpId.value = '';
            fpCategory.value = currentFpFilter !== 'All' ? currentFpFilter : (getActiveCategories()[0] || 'Graphic Design');
            fpAspectType.value = 'portrait';
            if (fpMediaType) fpMediaType.value = 'image';
            if (fpLink) fpLink.value = '';
            fpYear.value = new Date().getFullYear().toString();
            if (fpLivePreviewBox) fpLivePreviewBox.style.display = 'none';
        }

        featuredProjectModal.classList.add('show');
    }

    function closeFeaturedProjectModal() {
        if (featuredProjectModal) featuredProjectModal.classList.remove('show');
    }

    if (openAddFpModalBtn) openAddFpModalBtn.addEventListener('click', () => openFeaturedProjectModal());
    if (quickAddFpBtn) quickAddFpBtn.addEventListener('click', () => {
        switchTab('featured');
        openFeaturedProjectModal();
    });
    if (closeFpModalBtn) closeFpModalBtn.addEventListener('click', closeFeaturedProjectModal);
    if (cancelFpModalBtn) cancelFpModalBtn.addEventListener('click', closeFeaturedProjectModal);

    // Live preview update for Featured Project
    function updateFpLivePreview() {
        const linkVal = fpLink ? fpLink.value.trim() : '';
        const imgVal = fpImage ? fpImage.value.trim() : '';
        const ytId = extractYouTubeId(linkVal) || extractYouTubeId(imgVal);

        if (ytId) {
            const ytThumb = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
            if (fpPreviewContainer && fpLivePreviewBox) {
                fpPreviewContainer.innerHTML = `
                    <div style="position:relative; width:100%; height:100%;">
                        <img src="${ytThumb}" style="width:100%; height:100%; object-fit:cover;">
                        <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.35);">
                            <div style="width:48px; height:48px; border-radius:50%; background:red; color:#fff; display:flex; align-items:center; justify-content:center; font-size:1.1rem; box-shadow:0 0 15px rgba(255,0,0,0.6);">
                                <i class="fas fa-play" style="margin-left:3px;"></i>
                            </div>
                        </div>
                        <span style="position:absolute; top:8px; left:8px; background:rgba(255,0,0,0.9); color:#fff; font-size:0.7rem; font-weight:700; padding:3px 8px; border-radius:4px;">
                            <i class="fab fa-youtube"></i> YOUTUBE VIDEO
                        </span>
                    </div>
                `;
                fpLivePreviewBox.style.display = 'block';
            }
            return;
        }

        const isBehance = (linkVal && linkVal.includes('behance.net')) || (imgVal && imgVal.includes('behance.net'));
        if (isBehance) {
            const displayImg = (imgVal && !imgVal.includes('behance.net')) ? imgVal : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80';
            if (fpPreviewContainer && fpLivePreviewBox) {
                fpPreviewContainer.innerHTML = `
                    <div style="position:relative; width:100%; height:100%;">
                        <img src="${displayImg}" style="width:100%; height:100%; object-fit:cover;">
                        <span style="position:absolute; top:8px; left:8px; background:#0057ff; color:#fff; font-size:0.7rem; font-weight:700; padding:3px 8px; border-radius:4px;">
                            <i class="fab fa-behance"></i> BEHANCE CASE STUDY
                        </span>
                    </div>
                `;
                fpLivePreviewBox.style.display = 'block';
            }
            return;
        }

        if (imgVal && fpPreviewContainer && fpLivePreviewBox) {
            fpPreviewContainer.innerHTML = `<img src="${imgVal}" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'" style="width:100%; height:100%; object-fit:cover;">`;
            fpLivePreviewBox.style.display = 'block';
        } else if (fpLivePreviewBox) {
            fpLivePreviewBox.style.display = 'none';
        }
    }

    if (fpImage) fpImage.addEventListener('input', updateFpLivePreview);
    if (fpLink) fpLink.addEventListener('input', updateFpLivePreview);
    if (fpMediaType) fpMediaType.addEventListener('change', updateFpLivePreview);

    // Local file upload for featured project image
    if (fpFileDropZone && fpImageFileInput) {
        fpFileDropZone.addEventListener('click', () => fpImageFileInput.click());
        fpImageFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (evt) => {
                const dataUrl = evt.target.result;
                fpImage.value = dataUrl;
                updateFpLivePreview();
            };
            reader.readAsDataURL(file);
        });
    }

    // Category filter chips in featured tab are managed dynamically by renderDynamicFpFiltersBar()

    // Form submit for featured project
    if (featuredProjectForm) {
        featuredProjectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = editFpId.value.trim();
            const title = fpTitle.value.trim();
            const category = fpCategory.value;
            const aspectType = fpAspectType.value;
            let image = fpImage.value.trim();
            let linkUrl = fpLink ? fpLink.value.trim() : '';
            let mediaType = fpMediaType ? fpMediaType.value : 'image';
            const client = fpClient.value.trim() || 'Client Project';
            const year = fpYear.value.trim() || '2026';
            const tools = fpTools.value.split(',').map(s => s.trim()).filter(Boolean);
            const description = fpDescription.value.trim();

            if (!title) {
                showToast('Please provide a project title', 'error');
                return;
            }

            // Smart detection for YouTube
            const ytId = extractYouTubeId(linkUrl) || extractYouTubeId(image);
            let videoUrl = '';
            if (ytId) {
                mediaType = 'youtube';
                videoUrl = `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`;
                if (!linkUrl || extractYouTubeId(linkUrl)) {
                    linkUrl = `https://www.youtube.com/watch?v=${ytId}`;
                }
                if (!image || extractYouTubeId(image)) {
                    image = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
                }
            } else if ((linkUrl && linkUrl.includes('behance.net')) || (image && image.includes('behance.net'))) {
                mediaType = 'behance';
                if (!linkUrl && image.includes('behance.net')) {
                    linkUrl = image;
                }
                if (image.includes('behance.net')) {
                    image = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80';
                }
            } else if (linkUrl && (!mediaType || mediaType === 'image')) {
                mediaType = 'link';
            }

            if (!image) {
                image = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
            }

            let aspectLabel = '3:4 Portrait';
            let gridSpan = 'col-span-1 md:col-span-6 lg:col-span-4';
            let heightClass = 'h-[420px] sm:h-[480px] lg:h-[420px]';

            if (aspectType === 'vertical' || aspectType === '9:16') {
                aspectLabel = '9:16 Vertical';
                gridSpan = 'col-span-1 md:col-span-6 lg:col-span-3';
                heightClass = 'h-[460px] sm:h-[520px] lg:h-[480px]';
            } else if (aspectType === 'landscape') {
                aspectLabel = '16:9 Landscape';
                gridSpan = 'col-span-1 md:col-span-12 lg:col-span-8';
                heightClass = 'h-[320px] sm:h-[380px] lg:h-[420px]';
            } else if (aspectType === 'square') {
                aspectLabel = '1:1 Square';
                gridSpan = 'col-span-1 md:col-span-6 lg:col-span-4';
                heightClass = 'h-[340px] sm:h-[400px] lg:h-[420px]';
            }

            const projectData = {
                id: id || `fp_${Date.now()}`,
                title,
                category,
                aspectType,
                aspectLabel,
                gridSpan,
                heightClass,
                mediaType,
                linkUrl,
                videoUrl,
                image,
                client,
                year,
                tools: tools.length > 0 ? tools : ['Photoshop', 'Illustrator'],
                description: description || `${category} creative showcase by Muhammed Qasim.`
            };

            portfolioData = getPortfolioData();
            if (!Array.isArray(portfolioData.featuredProjects)) {
                portfolioData.featuredProjects = [];
            }

            if (id) {
                const index = portfolioData.featuredProjects.findIndex(p => p.id === id);
                if (index !== -1) {
                    portfolioData.featuredProjects[index] = projectData;
                } else {
                    portfolioData.featuredProjects.unshift(projectData);
                }
                showToast(`Updated "${title}" successfully!`, 'success');
            } else {
                portfolioData.featuredProjects.unshift(projectData);
                showToast(`Added "${title}" to Featured Projects!`, 'success');
            }

            savePortfolioData(portfolioData);
            closeFeaturedProjectModal();
            renderFeaturedProjectsGrid();
            renderOverview();
        });
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

// Helper: Extract YouTube video ID
function extractYouTubeId(url) {
    if (!url || typeof url !== 'string') return null;
    const trimmed = url.trim();
    const thumbMatch = trimmed.match(/(?:img\\.youtube\\.com\\/vi|i[0-9]?\\.ytimg\\.com\\/vi(?:_webp)?)\\/([a-zA-Z0-9_-]{11})/i);
    if (thumbMatch && thumbMatch[1]) return thumbMatch[1];
    const urlMatch = trimmed.match(/(?:youtu\\.be\\/|youtube\\.com\\/(?:embed\\/|v\\/|watch\\?v=|shorts\\/|live\\/|watch\\?.+&v=))([a-zA-Z0-9_-]{11})/i);
    if (urlMatch && urlMatch[1]) return urlMatch[1];
    return null;
}

// Helper: Auto-heal & sanitize featured project objects (YouTube thumbnails, Behance links)
function sanitizeFeaturedProject(project) {
    if (!project || typeof project !== 'object') return project;
    const rawImage = project.image || '';
    const rawLink = project.linkUrl || project.videoUrl || '';

    const ytId = extractYouTubeId(rawLink) || extractYouTubeId(rawImage);
    if (ytId) {
        project.mediaType = 'youtube';
        project.videoUrl = \`https://www.youtube.com/embed/\${ytId}?autoplay=1&mute=0&enablejsapi=1&rel=0\`;
        if (!project.linkUrl || !project.linkUrl.startsWith('http') || extractYouTubeId(project.linkUrl)) {
            project.linkUrl = \`https://www.youtube.com/watch?v=\${ytId}\`;
        }
        project.image = \`https://img.youtube.com/vi/\${ytId}/hqdefault.jpg\`;
    } else if (rawImage.includes('behance.net') || rawLink.includes('behance.net')) {
        project.mediaType = 'behance';
        if (!project.linkUrl && rawImage.includes('behance.net')) {
            project.linkUrl = rawImage;
        }
        if (project.image && project.image.includes('behance.net')) {
            project.image = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80';
        }
    } else if (project.linkUrl && !project.mediaType) {
        project.mediaType = 'link';
    }
    return project;
}

// Helper: Get active data
function getPortfolioData() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            const rawFp = Array.isArray(parsed.featuredProjects) && parsed.featuredProjects.length > 0 ? parsed.featuredProjects : DEFAULT_PORTFOLIO_DATA.featuredProjects;
            const sanitizedFp = rawFp.map(sanitizeFeaturedProject);

            let needsUpdate = false;
            rawFp.forEach((p, idx) => {
                if (p.videoUrl !== sanitizedFp[idx].videoUrl || p.mediaType !== sanitizedFp[idx].mediaType) {
                    needsUpdate = true;
                }
            });
            if (needsUpdate) {
                parsed.featuredProjects = sanitizedFp;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
            }

            return {
                profile: { ...DEFAULT_PORTFOLIO_DATA.profile, ...(parsed.profile || {}) },
                works: Array.isArray(parsed.works) && parsed.works.length > 0 ? parsed.works : DEFAULT_PORTFOLIO_DATA.works,
                featuredProjects: sanitizedFp,
                featuredSection: { ...DEFAULT_PORTFOLIO_DATA.featuredSection, ...(parsed.featuredSection || {}) }
            };
        }
    } catch (e) {
        console.warn("Could not load from localStorage, using defaults", e);
    }
    const cloned = JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
    cloned.featuredProjects = cloned.featuredProjects.map(sanitizeFeaturedProject);
    return cloned;
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
        emailLink.innerHTML = \`\${p.email} <span class="external-arrow">Ã¢â€ â€”</span>\`;
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

    // Featured Projects Section Hydration
    if (data.featuredSection) {
        document.querySelectorAll('.js-featured-title').forEach(el => {
            el.innerHTML = data.featuredSection.title || 'Projects';
        });
        document.querySelectorAll('.js-featured-subtitle').forEach(el => {
            el.innerHTML = data.featuredSection.subtitle || '';
        });
        document.querySelectorAll('.js-featured-badge').forEach(el => {
            el.innerHTML = \`<span class="tag-corner">â”Œ</span> \${data.featuredSection.badge || 'CURATED ARCHIVE & CASE STUDIES'}\`;
        });
    }
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
                showToast('Ã°Å¸Å¡â‚¬ Pushed to GitHub! Changes will be live across all PCs in 1 minute.', 'success');
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
        populateFeaturedHeaderForm();
        renderCategoryPillsManager();
        renderDynamicFpFiltersBar();
        populateFpCategoryDropdown();
        renderFeaturedProjectsGrid();
        renderWorksGrid();
        populateProfileForms();
    }

    checkAuth();
    if (sessionStorage.getItem('mq_admin_logged_in') === 'true') {
        initDashboard();
    }
});
