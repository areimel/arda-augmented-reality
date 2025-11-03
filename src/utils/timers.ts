// Timer utilities for session tracking, stopwatch, and Pomodoro functionality
// Provides multiple timer types for different use cases

// External Timer library interface
declare global {
  interface Window {
    Timer: TimerConstructor;
  }
}

export interface TimerConstructor {
  new (): TimerInstance;
}

export interface TimerInstance {
  start(options?: TimerStartOptions): void;
  pause(): void;
  stop(): void;
  getTimeValues(): TimerValues;
  addEventListener(event: TimerEvent, callback: () => void): void;
}

export interface TimerStartOptions {
  countdown?: boolean;
  startValues?: {
    seconds?: number;
    minutes?: number;
    hours?: number;
  };
}

export interface TimerValues {
  toString(): string;
}

export type TimerEvent = 'secondsUpdated' | 'started' | 'reset' | 'targetAchieved';

/**
 * Create a session timer that starts automatically and updates an element
 */
export function createSessionTimer(elementID: string): TimerInstance | null {
  if (typeof window === 'undefined' || !window.Timer) {
    console.error('Timer library not available');
    return null;
  }

  const timer = new window.Timer();
  timer.start();

  timer.addEventListener('secondsUpdated', function() {
    const element = document.querySelector(elementID);
    if (element) {
      element.innerHTML = timer.getTimeValues().toString();
    }
  });

  return timer;
}

/**
 * Create a stopwatch timer with control buttons
 */
export function createStopWatchTimer(containerId: string = '#chronoExample'): TimerInstance | null {
  if (typeof window === 'undefined' || !window.Timer) {
    console.error('Timer library not available');
    return null;
  }

  const timer = new window.Timer();

  // Button event listeners
  const startButton = document.querySelector(`${containerId} .startButton`);
  const pauseButton = document.querySelector(`${containerId} .pauseButton`);
  const stopButton = document.querySelector(`${containerId} .stopButton`);
  const resetButton = document.querySelector(`${containerId} .resetButton`);
  const valuesDisplay = document.querySelector(`${containerId} .values`);

  startButton?.addEventListener('click', function() {
    timer.start();
  });

  pauseButton?.addEventListener('click', function() {
    timer.pause();
  });

  stopButton?.addEventListener('click', function() {
    timer.stop();
  });

  resetButton?.addEventListener('click', function() {
    timer.stop();
    timer.start();
  });

  // Timer event listeners
  timer.addEventListener('secondsUpdated', function() {
    if (valuesDisplay) {
      valuesDisplay.innerHTML = timer.getTimeValues().toString();
    }
  });

  timer.addEventListener('started', function() {
    if (valuesDisplay) {
      valuesDisplay.innerHTML = timer.getTimeValues().toString();
    }
  });

  timer.addEventListener('reset', function() {
    if (valuesDisplay) {
      valuesDisplay.innerHTML = timer.getTimeValues().toString();
    }
  });

  return timer;
}

/**
 * Create a Pomodoro timer with alternating work/break periods
 */
export function createPomodoroTimer(
  elementID: string,
  timer1Time: number,
  timer2Time: number,
  timer1ResetText: string = "00:00:30",
  timer2ResetText: string = "00:00:10",
  timer1EndMessage: string = "Timer 1 complete, flipping to Timer 2",
  timer2EndMessage: string = "Timer 2 complete, flipping back to Timer 1"
): { timer1: TimerInstance; timer2: TimerInstance } | null {
  if (typeof window === 'undefined' || !window.Timer) {
    console.error('Timer library not available');
    return null;
  }

  const timer1 = new window.Timer();
  const timer2 = new window.Timer();

  function timer1Start(seconds: number): void {
    timer1.start({ countdown: true, startValues: { seconds } });
  }

  function timer2Start(seconds: number): void {
    timer2.start({ countdown: true, startValues: { seconds } });
  }

  function messageFlash(text: string): void {
    const messageElement = document.querySelector(`${elementID} .message`);
    if (messageElement) {
      messageElement.innerHTML = text;
      setTimeout(() => {
        messageElement.innerHTML = "";
      }, 2000); // time in ms
    }
  }

  function setupTimer1Behavior(): void {
    const timer1Element = document.querySelector(`${elementID} .timer1`);
    if (timer1Element) {
      timer1Element.innerHTML = timer1.getTimeValues().toString();
    }

    timer1.addEventListener('secondsUpdated', function() {
      if (timer1Element) {
        timer1Element.innerHTML = timer1.getTimeValues().toString();
      }
    });

    timer1.addEventListener('targetAchieved', function() {
      messageFlash(timer1EndMessage);
      timer2Start(timer2Time);
      if (timer1Element) {
        timer1Element.innerHTML = timer1ResetText;
      }
    });
  }

  function setupTimer2Behavior(): void {
    const timer2Element = document.querySelector(`${elementID} .timer2`);
    if (timer2Element) {
      timer2Element.innerHTML = timer2.getTimeValues().toString();
    }

    timer2.addEventListener('secondsUpdated', function() {
      if (timer2Element) {
        timer2Element.innerHTML = timer2.getTimeValues().toString();
      }
    });

    timer2.addEventListener('targetAchieved', function() {
      messageFlash(timer2EndMessage);
      timer1Start(timer1Time);
      if (timer2Element) {
        timer2Element.innerHTML = timer2ResetText;
      }
    });
  }

  // Initialize behaviors
  setupTimer1Behavior();
  setupTimer2Behavior();
  timer1Start(timer1Time);

  return { timer1, timer2 };
}

/**
 * Initialize default timers
 */
export function initializeTimers(): void {
  createSessionTimer("#sessionTimer");
  createStopWatchTimer();

  // Initialize Pomodoro timer with default settings
  createPomodoroTimer(
    "#pomodoroTimerTest",
    30,   // timer1Time
    10,   // timer2Time
    "00:00:30", // timer1ResetText
    "00:00:10", // timer2ResetText
    "Timer 1 complete, flipping to Timer 2", // timer1EndMessage
    "Timer 2 complete, flipping back to Timer 1" // timer2EndMessage
  );
}

/**
 * Legacy function names for backward compatibility
 */
export function SessionTimer(elementID: string): TimerInstance | null {
  return createSessionTimer(elementID);
}

export function StopWatchTimer(elementID?: string): TimerInstance | null {
  return createStopWatchTimer(elementID);
}

export function PomodoroTimer(
  elementID: string,
  timer1Time: number,
  timer2Time: number,
  timer1ResetText?: string,
  timer2ResetText?: string,
  timer1EndMessage?: string,
  timer2EndMessage?: string
): { timer1: TimerInstance; timer2: TimerInstance } | null {
  return createPomodoroTimer(
    elementID,
    timer1Time,
    timer2Time,
    timer1ResetText,
    timer2ResetText,
    timer1EndMessage,
    timer2EndMessage
  );
}

// Auto-initialize when DOM is loaded (for backward compatibility)
if (typeof document !== 'undefined') {
  document.addEventListener("DOMContentLoaded", initializeTimers);
}