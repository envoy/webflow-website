const SELECTORS = {
  touchpoint: "[touchpoint-el]",
  touchpointBase: ".interactive_touchpoint_base",
  touchpointCard: ".interactive_touchpoint_card",
  viewSolutionButton: "[solution-el]",
  modal: "[modal-el]",
  modalClose: "[close-el]",
  modalCloseButton: "[close-button]",
};

let touchpoints, modals, modalCloseEls;
let activeIndex = 0;
let previousIndex = -1; // Track the previous card index
let autoplayInterval;
let isAutoplaying = true;
let isModalOpen = false;
let previouslyFocusedElement; // Track the element that opened the modal

// Function to show the hovered card and hide all others
function showHoveredCard(index) {
  touchpoints.forEach((touchpoint, i) => {
    const card = touchpoint.querySelector(SELECTORS.touchpointCard);
    const base = touchpoint.querySelector(SELECTORS.touchpointBase);

    if (i === index) {
      card.classList.remove("interactive_hide");
      base.classList.add("is-active");
    } else {
      card.classList.add("interactive_hide");
      base.classList.remove("is-active");
    }
  });
}

// Function to show two active cards simultaneously during autoplay
function showActiveCards(index, prevIndex) {
  touchpoints.forEach((touchpoint, i) => {
    const card = touchpoint.querySelector(SELECTORS.touchpointCard);
    const base = touchpoint.querySelector(SELECTORS.touchpointBase);

    if (i === index || i === prevIndex) {
      card.classList.remove("interactive_hide");
      base.classList.add("is-active");
    } else {
      card.classList.add("interactive_hide");
      base.classList.remove("is-active");
    }
  });
}

// Autoplay function with overlapping logic
function startAutoplay() {
  clearInterval(autoplayInterval);
  if (!isModalOpen) {
    autoplayInterval = setInterval(() => {
      previousIndex = activeIndex; // Set the previous card index
      activeIndex = (activeIndex + 1) % touchpoints.length;

      // Show both the previous and the new card for overlap
      showActiveCards(activeIndex, previousIndex);

      // After 1000ms, hide the previous card
      setTimeout(() => {
        const prevCard = touchpoints[previousIndex].querySelector(
          SELECTORS.touchpointCard
        );
        const prevBase = touchpoints[previousIndex].querySelector(
          SELECTORS.touchpointBase
        );
        prevCard.classList.add("interactive_hide");
        prevBase.classList.remove("is-active");
      }, 1000); // Adjust the timing to control overlap duration
    }, 2000); // Main autoplay interval for new cards
  }
}

// Stop autoplay function
function stopAutoplay() {
  clearInterval(autoplayInterval);
  isAutoplaying = false;
  showActiveCards(-1, -1); // Hide all cards
}

// Function to initialize the touchpoints functionality
function init() {
  touchpoints = document.querySelectorAll(SELECTORS.touchpoint);
  modals = document.querySelectorAll(SELECTORS.modal);
  modalCloseEls = document.querySelectorAll(SELECTORS.modalClose);

  if (touchpoints.length > 0) {
    startAutoplay();

    touchpoints.forEach((touchpoint, index) => {
      const viewSolutionButton = touchpoint.querySelector(
        SELECTORS.viewSolutionButton
      );
      const clickedIndex = parseInt(
        viewSolutionButton.getAttribute("solution-el")
      );
      const matchingModal = modals[clickedIndex];
      const closeEl = modalCloseEls[clickedIndex];
      const closeButton = matchingModal.querySelector(
        SELECTORS.modalCloseButton
      );

      // Reuse the mouseover effect for keyboard focus
      const handleInteraction = () => {
        if (isAutoplaying) {
          stopAutoplay();
        }
        showHoveredCard(index); // Show only the hovered card
      };

      touchpoint.addEventListener("mouseover", handleInteraction);
      touchpoint.addEventListener("focus", handleInteraction);

      touchpoint.addEventListener("mouseout", () => {
        if (!isAutoplaying && !isModalOpen) {
          activeIndex = index;
          startAutoplay(); // Restart autoplay after mouseout
          isAutoplaying = true;
        }
      });

      touchpoint.addEventListener("blur", () => {
        if (!isAutoplaying && !isModalOpen) {
          activeIndex = index;
          startAutoplay(); // Restart autoplay after blur
          isAutoplaying = true;
        }
      });

      // Add keydown event listener to open modal on Enter or Space key
      touchpoint.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          previouslyFocusedElement = document.activeElement;
          matchingModal.classList.remove("interactive_hide");
          isModalOpen = true;
          stopAutoplay();
          trapFocus(matchingModal);
          document.body.style.overflow = "hidden";
        }
      });

      viewSolutionButton.addEventListener("click", () => {
        previouslyFocusedElement = document.activeElement;
        matchingModal.classList.remove("interactive_hide");
        isModalOpen = true;
        stopAutoplay();
        trapFocus(matchingModal);
        document.body.style.overflow = "hidden";
      });

      // Add click event listener to the modal wrap
      matchingModal.addEventListener("click", (event) => {
        if (event.target.matches(SELECTORS.modalClose)) {
          matchingModal.classList.add("interactive_hide");
          isModalOpen = false;
          startAutoplay();
          isAutoplaying = true;
          previouslyFocusedElement.focus();
          document.body.style.overflow = "auto";
        }
      });

      closeButton.addEventListener("click", () => {
        matchingModal.classList.add("interactive_hide");
        isModalOpen = false;
        startAutoplay();
        isAutoplaying = true;
        previouslyFocusedElement.focus();
        document.body.style.overflow = "auto";
      });

      matchingModal.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          matchingModal.classList.add("interactive_hide");
          isModalOpen = false;
          startAutoplay();
          isAutoplaying = true;
          previouslyFocusedElement.focus();
          document.body.style.overflow = "auto";
        }
      });
    });
  }
}

// Resize observer to track window size changes
const resizeObserver = new ResizeObserver(() => {
  if (window.innerWidth >= 992) {
    if (!touchpoints) {
      init(); // Initialize the code when the screen width is 992px or more
    }
  } else {
    clearInterval(autoplayInterval); // Stop autoplay when screen size is below 992px
  }
});

// Initial check for screen size
if (window.innerWidth >= 992) {
  init();
}

// Start observing resize events
resizeObserver.observe(document.body);
