/**
 * Dr. Surendranaik Y - Academic & Research Scientist Portfolio
 * Interactive Functionality, Molecular Simulation, Publication Engine & Citation Suite
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Footer Year
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // 2. Theme Manager (Dark / Light)
    initThemeManager();

    // 3. Scroll Progress & Back to Top
    initScrollAndNav();

    // 4. Molecular Canvas Particle Simulation
    initMoleculeCanvas();

    // 5. Animated Number Counters
    initAnimatedCounters();

    // 6. Publication Search & Filter Engine
    initPublicationSearch();

    // 7. Mobile Navigation Drawer
    initMobileNav();
});

/* ==========================================================================
   2. Theme Manager (Dark / Light Mode)
   ========================================================================== */
function initThemeManager() {
    const themeToggleBtn = document.getElementById('themeToggle');
    const root = document.documentElement;

    const savedTheme = localStorage.getItem('sy_academic_theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    setTheme(initialTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = root.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    function setTheme(theme) {
        root.setAttribute('data-theme', theme);
        localStorage.setItem('sy_academic_theme', theme);
    }
}

/* ==========================================================================
   3. Scroll Progress, Active Nav & Back to Top
   ========================================================================== */
function initScrollAndNav() {
    const progressBar = document.getElementById('scrollProgressBar');
    const backToTopBtn = document.getElementById('backToTop');
    const progressCircle = document.querySelector('.progress-ring-circle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = [];

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target) sections.push(target);
        }
    });

    const circumference = 2 * Math.PI * 20;
    if (progressCircle) {
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = `${circumference}`;
    }

    function onScroll() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

        if (progressBar) {
            progressBar.style.width = `${scrollPercentage}%`;
        }

        if (progressCircle) {
            const offset = circumference - (scrollPercentage / 100) * circumference;
            progressCircle.style.strokeDashoffset = offset;
        }

        if (backToTopBtn) {
            if (scrollTop > 350) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        if (navbar) {
            navbar.classList.toggle('scrolled', scrollTop > 60);
        }

        // Active link tracking
        let currentSectionId = '';
        const scrollPos = scrollTop + 160;

        sections.forEach(section => {
            if (section.offsetTop <= scrollPos) {
                currentSectionId = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (currentSectionId && link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Scroll Fade-in Intersection Observer
    const fadeEls = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    fadeEls.forEach(el => observer.observe(el));
}

/* ==========================================================================
   4. Interactive Molecular Chemistry Canvas Simulation (Cyan & Gold Orbit)
   ========================================================================== */
function initMoleculeCanvas() {
    const canvas = document.getElementById('moleculeCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let nodes = [];
    const nodeCount = 32;
    const maxDistance = 95;
    let orbitAngle = 0;

    function resize() {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    const colors = [
        { fill: 'rgba(0, 240, 255, 0.85)', glow: '#00f0ff', type: 'cyan' },
        { fill: 'rgba(56, 189, 248, 0.80)', glow: '#38bdf8', type: 'azure' },
        { fill: 'rgba(226, 168, 75, 0.85)', glow: '#e2a84b', type: 'gold' },
        { fill: 'rgba(251, 191, 36, 0.75)', glow: '#fbbf24', type: 'amber' }
    ];

    class AtomNode {
        constructor() {
            this.x = Math.random() * (width || 300);
            this.y = Math.random() * (height || 350);
            this.vx = (Math.random() - 0.5) * 0.7;
            this.vy = (Math.random() - 0.5) * 0.7;
            this.radius = Math.random() * 2.4 + 2.0;
            const chosen = colors[Math.floor(Math.random() * colors.length)];
            this.fill = chosen.fill;
            this.glow = chosen.glow;
            this.type = chosen.type;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.fill;
            ctx.shadowColor = this.glow;
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < nodeCount; i++) {
        nodes.push(new AtomNode());
    }

    function drawOrbitalRing() {
        const cx = width * 0.5;
        const cy = height * 0.32; // Centered around the portrait ring
        const rx = 76;
        const ry = 42;

        orbitAngle += 0.015;

        // Subtle atomic orbital ellipse 1 (Cyan)
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-0.35);
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.18)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 6]);
        ctx.stroke();

        // Orbiting electron particle 1
        const e1x = Math.cos(orbitAngle) * rx;
        const e1y = Math.sin(orbitAngle) * ry;
        ctx.beginPath();
        ctx.arc(e1x, e1y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();

        // Subtle atomic orbital ellipse 2 (Gold)
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(0.35);
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(226, 168, 75, 0.16)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([5, 7]);
        ctx.stroke();

        // Orbiting electron particle 2
        const e2x = Math.cos(-orbitAngle * 1.2) * rx;
        const e2y = Math.sin(-orbitAngle * 1.2) * ry;
        ctx.beginPath();
        ctx.arc(e2x, e2y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw molecular connecting bonds
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDistance) {
                    const alpha = (1 - dist / maxDistance) * 0.35;
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);

                    if (nodes[i].type === 'gold' || nodes[j].type === 'gold') {
                        ctx.strokeStyle = `rgba(226, 168, 75, ${alpha})`;
                    } else {
                        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
                    }
                    ctx.lineWidth = 1.1;
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }

        // Draw orbital rings
        drawOrbitalRing();

        // Update and draw atom nodes
        nodes.forEach(node => {
            node.update();
            node.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   5. Animated Number Counters
   ========================================================================== */
function initAnimatedCounters() {
    const ribbon = document.querySelector('.metrics-ribbon');
    if (!ribbon) return;

    let animated = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.25 });

    observer.observe(ribbon);

    function animateCounters() {
        const cards = document.querySelectorAll('.metric-card');
        cards.forEach(card => {
            const target = parseInt(card.getAttribute('data-count'), 10);
            const counterEl = card.querySelector('.counter');
            if (!counterEl || isNaN(target)) return;

            let count = 0;
            const duration = 1200;
            const stepTime = 25;
            const steps = duration / stepTime;
            const increment = target / steps;

            const interval = setInterval(() => {
                count += increment;
                if (count >= target) {
                    counterEl.textContent = target;
                    clearInterval(interval);
                } else {
                    counterEl.textContent = Math.floor(count);
                }
            }, stepTime);
        });
    }
}

/* ==========================================================================
   6. Publication Database & Filter Engine
   ========================================================================== */
const PUBLICATIONS_DATA = [
    {
        id: 0,
        title: "Hybrid triazole azo dyes as bioactive compounds: Synthesis, characterization, electrochemical analysis, DFT studies, docking, and live cell imaging investigations",
        journal: "Journal of Molecular Structure",
        year: "2026",
        month: "Apr",
        authors: "Mallikarjuna, B.; Chavan, Prabhakar; Vinay, K. K.; Surendranaik, Y.",
        details: "Vol. 1345, Article 145316 (2026)",
        doi: "10.1016/J.MOLSTRUC.2026.145316"
    },
    {
        id: 1,
        title: "Domino C-C/C-N bond-forming strategy for convergent regioselective synthesis of fused pyrimidines using Zn(L-Proline)2: Integrative bioactivity, LFPs imaging and computational modeling",
        journal: "Journal of Molecular Structure",
        year: "2026",
        month: "Feb",
        authors: "Mandara, A. M.; Chavan, Prabhakar; Yadav, Ganapati Pakkirappa; Surendranaik, Y.",
        details: "Vol. 1344, Article 144171 (2026)",
        doi: "10.1016/J.MOLSTRUC.2025.144171"
    },
    {
        id: 2,
        title: "Synthesis and characterization of substituted 3-((4-methyl-2-oxo-2H-chromen-7-yl)imino)indolin-2-one derivatives as photosensitizers for solar cell application and their NLO properties",
        journal: "Journal of Molecular Structure",
        year: "2026",
        month: "Jan",
        authors: "Surendranaik, Y.; Venkatesh, Talavara; Manjunatha, L. S.",
        details: "Vol. 1343, Article 143954 (2026)",
        doi: "10.1016/J.MOLSTRUC.2025.143954"
    },
    {
        id: 3,
        title: "Synthesis of triazolo-pyrimidine carbonitrile derivatives: A one-vessel three-component reaction, biological screening, docking, DFT, and electrochemical profiling",
        journal: "Journal of Molecular Structure",
        year: "2026",
        month: "2026",
        authors: "Mallikarjuna, B.; Chavan, Prabhakar; Surendranaik, Y.",
        details: "Vol. 1346, Article 146087 (2026)",
        doi: "10.1016/J.MOLSTRUC.2026.146087"
    },
    {
        id: 4,
        title: "Benzoxazole-isatin-based metal complexes as potential anti-tuberculosis agents: synthesis, characterization, in vitro evaluation, and computational modeling",
        journal: "Journal of Coordination Chemistry",
        year: "2026",
        month: "2026",
        authors: "Pooja, T. Kumari; Yuvaraj, T. C. M.; Naik, Y. Surendra",
        details: "Vol. 79, No. 4, pp. 378–397 (2026)",
        doi: "10.1080/00958972.2026.2626033"
    },
    {
        id: 5,
        title: "Synthesis, characterization and biological evaluation of coumarin incorporated azo compounds",
        journal: "Journal of Molecular Structure",
        year: "2025",
        month: "Dec",
        authors: "Karunasagar, K. O.; Bodke, Yadav D.; Vinay, K. K.; Surendranaik, Y.",
        details: "Article 143360 (2025)",
        doi: "10.1016/J.MOLSTRUC.2025.143360"
    },
    {
        id: 6,
        title: "L-Proline driven Knoevenagel condensation for assembling benzimidazole-pyrazole-coumarin frameworks; mechanistic, biological and electrochemical lead sensor applications",
        journal: "Journal of the Indian Chemical Society",
        year: "2025",
        month: "Nov",
        authors: "Mandara, A. M.; Chavan, Prabhakar; Surendranaik, Y.",
        details: "Article 102106 (2025)",
        doi: "10.1016/J.JICS.2025.102106"
    },
    {
        id: 7,
        title: "Synthesis, characterization and geometrical optimization of azo dyes derived from the substituted pyrazole and benzothiazole amines coupled with 3-N,N-diethyl amino phenol",
        journal: "Journal of Molecular Structure",
        year: "2025",
        month: "Oct",
        authors: "Shakuntala, R. B.; Keshavayya, J.; Pushpavathi, Itte; Surendranaik, Y.",
        details: "Vol. 1343, Article 142802 (2025)",
        doi: "10.1016/J.MOLSTRUC.2025.142802"
    },
    {
        id: 8,
        title: "Synthesis, Characterization, Electrochemical Sensing, DFT Analysis, Molecular Docking and Anticancer Activity of a Novel Thiadiazole-Based Azo Dye Incorporating a Barbituric Acid Scaffold",
        journal: "Journal of Molecular Structure",
        year: "2025",
        month: "Oct",
        authors: "Harisha, S.; Nagaraj, Kalyan; Surendranaik, Y.",
        details: "Vol. 1341, Article 142576 (2025)",
        doi: "10.1016/J.MOLSTRUC.2025.142576"
    },
    {
        id: 9,
        title: "Synthesis, Solvatochromic, LFPs, Computational, and Electrochemical Investigation of Novel Sulfadiazine Azo Dyes and Their Biological Studies",
        journal: "ChemistrySelect",
        year: "2025",
        month: "Aug",
        authors: "Pavithra; Pushpavathi, Itte; Naik, Y. Surendra",
        details: "Vol. 10, No. 33, Article e01285 (2025)",
        doi: "10.1002/SLCT.202501285"
    },
    {
        id: 10,
        title: "Facile CeO₂ Nanoparticles Catalysed the Synthesis of a Series of 2,4,5-Trisubstituted Imidazole Derivatives and their DFT Studies for NLO Application",
        journal: "Letters in Organic Chemistry",
        year: "2025",
        month: "Aug",
        authors: "Yashyanaik, Surendranaik; Venkatesh, Talavara; M.e., Jayachandu",
        details: "Vol. 22, No. 8, pp. 642–652 (2025)",
        doi: "10.2174/0115701786362014250102043411"
    },
    {
        id: 11,
        title: "Synthesis, Biological, and Computational Studies of Novel Isoxazolone-Coupled Azo Moieties and Their Photophysical Interactions",
        journal: "Russian Journal of Bioorganic Chemistry",
        year: "2025",
        month: "Jun",
        authors: "Karunasagar, K. O.; Bodke, Yadav D.; Surendranaik, Y.",
        details: "Vol. 51, No. 3, pp. 1099–1114 (2025)",
        doi: "10.1134/S1068162024605962"
    },
    {
        id: 12,
        title: "Synthesis and evaluation of the anti-TB activity of novel 7-(2-(4-substitutedphenyl)-4,5-diphenyl-1H-imidazol-1-yl)-4-methyl-2H-chromen-2-one derivatives and their DFT studies for NLO application",
        journal: "Journal of Molecular Structure",
        year: "2025",
        month: "Feb",
        authors: "Surendranaik, Y.; Venkatesh, Talavara",
        details: "Vol. 1321, Article 140111 (2025)",
        doi: "10.1016/J.MOLSTRUC.2024.140111"
    },
    {
        id: 13,
        title: "Synthesis, characterization, solvatochromic, and electrochemical investigation of novel 4-methyl coumarin fused azo dyes as an NLO material and their biological studies",
        journal: "Structural Chemistry",
        year: "2025",
        month: "Feb",
        authors: "Surendranaik, Y.; Venkatesh, Talavara; Naik, Eresha",
        details: "Vol. 36, No. 1, pp. 171–190 (2025)",
        doi: "10.1007/S11224-024-02359-5"
    },
    {
        id: 14,
        title: "Synthesis, Characterization, and Optical Properties of Novel Heterocyclic Azo Dyes and Evaluation of Their Antioxidant Activity as an Active Sunscreen Agent",
        journal: "ChemistrySelect",
        year: "2024",
        month: "Sep",
        authors: "Surendranaik, Y.; Venkatesh, Talavara; Chethan",
        details: "Vol. 9, No. 34, Article e202402411 (2024)",
        doi: "10.1002/SLCT.202402411"
    },
    {
        id: 15,
        title: "Red-emitting 4-methyl coumarin fused barbituric acid as an electrochemical sensor for catechol detection and probe for latent fingerprints",
        journal: "Luminescence (Wiley)",
        year: "2024",
        month: "Jul",
        authors: "Yashyanaik, Surendranaik; Venkatesh, Talavara; Vinuth, Mirle",
        details: "Vol. 39, No. 7, Article e4825 (2024)",
        doi: "10.1002/BIO.4825"
    }
];

function initPublicationSearch() {
    const searchInput = document.getElementById('pubSearchInput');
    const clearBtn = document.getElementById('clearSearchBtn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const pubCards = document.querySelectorAll('.pub-entry-card');
    const yearDividers = document.querySelectorAll('.pub-year-divider');
    const noPubsMsg = document.getElementById('noPubsMessage');

    let activeFilter = 'all';
    let searchQuery = '';

    function filterPublications() {
        let visibleCount = 0;

        pubCards.forEach(card => {
            const cardYear = card.getAttribute('data-year');
            const cardText = card.textContent.toLowerCase();
            const matchesYear = (activeFilter === 'all' || cardYear === activeFilter);
            const matchesSearch = (searchQuery === '' || cardText.includes(searchQuery));

            if (matchesYear && matchesSearch) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        yearDividers.forEach(divider => {
            const dividerYear = divider.getAttribute('data-year');
            const hasVisibleInYear = Array.from(pubCards).some(c => 
                c.getAttribute('data-year') === dividerYear && c.style.display !== 'none'
            );
            divider.style.display = hasVisibleInYear ? 'block' : 'none';
        });

        if (noPubsMsg) {
            noPubsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            if (clearBtn) clearBtn.style.display = searchQuery ? 'block' : 'none';
            filterPublications();
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            searchQuery = '';
            clearBtn.style.display = 'none';
            filterPublications();
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.getAttribute('data-filter');
            filterPublications();
        });
    });
}

/* ==========================================================================
   7. Citation Modal Dialog & Generator (BibTeX, APA, MLA)
   ========================================================================== */
let currentPubIndex = 0;
let currentCitationTab = 'bibtex';

window.openCiteModal = function (pubIndex) {
    currentPubIndex = pubIndex;
    const modal = document.getElementById('citationModal');
    if (modal) {
        modal.classList.add('show');
        renderCitation();
    }
};

window.closeCiteModal = function () {
    const modal = document.getElementById('citationModal');
    if (modal) modal.classList.remove('show');
};

window.switchCiteTab = function (tab) {
    currentCitationTab = tab;
    document.querySelectorAll('.cite-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase().includes(tab));
    });
    renderCitation();
};

function renderCitation() {
    const pub = PUBLICATIONS_DATA[currentPubIndex];
    const codeEl = document.getElementById('citationCode');
    if (!pub || !codeEl) return;

    if (currentCitationTab === 'bibtex') {
        const firstAuthor = pub.authors.split(';')[0].split(',')[0].trim().toLowerCase();
        const bibtexKey = `${firstAuthor}${pub.year}${pub.title.split(' ')[0].toLowerCase()}`;
        codeEl.textContent = `@article{${bibtexKey},
  title   = {${pub.title}},
  author  = {${pub.authors.replace(/;/g, ' and')}},
  journal = {${pub.journal}},
  year    = {${pub.year}},
  doi     = {${pub.doi}},
  url     = {https://doi.org/${pub.doi}}
}`;
    } else if (currentCitationTab === 'apa') {
        codeEl.textContent = `${pub.authors} (${pub.year}). ${pub.title}. ${pub.journal}, ${pub.details}. https://doi.org/${pub.doi}`;
    } else if (currentCitationTab === 'mla') {
        codeEl.textContent = `${pub.authors}. "${pub.title}." ${pub.journal}, ${pub.details}. doi:${pub.doi}.`;
    }
}

window.copyActiveCitation = function () {
    const codeEl = document.getElementById('citationCode');
    if (codeEl) {
        copyToClipboard(codeEl.textContent, 'Citation copied to clipboard!');
        closeCiteModal();
    }
};

window.copyToClipboard = function (text, message = 'Copied to clipboard!') {
    navigator.clipboard.writeText(text).then(() => {
        showToast(message);
    }).catch(() => {
        showToast('Failed to copy');
    });
};

function showToast(message) {
    const toast = document.getElementById('toastNotification');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2800);
}

/* ==========================================================================
   8. Image Lightbox Modal Viewer
   ========================================================================== */
window.openLightbox = function (imageSrc, title, description) {
    const modal = document.getElementById('imageLightboxModal');
    const img = document.getElementById('lightboxImage');
    const titleEl = document.getElementById('lightboxTitle');
    const descEl = document.getElementById('lightboxDesc');

    if (!modal || !img) return;

    img.src = imageSrc;
    img.alt = title || 'Enlarged Academic Figure';
    if (titleEl) titleEl.textContent = title || 'Scientific Visual';
    if (descEl) descEl.textContent = description || '';

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
};

window.closeLightbox = function () {
    const modal = document.getElementById('imageLightboxModal');
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
};

window.handleLightboxBackdropClick = function (event) {
    if (event.target && event.target.id === 'imageLightboxModal') {
        closeLightbox();
    }
};

// Global Escape Key Listener for Modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
        if (typeof closeCiteModal === 'function') closeCiteModal();
    }
});

/* ==========================================================================
   9. Mobile Navigation
   ========================================================================== */
function initMobileNav() {
    const hamburger = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

/* ==========================================================================
   9. Clean ATS Academic CV Generator (Print / PDF)
   ========================================================================== */
window.generateATSCV = function () {
    const html = buildAcademicCVHTML();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const win = window.open(url, '_blank');
    if (win) {
        win.onload = function () {
            win.focus();
            win.print();
        };
    }
    setTimeout(() => URL.revokeObjectURL(url), 60000);
};

function buildAcademicCVHTML() {
    const pubsFormatted = PUBLICATIONS_DATA.map((p, idx) => `
    <div class="cv-pub-item">
      [${idx + 1}] <strong>${p.authors}</strong> (${p.year}). "${p.title}." <em>${p.journal}</em>, ${p.details}. DOI: ${p.doi}
    </div>
    `).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Dr_Surendranaik_Y_Curriculum_Vitae</title>
<style>
  @page { margin: 0.6in 0.75in; size: letter; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Calibri', 'Arial', 'Helvetica', sans-serif;
    font-size: 10.5pt;
    line-height: 1.38;
    color: #111827;
    max-width: 7.6in;
    margin: 0 auto;
    padding: 0.2in 0;
  }
  h1 {
    font-size: 19pt;
    font-weight: 700;
    color: #0f2744;
    text-align: center;
    letter-spacing: 0.5px;
    margin-bottom: 2pt;
  }
  .contact-header {
    text-align: center;
    font-size: 9.5pt;
    color: #374151;
    margin-bottom: 8pt;
    line-height: 1.45;
  }
  hr.divider {
    border: none;
    border-top: 1.5px solid #0f2744;
    margin: 6pt 0 10pt;
  }
  h2 {
    font-size: 11.5pt;
    font-weight: 700;
    color: #0f2744;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    border-bottom: 1px solid #d1d5db;
    padding-bottom: 2pt;
    margin-top: 10pt;
    margin-bottom: 5pt;
  }
  p.section-p {
    font-size: 10pt;
    line-height: 1.4;
    margin-bottom: 4pt;
    text-align: justify;
  }
  .cv-entry {
    margin-bottom: 6pt;
  }
  .cv-entry-header {
    display: flex;
    justify-content: space-between;
    font-weight: 700;
    font-size: 10.5pt;
    color: #0f2744;
  }
  .cv-date {
    font-weight: 600;
    font-size: 9.5pt;
    color: #4b5563;
  }
  .cv-sub {
    font-size: 9.8pt;
    color: #374151;
    margin-bottom: 2pt;
  }
  ul.cv-bullets {
    list-style: square;
    padding-left: 16pt;
    margin: 2pt 0;
  }
  ul.cv-bullets li {
    font-size: 9.8pt;
    line-height: 1.35;
    margin-bottom: 2pt;
  }
  .cv-pub-item {
    font-size: 9.3pt;
    line-height: 1.35;
    margin-bottom: 4pt;
    padding-left: 16pt;
    text-indent: -16pt;
  }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>
</head>
<body>
  <h1>DR. SURENDRANAIK Y</h1>
  <div class="contact-header">
    <strong>Assistant Professor, Department of Chemistry</strong><br>
    MVJ College of Engineering, Channasandra Main Road, near ITPB, Whitefield, Bengaluru, Karnataka 560067<br>
    Phone: +91 93804 70819 | Email: surendranaiky33@gmail.com<br>
    Google Scholar: Surendranaik Y | ORCID: 0009-0007-9150-8297 | Location: Bengaluru, Karnataka, India
  </div>

  <hr class="divider">

  <h2>Professional Summary</h2>
  <p class="section-p">
    Assistant Professor of Chemistry with Ph.D. in Organic Chemistry from Kuvempu University. Established track record in synthesis and characterization of bioactive heterocyclic compounds, electrochemical sensing devices, NLO materials, and computational modeling (DFT, Molecular Docking, CADD). Author of 16 peer-reviewed research papers in high-impact international journals and co-inventor on 1 Indian Patent. Qualified CSIR-NET (Chemical Sciences, AIR 52, Top 1%), GATE (2023), and K-SET (2022). Committed to academic excellence, innovative pedagogy, and interdisciplinary chemical research.
  </p>

  <h2>Research Areas &amp; Specializations</h2>
  <p class="section-p">
    Organic Synthesis, Medicinal Chemistry, Heterocyclic Scaffold Design, Green Chemistry & Catalysis, Electrochemical Sensors, Latent Fingerprint (LFPs) Imaging, Density Functional Theory (DFT), Computer-Aided Drug Design (CADD), and Spectroscopic Structural Elucidation (NMR, IR, UV-Vis, Mass Spectrometry).
  </p>

  <h2>Academic &amp; Professional Experience</h2>
  <div class="cv-entry">
    <div class="cv-entry-header">
      <span>Assistant Professor — Department of Chemistry</span>
      <span class="cv-date">2026 – Present</span>
    </div>
    <div class="cv-sub">MVJ College of Engineering, Bengaluru, Karnataka</div>
    <ul class="cv-bullets">
      <li>Instructing Engineering Chemistry and Advanced Chemistry courses for undergraduate engineering students.</li>
      <li>Mentoring student research, supervising laboratory work, and designing instructional modules.</li>
    </ul>
  </div>

  <div class="cv-entry">
    <div class="cv-entry-header">
      <span>Senior Associate</span>
      <span class="cv-date">Feb 2026 – Apr 2026</span>
    </div>
    <div class="cv-sub">Innodata Inc.</div>
    <ul class="cv-bullets">
      <li>Designed structured academic content and problem-solving frameworks for advanced organic and medicinal chemistry using LaTeX and scientific visualization tools.</li>
      <li>Maintained scientific accuracy and data rigor within tight delivery timelines.</li>
    </ul>
  </div>

  <div class="cv-entry">
    <div class="cv-entry-header">
      <span>Doctoral Research Scholar</span>
      <span class="cv-date">Jul 2022 – May 2026</span>
    </div>
    <div class="cv-sub">Kuvempu University, Shivamogga, Karnataka</div>
    <ul class="cv-bullets">
      <li>Conducted full-time doctoral research on novel heterocyclic frameworks for bio-applications and sensors.</li>
      <li>Authored 16 journal articles and 1 Indian patent application.</li>
    </ul>
  </div>

  <div class="cv-entry">
    <div class="cv-entry-header">
      <span>Guest Lecturer</span>
      <span class="cv-date">Feb 2022 – Apr 2022</span>
    </div>
    <div class="cv-sub">Sahyadri Science College, Shimoga, Karnataka</div>
    <ul class="cv-bullets">
      <li>Delivered advanced lectures in Organic Chemistry and conducted practical classes for postgraduate M.Sc. students.</li>
    </ul>
  </div>

  <h2>Educational Qualifications</h2>
  <ul class="cv-bullets">
    <li><strong>Ph.D. in Organic Chemistry</strong> — Kuvempu University, Shivamogga (2022–2026)</li>
    <li><strong>M.Sc. in Chemistry</strong> — Kuvempu University, Shivamogga (2021), <strong>First Class (72.36%)</strong></li>
    <li><strong>B.Sc. (Chemistry, Zoology, Biotechnology)</strong> — Govt. Sir M.V. Science College, Bhadravathi (2019), <strong>Distinction (80.00%)</strong></li>
  </ul>

  <h2>National Level Competitive Honors &amp; Awards</h2>
  <ul class="cv-bullets">
    <li><strong>CSIR-NET (Chemical Sciences)</strong> — <strong>All India Rank 52 (Top 1%)</strong>, Qualified (2026)</li>
    <li><strong>Graduate Aptitude Test in Engineering (GATE)</strong> — Qualified in Chemical Sciences (2023)</li>
    <li><strong>Karnataka State Eligibility Test (K-SET)</strong> — Qualified for Assistant Professorship (2022)</li>
  </ul>

  <h2>Patents</h2>
  <p class="section-p">
    <strong>Novel Anti-TB Heterocyclic Compounds</strong> — Indian Patent Application No. 202541004838 (Coumarin-imidazole bioactive derivatives).
  </p>

  <h2>Peer-Reviewed Journal Publications (16 Articles)</h2>
  ${pubsFormatted}

  <h2>Conferences &amp; Symposia Presentations</h2>
  <ul class="cv-bullets">
    <li><strong>ICACPS-2025</strong> — International Conference on Advances in Chemical and Physical Sciences (Jan 23–24, 2025), Amrita Vishwa Vidyapeetham, Mysuru — <em>Poster Presentation</em></li>
    <li><strong>ISEMS-2024</strong> — International Conference on Innovations in Sustainable Energy and Material Science (Mar 1–2, 2024), JNNCE Shivamogga — <em>Oral Presentation</em></li>
    <li><strong>Rasayan 18</strong> — Two-Day International Symposium on Science Beyond Boundary (Jan 29–30, 2024), Vidyasagar University & CHRIST University — <em>Poster Presentation</em></li>
  </ul>

  <h2>Workshops &amp; Advanced Training</h2>
  <ul class="cv-bullets">
    <li>Hands-on Training Program on Electrochemical Techniques & Energy Storage Systems (Jun 2023), CIIRC, Bengaluru</li>
    <li>Seven-Day National Level DST-STUTI Training Programme (Nov 2022), Mangalore University</li>
    <li>National Intellectual Property Awareness Program (Aug 2022), Intellectual Property Office, India</li>
    <li>National Workshop on "Recent Trends in Material Frontiers: Chemical and Biological Aspects" (Aug 2022), Amity University, Kolkata</li>
  </ul>
</body>
</html>`;
}