// QR Code generation utilities
// Handles dynamic QR code creation for elements with data attributes

// Global QRCode interface (from external library)
declare global {
  interface Window {
    QRCode: QRCodeConstructor;
  }
}

export interface QRCodeConstructor {
  new (element: HTMLElement, options: QRCodeOptions): QRCodeInstance;
  CorrectLevel: {
    L: number;
    M: number;
    Q: number;
    H: number;
  };
}

export interface QRCodeOptions {
  text: string;
  width: number;
  height: number;
  colorDark: string;
  colorLight: string;
  correctLevel: number;
}

export interface QRCodeInstance {
  // QR code instance methods (if needed)
}

export interface QRCodeElement extends HTMLElement {
  getAttribute(name: string): string | null;
}

export type QRCodeSize = 'small' | 'medium' | 'large';

/**
 * Get pixel size based on size designation
 */
export function getQRCodePixelSize(size: QRCodeSize | string | null): number {
  switch (size) {
    case 'small':
      return 100;
    case 'medium':
      return 250;
    case 'large':
      return 500;
    default:
      return 250; // default size
  }
}

/**
 * Create a single QR code for a given element
 */
export function createQRCode(element: QRCodeElement, link: string, size: QRCodeSize | string | null): QRCodeInstance | null {
  if (typeof window === 'undefined' || !window.QRCode) {
    console.error('QRCode library not available');
    return null;
  }

  const pxSize = getQRCodePixelSize(size);

  try {
    const qrcode = new window.QRCode(element, {
      text: link,
      width: pxSize,
      height: pxSize,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: window.QRCode.CorrectLevel.H
    });

    return qrcode;
  } catch (error) {
    console.error('Failed to create QR code:', error);
    return null;
  }
}

/**
 * Initialize QR codes for all elements with .qrcodeElement class
 */
export function initializeQRCodes(): void {
  const elements = document.querySelectorAll('.qrcodeElement') as NodeListOf<QRCodeElement>;

  elements.forEach(element => {
    const link = element.getAttribute("data-link");
    const size = element.getAttribute("data-size") as QRCodeSize | null;

    if (!link) {
      console.warn('QR code element missing data-link attribute:', element);
      return;
    }

    createQRCode(element, link, size);
  });
}

/**
 * Create a QR code programmatically
 */
export function generateQRCode(
  container: HTMLElement | string,
  text: string,
  options?: Partial<QRCodeOptions>
): QRCodeInstance | null {
  const element = typeof container === 'string'
    ? document.querySelector(container) as HTMLElement
    : container;

  if (!element) {
    console.error('QR code container not found');
    return null;
  }

  if (typeof window === 'undefined' || !window.QRCode) {
    console.error('QRCode library not available');
    return null;
  }

  const defaultOptions: QRCodeOptions = {
    text,
    width: 250,
    height: 250,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: window.QRCode.CorrectLevel.H
  };

  const finalOptions = { ...defaultOptions, ...options };

  try {
    return new window.QRCode(element, finalOptions);
  } catch (error) {
    console.error('Failed to generate QR code:', error);
    return null;
  }
}

/**
 * Legacy function name for backward compatibility
 */
export function QRCodesSet(): void {
  initializeQRCodes();
}

// Auto-initialize when DOM is loaded (for backward compatibility)
if (typeof document !== 'undefined') {
  document.addEventListener("DOMContentLoaded", initializeQRCodes);
}