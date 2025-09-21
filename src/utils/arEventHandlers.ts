// AR Event Handlers for Mind-AR interactions
// Handles AR system events, target detection, and user interactions

export interface ARScene extends HTMLElement {
  systems: {
    [key: string]: ARSystem;
  };
}

export interface ARSystem {
  start(): void;
  stop(): void;
  pause(keepVideo?: boolean): void;
  unpause(): void;
}

export interface ARTarget extends HTMLElement {
  addEventListener(event: 'targetFound' | 'targetLost' | 'click', callback: (event: Event) => void): void;
}

/**
 * Initialize AR event handlers for Mind-AR system
 */
export function initializeArEventHandlers(): void {
  const sceneEl = document.querySelector('a-scene') as ARScene | null;
  let arSystem: ARSystem;

  if (!sceneEl) {
    console.warn('A-Frame scene not found');
    return;
  }

  sceneEl.addEventListener('loaded', function () {
    arSystem = sceneEl.systems["mindar-image-system"];
  });

  const exampleTarget = document.querySelector('#example-target') as ARTarget | null;
  const examplePlane = document.querySelector('#example-plane') as HTMLElement | null;
  const startButton = document.querySelector("#example-start-button") as HTMLElement | null;
  const stopButton = document.querySelector("#example-stop-button") as HTMLElement | null;
  const pauseButton = document.querySelector("#example-pause-button") as HTMLElement | null;
  const pauseKeepVideoButton = document.querySelector("#example-pause-keep-video-button") as HTMLElement | null;
  const unpauseButton = document.querySelector("#example-unpause-button") as HTMLElement | null;

  // AR Control Button Event Listeners
  startButton?.addEventListener('click', () => {
    console.log("start");
    arSystem?.start(); // start AR
  });

  stopButton?.addEventListener('click', () => {
    arSystem?.stop(); // stop AR
  });

  pauseButton?.addEventListener('click', () => {
    arSystem?.pause(); // pause AR, pause video
  });

  pauseKeepVideoButton?.addEventListener('click', () => {
    arSystem?.pause(true); // pause AR, keep video
  });

  unpauseButton?.addEventListener('click', () => {
    arSystem?.unpause(); // unpause AR and video
  });

  // AR System Event Listeners
  sceneEl.addEventListener("arReady", (event) => {
    console.log("MindAR is ready");
  });

  sceneEl.addEventListener("arError", (event) => {
    console.log("MindAR failed to start");
  });

  // Target Detection Event Listeners
  exampleTarget?.addEventListener("targetFound", event => {
    console.log("target found");
  });

  exampleTarget?.addEventListener("targetLost", event => {
    console.log("target lost");
  });

  // Interaction Event Listeners
  examplePlane?.addEventListener("click", event => {
    console.log("plane click");
  });
}

/**
 * Set up custom AR event handlers for specific target elements
 * @param targetSelector - CSS selector for the target element
 * @param onTargetFound - Callback when target is found
 * @param onTargetLost - Callback when target is lost
 * @param onTargetClick - Callback when target is clicked
 */
export function setupCustomArEventHandlers(
  targetSelector: string,
  onTargetFound?: () => void,
  onTargetLost?: () => void,
  onTargetClick?: () => void
): void {
  const target = document.querySelector(targetSelector) as ARTarget | null;

  if (!target) {
    console.warn(`AR target not found: ${targetSelector}`);
    return;
  }

  if (onTargetFound) {
    target.addEventListener("targetFound", onTargetFound);
  }

  if (onTargetLost) {
    target.addEventListener("targetLost", onTargetLost);
  }

  if (onTargetClick) {
    target.addEventListener("click", onTargetClick);
  }
}

// Auto-initialize when DOM is loaded (for backward compatibility)
if (typeof document !== 'undefined') {
  document.addEventListener("DOMContentLoaded", initializeArEventHandlers);
}