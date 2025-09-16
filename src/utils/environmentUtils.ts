// Environment detection and URL resolution utilities

declare global {
  const __BASE_URLS__: {
    localhost: string;
    staging: string;
    live: string;
  };
}

export type Environment = 'localhost' | 'staging' | 'live';

/**
 * Detects the current environment based on Astro's built-in environment variables
 */
export function getCurrentEnvironment(): Environment {
  // Check if we're in development mode (astro dev)
  if (import.meta.env.DEV) {
    return 'localhost';
  }

  // In production, we could add logic to detect staging vs live
  // For now, we'll default to live for all production builds
  // You could extend this to check for staging environment variables or URLs
  if (import.meta.env.PROD) {
    // Add staging detection logic here if needed in the future
    // For example: if (import.meta.env.STAGING) return 'staging';
    return 'live';
  }

  // Fallback
  return 'live';
}

/**
 * Gets the base URL for the current environment
 */
export function getCurrentBaseURL(): string {
  const environment = getCurrentEnvironment();
  const baseUrls = __BASE_URLS__;

  return baseUrls[environment] || baseUrls.live;
}

/**
 * Converts a URL to use the current environment's base URL
 * Handles both absolute URLs (replaces domain) and relative URLs (adds base)
 */
export function adaptURLForEnvironment(url: string): string {
  if (!url) return url;

  const currentBaseURL = getCurrentBaseURL();

  // If it's already a relative URL or path, just prepend the base URL
  if (url.startsWith('/')) {
    return `${currentBaseURL}${url}`;
  }

  // If it's an absolute URL, replace the domain with current environment's domain
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const urlObj = new URL(url);
      const currentBaseObj = new URL(currentBaseURL);

      // Replace the host (domain + port) but keep the path
      urlObj.protocol = currentBaseObj.protocol;
      urlObj.host = currentBaseObj.host;

      return urlObj.toString();
    } catch (error) {
      console.warn('Failed to parse URL:', url, error);
      return url; // Return original URL if parsing fails
    }
  }

  // For other cases (like relative paths without leading slash), return as-is
  return url;
}

/**
 * Specific helper for adapting project URLs that might use different domains
 * This handles the case where some projects use different netlify subdomains
 */
export function adaptProjectURL(projectUrl: string): string {
  if (!projectUrl) return projectUrl;

  const currentBaseURL = getCurrentBaseURL();

  // Handle the specific case of different netlify domains
  if (projectUrl.includes('grovery-ar.netlify.app')) {
    // In development, redirect grovery-ar URLs to localhost
    if (getCurrentEnvironment() === 'localhost') {
      return projectUrl.replace('https://grovery-ar.netlify.app', currentBaseURL);
    }
  }

  // Use the standard URL adaptation for other cases
  return adaptURLForEnvironment(projectUrl);
}