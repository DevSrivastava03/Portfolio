/* =========================================================
   EXIGER OVERVIEW — CASE STUDY ACCESS
   Change EXIGER_CASE_STUDY_PASSWORD below to update the password.

   This is client-side gating for a static site. It is not
   server-level security; the case study HTML can still be
   inspected in the browser.
   ========================================================= */

const EXIGER_CASE_STUDY_PASSWORD = 'exiger';
const EXIGER_AUTH_STORAGE_KEY = 'exiger-overview-auth';

(function () {
    const form = document.getElementById('case-lock-form');
    const input = document.getElementById('case-lock-input');
    const error = document.getElementById('case-lock-error');

    if (!form || !input) return;

    const unlock = () => {
        document.documentElement.classList.add('is-unlocked');
        document.body.style.overflow = '';
        if (lockEl) {
            lockEl.setAttribute('aria-hidden', 'true');
            lockEl.removeAttribute('aria-modal');
        }
        window.scrollTo(0, 0);
    };

    const lockEl = document.getElementById('case-lock');

    try {
        if (sessionStorage.getItem(EXIGER_AUTH_STORAGE_KEY) === 'granted') {
            unlock();
        }
    } catch (err) {
        // sessionStorage unavailable — visitor can still authenticate this page load
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const attempt = input.value;

        if (attempt === EXIGER_CASE_STUDY_PASSWORD) {
            try {
                sessionStorage.setItem(EXIGER_AUTH_STORAGE_KEY, 'granted');
            } catch (err) {
                // Continue with in-memory unlock for this visit
            }
            form.classList.remove('is-error');
            input.removeAttribute('aria-invalid');
            if (error) error.textContent = '';
            unlock();
            return;
        }

        form.classList.remove('is-error');
        void form.offsetWidth;
        form.classList.add('is-error');
        input.setAttribute('aria-invalid', 'true');
        if (error) {
            error.textContent = 'That password doesn’t match. Try again.';
        }
        input.select();
    });
})();
