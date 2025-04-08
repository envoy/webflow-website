
  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('marketo-form');

    // Intercept form submit
    form.addEventListener('submit', function (e) {
      console.log("Form submitting");
      // Step 1: Checkbox logic
      const happyHour = form.querySelector('input[name="interestedinhappyhour"]');
      const bookMeeting = form.querySelector('input[name="interestedinmeeting"]');
      const partnerInterest = form.querySelector('input[name="isInterestedInPartner__c"]');

      const hh = happyHour?.checked;
      const bm = bookMeeting?.checked;
      const pi = partnerInterest?.checked;

      // Step 2: Set callback dynamically
      if (bm && pi && !hh) {
        form.setAttribute('data-success-callback', 'handleBmAndPi');
      } else if (bm && !hh && !pi) {
        form.setAttribute('data-success-callback', 'handleBmOnly');
      } else if (hh && pi && !bm) {
        form.setAttribute('data-success-callback', 'handleHh');
      } else if (bm && hh && !bm) {
        form.setAttribute('data-success-callback', 'handleBmAndHh');
      } else if (hh && !bm && !pi) {
        form.setAttribute('data-success-callback', 'handleHh');
      } else {
        // Covers none checked OR any other unmatched combo
        form.setAttribute('data-success-callback', 'handleDefault');
      }
    });
  });

  // Callback functions
  function handleBmAndPi() {
    console.log("Book Meeting and Partner Interest selected");
    ChiliPiper.submit("envoy", "envoy-marketing-events---partners", {
        formId: $form.attr("id"),
        onSuccess: handleDefault,
    });
  }

  function handleBmOnly() {
    console.log("Book Meeting selected");
    ChiliPiper.submit("envoy", "envoy-marketing-events---general", {
        formId: $form.attr("id"),
        onSuccess: handleDefault,
    });
  }

  function handleBmAndHh() {
    console.log("Book Meeting and Happy Hour selected");
    ChiliPiper.submit("envoy", "envoy-marketing-events---general", {
        formId: $form.attr("id"),
        onSuccess: handleHh,
    });
  }

  function handleHh() {
    console.log("Happy Hour selected");
    setTimeout(() => {
      window.location = `/thanks/events?hh=true&custom-message=Thanks`;
    }, 2000);
  }

  function handleDefault() {
    console.log("Fallback/default case");
    setTimeout(() => {
      window.location = `/thanks/events`;
    }, 2000);
  }
