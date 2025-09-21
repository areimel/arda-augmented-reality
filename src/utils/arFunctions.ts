// AR Position Control Functions
// Handles 3D object positioning for wall, flat, and card orientations

export interface ObjectWrapperElement extends HTMLElement {
  setAttribute: (name: string, value: string) => void;
  getAttribute: (name: string) => string | null;
}

export interface ControlsContainer extends HTMLElement {
  setAttribute: (name: string, value: string) => void;
}

export type ViewType = 'wall' | 'flat' | 'card';

/**
 * Set up position controls for 3D objects based on wall/flat/card orientations
 */
export function positionSet(): void {
  // DOM elements
  const objectWrapper = document.querySelector('#objectWrapper') as ObjectWrapperElement | null;
  const controlsContainer = document.querySelector('.controls') as ControlsContainer | null;
  const controlButtonWall = document.querySelector('.controlButton[data-control-button="wall"]') as HTMLElement | null;
  const controlButtonFlat = document.querySelector('.controlButton[data-control-button="flat"]') as HTMLElement | null;

  if (!objectWrapper) {
    console.warn('Object wrapper element not found');
    return;
  }

  // Data Variables
  // Wall settings
  const wallRotationSetting = objectWrapper.getAttribute("data-wall-rotation");
  const wallPositionSetting = objectWrapper.getAttribute("data-wall-position");
  // Flat settings
  const flatRotationSetting = objectWrapper.getAttribute("data-flat-rotation");
  const flatPositionSetting = objectWrapper.getAttribute("data-flat-position");
  // Card settings
  const cardRotationSetting = objectWrapper.getAttribute("data-card-rotation");
  const cardPositionSetting = objectWrapper.getAttribute("data-card-position");

  /**
   * Updates .objectWrapper element based on element's data-attribute settings
   */
  function updateObjectWrapperSettings(viewType: ViewType): void {
    if (viewType === "wall") {
      if (wallRotationSetting) objectWrapper.setAttribute("rotation", wallRotationSetting);
      if (wallPositionSetting) objectWrapper.setAttribute("position", wallPositionSetting);
      updateButtonVisibility(viewType);
    } else if (viewType === "flat") {
      if (flatRotationSetting) objectWrapper.setAttribute("rotation", flatRotationSetting);
      if (flatPositionSetting) objectWrapper.setAttribute("position", flatPositionSetting);
      updateButtonVisibility(viewType);
    } else if (viewType === "card") {
      if (cardRotationSetting) objectWrapper.setAttribute("rotation", cardRotationSetting);
      if (cardPositionSetting) objectWrapper.setAttribute("position", cardPositionSetting);
      updateButtonVisibility(viewType);
    } else {
      console.log("No view type found");
    }
  }

  function updateButtonVisibility(rotationSetting: ViewType): void {
    controlsContainer?.setAttribute('data-current-rotation', rotationSetting);
  }

  // Event listeners
  controlButtonWall?.addEventListener('click', function() {
    console.log("controlButtonWall click");
    updateObjectWrapperSettings("wall");
  });

  controlButtonFlat?.addEventListener('click', function() {
    console.log("controlButtonFlat click");
    objectWrapper.setAttribute("data-rotation-setting", "flat");
    updateObjectWrapperSettings("flat");
  });

  // Initialize button visibility based on initial rotation setting
  const initialSetting = objectWrapper.getAttribute("data-rotation-setting") as ViewType || "flat";
  updateButtonVisibility(initialSetting);
}

/**
 * Check URL parameters for position setting and apply them
 */
export function checkUrlPosition(): void {
  const params = new URLSearchParams(window.location.search);
  const position = params.get('position') as ViewType | null;
  const objectWrapper = document.querySelector('#objectWrapper') as ObjectWrapperElement | null;
  const controlsContainer = document.querySelector('.controls') as ControlsContainer | null;

  function updateButtonVisibility(rotationSetting: ViewType): void {
    controlsContainer?.setAttribute('data-current-rotation', rotationSetting);
  }

  if (position === 'wall') {
    console.log("URL position: wall");
    objectWrapper?.setAttribute("data-rotation-setting", "wall");
    objectWrapper?.setAttribute("rotation", "0 0 0");
    updateButtonVisibility("wall");
  } else if (position === 'flat') {
    console.log("URL position: flat");
    objectWrapper?.setAttribute("data-rotation-setting", "flat");
    objectWrapper?.setAttribute("rotation", "90 0 0");
    updateButtonVisibility("flat");
  }
}

/**
 * Initialize AR position functions when DOM is ready
 */
export function initializeArFunctions(): void {
  checkUrlPosition();
  positionSet();
}

// Auto-initialize when DOM is loaded (for backward compatibility)
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initializeArFunctions);
}