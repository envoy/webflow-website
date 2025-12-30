(function() {
  var css = document.createElement('style');
  css.textContent = 
    '.mktoForm .iti .int-phone { padding-left: 65px !important; height: 44px; line-height: 44px; box-sizing: border-box; width: 100%; }' +
    '.mktoForm .iti--separate-dial-code.iti--show-flags .iti__selected-dial-code { margin-right: 4px; }' +
    '.mktoForm .iti__selected-flag { width: 60px !important; padding: 5px !important; }' +
    '.mktoForm .iti__country-list { z-index: 9999 !important; }';
  document.head.appendChild(css);

  function attach(form) {
    var el = form.getFormElem()[0];
    if (el.__intlBound) return;
    el.__intlBound = true;

    var FIELD_NAME = 'Phone';
    var mktoPhone = el.querySelector('input[name="' + FIELD_NAME + '"]');
    if (!mktoPhone) return;

    if (el.querySelector('.intl-tel-input,.int-phone')) return;

    var visible = document.createElement('input');
    visible.type = 'tel';
    visible.className = 'int-phone';
    visible.placeholder = 'Your number here';
    visible.autocomplete = 'tel';
    mktoPhone.parentNode.insertBefore(visible, mktoPhone);
    mktoPhone.style.display = 'none';

    var countryISO = el.querySelector('input[name="Country"]');
    if (!countryISO) {
      countryISO = document.createElement('input');
      countryISO.type = 'hidden';
      countryISO.name = 'Country';
      el.appendChild(countryISO);
    }

    var inferred = el.querySelector('input[name="formCountry"]');
    if (!inferred) {
      inferred = document.createElement('input');
      inferred.type = 'hidden';
      inferred.name = 'formCountry';
      el.appendChild(inferred);
    }

    var iti = window.intlTelInput(visible, {
      initialCountry: "us",
      separateDialCode: true,
      preferredCountries: ["us", "gb", "ca"]
    });

    function sync() {
      iti.setNumber(visible.value);
      mktoPhone.value = iti.getNumber() || '';
      var d = iti.getSelectedCountryData() || {};
      countryISO.value = (d.iso2 || '').toUpperCase();
      inferred.value = d.name || '';
    }

    visible.addEventListener('input', sync);
    visible.addEventListener('change', sync);
    visible.addEventListener('countrychange', sync);
    sync();
    form.onSubmit(sync);
  }

  function waitForMarketo() {
    if (window.MktoForms2 && MktoForms2.whenReady) {
      MktoForms2.whenReady(attach);
    } else {
      setTimeout(waitForMarketo, 100);
    }
  }
  waitForMarketo();
})();
