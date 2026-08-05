// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Header image slider =====
(function () {
    const slides = document.querySelectorAll('#headerSlider .slide');
    const dotsWrap = document.getElementById('sliderDots');
    let current = 0;
    let timer;

    // Build dots
    slides.forEach((_, i) => {
        const dot = document.createElement('span');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap.querySelectorAll('span');

    function showSlide(index) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
    }

    function goToSlide(index) {
        showSlide(index);
        resetTimer();
    }

    window.changeSlide = function (step) {
        showSlide(current + step);
        resetTimer();
    };

    function resetTimer() {
        clearInterval(timer);
        timer = setInterval(() => showSlide(current + 1), 4000);
    }

    resetTimer();
})();

// ===== Conferences View More / View Less =====
function toggleConferences() {
    const extra = document.getElementById('confExtra');
    const btn = document.getElementById('viewConfBtn');
    if (!extra || !btn) return;
    const expanded = extra.classList.toggle('expanded');
    btn.textContent = expanded ? 'View Less' : 'View More';
    if (!expanded) {
        document.getElementById('conferences').scrollIntoView({ behavior: 'smooth' });
    }
}

// ===== Work History View More / View Less =====
function toggleWorkHistory() {
    const extra = document.getElementById('whExtra');
    const btn = document.getElementById('viewWhBtn');
    if (!extra || !btn) return;
    const expanded = extra.classList.toggle('expanded');
    btn.textContent = expanded ? 'View Less' : 'View More';
    if (!expanded) {
        document.getElementById('work-history').scrollIntoView({ behavior: 'smooth' });
    }
}

// ===== Workshops View More / View Less =====
function toggleWorkshops() {
    const extra = document.getElementById('wsExtra');
    const btn = document.getElementById('viewWsBtn');
    if (!extra || !btn) return;
    const expanded = extra.classList.toggle('expanded');
    btn.textContent = expanded ? 'View Less' : 'View More';
    if (!expanded) {
        document.getElementById('workshops').scrollIntoView({ behavior: 'smooth' });
    }
}

// ===== Publications View More / View Less =====
function togglePublications() {
    const extra = document.getElementById('pubExtra');
    const btn = document.getElementById('viewPubBtn');
    if (!extra || !btn) return;
    const expanded = extra.classList.toggle('expanded');
    btn.textContent = expanded ? 'View Less' : 'View More (12+)';
    if (!expanded) {
        document.getElementById('publications').scrollIntoView({ behavior: 'smooth' });
    }
}

// ===== Auto-generate ATS-Friendly CV (PDF) =====
function generateATSCV() {
    const data = collectCVData();
    const html = buildCVHTML(data);

    // Create a Blob with the HTML content
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // Open in a new window and trigger print
    const win = window.open(url, '_blank');
    if (win) {
        win.onload = function () {
            win.focus();
            win.print();
        };
    }
    setTimeout(() => URL.revokeObjectURL(url), 60000);
}

function buildCVHTML(data) {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Dr_Surendranaik_Y_CV</title>
<style>
  @page { margin: 0.6in 0.75in; size: letter; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Calibri', 'Arial', 'Helvetica', sans-serif;
    font-size: 11pt;
    line-height: 1.35;
    color: #111;
    max-width: 7.5in;
    margin: 0 auto;
    padding: 0;
  }
  h1 {
    font-size: 18pt;
    font-weight: 700;
    color: #0a1628;
    text-align: center;
    margin-bottom: 2pt;
    letter-spacing: 0.5px;
  }
  .contact-line {
    text-align: center;
    font-size: 9.5pt;
    color: #333;
    margin-bottom: 2pt;
    line-height: 1.4;
  }
  hr {
    border: none;
    border-top: 1.5px solid #0a1628;
    margin: 8pt 0;
  }
  h2 {
    font-size: 12pt;
    font-weight: 700;
    color: #0a1628;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    border-bottom: 1px solid #ccc;
    padding-bottom: 2pt;
    margin-top: 10pt;
    margin-bottom: 5pt;
  }
  .summary-text {
    font-size: 10pt;
    line-height: 1.4;
    margin-bottom: 4pt;
    text-align: justify;
  }
  .tags-text {
    font-size: 10pt;
    line-height: 1.4;
    margin-bottom: 4pt;
  }
  .work-entry {
    margin-bottom: 6pt;
  }
  .work-entry .entry-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-weight: 700;
    font-size: 10.5pt;
    color: #0a1628;
  }
  .work-entry .entry-header .date {
    font-weight: 400;
    font-size: 9.5pt;
    color: #555;
    white-space: nowrap;
  }
  .work-entry .org {
    font-size: 10pt;
    color: #444;
    margin-bottom: 2pt;
  }
  .work-entry ul {
    list-style: none;
    padding-left: 14pt;
    margin: 0;
  }
  .work-entry ul li {
    font-size: 10pt;
    line-height: 1.35;
    margin-bottom: 1pt;
    position: relative;
  }
  .work-entry ul li::before {
    content: '\\2022';
    position: absolute;
    left: -10pt;
    color: #0a1628;
  }
  .pub-entry {
    font-size: 9.5pt;
    line-height: 1.4;
    margin-bottom: 4pt;
    padding-left: 14pt;
    text-indent: -14pt;
  }
  .pub-entry em {
    font-style: italic;
  }
  .edu-entry {
    font-size: 10pt;
    line-height: 1.35;
    margin-bottom: 2pt;
    padding-left: 14pt;
    text-indent: -14pt;
  }
  .award-entry {
    font-size: 10pt;
    line-height: 1.35;
    margin-bottom: 2pt;
    padding-left: 14pt;
    text-indent: -14pt;
  }
  .conf-entry {
    font-size: 10pt;
    line-height: 1.35;
    margin-bottom: 3pt;
    padding-left: 14pt;
    text-indent: -14pt;
  }
  .workshop-entry {
    font-size: 10pt;
    line-height: 1.35;
    margin-bottom: 3pt;
    padding-left: 14pt;
    text-indent: -14pt;
  }
  .teaching-entry {
    font-size: 10pt;
    line-height: 1.35;
    margin-bottom: 2pt;
    padding-left: 14pt;
    text-indent: -14pt;
  }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>
</head>
<body>
  <h1>DR. SURENDRANAIK Y</h1>
  <div class="contact-line">Assistant Professor, Department of Chemistry</div>
  <div class="contact-line">MVJ College of Engineering, Channasandra Main Road, near ITPB, Whitefield, Bengaluru, Karnataka 560067</div>
  <div class="contact-line">Phone: +91 93804 70819 | Email: surendranaiky33@gmail.com</div>
  <div class="contact-line">ORCID: 0009-0007-9150-8297 | Google Scholar</div>

  <hr>

  <h2>Professional Summary</h2>
  <p class="summary-text">${data.summary}</p>

  <h2>Research Interests</h2>
  <p class="tags-text">${data.researchInterests}</p>

  <h2>Work History</h2>
  ${data.workHistory}

  <h2>Educational Qualifications</h2>
  ${data.education}

  <h2>Awards &amp; Achievements</h2>
  ${data.awards}

  <h2>Publications</h2>
  ${data.publications}

  <h2>Patents</h2>
  <div class="pub-entry">${data.patents}</div>

  <h2>Conferences</h2>
  ${data.conferences}

  <h2>Workshops &amp; Training</h2>
  ${data.workshops}

  <h2>Teaching Experience</h2>
  <p class="teaching-entry">Assistant Professor, Department of Chemistry — MVJ College of Engineering, Bengaluru</p>
  <p class="teaching-entry">Courses taught: Engineering Chemistry, Organic Chemistry, Spectroscopy</p>
</body>
</html>`;
}

function collectCVData() {
    const data = {};

    // Professional Summary
    data.summary = 'Assistant Professor in Chemistry with a Ph.D. in Organic Chemistry from Kuvempu University, Shivamogga. Expertise in Organic and Medicinal Chemistry with a strong record of research publications in heterocyclic compounds, spectroscopy, and applied chemistry. Qualified CSIR-NET (AIR 52), GATE, and K-SET. Passionate about teaching, mentoring, and advancing research in heterocyclic compounds, electrochemical sensing, and computational chemistry.';

    // Research Interests
    data.researchInterests = 'Organic Chemistry, Medicinal Chemistry, Heterocyclic Compounds, Green Chemistry, Electrochemical Sensing, Computational Chemistry (DFT, Molecular Docking), Computer Aided Drug Design.';

    // Work History
    data.workHistory = `
    <div class="work-entry">
      <div class="entry-header"><span>Senior Associate</span><span class="date">Feb 2026 – Apr 2026</span></div>
      <div class="org">Innodata Inc.</div>
      <ul>
        <li>Designed structured academic content and problem-solving frameworks for advanced organic and medicinal chemistry using LaTeX and scientific visualization tools.</li>
        <li>Maintained rigorous scientific accuracy while delivering high-quality research content and data visualizations within tight deadlines.</li>
      </ul>
    </div>
    <div class="work-entry">
      <div class="entry-header"><span>Research Scholar</span><span class="date">Jul 2022 – May 2026</span></div>
      <div class="org">Kuvempu University, Shankaraghatta, Shimoga</div>
      <ul>
        <li>Conducted research on synthesis, characterization, and applications of novel heterocyclic compounds in organic and medicinal chemistry.</li>
        <li>Collaborated with faculty and peers to advance knowledge in the field, contributing to innovative research projects.</li>
      </ul>
    </div>
    <div class="work-entry">
      <div class="entry-header"><span>Guest Lecturer</span><span class="date">Feb 2022 – Apr 2022</span></div>
      <div class="org">Sahyadri Science College, Shimoga</div>
      <ul>
        <li>Delivered lectures on organic chemistry and conducted theoretical and practical classes for postgraduate students.</li>
        <li>Fostered a collaborative learning environment, encouraging student participation and inquiry.</li>
      </ul>
    </div>`;

    // Education
    data.education = `
    <div class="edu-entry">• Ph.D. in Organic Chemistry — Kuvempu University, Shivamogga (2022–2026)</div>
    <div class="edu-entry">• M.Sc. in Chemistry — Kuvempu University, Shivamogga (2021), First Class (72.36%)</div>
    <div class="edu-entry">• B.Sc. (Chemistry, Zoology, Biotechnology) — Govt. Sir M.V. Science College, Bhadravathi (2019), Distinction (80%)</div>
    <div class="edu-entry">• CSIR-NET (Chemical Sciences) — AIR 52, Qualified (2026)</div>
    <div class="edu-entry">• K-SET — Qualified (2022)</div>
    <div class="edu-entry">• GATE — Qualified (2023)</div>`;

    // Awards
    data.awards = `
    <div class="award-entry">• CSIR-NET (Chemical Sciences) — All India Rank 52 (2026)</div>`;

    // Publications (scrape from DOM with proper citation format)
    const lines = [];
    const pubEls = document.querySelectorAll('#publications .publication');
    pubEls.forEach((pubEl, i) => {
        const titleEl = pubEl.querySelector('h3 a');
        const title = titleEl ? titleEl.textContent.trim() : (pubEl.querySelector('h3') ? pubEl.querySelector('h3').textContent.trim() : '');
        const ps = pubEl.querySelectorAll('p');
        const journal = ps.length > 0 ? ps[0].textContent.trim() : '';
        const authors = ps.length > 1 ? ps[1].textContent.replace('Authors: ', '').trim() : '';
        const details = ps.length > 2 ? ps[2].textContent.trim() : '';
        const link = titleEl ? titleEl.getAttribute('href') : '';
        const doi = link ? link.replace('https://doi.org/', '') : '';

        // Build citation: Authors (Year) Title. Journal, Details. DOI
        let citation = `${authors} (${journal.match(/20\d{2}/)?.[0] || ''}) ${title}. `;
        citation += `<em>${journal.replace(/, \w+ 20\d{2}$/, '').replace(/20\d{2}$/, '').trim()}</em>`;
        if (details && !details.includes('Vol. X')) citation += `, ${details}`;
        citation += `.`;
        if (doi) citation += ` https://doi.org/${doi}`;

        lines.push(citation);
    });
    data.publications = lines.join('</div><div class="pub-entry">');
    if (!data.publications) data.publications = '';
    else data.publications = '<div class="pub-entry">' + data.publications + '</div>';

    // Patents
    data.patents = 'Novel Anti-TB Heterocyclic Compounds — Filed Indian Patent (Application No. 202541004838) for coumarin-imidazole derivatives.';

    // Conferences
    data.conferences = `
    <div class="conf-entry">• ICACPS-2025 — International Conference on Advances in Chemical and Physical Sciences (Jan 2025) — Poster Presentation</div>
    <div class="conf-entry">• ISEMS-2024 — International Conference on Innovations in Sustainable Energy and Material Science (Mar 2024) — Oral Presentation</div>
    <div class="conf-entry">• Rasayan 18 — Two-Day International Symposium on Science Beyond Boundary (Jan 2024) — Poster Presentation</div>`;

    // Workshops
    data.workshops = `
    <div class="workshop-entry">• Hands-on Training Program on Electrochemical Techniques and Energy Storage Systems (Jun 2023)</div>
    <div class="workshop-entry">• Seven-Day National Level DST-STUTI Training Programme (Nov 2022)</div>
    <div class="workshop-entry">• National Intellectual Property Awareness Program (Aug 2022)</div>
    <div class="workshop-entry">• National Workshop on "Recent Trends in Material Frontiers" (Aug 2022)</div>`;

    return data;
}

// ===== Scroll-triggered fade-in animations =====
(function () {
    const fadeEls = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -30px 0px'
    });

    fadeEls.forEach(el => observer.observe(el));
})();

// ===== Sticky nav: highlight active section & shadow =====
(function () {
    const navbar = document.getElementById('navbar');
    const navLinks = navbar.querySelectorAll('a');
    const sections = [];

    navLinks.forEach(link => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) sections.push(target);
    });

    function updateNav() {
        let currentSection = sections[0];
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            if (section.offsetTop <= scrollPos) {
                currentSection = section;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection.id) {
                link.classList.add('active');
            }
        });

        navbar.classList.toggle('scrolled', window.scrollY > 100);
    }

    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
})();