// Import the processUrl function from utils.js
import { processUrl } from "./utils.js";

// Log when the background script loads
console.log("Background script loaded at:", new Date().toISOString());

// Listen for the keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  console.log("Command received:", command);

  if (command === "copy-url") {
    console.log("Copy URL command detected");
    copyCurrentUrl();
  }
});
// Function to copy the current URL
function copyCurrentUrl() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || tabs.length === 0) {
      console.error("No active tab found");
      return;
    }

    const currentTab = tabs[0];
    let currentUrl = currentTab.url;

    // Process the URL to strip query params if needed
    currentUrl = processUrl(currentUrl);
    console.log("URL to copy:", currentUrl);

    // Method 1: Try using executeScript
    chrome.scripting
      .executeScript({
        target: { tabId: currentTab.id },
        func: (url) => {
          // Create a temporary textarea element
          const textarea = document.createElement("textarea");
          textarea.value = url;
          document.body.appendChild(textarea);
          textarea.select();

          // Copy the text
          const success = document.execCommand("copy");

          // Remove the textarea
          document.body.removeChild(textarea);

          return success;
        },
        args: [currentUrl],
      })
      .then((results) => {
        if (results && results[0] && results[0].result) {
          console.log("URL copied successfully via content script");

          // Show notification in the active tab
          chrome.tabs
            .sendMessage(currentTab.id, {
              action: "showNotification",
            })
            .catch((error) => {
              console.error("Error sending notification message:", error);
            });
        } else {
          console.error("Failed to copy URL via content script");
        }
      })
      .catch((error) => {
        console.error("Error in executeScript:", error);
      });
  });
}
