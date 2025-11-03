// A-Frame Look-At Component
// Custom A-Frame component for making entities look at target elements

// A-Frame global interface
declare global {
  interface Window {
    AFRAME: {
      registerComponent(name: string, definition: ComponentDefinition): void;
    };
  }
}

export interface ComponentDefinition {
  schema: ComponentSchema;
  init?(): void;
  tick?(): void;
}

export interface ComponentSchema {
  type: string;
}

export interface AFrameComponent {
  el: AFrameEntity;
  data: AFrameEntity;
}

export interface AFrameEntity {
  object3D: {
    position: Vector3;
    lookAt(target: Vector3): void;
  };
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

/**
 * Register the look-at component with A-Frame
 */
export function registerLookAtComponent(): void {
  if (typeof window === 'undefined' || !window.AFRAME) {
    console.error('A-Frame not available');
    return;
  }

  window.AFRAME.registerComponent('look-at', {
    schema: { type: 'selector' },

    init: function() {
      // Component initialization
    },

    tick: function(this: AFrameComponent) {
      // Make this entity look at the target every frame
      if (this.data && this.data.object3D && this.data.object3D.position) {
        this.el.object3D.lookAt(this.data.object3D.position);
      }
    }
  });
}

/**
 * Initialize the look-at component
 */
export function initializeLookAtComponent(): void {
  registerLookAtComponent();
}

// Auto-register when the script loads (for backward compatibility)
if (typeof document !== 'undefined') {
  // Wait for A-Frame to be available
  if (typeof window !== 'undefined' && window.AFRAME) {
    registerLookAtComponent();
  } else {
    // Wait for A-Frame to load
    document.addEventListener('DOMContentLoaded', () => {
      // Check if A-Frame is available after DOM load
      if (typeof window !== 'undefined' && window.AFRAME) {
        registerLookAtComponent();
      } else {
        console.warn('A-Frame not available for look-at component registration');
      }
    });
  }
}