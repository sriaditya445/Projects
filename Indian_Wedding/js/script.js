/* ==========================================================================
   CINEMATIC SOUTH INDIAN WEDDING INVITATION — CLIENT JS LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. FLOATING PETALS CANVAS ANIMATION --- */
    const canvas = document.getElementById('petalCanvas');
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const petals = [];
    const petalColors = ['#FFB7C5', '#E8829F', '#F3E5AB', '#D4AF37', '#FFF0F5'];

    class Petal {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * -height;
            this.size = Math.random() * 8 + 5;
            this.speedY = Math.random() * 1.2 + 0.6;
            this.speedX = Math.random() * 0.8 - 0.4;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 2 - 1;
            this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
            this.opacity = Math.random() * 0.7 + 0.3;
        }

        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.y * 0.01) + this.speedX;
            this.rotation += this.rotationSpeed;

            if (this.y > height + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(0, -this.size);
            ctx.quadraticCurveTo(this.size, -this.size / 2, this.size, 0);
            ctx.quadraticCurveTo(this.size, this.size / 2, 0, this.size);
            ctx.quadraticCurveTo(-this.size, this.size / 2, -this.size, 0);
            ctx.quadraticCurveTo(-this.size, -this.size / 2, 0, -this.size);
            ctx.fill();
            ctx.restore();
        }
    }

    // Create 45 ambient petals
    for (let i = 0; i < 45; i++) {
        petals.push(new Petal());
    }

    function animatePetals() {
        ctx.clearRect(0, 0, width, height);
        petals.forEach(petal => {
            petal.update();
            petal.draw();
        });
        requestAnimationFrame(animatePetals);
    }
    animatePetals();


    /* --- 2. INTERSECTION OBSERVER FOR SCROLL ANIMATIONS --- */
    const scrollTriggers = document.querySelectorAll('.scroll-trigger');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    scrollTriggers.forEach(el => observer.observe(el));


    /* --- 3. COUNTDOWN TIMER --- */
    const targetDate = new Date('December 12, 2026 09:15:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            document.getElementById('countDays').textContent = String(days).padStart(2, '0');
            document.getElementById('countHours').textContent = String(hours).padStart(2, '0');
            document.getElementById('countMins').textContent = String(minutes).padStart(2, '0');
            document.getElementById('countSecs').textContent = String(seconds).padStart(2, '0');
        } else {
            document.getElementById('heroCountdown').innerHTML = "<div class='count-box'><span>TODAY IS THE DAY!</span></div>";
        }
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();


    /* --- 4. AUDIO MUSIC PLAYER & SYNTHESIZER FALLBACK --- */
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    const weddingAudio = document.getElementById('weddingAudio');
    let isPlaying = false;
    let audioCtx = null;
    let synthInterval = null;

    // Web Audio Synthesizer fallback for traditional Shehnai / Tanpura ambient drone tone
    function startAmbientSynth() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        // Create Indian classical scale drone (Sa-Pa drone: C#4, G#4)
        const freqs = [277.18, 415.30, 554.37];
        freqs.forEach(freq => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
        });
    }

    musicToggleBtn.addEventListener('click', () => {
        if (!isPlaying) {
            weddingAudio.play().then(() => {
                isPlaying = true;
                musicToggleBtn.classList.add('playing');
                musicToggleBtn.querySelector('i').className = 'fas fa-volume-up';
            }).catch(err => {
                console.log("Audio autoplay fallback activated:", err);
                startAmbientSynth();
                isPlaying = true;
                musicToggleBtn.classList.add('playing');
                musicToggleBtn.querySelector('i').className = 'fas fa-volume-up';
            });
        } else {
            weddingAudio.pause();
            if (audioCtx) audioCtx.suspend();
            isPlaying = false;
            musicToggleBtn.classList.remove('playing');
            musicToggleBtn.querySelector('i').className = 'fas fa-music';
        }
    });


    /* --- 5. MODALS & DRAWERS LOGIC --- */

    // Helper functions for modal toggles
    function openModal(modalId) {
        document.getElementById(modalId).classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
        document.body.style.overflow = '';
    }

    // RSVP Modal
    document.getElementById('openRsvpBtn').addEventListener('click', () => openModal('rsvpModal'));
    document.getElementById('closeRsvpBtn').addEventListener('click', () => closeModal('rsvpModal'));
    
    document.getElementById('rsvpForm').addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('rsvpForm').classList.add('hidden');
        document.getElementById('rsvpSuccessMsg').classList.remove('hidden');
    });

    // Map Modal
    document.getElementById('openMapBtn').addEventListener('click', () => openModal('mapModal'));
    document.getElementById('closeMapBtn').addEventListener('click', () => closeModal('mapModal'));

    // Drawer Customizer
    const customizeBtn = document.getElementById('customizeBtn');
    const customizeDrawer = document.getElementById('customizeDrawer');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');

    customizeBtn.addEventListener('click', () => customizeDrawer.classList.add('active'));
    closeDrawerBtn.addEventListener('click', () => customizeDrawer.classList.remove('active'));

    // Close modal on backdrop click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-backdrop')) {
            e.target.classList.remove('active');
            document.body.style.overflow = '';
        }
        if (e.target.classList.contains('drawer-backdrop')) {
            e.target.classList.remove('active');
        }
    });


    /* --- 6. ADD TO CALENDAR LOGIC --- */
    document.getElementById('addToCalBtn').addEventListener('click', () => {
        const title = encodeURIComponent("Ananya & Aditya's Wedding Muhurtham");
        const details = encodeURIComponent("Join us in celebrating the sacred union of Ananya & Aditya.");
        const location = encodeURIComponent("Sri Venkateswara Temple Kalyana Mandapam, Tirupati");
        const startDate = "20261212T034500Z";
        const endDate = "20261212T050000Z";

        const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
        window.open(googleCalUrl, '_blank');
    });


    /* --- 7. LIVE CUSTOMIZATION & LOCAL STORAGE PRESERVATION --- */
    const saveDetailsBtn = document.getElementById('saveDetailsBtn');

    function updateDOMDetails(bride, groom, date, time, venue, city) {
        document.querySelectorAll('.data-bride-name').forEach(el => el.textContent = bride);
        document.querySelectorAll('.data-groom-name').forEach(el => el.textContent = groom);
        document.querySelectorAll('.data-wedding-date').forEach(el => el.textContent = date);
        document.querySelectorAll('.data-muhurtham-time').forEach(el => el.textContent = time);
        document.querySelectorAll('.data-main-venue').forEach(el => el.textContent = venue);
        document.querySelectorAll('.data-venue-city').forEach(el => el.textContent = city);

        document.title = `Wedding Invitation | ${bride} & ${groom}`;
    }

    saveDetailsBtn.addEventListener('click', () => {
        const bride = document.getElementById('editBrideName').value || 'Ananya';
        const groom = document.getElementById('editGroomName').value || 'Aditya';
        const date = document.getElementById('editDate').value || 'DECEMBER 12, 2026';
        const time = document.getElementById('editMuhurtham').value || '09:15 AM - 10:30 AM IST';
        const venue = document.getElementById('editVenue').value || 'Sri Venkateswara Temple Kalyana Mandapam';
        const city = document.getElementById('editCity').value || 'Tirupati, Andhra Pradesh';

        updateDOMDetails(bride, groom, date, time, venue, city);

        // Save in localStorage
        const customData = { bride, groom, date, time, venue, city };
        localStorage.setItem('wedding_invitation_data', JSON.stringify(customData));

        customizeDrawer.classList.remove('active');
    });

    // Load saved settings if exist
    const savedData = localStorage.getItem('wedding_invitation_data');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            document.getElementById('editBrideName').value = data.bride;
            document.getElementById('editGroomName').value = data.groom;
            document.getElementById('editDate').value = data.date;
            document.getElementById('editMuhurtham').value = data.time;
            document.getElementById('editVenue').value = data.venue;
            document.getElementById('editCity').value = data.city;

            updateDOMDetails(data.bride, data.groom, data.date, data.time, data.venue, data.city);
        } catch (e) {
            console.error("Error loading saved details:", e);
        }
    }

});
