const SELECTORS = {
  touchpoint: "[touchpoint-el]",
  touchpointBase: ".interactive_touchpoint_base",
  touchpointCard: ".interactive_touchpoint_card",
  viewSolutionButton: "[solution-el]",
  modal: "[modal-el]",
  modalClose: "[close-el]",
  modalCloseButton: "[close-button]",
};

const touchpoints = document.querySelectorAll(SELECTORS.touchpoint);
const modals = document.querySelectorAll(SELECTORS.modal);
const modalCloseEls = document.querySelectorAll(SELECTORS.modalClose);

let activeIndex = 0;
let autoplayInterval;
let isAutoplaying = true;
let isModalOpen = false;
let previouslyFocusedElement; // Track the element that opened the modal

// Function to show the active card
function showActiveCard(index) {
  touchpoints.forEach((touchpoint, i) => {
    const card = touchpoint.querySelector(SELECTORS.touchpointCard);
    const base = touchpoint.querySelector(SELECTORS.touchpointBase);

    if (i === index) {
      card.classList.remove("hide");
      base.classList.add("is-active");
    } else {
      card.classList.add("hide");
      base.classList.remove("is-active");
    }
  });
}

// Autoplay function
function startAutoplay() {
  clearInterval(autoplayInterval);
  if (!isModalOpen) {
    autoplayInterval = setInterval(() => {
      activeIndex = (activeIndex + 1) % touchpoints.length;
      showActiveCard(activeIndex);
    }, 2000);
  }
}

// Stop autoplay function
function stopAutoplay() {
  clearInterval(autoplayInterval);
  isAutoplaying = false;
  showActiveCard(-1);
}

// Function to trap focus within the modal
function trapFocus(modal) {
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  modal.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  });

  // Set focus to the first element in the modal
  firstElement.focus();
}

// Initial call to start autoplay
startAutoplay();

touchpoints.forEach((touchpoint, index) => {
  const viewSolutionButton = touchpoint.querySelector(
    SELECTORS.viewSolutionButton
  );
  const clickedIndex = parseInt(viewSolutionButton.getAttribute("solution-el"));
  const matchingModal = modals[clickedIndex];
  const closeEl = modalCloseEls[clickedIndex];
  const closeButton = matchingModal.querySelector(SELECTORS.modalCloseButton);

  // Reuse the mouseover effect for keyboard focus
  const handleInteraction = () => {
    if (isAutoplaying) {
      stopAutoplay();
    }
    showActiveCard(index);
  };

  touchpoint.addEventListener("mouseover", handleInteraction);

  touchpoint.addEventListener("focus", handleInteraction);

  touchpoint.addEventListener("mouseout", () => {
    if (!isAutoplaying && !isModalOpen) {
      activeIndex = index;
      startAutoplay();
      isAutoplaying = true;
    }
  });

  touchpoint.addEventListener("blur", () => {
    if (!isAutoplaying && !isModalOpen) {
      activeIndex = index;
      startAutoplay();
      isAutoplaying = true;
    }
  });

  // Add keydown event listener to open modal on Enter or Space key
  touchpoint.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault(); // Prevent default behavior like scrolling
      previouslyFocusedElement = document.activeElement;
      matchingModal.classList.remove("hide");
      isModalOpen = true;
      stopAutoplay();
      trapFocus(matchingModal); // Trap focus inside the modal
      // stop body from scrolling
      document.body.style.overflow = "hidden";
    }
  });

  viewSolutionButton.addEventListener("click", () => {
    previouslyFocusedElement = document.activeElement;
    matchingModal.classList.remove("hide");
    isModalOpen = true;
    stopAutoplay();
    trapFocus(matchingModal); // Trap focus inside the modal
    // stop body from scrolling
    document.body.style.overflow = "hidden";
  });

  closeEl.addEventListener("click", () => {
    matchingModal.classList.add("hide");
    isModalOpen = false;
    startAutoplay();
    isAutoplaying = true;
    previouslyFocusedElement.focus(); // Return focus to the element that triggered the modal
    // allow body to scroll
    document.body.style.overflow = "auto";
  });

  closeButton.addEventListener("click", () => {
    matchingModal.classList.add("hide");
    isModalOpen = false;
    startAutoplay();
    isAutoplaying = true;
    previouslyFocusedElement.focus(); // Return focus to the element that triggered the modal
    // allow body to scroll
    document.body.style.overflow = "auto";
  });

  // Allow closing the modal with the Escape key
  matchingModal.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      matchingModal.classList.add("hide");
      isModalOpen = false;
      startAutoplay();
      isAutoplaying = true;
      previouslyFocusedElement.focus(); // Return focus to the element that triggered the modal
      // allow body to scroll
      document.body.style.overflow = "auto";
    }
  });
});
