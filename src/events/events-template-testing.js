
  MktoForms2.whenReady(function(form) {
    form.onSubmit(function() {
      const formEl = form.getFormElem();

      console.log("Form submitting");
      // 1: Checkbox logic
      const happyHour = form.querySelector('input[name="interestedinhappyhour"]');
      const bookMeeting = form.querySelector('input[name="interestedinmeeting"]');
      const partnerInterest = form.querySelector('input[name="isInterestedInPartner__c"]');

      const hh = happyHour?.checked;
      const bm = bookMeeting?.checked;
      const pi = partnerInterest?.checked;

      let callbackName = 'handleDefault';

      // 2: Set callback dynamically
      if (bm && pi && !hh) {
        callbackName = 'handleBmAndPi';
      } else if (bm && !hh && !pi) {
        callbackName = 'handleBmOnly';
      } else if (hh && pi && !bm) {
        callbackName = 'handleHh';
      } else if (bm && hh && !bm) {
        callbackName = 'handleBmAndHh';
      } else if (hh && !bm && !pi) {
        callbackName ='handleHh';
      } 

      formEl.attr('data-success-callback', callbackName);

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
