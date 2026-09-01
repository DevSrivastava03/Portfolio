/* =========================================================
   EXIGER OVERVIEW ACCESS
   The password is not stored in this file. The case study is
   AES-GCM ciphertext in exigier-payload.js. Unlocking derives
   a key from what the visitor types and tries to decrypt.
   ========================================================= */

const EXIGER_SESSION_KEY = 'exiger-overview-html';

(function () {
    const form = document.getElementById('case-lock-form');
    const input = document.getElementById('case-lock-input');
    const error = document.getElementById('case-lock-error');
    const lockEl = document.getElementById('case-lock');
    const bodyEl = document.getElementById('case-study-body');
    const payload = window.EXIGER_PAYLOAD;

    if (!form || !input || !bodyEl || !payload) return;

    const b64ToBytes = (value) => {
        const binary = atob(value);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
        return bytes;
    };

    const deriveKey = async (password, salt, iterations) => {
        const material = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(password),
            'PBKDF2',
            false,
            ['deriveKey']
        );
        return crypto.subtle.deriveKey(
            { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
            material,
            { name: 'AES-GCM', length: 256 },
            false,
            ['decrypt']
        );
    };

    const decrypt = async (password) => {
        const key = await deriveKey(password, b64ToBytes(payload.salt), payload.iter);
        const bytes = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: b64ToBytes(payload.iv) },
            key,
            b64ToBytes(payload.data)
        );
        return new TextDecoder().decode(bytes);
    };

    const unlock = (html) => {
        bodyEl.innerHTML = html;
        document.documentElement.classList.add('is-unlocked');
        document.body.style.overflow = '';
        if (lockEl) {
            lockEl.setAttribute('aria-hidden', 'true');
            lockEl.removeAttribute('aria-modal');
        }
        input.value = '';
        window.scrollTo(0, 0);
        if (typeof window.initCaseStudyScrollNav === 'function') {
            window.initCaseStudyScrollNav();
        }
    };

    const fail = () => {
        form.classList.remove('is-error');
        void form.offsetWidth;
        form.classList.add('is-error');
        input.setAttribute('aria-invalid', 'true');
        if (error) error.textContent = 'That password doesn’t match. Try again.';
        input.select();
    };

    try {
        const cached = sessionStorage.getItem(EXIGER_SESSION_KEY);
        if (cached) unlock(cached);
    } catch (err) {
        // sessionStorage unavailable
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const attempt = input.value;
        if (!attempt) return;

        form.classList.remove('is-error');
        if (error) error.textContent = '';

        try {
            const html = await decrypt(attempt);
            try {
                sessionStorage.setItem(EXIGER_SESSION_KEY, html);
            } catch (err) {
                // Session cache is optional
            }
            input.removeAttribute('aria-invalid');
            unlock(html);
        } catch (err) {
            fail();
        }
    });
})();
