// AR Video Handler utilities
// Manages video playback in AR scenes with target detection

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
  addEventListener(event: 'targetFound' | 'targetLost', callback: (event: Event) => void): void;
}

export interface ARVideo extends HTMLVideoElement {
  play(): Promise<void>;
  pause(): void;
}

/**
 * Initialize AR video handler with target-based video control
 */
export function initializeArVideoHandler(): void {
  const sceneEl = document.querySelector('a-scene') as ARScene | null;
  let arSystem: ARSystem;

  if (!sceneEl) {
    console.warn('A-Frame scene not found');
    return;
  }

  sceneEl.addEventListener('loaded', function() {
    arSystem = sceneEl.systems["mindar-image-system"];
    const video = document.querySelector("#ar-video") as ARVideo | null;
    video?.pause();
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

  // Target Detection Event Listeners with Video Control
  exampleTarget?.addEventListener("targetFound", event => {
    console.log("target found");
    const video = document.querySelector("#ar-video") as ARVideo | null;
    video?.play().catch(error => {
      console.error('Failed to play video:', error);
    });
  });

  exampleTarget?.addEventListener("targetLost", event => {
    console.log("target lost");
    const video = document.querySelector("#ar-video") as ARVideo | null;
    video?.pause();
  });

  // Interaction Event Listeners
  examplePlane?.addEventListener("click", event => {
    console.log("plane click");
  });
}

/**
 * Set up custom AR video handler for specific target and video elements
 * @param targetSelector - CSS selector for the target element
 * @param videoSelector - CSS selector for the video element
 * @param onTargetFound - Optional callback when target is found
 * @param onTargetLost - Optional callback when target is lost
 */
export function setupCustomArVideoHandler(
  targetSelector: string,
  videoSelector: string,
  onTargetFound?: () => void,
  onTargetLost?: () => void
): void {
  const target = document.querySelector(targetSelector) as ARTarget | null;
  const video = document.querySelector(videoSelector) as ARVideo | null;

  if (!target) {
    console.warn(`AR target not found: ${targetSelector}`);
    return;
  }

  if (!video) {
    console.warn(`AR video not found: ${videoSelector}`);
    return;
  }

  target.addEventListener("targetFound", () => {
    console.log(`Target found: ${targetSelector}`);
    video.play().catch(error => {
      console.error('Failed to play video:', error);
    });
    onTargetFound?.();
  });

  target.addEventListener("targetLost", () => {
    console.log(`Target lost: ${targetSelector}`);
    video.pause();
    onTargetLost?.();
  });
}

/**
 * Pause all AR videos
 */
export function pauseAllArVideos(): void {
  const videos = document.querySelectorAll('video[id*="ar-video"], video[class*="ar-video"]') as NodeListOf<ARVideo>;
  videos.forEach(video => {
    video.pause();
  });
}

/**
 * Get AR video element by selector
 */
export function getArVideo(selector: string = "#ar-video"): ARVideo | null {
  return document.querySelector(selector) as ARVideo | null;
}

/**
 * Check if AR video is playing
 */
export function isArVideoPlaying(videoSelector: string = "#ar-video"): boolean {
  const video = getArVideo(videoSelector);
  return video ? !video.paused && !video.ended && video.readyState > 2 : false;
}

// Auto-initialize when DOM is loaded (for backward compatibility)
if (typeof document !== 'undefined') {
  document.addEventListener("DOMContentLoaded", initializeArVideoHandler);
}