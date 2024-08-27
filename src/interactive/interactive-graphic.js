const SELECTORS = {
  touchpoint: '[interactive-el="touchpoint"]',
  touchpointCard: ".interactive_touchpoint_card",
};

const touchpoints = document.querySelectorAll(SELECTORS.touchpoint);

touchpoints.forEach((touchpoint) => {
  touchpoint.addEventListener("mouseover", () => {
    // Do something when a touchpoint is hovered
    console.log("Hovered over a touchpoint");
    const card = touchpoint.querySelector(SELECTORS.touchpointCard);
    card.classList.remove("hide");
  });

  touchpoint.addEventListener("mouseout", () => {
    // Do something when a touchpoint is no longer hovered
    console.log("No longer hovering over a touchpoint");
    const card = touchpoint.querySelector(SELECTORS.touchpointCard);
    card.classList.add("hide");
  });

  touchpoint.addEventListener("click", () => {
    // Do something when a touchpoint is clicked
    console.log("Clicked on a touchpoint");
  });
});
