document.addEventListener('DOMContentLoaded', () => {
    // Update year in footer (no-op if there is no #year element)
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Mobile nav toggle.
    // Sets both class-based (.is-open/.is-active) and body/aria state so the
    // same script works regardless of which theme drives the nav visibility.
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');

    if (navToggle && nav) {
        const setOpen = (open) => {
            nav.classList.toggle('is-open', open);
            navToggle.classList.toggle('is-active', open);
            document.body.classList.toggle('nav-open', open);
            navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        };

        navToggle.addEventListener('click', () => {
            setOpen(!nav.classList.contains('is-open'));
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
                setOpen(false);
            }
        });

        // Close menu when a nav link is clicked
        nav.addEventListener('click', (e) => {
            if (e.target.closest('a')) setOpen(false);
        });

        // Close menu on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') setOpen(false);
        });
    }

    // Image modal with keyboard navigation
    const modal = document.getElementById('imageModal');
    if (modal) {
        const modalImg = document.getElementById('modalImage');
        const modalCaption = document.getElementById('modalCaption');
        const closeBtn = modal.querySelector('.modal-close');
        const prevBtn = modal.querySelector('.modal-prev');
        const nextBtn = modal.querySelector('.modal-next');
        const backdrop = modal.querySelector('.modal-backdrop');
        const productCards = Array.from(document.querySelectorAll('.product-card'));
        let lastFocused = null;
        let currentIndex = -1;

        function showIndex(index) {
            if (index < 0) index = productCards.length - 1;
            if (index >= productCards.length) index = 0;
            currentIndex = index;
            const card = productCards[currentIndex];
            const img = card.querySelector('img');
            const title = card.querySelector('h3')?.textContent || '';
            if (img) {
                modalImg.src = img.getAttribute('data-full') || img.src;
                modalImg.alt = img.alt || '';
                modalCaption.textContent = title;
            }
        }

        function openModal(index) {
            lastFocused = document.activeElement;
            showIndex(index);
            modal.showModal();
            document.body.classList.add('modal-open');
            closeBtn && closeBtn.focus();
        }

        function closeModal() {
            modal.close();
            document.body.classList.remove('modal-open');
            modalImg.src = '';
            if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
        }

        productCards.forEach((card, index) => {
            card.addEventListener('click', () => openModal(index));
        });

        closeBtn && closeBtn.addEventListener('click', closeModal);
        prevBtn && prevBtn.addEventListener('click', () => showIndex(currentIndex - 1));
        nextBtn && nextBtn.addEventListener('click', () => showIndex(currentIndex + 1));
        backdrop && backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop || e.target.dataset.close === 'true') closeModal();
        });
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                showIndex(currentIndex - 1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                showIndex(currentIndex + 1);
            }
        });
        // Native <dialog> handles Escape; keep body state in sync on close
        modal.addEventListener('close', () => {
            document.body.classList.remove('modal-open');
        });
    }

    // Portfolio filter bar: boost contrast once it sticks while scrolling
    const filterBar = document.querySelector('.portfolio-filter');
    if (filterBar) {
        const stickyTop = parseInt(getComputedStyle(filterBar).top, 10) || 0;
        const updateStuck = () => {
            const stuck = filterBar.getBoundingClientRect().top <= stickyTop + 1;
            filterBar.classList.toggle('is-stuck', stuck);
        };
        window.addEventListener('scroll', updateStuck, { passive: true });
        updateStuck();
    }

    // Back to top button
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('is-visible', window.scrollY > 400);
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
