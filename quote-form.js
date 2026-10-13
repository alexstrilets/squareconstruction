/* Square Construction — quote form via EmailJS.
   Same pattern as the HoneycombsAndMore contact form (contact-form.js).
   Quote requests land in Alex's inbox for now.
   SETUP (2 minutes, EmailJS dashboard at https://dashboard.emailjs.com):
     1. Create a new template, e.g. "square-construction-quote".
     2. Set its To email to Alex's address.
     3. Use these variables in the template body:
        {{name}} {{phone}} {{customer_email}} {{project_type}} {{details}}
     4. Paste the template ID into EMAILJS_TEMPLATE_ID below. */
(function () {
  'use strict';

  var EMAILJS_PUBLIC_KEY = 'oYEqabkFp7Wvp_3VA'; // Alex's EmailJS public key (same as bees site)
  var EMAILJS_SERVICE_ID = 'service_xdhrral';  // Alex's EmailJS service (same as bees site)
  var EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // <-- create the template (see above), paste its ID here

  function initQuoteForm() {
    if (typeof emailjs === 'undefined') {
      console.error('EmailJS library not loaded');
      return;
    }
    try {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    } catch (error) {
      console.error('EmailJS initialization failed:', error);
      return;
    }

    var form = document.querySelector('#quote-form');
    var submitButton = form ? form.querySelector('button[type="submit"]') : null;
    if (!form || !submitButton) {
      console.error('Quote form or submit button not found');
      return;
    }
    var originalButtonText = submitButton.innerHTML;
    var status = document.getElementById('form-status');

    /* Not wired yet: say so plainly instead of failing silently. */
    if (EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID') {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        setStatus('The form is not connected to an inbox yet — the EmailJS template ID still needs to be pasted into quote-form.js (see the SETUP comment at the top).', false);
      });
      return;
    }

    /* Dynamic validation: flag problems on blur, clear them on input. */
    var validators = {
      'q-name': function (v) { return v.trim().length > 1; },
      'q-phone': function (v) { return (v.replace(/\D/g, '').length) >= 10; },
      'q-email': function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
      'q-type': function (v) { return v !== ''; },
      'q-details': function (v) { return v.trim().length > 10; }
    };
    Object.keys(validators).forEach(function (id) {
      var field = document.getElementById(id);
      var error = document.getElementById(id + '-error');
      if (!field) return;
      field.addEventListener('blur', function () { setFieldState(field, error, validators[id](field.value)); });
      field.addEventListener('input', function () {
        if (field.getAttribute('aria-invalid') === 'true' && validators[id](field.value)) {
          setFieldState(field, error, true);
        }
      });
    });

    function setFieldState(field, error, valid) {
      field.setAttribute('aria-invalid', String(!valid));
      if (error) error.hidden = valid;
      return valid;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var scrollPos = window.pageYOffset || document.documentElement.scrollTop;

      var data = {
        name: document.getElementById('q-name').value,
        phone: document.getElementById('q-phone').value,
        email: document.getElementById('q-email').value,
        project_type: document.getElementById('q-type').value,
        details: document.getElementById('q-details').value
      };

      var allValid = Object.keys(validators).every(function (id) {
        var field = document.getElementById(id);
        var error = document.getElementById(id + '-error');
        return setFieldState(field, error, validators[id](field.value));
      });
      if (!allValid) {
        setStatus('A couple of fields need attention — they are marked above.', false);
        var firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
      setStatus('', true);

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        name: data.name,
        phone: data.phone,
        customer_email: data.email,
        project_type: data.project_type,
        details: data.details
      }).then(function () {
        setStatus('Quote request sent. We usually reply within one business day.', true);
        form.reset();
        window.scrollTo(0, scrollPos);
      }).catch(function (error) {
        console.error('Email sending failed:', error);
        setStatus('The request could not be sent. Call or text (780) 555-0134 instead — that always works.', false);
        window.scrollTo(0, scrollPos);
      }).finally(function () {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      });
    });

    function setStatus(text, ok) {
      if (!status) return;
      status.textContent = text;
      status.className = 'form-status ' + (text ? (ok ? 'success' : 'error') : '');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuoteForm);
  } else {
    initQuoteForm();
  }
})();
