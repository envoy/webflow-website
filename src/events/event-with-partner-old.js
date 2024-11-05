function initEventForm() {
  console.log("initEventForm");
  const partnerEl = document.querySelector("#isInterestedInPartner__c_0");
  const wasReferrredByPartnerEl = document.querySelector(
    "#wasReferredbyaPartner_0"
  );
  // const bookMeetingEl = document.querySelector("#interestedinmeeting_0");
  // const happyHourEl = document.querySelector("#interestedinhappyhour_0");
  partnerEl.addEventListener("change", updateUi);
  wasReferrredByPartnerEl.addEventListener("change", updateUi);
  // bookMeetingEl.addEventListener("change", updateUi);
  // happyHourEl.addEventListener("change", updateUi);

  updateUi();
}

function updateUi() {
  console.log("updateUi");
  const submitButton = document.querySelector(".mktoButton");
  const partnerEl = document.querySelector("#isInterestedInPartner__c_0");
  const bookMeetingEl = document.querySelector("#interestedinmeeting_0");
  const happyHourEl = document.querySelector("#interestedinhappyhour_0");

  happyHourEl.disabled = true;

  if (!partnerEl.checked && !bookMeetingEl.checked && !happyHourEl.checked) {
    submitButton.disabled = true;
    submitButton.style.pointerEvents = "none";
    return false;
  } else {
    submitButton.disabled = false;
    submitButton.style.pointerEvents = "auto";
  }
}

function submitAndRedirectToDemo_cpfix(values, followUpUrl, $form) {
  const bookMeetingEl = document.querySelector("#interestedinmeeting_0");
  const happyHourEl = document.querySelector("#interestedinhappyhour_0");
  const interestedInPartner = document.querySelector(
    "#isInterestedInPartner__c_0"
  );

  const track_name = $form.data("track");
  window.metrics?.trackEvent(track_name);

  localStorage.setItem("email", values["Email"]);

  if (bookMeetingEl.checked) {
    if (interestedInPartner.checked) {
      console.log("partner");
      ChiliPiper.submit("envoy", "envoy-marketing-events-partners", {
        formId: $form.attr("id"),
        onSuccess: handleCpSuccess,
      });
    } else {
      console.log("nonpartner");
      ChiliPiper.submit("envoy", "envoy-marketing-events-general", {
        formId: $form.attr("id"),
        onSuccess: handleCpSuccess,
      });
    }
  } else {
    window.location = `/thanks/events`;
    // window.location = `/thanks/events?hh=${happyHourEl.checked}`;
  }

  return false;
}

function handleCpSuccess() {
  setTimeout(() => {
    const happyHourEl = document.querySelector("#interestedinhappyhour_0");
    window.location = `/thanks/events`;
  }, 2000);
}
