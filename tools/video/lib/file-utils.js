import { existsSync, mkdirSync, statSync } from 'fs';
import { dirname, resolve, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get the project root directory
 * @returns {string} Absolute path to project root
 */
export function getProjectRoot() {
  // Go up 3 levels from tools/video/lib to project root
  return resolve(__dirname, '../../..');
}

/**
 * Resolve path relative to project root
 * @param {string} relativePath - Path relative to project root
 * @returns {string} Absolute path
 */
export function resolveProjectPath(relativePath) {
  return resolve(getProjectRoot(), relativePath);
}

/**
 * Check if file exists
 * @param {string} filePath - Path to file
 * @returns {boolean} True if file exists
 */
export function fileExists(filePath) {
  try {
    return existsSync(filePath) && statSync(filePath).isFile();
  } catch {
    return false;
  }
}

/**
 * Check if directory exists
 * @param {string} dirPath - Path to directory
 * @returns {boolean} True if directory exists
 */
export function directoryExists(dirPath) {
  try {
    return existsSync(dirPath) && statSync(dirPath).isDirectory();
  } catch {
    return false;
  }
}

/**
 * Ensure directory exists, create if it doesn't
 * @param {string} dirPath - Path to directory
 */
export function ensureDirectory(dirPath) {
  if (!directoryExists(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Validate input file exists and is a video
 * @param {string} filePath - Path to input file
 * @returns {Object} { valid: boolean, error?: string }
 */
export function validateInputFile(filePath) {
  const absolutePath = resolveProjectPath(filePath);

  if (!fileExists(absolutePath)) {
    return { valid: false, error: `Input file not found: ${filePath}` };
  }

  const ext = extname(filePath).toLowerCase();
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.m4v'];

  if (!videoExtensions.includes(ext)) {
    return { valid: false, error: `File is not a supported video format: ${ext}` };
  }

  return { valid: true };
}

/**
 * Validate output path and ensure directory exists
 * @param {string} outputPath - Path to output file
 * @returns {Object} { valid: boolean, error?: string, absolutePath: string }
 */
export function validateOutputPath(outputPath) {
  const absolutePath = resolveProjectPath(outputPath);
  const outputDir = dirname(absolutePath);

  try {
    ensureDirectory(outputDir);
    return { valid: true, absolutePath };
  } catch (error) {
    return { valid: false, error: `Cannot create output directory: ${error.message}` };
  }
}

/**
 * Get file size in MB
 * @param {string} filePath - Path to file
 * @returns {number} File size in megabytes
 */
export function getFileSizeMB(filePath) {
  try {
    const stats = statSync(filePath);
    return (stats.size / (1024 * 1024)).toFixed(2);
  } catch {
    return 0;
  }
}

/**
 * Generate output filename with suffix
 * @param {string} inputPath - Input file path
 * @param {string} suffix - Suffix to add (e.g., '-compressed')
 * @param {string} newExtension - Optional new extension (e.g., '.webm')
 * @returns {string} New filename
 */
export function generateOutputFilename(inputPath, suffix, newExtension = null) {
  const ext = newExtension || extname(inputPath);
  const base = basename(inputPath, extname(inputPath));
  const dir = dirname(inputPath);
  return resolve(dir, `${base}${suffix}${ext}`);
}
