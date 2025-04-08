  window.onload = function () {
    if (typeof MktoForms2 !== 'undefined' && MktoForms2.whenReady) {
      MktoForms2.whenReady(function(form) {
        form.onSubmit(function() {
          const formEl = form.getFormElem();
    
          console.log("Form submitting");
          // 1: Checkbox logic
          const happyHour = formEl.find('input[name="interestedinhappyhour"]')[0];
          const bookMeeting = formEl.find('input[name="interestedinmeeting"]')[0];
          const partnerInterest = formEl.find('input[name="isInterestedInPartner__c"]')[0];
    
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
  } else {
    console.warn('MktoForms2 is not available.');
  }
};

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
