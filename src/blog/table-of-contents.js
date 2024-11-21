import gsap from "https://cdn.skypack.dev/gsap";
import { ScrollTrigger } from "https://cdn.skypack.dev/gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", function () {
  // Handle window resize event
  window.addEventListener("resize", function () {
    // Check if the viewport width is greater than 991px (desktop breakpoint)
    initializeTableOfContents();
  });

  initializeTableOfContents();
});

function initializeTableOfContents() {
  if (window.innerWidth < 991) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
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
    let id = `section-${baseId}`; // Example prefix to ensure valid ID
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
      event.preventDefault(); // Prevent default anchor behavior
      scrollToHeader(id); // Scroll to the corresponding header
    });
  });

  // Set initial active link based on current scroll position
  updateActiveHeader();

  // Function to scroll to a specific header by ID
  function scrollToHeader(id) {
    const header = document.getElementById(id);
    if (header) {
      header.scrollIntoView({ behavior: "smooth", block: "start" });

      // Update active link in TOC
      updateActiveLink(id);
    }
  }

  // Function to update active link in TOC based on current scroll position
  function updateActiveHeader() {
    let currentActiveHeader = null;
    headers.forEach(function (header) {
      const bounding = header.getBoundingClientRect();
      if (
        bounding.top <= 100 && // Adjust this value as needed
        bounding.bottom >= 100 && // Adjust this value as needed
        (currentActiveHeader === null ||
          bounding.top < currentActiveHeader.getBoundingClientRect().top)
      ) {
        currentActiveHeader = header;
      }
    });

    if (currentActiveHeader) {
      const id = currentActiveHeader.id;
      updateActiveLink(id);
    } else {
      // If no headers are active, set the first link as active
      if (headers.length > 0 && window.scrollY < 100) {
        const firstHeaderId = headers[0].id;
        updateActiveLink(firstHeaderId);
      }
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

  // Add ScrollTrigger to monitor visibility and update active link
  headers.forEach(function (header) {
    ScrollTrigger.create({
      trigger: header,
      start: "top 20%", // Adjust start position as needed
      end: "bottom top", // Adjust end position as needed
      onToggle: (self) => {
        if (self.isActive) {
          updateActiveLink(header.id);
        }
      },
    });
  });

  if (headers.length > 0) {
    tocComponent.style.display = "block";
  }
}
