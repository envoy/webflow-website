function handleEventFormSubmission(values, followUpUrl, $form) {
  const isInterestedInPartnerEl = document.querySelector(
    "#isInterestedInPartner__c_0"
  );
  const wasReferrredByPartnerEl = document.querySelector(
    "#wasReferredbyaPartner_0"
  );

  const track_name = $form.data("track");
  window.metrics?.trackEvent(track_name);

  localStorage.setItem("email", values["Email"]);

  if (isInterestedInPartnerEl.checked) {
    // Send to partner router
    console.log("partner router");
    ChiliPiper.submit("envoy", "envoy-marketing-events-partners", {
      formId: $form.attr("id"),
      onSuccess: handleCpSuccess,
    });
  } else {
    // Send to general router
    console.log("general router");
    ChiliPiper.submit("envoy", "envoy-marketing-events-general", {
      formId: $form.attr("id"),
      onSuccess: handleCpSuccess,
    });
  }
  return false;
}

function handleCpSuccess() {
  setTimeout(() => {
    // const happyHourEl = document.querySelector("#interestedinhappyhour_0");
    window.location = `/thanks/events`;
  }, 2000);
}
