// Function to detect dark mode
function isDarkMode() {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

// Function to show a Sonner-style toast notification
function showCopyNotification() {
  // Remove existing notification if present
  const existingNotification = document.getElementById("linky-notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Check if dark mode is enabled
  const darkMode = isDarkMode();

  // Create toast container (main wrapper)
  const toasterWrapper = document.createElement("div");
  toasterWrapper.setAttribute("data-sonner-toaster", "");
  // Invert the theme for more contrast
  toasterWrapper.setAttribute("data-sonner-theme", darkMode ? "light" : "dark");
  toasterWrapper.id = "linky-notification";

  // Style the toaster wrapper like Sonner's
  Object.assign(toasterWrapper.style, {
    position: "fixed",
    top: "24px",
    right: "24px",
    width: "400px",
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif",
    zIndex: "999999999",
    boxSizing: "border-box",
    padding: "0",
    margin: "0",
    listStyle: "none",
    outline: "none",
  });

  // Create the actual toast element
  const toast = document.createElement("div");
  toast.setAttribute("data-sonner-toast", "");
  toast.setAttribute("data-styled", "true");
  toast.setAttribute("data-type", "success");
  toast.setAttribute("data-y-position", "top");
  toast.setAttribute("data-x-position", "right");

  // Style the toast element - invert colors for contrast
  Object.assign(toast.style, {
    position: "relative",
    opacity: "0",
    padding: "18px",
    background: darkMode ? "#fff" : "#000",
    border: `1px solid ${darkMode ? "hsl(0, 0%, 93%)" : "hsl(0, 0%, 20%)"}`,
    color: darkMode ? "hsl(0, 0%, 9%)" : "hsl(0, 0%, 99%)",
    borderRadius: "8px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    width: "100%",
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transform: "translateY(-16px) scale(0.95)",
    transition:
      "transform 400ms cubic-bezier(0.18, 0.89, 0.32, 1.28), opacity 300ms ease",
  });

  // Create icon wrapper
  const iconWrapper = document.createElement("div");
  iconWrapper.setAttribute("data-icon", "");

  // Style the icon wrapper
  Object.assign(iconWrapper.style, {
    display: "flex",
    height: "20px",
    width: "20px",
    position: "relative",
    justifyContent: "flex-start",
    alignItems: "center",
    flexShrink: "0",
    marginLeft: "-2px",
    marginRight: "6px",
  });

  // Create success SVG icon (with Sonner's animation)
  const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svgIcon.setAttribute("width", "20");
  svgIcon.setAttribute("height", "20");
  svgIcon.setAttribute("viewBox", "0 0 20 20");
  svgIcon.setAttribute("fill", "none");
  svgIcon.style.marginLeft = "-1px";
  svgIcon.style.opacity = "0";
  svgIcon.style.transform = "scale(0.8)";
  svgIcon.style.transformOrigin = "center";
  svgIcon.style.animation = "sonner-fade-in 300ms ease forwards";

  // Create success icon elements
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );
  circle.setAttribute("cx", "10");
  circle.setAttribute("cy", "10");
  circle.setAttribute("r", "10");
  circle.setAttribute("fill", "#10B981");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M6.5 10L8.5 12L13.5 7");
  path.setAttribute("stroke", "white");
  path.setAttribute("stroke-width", "2");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");

  // Assemble the SVG
  svgIcon.appendChild(circle);
  svgIcon.appendChild(path);
  iconWrapper.appendChild(svgIcon);

  // Create content container
  const contentContainer = document.createElement("div");
  contentContainer.setAttribute("data-content", "");

  // Style the content container
  Object.assign(contentContainer.style, {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  });

  // Create title
  const title = document.createElement("div");
  title.setAttribute("data-title", "");

  title.textContent = "URL copied to clipboard";

  // Style the title
  Object.assign(title.style, {
    fontWeight: "500",
    lineHeight: "1.5",
    color: "inherit",
    fontSize: "16px",
  });

  // Assemble content
  contentContainer.appendChild(title);

  // Assemble the toast
  toast.appendChild(iconWrapper);
  toast.appendChild(contentContainer);
  toasterWrapper.appendChild(toast);

  // Add keyframes for animation if they don't exist
  if (!document.getElementById("sonner-animations")) {
    const style = document.createElement("style");
    style.id = "sonner-animations";
    style.textContent = `
      @keyframes sonner-fade-in {
        0% {
          opacity: 0;
          transform: scale(0.8);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Add to page
  document.body.appendChild(toasterWrapper);

  // Animate in - different animation for top position
  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0) scale(1)";
  }, 10);

  // Remove after 2 seconds - different animation for top position
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-10px) scale(0.9)";
    setTimeout(() => {
      toasterWrapper.remove();
    }, 300); // Wait for fade out animation
  }, 2000);
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showNotification") {
    showCopyNotification();
    sendResponse({ status: "success" });
  }
});
