// Darjiling.js — gallery, lightbox, accordion, pricing and validation
(() => {
    'use strict';

    const main = document.getElementById('mainImage');
    const thumbs = document.querySelectorAll('.thumb');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');

    function setMain(src) {
        if (!src || !main) return;
        main.style.backgroundImage = `url('${src}')`;
        if (lightboxImg) lightboxImg.src = src;
    }

    // initialize from first active thumb or existing main background
    const initThumb = document.querySelector('.thumb.active') || document.querySelector('.thumb');
    if (initThumb) setMain(initThumb.dataset.src || (getComputedStyle(main).backgroundImage || '').replace(/url\((['"]?)(.*?)\1\)/, '$2'));

    thumbs.forEach(t => {
        t.addEventListener('click', (e) => {
            if (e && typeof e.preventDefault === 'function') e.preventDefault();
            thumbs.forEach(x => x.classList.remove('active'));
            t.classList.add('active');
            setMain(t.dataset.src);
        });
    });

    // Lightbox open/close
    if (main && lightbox && lightboxImg) {
        main.addEventListener('click', () => {
            lightbox.style.display = 'flex';
            lightbox.setAttribute('aria-hidden', 'false');
        });

        lightbox.addEventListener('click', () => {
            lightbox.style.display = 'none';
            lightbox.setAttribute('aria-hidden', 'true');
        });
    }

    // Preload images
    thumbs.forEach(t => {
        if (t.dataset.src) {
            const img = new Image();
            img.src = t.dataset.src;
        }
    });

    // Itinerary accordion
    document.querySelectorAll('.day-header').forEach(h => {
        h.addEventListener('click', () => {
            const body = h.nextElementSibling;
            const opened = body && body.style.display === 'block';

            document.querySelectorAll('.day-body').forEach(d => d.style.display = 'none');
            document.querySelectorAll('.day-header .toggle').forEach(t => t.textContent = '+');

            if (!opened && body) {
                body.style.display = 'block';
                const toggle = h.querySelector('.toggle');
                if (toggle) toggle.textContent = '−';
            }
        });
    });

    // Pricing
    const guests = document.getElementById('guests');
    const pricePerPersonElm = document.getElementById('pricePerPerson');
    const totalPayableElm = document.getElementById('totalPayable');
    const priceSummary = document.getElementById('priceSummary');

    const basePrice = 16500;
    const taxes = 1485;

    function updatePrice() {
        const g = guests ? parseInt(guests.value, 10) || 1 : 1;
        const total = basePrice * g + taxes;
        if (pricePerPersonElm) pricePerPersonElm.textContent = `₹${basePrice.toLocaleString()} / person`;
        if (totalPayableElm) totalPayableElm.textContent = `₹${total.toLocaleString()}`;
        if (priceSummary) priceSummary.textContent = `${g} ${g > 1 ? 'persons' : 'person'}`;
    }

    if (guests) {
        guests.addEventListener('change', updatePrice);
        updatePrice();
    }

    // Booking form validation (client-side helper)
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            const date = document.getElementById('travelDate')?.value;
            if (!date) {
                e.preventDefault();
                alert('Please select a travel date.');
            }
        });
    }
})();