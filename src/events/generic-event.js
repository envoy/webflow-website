function initEventForm() {
  console.log("initEventForm");
}

function submitAndRedirectToDemo_cpfix(values, followUpUrl, $form) {
  const companySize = document.querySelector("#Employee_Range__c_0");
  const selectedIndex = companySize.selectedIndex;

  const track_name = $form.data("track");
  window.metrics?.trackEvent(track_name);

  localStorage.setItem("email", values["Email"]);

  ChiliPiper.submit("envoy", "envoy-marketing-events-general", {
    formId: $form.attr("id"),
    onSuccess: handleCpSuccess,
  });
  return false;
}

function handleCpSuccess() {
  setTimeout(() => {
    window.location = `/thanks/events`;
  }, 2000);
}
