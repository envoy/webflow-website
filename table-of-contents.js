document.addEventListener("DOMContentLoaded", function () {
  const headers = document.querySelectorAll(".text-rich-text h2");
  const tocContainer = document.querySelector(".dynamic-page-toc-container");
  tocContainer.innerHTML = "";
  const ids = {};

  headers.forEach(function (header, index) {
    let baseId = header.textContent
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    let id = baseId;
    let count = 1;

    // Ensure the ID is unique
    while (ids[id]) {
      id = `${baseId}${count}`;
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

    // Add a divider after each link, except for the last one
    if (index < headers.length - 1) {
      const divider = document.createElement("div");
      divider.className = "dynamic-page-toc-divider";
      tocContainer.appendChild(divider);
    }
  });

  if (headers.length === 0) {
    tocContainer.remove();
  }
});
