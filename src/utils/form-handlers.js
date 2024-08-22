/**
 * Marketo has a standard embed code that does not allow multiple Marketo forms to
 * exist on the same page: More than one form = conflicts with the HTML IDs Marketo's
 * JS looked for.
 *
 * In addition, we needed to have the same form be able to redirect to variable URLs
 * upon successful submission - something not configurable in the Marketo Form Builder UI.
 *
 * Marketo does provide some event handlers for forms, which we use below to work around
 * Marketo's 1-form-per-page limitation, and redirect users to the right place afterwards.
 *
 * Forms can be added to a page with the following HTML (specific to Envoy):
 * <form data-marketo-form-id="40" id="unique-form-id-whatever-you-want" data-button-text="Button text" class="marketo-form whatever-classes-here"></form>
 * <script type="text/javascript">loadMarketoForm( $( '#unique-form-id' ) );</script>
 *
 * data-marketo-form-id should equal the form ID (only the number) provided in Marketo's default embed snippet.
 */

const marketoFormIndex = 0;
let marketoFormLoading = false;

// For Event Tracking
const EVENT_NAME = "generate_lead";
const FORM_TYPES = {
  GET_DEMO: "get_demo",
  GET_QUOTE: "get_quote",
  GET_TRIAL: "get_trial",
  CONTACT_US: "contact_us",
  GATED_ASSET: "gated_asset",
  EVENTS: "events",
  BETA_SIGNUP: "beta_signup",
  NO_FORM_TYPE: "no_form_type",
};
const FORM_ID_TYPE_MAP = {
  1: FORM_TYPES.NO_FORM_TYPE,
  3: FORM_TYPES.GATED_ASSET,
  40: FORM_TYPES.GET_TRIAL,
  95: FORM_TYPES.EVENTS,
  123: FORM_TYPES.GATED_ASSET,
  223: FORM_TYPES.GATED_ASSET,
  438: FORM_TYPES.GATED_ASSET,
  255: FORM_TYPES.GET_QUOTE,
  316: FORM_TYPES.CONTACT_US,
  340: FORM_TYPES.GET_DEMO,
  413: FORM_TYPES.CONTACT_US,
  478: FORM_TYPES.EVENTS,
  483: FORM_TYPES.GATED_ASSET,
  488: FORM_TYPES.GATED_ASSET,
  505: FORM_TYPES.EVENTS,
  510: FORM_TYPES.GET_DEMO,
  521: FORM_TYPES.BETA_SIGNUP,
};

function loadMarketoForm(form) {
  return new Promise((resolve, reject) => {
    if (marketoFormLoading) {
      setTimeout(() => resolve(loadMarketoForm(form)), 200);
    } else {
      marketoFormLoading = true;
      const $form = $(form),
        formId = $form.data("marketo-form-id"),
        index = marketoFormIndex;
      $form.attr("id", "mktoForm_" + formId);
      if ($form.hasClass("email-only") && typeof MktoForms2 === "undefined") {
        $form.attr("action", "https://signup.envoy.com");
        $form.attr("method", "get");
        $form.append(
          '<div class="form-html-version"><div class="col xs-col-12 sm-col-12 md-col-7 md-pr2 mb2"><input name="email" type="email" placeholder="Enter your email" class="input"></div><div class="col xs-col-12 sm-col-12 md-col-5"><button class="btn btn-primary block">Get started</button></div></div>'
        );
        marketoFormLoading = false;
        return;
      }
      if (typeof MktoForms2 === "undefined") {
        setTimeout(() => resolve(loadMarketoForm(form)), 200);
        return;
      }
      MktoForms2.setOptions({
        formXDPath: "/rs/510-TEH-674/images/marketo-xdframe-relative.html",
      });
      MktoForms2.loadForm(
        "//pages.envoy.com",
        "510-TEH-674",
        formId,
        function (form) {
          $form.find(".form-html-version").remove();
          $form.find("label[for]").each(function () {
            const $label = $(this),
              oldId = $label.attr("for"),
              newId = oldId + "_" + index;
            $form.find("#" + oldId).attr("id", newId);
            $label.attr("for", newId);
          });
          $form.attr("id", "marketo-form-" + index);
          if ($form.data("button-text")) {
            $form.find(".mktoButton").text($form.data("button-text"));
          }
          const $emailInput = $form.find('input[name="Email"]');
          if ($emailInput.length > 0) {
            $emailInput.closest(".mktoFormRow").addClass("contains-email");
            const $tooltip = $(
              '<div class="input-tooltip"><div class="top"><p class="input-tooltip-content mb0">Please enter a valid email address.</p><i></i></div></div>'
            );
            $tooltip.insertBefore($emailInput);
          }
          const submitCallbackName = $form.data("submit-callback");
          form.onSubmit(function (form) {
            window.analytics &&
              analytics.track("Form Filled", {
                formID: formId,
                formType: FORM_ID_TYPE_MAP[formId] || FORM_TYPES.NO_FORM_TYPE,
                emailAddress: form.vals().Email,
              });
            window.dataLayer.push({
              event: EVENT_NAME,
              formID: formId,
              formType: FORM_ID_TYPE_MAP[formId] || FORM_TYPES.NO_FORM_TYPE,
              emailAddress: form.vals().Email,
            });
            if (submitCallbackName) {
              return window[submitCallbackName](form);
            }
          });
          const successCallbackName = $form.data("success-callback");
          if (typeof successCallbackName !== "undefined") {
            form.onSuccess(function (values, followUpUrl) {
              return window[successCallbackName](values, followUpUrl, $form);
            });
          }
          const onloadCallbackName = $form.data("onload-callback");
          if (typeof onloadCallbackName !== "undefined") {
            console.log({ onloadCallbackName, formId });
            window[onloadCallbackName]($form);
          }
          if ($form.data("load-from-parameters")) {
            $form
              .find('input[name="Email"]')
              .val(marketoGetQueryParameter("email"));
          }
          $form.removeAttr("data-marketo-form-id");
          marketoFormLoading = false;
          resolve();
        }
      );
    }
  });
}

$(function () {
  const formPromises = [];
  $("form[data-marketo-form-id]").each(function () {
    formPromises.push(loadMarketoForm($(this)));
  });
  Promise.all(formPromises).then(() => {
    console.log("All forms loaded");
  });
});

// Marketo Form Handlers

// Each form can have the success callback set via the data-success-callback attribute.
// The fallback/default is marketoSendToTrialPage, because this was the first
// use case and all of the signup/landing page forms use it.
function marketoSendToTrialPage(values, followUpUrl, $form) {
  const productsSelected = $form.data("products-selected")
      ? $form.data("products-selected")
      : false,
    email = values.Email;
  let url = "https://signup.envoy.com/?";
  if (productsSelected) {
    url +=
      "products=" +
      encodeURIComponent(productsSelected) +
      "&email=" +
      encodeURIComponent(email);
  } else {
    url += "email=" + encodeURIComponent(email);
  }
  // Take the lead to a different page on successful submit, ignoring the form's configured followUpUrl
  location.href = url;
  // Return false to prevent the submission handler continuing with its own processing
  return false;
}
function marketoDisplayThankYou(values, followUpUrl, $form) {
  let thankYouMessage = $form.data("thank-you-message");
  if (typeof thankYouMessage === "undefined") {
    thankYouMessage =
      "Thank you for your submission! Check your email for confirmation.";
  }
  $form.replaceWith("<p class='thank-you-message'>" + thankYouMessage + "</p>");
  $("html, body").animate(
    { scrollTop: $(".thank-you-message").offset().top - 150 },
    750
  );
  return false;
}

function marketoGetQueryParameter(sParam) {
  let sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split("&"),
    sParameterName,
    i;
  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split("=");
    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
}

function addTermsHtml($form) {
  $form
    .find(".mktoButtonRow:last-of-type")
    .before(
      '<span class="text-sm text-slate-muted block my-6 terms-text">By submitting this form you agree to our' +
        ' <a class="policy-link" href="/legal/terms-of-service">Terms of Service</a>, ' +
        '<a class="policy-link" href="/legal/privacy-policy">Privacy Policy</a>, and to receive marketing communications from Envoy.' +
        "</span>"
    );
}

function addDisclaimerHtml($form) {
  $form
    .find(".mktoButtonRow:last-of-type")
    .before(
      '<span class="disclaimer e-small">Please note that this total is an estimate and not binding. For a complete total, contact our sales team' +
        ' <a href="/contact/">here</a>.' +
        "</span>"
    );
}

function submitAndChilipiper_413(values, followUpUrl, $form) {
  let successOrRouted = false;
  ChiliPiper.submit("envoy", "envoy-linkedin", {
    title: "Thanks! What time works best for a quick call?",
    onError: function () {
      marketoDisplayThankYou(values, followUpUrl, $form);
    },
    onSuccess: function () {
      successOrRouted = true;
      marketoDisplayThankYou(values, followUpUrl, $form);
    },
    onClose: function () {
      successOrRouted = true;
      $(".landing-page-form").data(
        "thank-you-message",
        "We didn't get your appointment scheduled - you can refresh the page to try again."
      );
      marketoDisplayThankYou(values, followUpUrl, $form);

      return false;
    },
    onComplete: function () {
      return false;
    },
  });

  return false;
}

function submitAndChilipiper_316(values, followUpUrl, $form) {
  let successOrRouted = false;
  window.metrics?.trackEvent("Contact form submission");

  ChiliPiper.submit("envoy", "inbound_contact_router", {
    title: "Thanks! What time works best for a quick call?",
    onError: function () {
      marketoDisplayThankYou(values, followUpUrl, $form);
    },
    onRouted: function () {
      successOrRouted = true;
    },
    onSuccess: function () {
      successOrRouted = true;
    },
  });

  setTimeout(function () {
    if (!successOrRouted) {
      marketoDisplayThankYou(values, followUpUrl, $form);
    }
  }, 3000);

  return false;
}

function ebookSuccess(values, followUpUrl, $form) {
  if (typeof fbq !== "undefined") {
    const track_name = $form.data("track");
    fbq("track", track_name);
  }
  const redirect_url = $form.data("redirect-url");
  location.href = redirect_url;

  return false;
}

function submitAndRedirectToDemo(values, followUpUrl, $form) {
  const redirectToDemo = function (values, followUpUrl, $form) {
    localStorage.setItem("email", values["Email"]);
    location.href = "/demo-videos?email=" + values["Email"];

    // Return false to prevent the submission handler continuing with its own processing
    return false;
  };

  const track_name = $form.data("track");
  window.metrics?.trackEvent(track_name);
  ChiliPiper.submit("envoy", "inbound-router", {
    onError: function () {
      redirectToDemo(values, followUpUrl, $form);
    },
    onSuccess: function () {
      redirectToDemo(values, followUpUrl, $form);
    },
    onClose: function () {
      redirectToDemo(values, followUpUrl, $form);
    },
  });
  localStorage.setItem("email", values["Email"]);
  //location.href = "/demo-videos";
  return false;
}

function fowFormSuccess(values, followUpUrl, $form) {
  $form.append(
    '<img height="1" width="1" style="display:none;" alt="" src="https://px.ads.linkedin.com/collect/?pid=108645&conversionId=1904772&fmt=gif" />'
  );

  marketoDisplayThankYou(values, followUpUrl, $form);

  return false;
}

function webinarFormSuccess(values, followUpUrl, $form) {
  if (typeof fbq !== "undefined") {
    fbq("track", "InitiateCheckout");
  }

  $form.append(
    '<img height="1" width="1" style="display:none;" alt="" src="https://px.ads.linkedin.com/collect/?pid=108645&conversionId=1904348&fmt=gif" />'
  );

  location.href = "/pages/leaders-of-the-workplace-webinar-video/";

  return false;
}

function redirectToSurvey(values, followUpUrl, $form) {
  const email = values.Email;

  let url = "/protect-beta-survey/?";

  url += "email=" + encodeURIComponent(email);

  // Take the lead to a different page on successful submit, ignoring the form's configured followUpUrl
  location.href = url;

  // Return false to prevent the submission handler continuing with its own processing
  return false;
}

function submitAndChilipiper_255(values, followUpUrl, $form) {
  window.metrics?.trackEvent("Quote form submission");

  ChiliPiper.submit("envoy", "inbound_quote_router", {
    formId: $form.attr("id"),
    title: "Thanks! What time works best for a quick call?",
    onError: function () {
      marketoDisplayThankYou(values, followUpUrl, $form);
    },
    onRouted: function () {
      successOrRouted = true;
    },
    onSuccess: function () {
      successOrRouted = true;
    },
  });
  marketoDisplayThankYou(values, followUpUrl, $form);

  return false;
}

function marketoSetPlaceholder($form) {
  $form.find('input[type="email"]').attr("placeholder", "Enter your email");
}

function successRedirect(values, followUpUrl, $form) {
  location.href = $form.data("redirect-url");
  return false;
}
