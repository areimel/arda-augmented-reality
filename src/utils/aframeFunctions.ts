// A-Frame utility functions
// Clock updates, cursor events, and interactive element handling

export interface AFrameElement extends HTMLElement {
  getAttribute(name: string): string | null;
  setAttribute(name: string, value: string): void;
  flushToDom?(force?: boolean): void;
}

export interface ClickableElement extends AFrameElement {
  addEventListener(event: 'click' | 'fusing' | 'mouseenter' | 'mouseleave', callback: (event: Event) => void): void;
}

/**
 * Update live clock display in A-Frame scene
 */
export function updateTime(): boolean {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}:${seconds}`;

  const clockElement = document.getElementById('LiveClock') as AFrameElement | null;

  if (clockElement) {
    clockElement.setAttribute('value', timeString);
  }

  return false;
}

/**
 * Initialize live clock with interval updates
 */
export function initializeLiveClock(): void {
  // Initial call
  updateTime();
  // Update time every second
  setInterval(updateTime, 1000);
}

/**
 * Toggle color of an A-Frame element between red and green
 */
export function toggleColor(element: AFrameElement): void {
  const isActive = element.getAttribute("data-active") === "true";

  if (isActive) {
    element.setAttribute("data-active", "false");
    element.setAttribute("color", "#FF0000");
  } else {
    element.setAttribute("data-active", "true");
    element.setAttribute("color", "#00FF00");
  }
}

/**
 * Set up click event for color toggle test cube
 */
export function initializeClickTestCube(): void {
  const element = document.querySelector('#ClickTestCube') as ClickableElement | null;

  if (element) {
    element.addEventListener('click', function() {
      toggleColor(element);
    });
  }
}

/**
 * Set up cursor events for fusing and clicking
 */
export function initializeCursorEvents(): void {
  const element = document.querySelector('#cursor') as ClickableElement | null;

  if (element) {
    element.addEventListener('fusing', function() {
      console.log("EVENT | cursor state: fusing");
    });

    element.addEventListener('click', function() {
      console.log("EVENT | cursor state: click");
    });
  }
}

/**
 * Set up interactive text update on click events
 */
export function initializeUpdateTextOnClick(): void {
  const element = document.querySelector('#ClickEventTester') as ClickableElement | null;
  const textElement = element?.querySelector('.updatableText') as AFrameElement | null;

  if (!element || !textElement) {
    return;
  }

  function resetText(): void {
    element.setAttribute("material", "color: #0000FF; side: double;");
    textElement.setAttribute("value", "Aim Reticule to Fuse-Click (1.5s)");
  }

  element.addEventListener('fusing', function() {
    element.setAttribute("material", "color: #00FF00; side: double;");
    textElement.setAttribute("value", "fusing");
  });

  element.addEventListener('click', function() {
    element.setAttribute("material", "color: #0000FF; side: double;");
    textElement.setAttribute("value", "click");
  });

  element.addEventListener('mouseenter', function() {
    element.setAttribute("material", "color: #0000FF; side: double;");
    textElement.setAttribute("value", "mouseenter");
  });

  element.addEventListener('mouseleave', function() {
    element.setAttribute("material", "color: #0000FF; side: double;");
    textElement.setAttribute("value", "mouseleave, resetting...");

    // Reset after delay
    setTimeout(() => {
      resetText();
    }, 3000); // time in ms
  });
}

/**
 * Initialize all A-Frame functions
 */
export function initializeAFrameFunctions(): void {
  initializeLiveClock();
  initializeClickTestCube();
  initializeCursorEvents();
  initializeUpdateTextOnClick();
}

// Auto-initialize when DOM is loaded (for backward compatibility)
if (typeof document !== 'undefined') {
  document.addEventListener("DOMContentLoaded", initializeAFrameFunctions);
}