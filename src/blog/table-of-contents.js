document.addEventListener("DOMContentLoaded", function () {
  // Handle window resize event
  window.addEventListener("resize", function () {
    initializeTableOfContents();
  });

  initializeTableOfContents();
});

function initializeTableOfContents() {
  if (window.innerWidth < 991) {
    return;
  }

  const headers = document.querySelectorAll(".text-rich-text h2");
  const tocContainer = document.querySelector(".dynamic-page-toc-container");
  const tocComponent = document.querySelector(".sidebar_toc_component");

  if (!tocContainer) {
    console.error("Table of contents container not found");
    return;
  }

  if (!tocComponent) {
    console.error("Table of contents component not found");
    return;
  }

  // Clear placeholder content
  tocContainer.innerHTML = "";

  const ids = {};

  // Create the table of contents elements and append them to the container
  headers.forEach(function (header, index) {
    let baseId = header.textContent
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Ensure the ID starts with a letter or underscore
    let id = `section-${baseId}`;
    let count = 1;

    // Ensure the ID is unique
    while (ids[id]) {
      id = `section-${baseId}-${count}`;
      count++;
    }
    ids[id] = true;

    // Assign the unique ID to the header
    header.id = id;

    // Create the link for the table of contents
    const link = document.createElement("a");
    link.href = `#${id}`;
    link.className = "dynamic-toc-link";
    link.textContent = header.textContent;

    tocContainer.appendChild(link);

    // Handle click event on TOC link
    link.addEventListener("click", function (event) {
      event.preventDefault();
      scrollToHeader(id);
    });
  });

  // Set initial active link based on current scroll position
  updateActiveHeader();

  // Add scroll listener to update active header
  let scrollTimeout;
  window.addEventListener("scroll", function() {
    // Throttle scroll events for performance
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(function() {
      updateActiveHeader();
    });
  }, { passive: true });

  // Function to scroll to a specific header by ID
  function scrollToHeader(id) {
    const header = document.getElementById(id);
    if (header) {
      header.scrollIntoView({ behavior: "smooth", block: "start" });
      updateActiveLink(id);
    }
  }

  // Function to update active link based on current scroll position
  function updateActiveHeader() {
    let currentActiveHeader = null;
    let closestDistance = Infinity;

    headers.forEach(function (header) {
      const bounding = header.getBoundingClientRect();
      const distance = Math.abs(bounding.top - 100);

      // Find the header closest to our target position (100px from top)
      if (bounding.top <= 150 && distance < closestDistance) {
        closestDistance = distance;
        currentActiveHeader = header;
      }
    });

    if (currentActiveHeader) {
      updateActiveLink(currentActiveHeader.id);
    } else if (headers.length > 0 && window.scrollY < 100) {
      // If near top of page, activate first header
      updateActiveLink(headers[0].id);
    }
  }

  // Function to update active link in TOC
  function updateActiveLink(id) {
    const activeLink = tocContainer.querySelector(".dynamic-toc-link.active");
    if (activeLink) {
      activeLink.classList.remove("active");
    }
    const currentLink = tocContainer.querySelector(`a[href="#${id}"]`);
    if (currentLink) {
      currentLink.classList.add("active");
    }
  }

  if (headers.length > 0) {
    tocComponent.style.display = "block";
  }
}
