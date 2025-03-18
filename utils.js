// Utility functions for Linky extension

/**
 * Processes a URL to strip query parameters from specific domains
 * @param {string} url - The URL to process
 * @return {string} - The processed URL
 */
function processUrl(url) {
  try {
    const urlObj = new URL(url);

    // List of domains where query parameters should be stripped
    const domainsToStripParams = ["sentry.io"];

    // Check if the current domain or any subdomain matches the list
    const shouldStripParams = domainsToStripParams.some(
      (domain) =>
        urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`),
    );

    if (shouldStripParams) {
      return `${urlObj.origin}${urlObj.pathname}`;
    }

    return url;
  } catch (e) {
    console.error("Error processing URL:", e);
    return url;
  }
}

export { processUrl };
