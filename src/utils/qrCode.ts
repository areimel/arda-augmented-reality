// QR Code generation utilities
// Handles dynamic QR code creation for elements with data attributes
import QRCode from 'qrcode';

export interface QRCodeElement extends HTMLElement {
  getAttribute(name: string): string | null;
}

export type QRCodeSize = 'small' | 'medium' | 'large';

export interface QRCodeRenderOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

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
export async function createQRCode(
  element: QRCodeElement,
  link: string,
  size: QRCodeSize | string | null
): Promise<HTMLCanvasElement | null> {
  const pxSize = getQRCodePixelSize(size);

  try {
    // Create canvas element
    const canvas = document.createElement('canvas');

    // Generate QR code on canvas
    await QRCode.toCanvas(canvas, link, {
      width: pxSize,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    });

    // Clear existing content and append canvas
    element.innerHTML = '';
    element.appendChild(canvas);

    return canvas;
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

    createQRCode(element, link, size).catch(error => {
      console.error('Failed to initialize QR code:', error);
    });
  });
}

/**
 * Create a QR code programmatically
 */
export async function generateQRCode(
  container: HTMLElement | string,
  text: string,
  options?: QRCodeRenderOptions
): Promise<HTMLCanvasElement | null> {
  const element = typeof container === 'string'
    ? document.querySelector(container) as HTMLElement
    : container;

  if (!element) {
    console.error('QR code container not found');
    return null;
  }

  const defaultOptions: QRCodeRenderOptions = {
    width: 250,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#ffffff'
    },
    errorCorrectionLevel: 'H'
  };

  const finalOptions = { ...defaultOptions, ...options };

  try {
    const canvas = document.createElement('canvas');
    await QRCode.toCanvas(canvas, text, finalOptions);

    element.innerHTML = '';
    element.appendChild(canvas);

    return canvas;
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
