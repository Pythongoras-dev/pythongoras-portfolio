// Custom Cursor
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
});

document.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
});

document.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
});

// Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 1000);
});

// Typing Effect
const typingText = 'Burak Öztok';
const typingElement = document.getElementById('hero-title');
let charIndex = 0;

function typeText() {
    if (charIndex < typingText.length) {
        typingElement.textContent += typingText.charAt(charIndex);
        charIndex++;
        setTimeout(typeText, 150);
    }
}

// Counter Animation
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Scroll Reveal
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            const counters = entry.target.querySelectorAll('.counter');
            counters.forEach(counter => {
                if (!counter.classList.contains('animated')) {
                    counter.classList.add('animated');
                    animateCounter(counter);
                }
            });
        }
    });
}, observerOptions);

document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
});

// Data Loading
let allDownloads = [];
let currentFilter = 'all';
let currentView = 'grid';

async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Veri yüklenemedi');
        const data = await response.json();
        
        renderHero(data.hero);
        renderBiography(data.biography);
        renderSocialLinks(data.socialLinks);
        renderDownloads(data.downloads);
        
        if (window.lucide) lucide.createIcons();
        
        setTimeout(typeText, 500);
    } catch (error) {
        console.error('Veri hatası:', error);
        if (window.lucide) lucide.createIcons();
    }
}

function renderHero(hero) {
    if (!hero) return;
    const subtitle = document.getElementById('hero-subtitle');
    const description = document.getElementById('hero-description');
    
    if (subtitle && hero.subtitle) subtitle.textContent = DOMPurify.sanitize(hero.subtitle);
    if (description && hero.description) description.textContent = DOMPurify.sanitize(hero.description);
}

function renderBiography(bio) {
    if (!bio) return;
    
    const name = document.getElementById('bio-name');
    const title = document.getElementById('bio-title');
    const location = document.getElementById('bio-location');
    
    if (name && bio.name) name.textContent = DOMPurify.sanitize(bio.name);
    if (title && bio.title) title.textContent = DOMPurify.sanitize(bio.title);
    if (location && bio.location) location.textContent = DOMPurify.sanitize(bio.location);
    
    const paragraphsContainer = document.getElementById('bio-paragraphs');
    if (paragraphsContainer && bio.paragraphs) {
        paragraphsContainer.innerHTML = '';
        bio.paragraphs.forEach(p => {
            const el = document.createElement('p');
            el.textContent = DOMPurify.sanitize(p);
            paragraphsContainer.appendChild(el);
        });
    }
    
    const skillsContainer = document.getElementById('skills-container');
    if (skillsContainer && bio.skills) {
        skillsContainer.innerHTML = '';
        bio.skills.forEach(skill => {
            const span = document.createElement('span');
            span.className = 'px-3 py-1.5 rounded-md bg-base border border-border text-zinc-300 text-xs font-medium hover:border-accent hover:text-accent transition-colors cursor-default';
            span.textContent = DOMPurify.sanitize(skill);
            skillsContainer.appendChild(span);
        });
    }
    
    const expContainer = document.getElementById('experience-container');
    if (expContainer && bio.experiences) {
        expContainer.innerHTML = '';
        bio.experiences.forEach(exp => {
            const div = document.createElement('div');
            div.className = 'experience-item relative pl-4 border-l border-border pb-2';
            div.innerHTML = `
                <div class="flex flex-wrap items-baseline gap-2 mb-1">
                    <h4 class="font-semibold text-white text-sm">${DOMPurify.sanitize(exp.role)}</h4>
                    <span class="text-zinc-600">•</span>
                    <span class="text-accent/80 text-xs font-mono">${DOMPurify.sanitize(exp.company)}</span>
                </div>
                <div class="text-[11px] text-muted font-mono mb-1.5">${DOMPurify.sanitize(exp.period)}</div>
                <p class="text-xs text-zinc-400 leading-relaxed">${DOMPurify.sanitize(exp.description)}</p>
            `;
            expContainer.appendChild(div);
        });
    }
}

function renderSocialLinks(links) {
    const container = document.getElementById('social-links');
    if (!container || !links) return;
    
    container.innerHTML = '';
    
    const icons = {
        twitter: 'twitter', 
        linkedin: 'linkedin', 
        github: 'github',
        youtube: 'youtube', 
        discord: 'message-circle', 
        website: 'globe',
        email: 'mail', 
        instagram: 'instagram', 
        telegram: 'send'
    };
    
    links.forEach(link => {
        const a = document.createElement('a');
        a.href = DOMPurify.sanitize(link.url);
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'social-link group flex items-center gap-4 px-6 py-4 rounded-xl border border-border bg-surface/50 hover:border-accent/50 transition-all duration-300';
        
        const iconName = icons[link.platform] || 'link';
        
        a.innerHTML = `
            <div class="social-icon w-12 h-12 rounded-xl bg-base border border-border flex items-center justify-center text-zinc-400 group-hover:border-accent/50 transition-all duration-300">
                <i data-lucide="${iconName}" class="w-6 h-6"></i>
            </div>
            <div class="flex-1 text-left">
                <div class="text-base font-semibold text-zinc-300 group-hover:text-white transition-colors">
                    ${DOMPurify.sanitize(link.label)}
                </div>
                <div class="text-xs text-muted font-mono mt-0.5">
                    ${DOMPurify.sanitize(link.platform)}
                </div>
            </div>
            <i data-lucide="arrow-up-right" class="w-5 h-5 text-muted group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"></i>
        `;
        
        container.appendChild(a);
    });
}

function renderDownloads(downloads) {
    allDownloads = downloads || [];
    updateStats();
    filterAndRender();
}

function updateStats() {
    const totalDownloads = allDownloads.reduce((sum, item) => sum + (item.downloads || 0), 0);
    const freeCount = allDownloads.filter(item => item.free).length;
    const premiumCount = allDownloads.filter(item => !item.free).length;
    const totalSize = allDownloads.reduce((sum, item) => {
        const size = parseFloat(item.size) || 0;
        return sum + size;
    }, 0);
    
    document.getElementById('total-downloads').textContent = totalDownloads.toLocaleString();
    document.getElementById('free-count').textContent = freeCount;
    document.getElementById('premium-count').textContent = premiumCount;
    document.getElementById('total-size').textContent = totalSize.toFixed(1) + ' MB';
}

function filterAndRender() {
    const searchTerm = document.getElementById('download-search').value.toLowerCase();
    
    let filtered = allDownloads.filter(item => {
        const matchesSearch = !searchTerm || 
            item.name.toLowerCase().includes(searchTerm) || 
            item.description.toLowerCase().includes(searchTerm);
        
        let matchesFilter = true;
        if (currentFilter === 'free') matchesFilter = item.free;
        else if (currentFilter === 'premium') matchesFilter = !item.free;
        else if (currentFilter !== 'all') matchesFilter = item.category === currentFilter;
        
        return matchesSearch && matchesFilter;
    });
    
    renderDownloadCards(filtered);
}

function renderDownloadCards(downloads) {
    const container = document.getElementById('downloads-container');
    container.innerHTML = '';
    
    if (downloads.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-16">
                <i data-lucide="search-x" class="w-12 h-12 text-muted mx-auto mb-4"></i>
                <p class="text-muted">Domain adresi alıncaya kadar projelerimin indirme linkini koymayacağım.</p>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
        return;
    }
    
    downloads.forEach(item => {
        const article = document.createElement('article');
        article.className = currentView === 'grid' 
            ? 'product-card group relative rounded-2xl border border-border backdrop-blur-sm p-6 overflow-hidden flex flex-col'
            : 'product-card group relative rounded-xl border border-border backdrop-blur-sm p-4 overflow-hidden flex items-center gap-4';
        
        const badgeHTML = item.free 
            ? `<div class="absolute top-4 right-4 px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-mono uppercase tracking-wider font-bold">ÜCRETSİZ</div>`
            : `<div class="absolute top-4 right-4 px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20 text-accent text-[10px] font-mono uppercase tracking-wider font-bold">PREMİUM</div>`;
        
        const versionHTML = item.version 
            ? `<span class="text-[10px] text-muted font-mono">v${DOMPurify.sanitize(item.version)}</span>` 
            : '';
        
        const updatedHTML = item.lastUpdated 
            ? `<span class="text-[10px] text-muted font-mono">${formatDate(item.lastUpdated)}</span>` 
            : '';
        
        const platformHTML = item.platform 
            ? item.platform.map(p => `<span class="px-2 py-0.5 rounded-md bg-base border border-border text-[9px] text-muted font-mono">${DOMPurify.sanitize(p)}</span>`).join('')
            : '';
        
        const downloadsHTML = item.downloads 
            ? `<div class="flex items-center gap-1 text-[10px] text-muted">
                   <i data-lucide="download" class="w-3 h-3"></i>
                   <span>${item.downloads.toLocaleString()}</span>
               </div>` 
            : '';
        
        const iconName = item.icon || 'download';
        
        if (currentView === 'grid') {
            article.innerHTML = `
                <div class="absolute -top-10 -right-10 w-32 h-32 bg-accent/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                ${badgeHTML}
                
                <div class="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-5 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                    <i data-lucide="${iconName}" class="w-5 h-5"></i>
                </div>
                
                <h3 class="text-lg font-bold text-white mb-2 group-hover:text-accent transition-colors">
                    ${DOMPurify.sanitize(item.name)}
                </h3>
                
                <p class="text-sm text-zinc-400 leading-relaxed mb-5 flex-1">
                    ${DOMPurify.sanitize(item.description)}
                </p>
                
                <div class="flex flex-wrap gap-1.5 mb-4">
                    ${platformHTML}
                </div>
                
                <div class="flex items-center justify-between text-xs text-muted mb-4">
                    ${versionHTML}
                    ${updatedHTML}
                </div>
                
                <div class="flex items-end justify-between pt-4 border-t border-border">
                    <div class="flex items-center gap-3">
                        <div class="text-[10px] text-muted font-mono">${DOMPurify.sanitize(item.size)}</div>
                        ${downloadsHTML}
                    </div>
                    <a href="${DOMPurify.sanitize(item.url)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border text-zinc-300 text-xs font-semibold hover:bg-accent hover:text-white hover:border-accent transition-all duration-300">
                        <i data-lucide="download" class="w-3.5 h-3.5"></i>
                        <span>İndir</span>
                    </a>
                </div>
            `;
        } else {
            article.innerHTML = `
                <div class="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0">
                    <i data-lucide="${iconName}" class="w-5 h-5"></i>
                </div>
                
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                        <h3 class="text-base font-bold text-white group-hover:text-accent transition-colors truncate">
                            ${DOMPurify.sanitize(item.name)}
                        </h3>
                        ${versionHTML}
                    </div>
                    <p class="text-xs text-zinc-400 truncate mb-2">
                        ${DOMPurify.sanitize(item.description)}
                    </p>
                    <div class="flex items-center gap-3 text-[10px] text-muted">
                        <span>${DOMPurify.sanitize(item.size)}</span>
                        ${downloadsHTML}
                        <span>${formatDate(item.lastUpdated)}</span>
                    </div>
                </div>
                
                <a href="${DOMPurify.sanitize(item.url)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border text-zinc-300 text-xs font-semibold hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 flex-shrink-0">
                    <i data-lucide="download" class="w-3.5 h-3.5"></i>
                    <span>İndir</span>
                </a>
            `;
        }
        
        container.appendChild(article);
    });
    
    if (window.lucide) lucide.createIcons();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Bugün';
    if (diffDays === 1) return 'Dün';
    if (diffDays < 7) return `${diffDays} gün önce`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`;
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    
    document.getElementById('download-search').addEventListener('input', filterAndRender);
    
    document.querySelectorAll('.download-filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.download-filter-btn').forEach(b => b.classList.remove('active', 'border-accent', 'text-accent'));
            this.classList.add('active', 'border-accent', 'text-accent');
            currentFilter = this.dataset.filter;
            filterAndRender();
        });
    });
    
    document.getElementById('grid-view-btn').addEventListener('click', function() {
        currentView = 'grid';
        document.getElementById('downloads-container').className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
        document.querySelectorAll('.view-toggle-btn').forEach(b => b.classList.remove('active', 'bg-accent', 'text-white'));
        this.classList.add('active', 'bg-accent', 'text-white');
        filterAndRender();
    });
    
    document.getElementById('list-view-btn').addEventListener('click', function() {
        currentView = 'list';
        document.getElementById('downloads-container').className = 'flex flex-col gap-3';
        document.querySelectorAll('.view-toggle-btn').forEach(b => b.classList.remove('active', 'bg-accent', 'text-white'));
        this.classList.add('active', 'bg-accent', 'text-white');
        filterAndRender();
    });
});