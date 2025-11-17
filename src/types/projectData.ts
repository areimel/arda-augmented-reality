/**
 * TypeScript interfaces for ARDA AR project data
 * These types provide type safety and IDE support for project configuration files
 */

/**
 * Experience type defines what kind of AR content will be displayed
 */
export type ExperienceType = 'video' | 'image' | '3d-object';

/**
 * UI preset determines the UI messaging and behavior
 */
export type UIPreset = 'default' | 'product' | 'artwork';

/**
 * Position orientation for AR content
 */
export type PositionOrientation = 'wall' | 'flat' | 'card';

/**
 * Scale preset for AR objects
 */
export type ScalePreset = 'default' | 'large';

/**
 * A-Frame asset item configuration
 */
export interface AssetItem {
  type: 'img' | 'video' | 'a-asset-item';
  id: string;
  src: string;
  attributes?: {
    playsinline?: boolean;
    crossorigin?: string;
    loop?: boolean;
    autoplay?: boolean;
    [key: string]: any;
  };
}

/**
 * Background image configuration for splash page
 * Can be a simple string path or an object with responsive images
 */
export interface BackgroundImages {
  active: boolean;
  desktop: string;
  mobile: string;
}

/**
 * Model/object positioning and scale settings
 */
export interface ModelSettings {
  /** Position orientation: wall (vertical), flat (horizontal), or card */
  position: PositionOrientation;
  /** Scale preset for the object */
  scale: ScalePreset;
  /** Custom video width (for video experiences) */
  videoWidth?: string;
  /** Custom video height (for video experiences) */
  videoHeight?: string;
  /** Enable greenscreen/chromakey effect for videos */
  isGreenscreen?: boolean;
  /** RGB color for chromakey (default: "0.1 0.9 0.2" for green) */
  chromakeyColor?: string;
  /** Custom scale for 3D models (e.g., "0.004 0.004 0.004") */
  modelScale?: string;
  /** Custom rotation for 3D models (e.g., "0 0 0") */
  modelRotation?: string;
  /** Custom position for 3D models (e.g., "0 -0.25 0") */
  modelPosition?: string;
}

/**
 * Splash page configuration
 */
export interface SplashPage {
  /** Background image path or responsive image object */
  backgroundImage: string | BackgroundImages | null;
}

/**
 * PDF download configuration
 */
export interface PdfSettings {
  /** Whether PDFs are available for download */
  available: boolean;
  /** Path to wall orientation PDF */
  wall: string;
  /** Path to flat orientation PDF */
  flat: string;
}

/**
 * Main project data interface
 * Defines all configuration for an AR experience
 */
export interface ProjectData {
  /** Display name of the project */
  projectName: string;
  /** Brief description of the AR experience */
  projectDescription: string;
  /** Path to compiled Mind-AR marker file (.mind) */
  markerFile: string;
  /** Path to marker image for reference/printing */
  markerImage: string;
  /** Path to the main display file (video, image, or 3D model) */
  displayFile: string;
  /** Type of AR experience */
  experienceType?: ExperienceType;
  /** UI preset for messaging and behavior */
  uiPreset?: UIPreset;
  /** Model positioning and scale settings */
  modelSettings: ModelSettings;
  /** Splash page configuration */
  splashPage: SplashPage;
  /** PDF download settings */
  pdfs: PdfSettings;
  /** Additional A-Frame assets (optional) */
  assets?: AssetItem[];
  /** Custom asset width (legacy/optional) */
  assetWidth?: string;
  /** Custom asset height (legacy/optional) */
  assetHeight?: string;
  /** Custom asset scale (legacy/optional) */
  assetScale?: string;
}

/**
 * Site-wide configuration data
 */
export interface SiteData {
  /** Base URL for the site */
  siteURL: string;
  /** Suffix appended to page titles */
  titleSuffix: string;
  /** Company/organization name */
  companyName: string;
  /** Path to company logo */
  companyLogo: string;
  /** Path to company logo glyph/icon */
  companyLogoGlyph: string;
  /** Project name */
  projectName: string;
  /** Fallback description for meta tags */
  fallbackDescription: string;
  /** Site metadata */
  siteMetadata: {
    /** Author name */
    author: string;
    /** Theme color preference */
    themeColor: string;
  };
}

/**
 * Type guard to check if an object is a ProjectData
 */
export function isProjectData(obj: any): obj is ProjectData {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.projectName === 'string' &&
    typeof obj.markerFile === 'string' &&
    typeof obj.displayFile === 'string'
  );
}

/**
 * Type guard to check if an object is SiteData
 */
export function isSiteData(obj: any): obj is SiteData {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.siteURL === 'string' &&
    typeof obj.companyName === 'string'
  );
}
