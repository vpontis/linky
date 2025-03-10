// Log when popup is loaded
console.log("Popup script loaded");

document.addEventListener('DOMContentLoaded', function() {
  const copyButton = document.getElementById('copyButton');
  const statusDiv = document.getElementById('status');
  
  copyButton.addEventListener('click', function() {
    console.log("Copy button clicked");
    copyCurrentUrl();
  });
  
  function copyCurrentUrl() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs && tabs.length > 0) {
        const currentTab = tabs[0];
        const url = currentTab.url;
        console.log("Current URL:", url);
        
        navigator.clipboard.writeText(url).then(function() {
          console.log("URL copied to clipboard");
          // Show the status message in popup
          statusDiv.style.display = 'block';
          
          // Hide the status message after 2 seconds
          setTimeout(function() {
            statusDiv.style.display = 'none';
          }, 2000);
          
          // Show notification in the tab
          chrome.tabs.sendMessage(currentTab.id, { 
            action: 'showNotification' 
          }).catch(error => {
            console.error("Error sending notification message:", error);
          });
          
          // Close the popup after copying
          setTimeout(function() {
            window.close();
          }, 1000);
        }).catch(function(err) {
          console.error("Failed to copy URL:", err);
        });
      } else {
        console.error("No active tab found");
      }
    });
  }
});