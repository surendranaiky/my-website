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

// ===== Publications View More / View Less =====
function togglePublications() {
    const extra = document.getElementById('pubExtra');
    const btn = document.getElementById('viewMoreBtn');
    const expanded = extra.classList.toggle('expanded');
    btn.textContent = expanded ? 'View Less' : 'View More';
    if (!expanded) {
        document.getElementById('publications').scrollIntoView({ behavior: 'smooth' });
    }
}

// ===== Conferences View More / View Less =====
function toggleConferences() {
    const extra = document.getElementById('confExtra');
    const btn = document.getElementById('viewConfBtn');
    const expanded = extra.classList.toggle('expanded');
    btn.textContent = expanded ? 'View Less' : 'View More';
    if (!expanded) {
        document.getElementById('conferences').scrollIntoView({ behavior: 'smooth' });
    }
}