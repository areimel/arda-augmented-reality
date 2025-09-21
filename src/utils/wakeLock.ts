// Wake Lock API utilities
// Prevents screen from sleeping during AR experiences

export interface WakeLockSentinel {
  released: boolean;
  release(): Promise<void>;
  addEventListener(event: 'release', callback: () => void): void;
}

export interface NavigatorWithWakeLock {
  wakeLock: {
    request(type?: 'screen'): Promise<WakeLockSentinel>;
  };
}

let wakelock: WakeLockSentinel | null = null;

/**
 * Check if Wake Lock API is supported in the current browser
 */
export function canWakeLock(): boolean {
  return 'wakeLock' in navigator;
}

/**
 * Request a wake lock to prevent screen from sleeping
 */
export async function lockWakeState(): Promise<boolean> {
  if (!canWakeLock()) {
    console.warn('Wake Lock API not supported');
    return false;
  }

  try {
    const nav = navigator as Navigator & NavigatorWithWakeLock;
    wakelock = await nav.wakeLock.request();

    wakelock.addEventListener('release', () => {
      console.log('Screen Wake State Locked:', !wakelock?.released);
    });

    console.log('Screen Wake State Locked:', !wakelock.released);
    return true;
  } catch (error) {
    console.error('Failed to lock wake state with reason:', (error as Error).message);
    return false;
  }
}

/**
 * Release the current wake lock
 */
export function releaseWakeState(): void {
  if (wakelock) {
    wakelock.release();
    wakelock = null;
    console.log('Wake lock released');
  }
}

/**
 * Get the current wake lock status
 */
export function getWakeLockStatus(): {
  isSupported: boolean;
  isActive: boolean;
  isReleased: boolean | null;
} {
  return {
    isSupported: canWakeLock(),
    isActive: wakelock !== null,
    isReleased: wakelock?.released ?? null
  };
}

/**
 * Initialize wake lock functionality
 */
export function initializeWakeLock(): void {
  console.log('Wake Lock API supported:', canWakeLock());
  lockWakeState();
}

/**
 * Legacy function name for backward compatibility
 */
export function WakeLock(): void {
  initializeWakeLock();
}

// Auto-initialize when DOM is loaded (for backward compatibility)
if (typeof document !== 'undefined') {
  document.addEventListener("DOMContentLoaded", initializeWakeLock);
}