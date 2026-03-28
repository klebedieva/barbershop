// Client-side validation and confirmation modal for booking and contact forms.
(function () {
    const modal = document.getElementById('confirm-modal');
    const titleEl = document.getElementById('modal-title');
    const messageEl = document.getElementById('modal-message');
    const closeBtn = document.getElementById('modal-close-btn');
    const bookingForm = document.getElementById('booking-form');
    const contactForm = document.getElementById('contact-form');
    const bookingErrorEl = document.getElementById('booking-form-error');
    const contactErrorEl = document.getElementById('contact-form-error');

    if (!modal || !bookingForm || !contactForm) {
        return;
    }

    const nameRe = /^[\p{L}\s'-]{2,50}$/u;

    function isValidEmail(value) {
        const v = value.trim();
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }

    function phoneDigits(value) {
        return value.replace(/\D/g, '');
    }

    function isValidPhone(value) {
        const d = phoneDigits(value);
        return d.length >= 8 && d.length <= 15;
    }

    function clearFormErrors(form, errorEl) {
        form.querySelectorAll('.field-invalid').forEach(function (el) {
            el.classList.remove('field-invalid');
        });
        if (errorEl) {
            errorEl.hidden = true;
            errorEl.textContent = '';
        }
    }

    function showFormError(form, errorEl, message, field) {
        clearFormErrors(form, errorEl);
        errorEl.textContent = message;
        errorEl.hidden = false;
        if (field) {
            field.classList.add('field-invalid');
            field.focus();
        }
    }

    function attachClearOnInput(form) {
        form.addEventListener(
            'input',
            function (e) {
                const t = e.target;
                if (t.classList && t.classList.contains('field-invalid')) {
                    t.classList.remove('field-invalid');
                }
            },
            true
        );
        form.addEventListener('change', function (e) {
            const t = e.target;
            if (t.classList && t.classList.contains('field-invalid')) {
                t.classList.remove('field-invalid');
            }
        });
    }

    function validateBooking() {
        const name = bookingForm.querySelector('#name');
        const email = bookingForm.querySelector('#email');
        const phone = bookingForm.querySelector('#phone');
        const service = bookingForm.querySelector('#service');
        const date = bookingForm.querySelector('#date');
        const time = bookingForm.querySelector('#time');

        const nameVal = name.value.trim();
        if (!nameVal) {
            return { ok: false, field: name, msg: 'Veuillez saisir votre nom.' };
        }
        if (!nameRe.test(nameVal)) {
            return {
                ok: false,
                field: name,
                msg: 'Le nom doit contenir au moins 2 lettres (caractères accentués autorisés).'
            };
        }

        if (!email.value.trim()) {
            return { ok: false, field: email, msg: 'Veuillez saisir votre adresse e-mail.' };
        }
        if (!isValidEmail(email.value)) {
            return { ok: false, field: email, msg: 'Veuillez saisir une adresse e-mail valide.' };
        }

        if (!phone.value.trim()) {
            return { ok: false, field: phone, msg: 'Veuillez saisir votre numéro de téléphone.' };
        }
        if (!isValidPhone(phone.value)) {
            return {
                ok: false,
                field: phone,
                msg: 'Le numéro doit contenir entre 8 et 15 chiffres.'
            };
        }

        if (!service.value) {
            return { ok: false, field: service, msg: 'Veuillez sélectionner un service.' };
        }

        if (!date.value) {
            return { ok: false, field: date, msg: 'Veuillez choisir une date.' };
        }
        if (!time.value) {
            return { ok: false, field: time, msg: 'Veuillez choisir une heure.' };
        }

        const when = new Date(date.value + 'T' + time.value);
        if (when < new Date()) {
            return {
                ok: false,
                field: time,
                msg: "La date et l'heure doivent être dans le futur."
            };
        }

        return { ok: true };
    }

    function validateContact() {
        const name = contactForm.querySelector('#contact-name');
        const email = contactForm.querySelector('#contact-email');
        const subject = contactForm.querySelector('#subject');
        const message = contactForm.querySelector('#message');

        const nameVal = name.value.trim();
        if (!nameVal) {
            return { ok: false, field: name, msg: 'Veuillez saisir votre nom.' };
        }
        if (!nameRe.test(nameVal)) {
            return {
                ok: false,
                field: name,
                msg: 'Le nom doit contenir au moins 2 lettres (caractères accentués autorisés).'
            };
        }

        if (!email.value.trim()) {
            return { ok: false, field: email, msg: 'Veuillez saisir votre adresse e-mail.' };
        }
        if (!isValidEmail(email.value)) {
            return { ok: false, field: email, msg: 'Veuillez saisir une adresse e-mail valide.' };
        }

        const subjVal = subject.value.trim();
        if (!subjVal) {
            return { ok: false, field: subject, msg: 'Veuillez indiquer un sujet.' };
        }

        const msgVal = message.value.trim();
        if (!msgVal) {
            return { ok: false, field: message, msg: 'Veuillez écrire un message.' };
        }

        return { ok: true };
    }

    function openModal(title, message) {
        titleEl.textContent = title;
        messageEl.textContent = message;
        modal.removeAttribute('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.setAttribute('hidden', '');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
            closeModal();
        }
    });

    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.min = new Date().toISOString().slice(0, 10);
    }

    attachClearOnInput(bookingForm);
    attachClearOnInput(contactForm);

    bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const result = validateBooking();
        if (!result.ok) {
            showFormError(bookingForm, bookingErrorEl, result.msg, result.field);
            return;
        }
        clearFormErrors(bookingForm, bookingErrorEl);
        openModal(
            'Demande envoyée',
            'Merci ! Votre demande de rendez-vous a bien été prise en compte. Nous vous contacterons sous peu.'
        );
        this.reset();
        if (dateInput) {
            dateInput.min = new Date().toISOString().slice(0, 10);
        }
    });

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const result = validateContact();
        if (!result.ok) {
            showFormError(contactForm, contactErrorEl, result.msg, result.field);
            return;
        }
        clearFormErrors(contactForm, contactErrorEl);
        openModal(
            'Message envoyé',
            'Merci ! Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.'
        );
        this.reset();
    });
})();
