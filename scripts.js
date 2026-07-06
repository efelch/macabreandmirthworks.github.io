document.addEventListener('DOMContentLoaded', () => {
    // Update year in footer
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Mobile nav toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.getElementById('primary-nav');
    if (navToggle && navList) {
        const closeMenu = () => {
            document.body.classList.remove('nav-open');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Open menu');
        };
        navToggle.addEventListener('click', () => {
            const open = navToggle.getAttribute('aria-expanded') === 'true';
            if (open) {
                closeMenu();
            } else {
                document.body.classList.add('nav-open');
                navToggle.setAttribute('aria-expanded', 'true');
                navToggle.setAttribute('aria-label', 'Close menu');
            }
        });
        // Close when a nav link is clicked
        navList.addEventListener('click', (e) => {
            if (e.target.closest('a')) closeMenu();
        });
        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });
    }

    // Image modal (native <dialog>) with keyboard navigation
    const modal = document.getElementById('imageModal');
    if (modal && typeof modal.showModal === 'function') {
        const modalImg = document.getElementById('modalImage');
        const modalCaption = document.getElementById('modalCaption');
        const closeBtn = modal.querySelector('.modal-close');
        const prevBtn = modal.querySelector('.modal-prev');
        const nextBtn = modal.querySelector('.modal-next');
        const backdrop = modal.querySelector('.modal-backdrop');
        const galleryImgs = Array.from(document.querySelectorAll('.gallery-item img'));
        let lastFocused = null;
        let currentIndex = -1;

        function showIndex(index) {
            if (!galleryImgs.length) return;
            if (index < 0) index = galleryImgs.length - 1;
            if (index >= galleryImgs.length) index = 0;
            currentIndex = index;
            const img = galleryImgs[currentIndex];
            const fig = img.closest('figure');
            const caption = fig ? (fig.querySelector('figcaption')?.textContent || '') : '';
            modalImg.src = img.getAttribute('data-full') || img.src;
            modalImg.alt = img.alt || '';
            modalCaption.textContent = caption;
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
        }

        galleryImgs.forEach((img, index) => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => openModal(index));
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
            modalImg.src = '';
            if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
        });
    }

    // Back to top button
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('is-visible', window.scrollY > 400);
        }, { passive: true });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
