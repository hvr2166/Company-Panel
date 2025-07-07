console.log("✅ JavaScript file loaded!");




// Function to add sidebar functionality


// Toggle sub-menu
function toggleSubMenu(event) {
  let arrowParent = event.target.parentElement.parentElement;
  let subMenu = arrowParent.querySelector(".sub-menu");

  // Close other open sub-menus
  document.querySelectorAll(".sub-menu").forEach(menu => {
    if (menu !== subMenu) {
      menu.parentElement.classList.remove("showMenu");
    }
  });

  // Toggle the clicked sub-menu
  arrowParent.classList.toggle("showMenu");
}

// Toggle sidebar open/close
function toggleSidebar() {
  let sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("close");
}

// Function to load a new page dynamically
// Function to load a new page dynamically
let isLoading = false; // Prevent multiple calls

function loadPage(url) {
  if (isLoading) {
    console.log(`⏳ Page load skipped, already in progress: ${url}`);
    return;
  }

  isLoading = true;
  
  fetch(url)
    .then(response => response.text())
    .then(html => {
      const container = document.getElementById("dynamic-content");
      if (container) {
        container.innerHTML = html;

        // Ensure dashboard only loads once
        if (url === "/dashboard" && !document.querySelector("#dashboard-loaded")) {
          const dashboardMarker = document.createElement("div");
          dashboardMarker.id = "dashboard-loaded";
          document.body.appendChild(dashboardMarker);
        }

        // Remove previously injected scripts before adding new ones
        document.querySelectorAll("script.dynamic-script").forEach(script => script.remove());

        const scripts = container.querySelectorAll("script");
        scripts.forEach(script => {
          const scriptSrc = script.src;

          // Prevent duplicate loading of external scripts
          if (scriptSrc && document.querySelector(`script[src="${scriptSrc}"]`)) {
            console.log(`🚫 Script already loaded: ${scriptSrc}`);
            return;
          }

          const newScript = document.createElement("script");
          newScript.classList.add("dynamic-script");

          if (scriptSrc) {
            newScript.src = scriptSrc;
          } else {
            newScript.textContent = script.textContent;
          }

          document.body.appendChild(newScript);
        });

        // Detach previous events before reattaching new ones
        detachSidebarEvents();
        attachSidebarEvents();

        // Highlight the active link
        highlightActiveLink(url);

        console.log(`✅ Page loaded dynamically: ${url}`);
      }

      isLoading = false; // Reset loading flag
    })
    .catch(err => {
      console.error(`❌ Error loading page: ${url}`, err);
      isLoading = false; // Ensure flag resets on error
    });
}



function detachSidebarEvents() {
  console.log("⏳ Detaching ALL sidebar events...");

  document.querySelectorAll(".arrow, .bx-menu").forEach(el => {
    el.replaceWith(el.cloneNode(true)); // Completely remove previous events
  });
}

function attachSidebarEvents() {
  let arrows = document.querySelectorAll(".arrow");
  arrows.forEach(arrowItem => {
    arrowItem.removeEventListener("click", toggleSubMenu);
    arrowItem.addEventListener("click", toggleSubMenu);
  });

  let sidebarBtn = document.querySelector(".bx-menu");
  sidebarBtn.removeEventListener("click", toggleSidebar);
  sidebarBtn.addEventListener("click", toggleSidebar);
}

document.querySelectorAll("script.dynamic-script").forEach(script => {
  console.log(`🗑️ Removing old script: ${script.src || "inline script"}`);
  script.remove();
});





// Function to highlight the active link
function highlightActiveLink(url) {
  // Remove 'active' class from all links
  document.querySelectorAll(".nav-links li a").forEach(link => {
    link.classList.remove("active");
  });

  // Find the link that matches the current URL and add 'active' class
  document.querySelectorAll(".nav-links li a").forEach(link => {
    if (link.getAttribute("data-page") === url) {
      link.classList.add("active"); // Add active class
    }
  });
}

// Attach event listeners when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  attachSidebarEvents();

  document.querySelectorAll(".load-page").forEach(link => {
    link.addEventListener("click", function (event) {
      event.preventDefault(); // Stop automatic navigation
      const page = this.getAttribute("data-page");
      loadPage(page);
    });
  });

  // Add click event to menu items to toggle sub-menu
  document.querySelectorAll(".iocn-link > a").forEach(menuItem => {
    menuItem.addEventListener("click", function (event) {
      const arrowParent = this.parentElement.parentElement;
      const subMenu = arrowParent.querySelector(".sub-menu");

      // Close other open sub-menus
      document.querySelectorAll(".sub-menu").forEach(menu => {
        if (menu !== subMenu) {
          menu.parentElement.classList.remove("showMenu");
        }
      });

      // Toggle the clicked sub-menu
      arrowParent.classList.toggle("showMenu");
    });
  });
});

document.getElementById("downloadData").addEventListener("click", function (e) {
  e.preventDefault();
  if (confirm("Do you want to download the data?")) {
    window.location.href = "/exportalldata";
  }
});

