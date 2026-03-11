document.addEventListener('DOMContentLoaded', () => {

    // --- SVG icon strings (inline, no lucide dependency for these) ---
    const ICON = {
        circle:      `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`,
        check:       `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.1 9 11.1"/></svg>`,
        loader:      `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin-icon"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>`,
        checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.1 9 11.1"/></svg>`,
        triangle:    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
        help:        `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
        refresh:     `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
        upload:      `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>`,
        shield:      `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`,
    };

    // Render static icons into the pre-placed span placeholders
    document.querySelector('.logo-icon').innerHTML = ICON.shield;
    document.querySelector('.upload-icon').innerHTML = ICON.upload;
    document.querySelector('#reset-btn span').innerHTML = ICON.refresh;
    document.querySelector('.badge-icon').innerHTML = ICON.checkCircle;

    // Elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const browseBtn = document.getElementById('browse-btn');

    const uploadSection = document.getElementById('upload-section');
    const scanningSection = document.getElementById('scanning-section');
    const resultsSection = document.getElementById('results-section');

    const previewContainer = document.getElementById('preview-container');
    const resultMediaContainer = document.getElementById('result-media-container');

    const scanProgress = document.getElementById('scan-progress');
    const scanStatusText = document.getElementById('scan-status-text');

    const stepEls = [
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3'),
        document.getElementById('step-4'),
    ];

    const authText = document.getElementById('auth-text');
    const authBadge = document.getElementById('auth-badge');
    const finalScoreEl = document.getElementById('final-score');
    const scoreIndicator = document.getElementById('score-indicator');
    const resetBtn = document.getElementById('reset-btn');

    const metricBars = {
        noise:  document.getElementById('metric-noise'),
        edges:  document.getElementById('metric-edges'),
        freq:   document.getElementById('metric-freq'),
        logic:  document.getElementById('metric-logic'),
    };

    // ── Section Switching ──────────────────────────────────────────────────────
    // We control visibility purely with opacity + pointer-events + display.
    // Two class states: 'card visible' or 'card' (invisible).
    const allSections = [uploadSection, scanningSection, resultsSection];

    function showSection(target) {
        allSections.forEach(sec => {
            if (sec === target) {
                sec.style.display = 'block';
                // Defer to next paint so display:block is applied before opacity
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        sec.style.opacity = '1';
                        sec.style.transform = 'translateY(0)';
                        sec.style.pointerEvents = 'all';
                    });
                });
            } else {
                sec.style.opacity = '0';
                sec.style.transform = 'translateY(20px)';
                sec.style.pointerEvents = 'none';
                setTimeout(() => {
                    if (sec.style.opacity === '0') sec.style.display = 'none';
                }, 400);
            }
        });
    }

    // ── Drag & Drop ────────────────────────────────────────────────────────────
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
        dropZone.addEventListener(evt, e => { e.preventDefault(); e.stopPropagation(); });
    });
    ['dragenter', 'dragover'].forEach(evt => dropZone.addEventListener(evt, () => dropZone.classList.add('dragover')));
    ['dragleave', 'drop'].forEach(evt => dropZone.addEventListener(evt, () => dropZone.classList.remove('dragover')));

    dropZone.addEventListener('drop', e => handleFiles(e.dataTransfer.files));
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', function () { handleFiles(this.files); });

    // ── File Handling ──────────────────────────────────────────────────────────
    function handleFiles(files) {
        if (!files || files.length === 0) return;
        const file = files[0];

        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');

        if (!isImage && !isVideo) {
            showToast('Unsupported format. Please upload an image or video file.');
            return;
        }
        if (file.size > 50 * 1024 * 1024) {
            showToast('File too large. Maximum size is 50 MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const src = e.target.result;
            let mediaHTML;
            if (isImage) {
                mediaHTML = `<img src="${src}" alt="Uploaded media" style="max-width:100%;max-height:380px;object-fit:contain;display:block;margin:auto;">`;
            } else {
                mediaHTML = `<video src="${src}" autoplay loop muted playsinline style="max-width:100%;max-height:380px;object-fit:contain;display:block;margin:auto;"></video>`;
            }

            // Set preview
            previewContainer.innerHTML = mediaHTML +
                `<div class="scanning-overlay"><div class="scan-line"></div><div class="scan-grid"></div></div>`;

            // Set result media
            resultMediaContainer.innerHTML = mediaHTML;

            startScanningProcess();
        };
        reader.readAsDataURL(file);
    }

    // ── Scanning ───────────────────────────────────────────────────────────────
    const stepMessages = [
        'Extracting metadata...',
        'Analyzing pixel variations...',
        'Checking for GAN artifacts...',
        'Computing probability score...',
    ];

    function resetSteps() {
        stepEls.forEach((el, i) => {
            el.className = 'step waiting';
            el.querySelector('.step-icon').innerHTML = ICON.circle;
        });
    }

    function startScanningProcess() {
        showSection(scanningSection);
        scanProgress.style.width = '0%';
        resetSteps();

        runStep(0, 0, [10, 40, 70, 100], () => {
            setTimeout(() => showResults(), 800);
        });
    }

    function runStep(index, delay, progressStops, onDone) {
        setTimeout(() => {
            const el = stepEls[index];
            el.className = 'step active';
            el.querySelector('.step-icon').innerHTML = ICON.loader;
            scanStatusText.textContent = stepMessages[index];
            scanProgress.style.width = progressStops[index] + '%';

            const nextDelay = [1400, 2200, 2600, 1800][index];
            setTimeout(() => {
                el.className = 'step completed';
                el.querySelector('.step-icon').innerHTML = ICON.check;

                if (index < 3) {
                    runStep(index + 1, 0, progressStops, onDone);
                } else {
                    if (onDone) onDone();
                }
            }, nextDelay);
        }, delay);
    }

    // ── Results ────────────────────────────────────────────────────────────────
    function generateScore() {
        const ai = Math.random() > 0.5;
        const score = ai
            ? parseFloat((Math.random() * 4 + 6).toFixed(1))   // 6.0–10.0
            : parseFloat((Math.random() * 4).toFixed(1));        // 0.0–4.0
        return {
            score,
            metrics: {
                noise: Math.floor(Math.random() * 100),
                edges: Math.floor(Math.random() * 100),
                freq:  Math.floor(Math.random() * 100),
                logic: Math.floor(Math.random() * 100),
            }
        };
    }

    function showResults() {
        const { score, metrics } = generateScore();

        showSection(resultsSection);

        // Determine verdict
        let label, icon, scoreClass, badgeClass, barColor;
        if (score <= 3.5) {
            label = 'Authentic';         icon = ICON.checkCircle; scoreClass = 'score-real';      badgeClass = 'badge-real';      barColor = 'var(--accent-success)';
        } else if (score >= 6.5) {
            label = 'AI Generated';      icon = ICON.triangle;    scoreClass = 'score-ai';        badgeClass = 'badge-ai';        barColor = 'var(--accent-danger)';
        } else {
            label = 'Uncertain / Modified'; icon = ICON.help;     scoreClass = 'score-uncertain'; badgeClass = 'badge-uncertain'; barColor = 'var(--accent-warning)';
        }

        // Score number
        finalScoreEl.className = 'score-number ' + scoreClass;
        animateValue(finalScoreEl, 0, score, 1400);

        // Badge
        authBadge.className = 'authenticity-badge ' + badgeClass;
        authBadge.querySelector('.badge-icon').innerHTML = icon;
        authText.textContent = label;

        // Scale indicator
        scoreIndicator.style.left = `${Math.min(100, (score / 10) * 100)}%`;

        // Metric bars — animate after short delay
        Object.keys(metricBars).forEach(key => {
            metricBars[key].style.backgroundColor = barColor;
            metricBars[key].style.width = '0%';
        });
        setTimeout(() => {
            metricBars.noise.style.width  = metrics.noise  + '%';
            metricBars.edges.style.width  = metrics.edges  + '%';
            metricBars.freq.style.width   = metrics.freq   + '%';
            metricBars.logic.style.width  = metrics.logic  + '%';
        }, 600);
    }

    // ── Utilities ──────────────────────────────────────────────────────────────
    function animateValue(el, from, to, duration) {
        const start = performance.now();
        function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            el.textContent = (from + p * (to - from)).toFixed(1);
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    function showToast(msg) {
        let t = document.getElementById('ts-toast');
        if (!t) {
            t = document.createElement('div');
            t.id = 'ts-toast';
            document.body.appendChild(t);
        }
        t.textContent = msg;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 3000);
    }

    // ── Reset ──────────────────────────────────────────────────────────────────
    resetBtn.addEventListener('click', () => {
        fileInput.value = '';
        Object.values(metricBars).forEach(b => { b.style.width = '0%'; });
        scoreIndicator.style.left = '0%';
        finalScoreEl.textContent = '0.0';
        finalScoreEl.className = 'score-number';
        authBadge.className = 'authenticity-badge';
        authText.textContent = 'Authentic';
        authBadge.querySelector('.badge-icon').innerHTML = ICON.checkCircle;
        showSection(uploadSection);
    });

    // ── Initial state ──────────────────────────────────────────────────────────
    // Ensure upload is visible and others hidden at load
    uploadSection.style.display = 'block';
    uploadSection.style.opacity = '1';
    uploadSection.style.transform = 'translateY(0)';
    uploadSection.style.pointerEvents = 'all';
    scanningSection.style.display = 'none';
    resultsSection.style.display = 'none';
});
