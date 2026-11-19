/* Square Construction — quote form via contact.php (PHPMailer + SMTP).
   Same pattern as the Local AI Geeks and HoneycombsAndMore forms.
   Quote requests land in Dima's inbox (sergeyalyosh@gmail.com) via the
   info@squareconstruction.ca mailbox. An optional job photo is attached
   to the email as a real file upload (max 2 MB). */
(function () {
  'use strict';

  function initQuoteForm() {
    var form = document.querySelector('#quote-form');
    var submitButton = form ? form.querySelector('button[type="submit"]') : null;
    if (!form || !submitButton) {
      console.error('Quote form or submit button not found');
      return;
    }
    var originalButtonText = submitButton.innerHTML;
    var status = document.getElementById('form-status');

    /* Dynamic validation: flag problems on blur, clear them on input. */
    var validators = {
      'q-name': function (v) { return v.trim().length > 1; },
      'q-phone': function (v) { return (v.replace(/\D/g, '').length) >= 10; },
      'q-email': function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
      'q-type': function (v) { return v !== ''; },
      'q-details': function (v) { return v.trim().length > 10; },
      'q-photo': function () {
        var f = document.getElementById('q-photo').files[0];
        return !f || f.size <= 2 * 1024 * 1024;
      }
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

      /* Send via the server-side handler (PHPMailer + SMTP), same as the
         Local AI Geeks and HoneycombsAndMore forms. The photo goes as a
         real file upload inside the FormData. */
      fetch('contact.php', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
        .then(function (response) {
          return response.json().then(function (payload) {
            return { ok: response.ok && payload.ok, payload: payload };
          });
        })
        .then(function (result) {
          if (!result.ok) {
            throw new Error(result.payload.error || 'The server did not accept the message.');
          }
          setStatus('Quote request sent. We usually reply within one business day.', true);
          form.reset();
          window.scrollTo(0, scrollPos);
        })
        .catch(function (error) {
          console.error('Quote request failed:', error);
          // Fall back to copying the request so the customer can email it instead
          var text =
            'Name: ' + data.name + '\n' +
            'Phone: ' + data.phone + '\n' +
            'Email: ' + data.email + '\n' +
            'Project type: ' + data.project_type + '\n\n' +
            data.details;
          var fallback =
            'The request could not be sent just now. Your quote request has been copied — ' +
            'please paste it into an email to info@squareconstruction.ca.';
          var copy = navigator.clipboard && navigator.clipboard.writeText
            ? navigator.clipboard.writeText(text)
            : Promise.reject(new Error('clipboard unavailable'));
          copy.then(function () {
            setStatus(fallback, false);
          }).catch(function () {
            setStatus('The request could not be sent. Please email us at info@squareconstruction.ca.', false);
          });
          window.scrollTo(0, scrollPos);
        })
        .finally(function () {
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
