import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileExists, getProjectRoot } from './file-utils.js';

const CONFIG_DIR = 'tools/video/config';

/**
 * Load JSON configuration file
 * @param {string} configName - Name of config file (without .json extension)
 * @returns {Object} Parsed configuration object
 */
export function loadConfig(configName) {
  const configPath = resolve(getProjectRoot(), CONFIG_DIR, `${configName}.json`);

  if (!fileExists(configPath)) {
    throw new Error(`Configuration file not found: ${configPath}`);
  }

  try {
    const content = readFileSync(configPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to parse config file ${configName}: ${error.message}`);
  }
}

/**
 * Load video settings configuration
 * @returns {Object} Video settings configuration
 */
export function loadVideoSettings() {
  return loadConfig('video-settings');
}

/**
 * Load batch tasks configuration
 * @returns {Object} Batch tasks configuration
 */
export function loadBatchTasks() {
  return loadConfig('batch-tasks');
}

/**
 * Get quality preset settings
 * @param {string} presetName - Name of preset (mobile, balanced, high)
 * @returns {Object} Preset configuration
 */
export function getQualityPreset(presetName) {
  const settings = loadVideoSettings();

  if (!settings.qualityPresets[presetName]) {
    throw new Error(
      `Unknown quality preset: ${presetName}. Available: ${Object.keys(settings.qualityPresets).join(', ')}`
    );
  }

  return settings.qualityPresets[presetName];
}

/**
 * Get format settings
 * @param {string} format - Format name (mp4, webm)
 * @returns {Object} Format configuration
 */
export function getFormatSettings(format) {
  const settings = loadVideoSettings();

  if (!settings.formats[format]) {
    throw new Error(
      `Unknown format: ${format}. Available: ${Object.keys(settings.formats).join(', ')}`
    );
  }

  return settings.formats[format];
}

/**
 * Get greenscreen settings
 * @returns {Object} Greenscreen configuration
 */
export function getGreenscreenSettings() {
  const settings = loadVideoSettings();
  return settings.greenscreen;
}

/**
 * Merge custom options with preset
 * @param {string} presetName - Name of quality preset
 * @param {Object} customOptions - Custom options to override
 * @returns {Object} Merged configuration
 */
export function mergeWithPreset(presetName, customOptions = {}) {
  const preset = getQualityPreset(presetName);
  return { ...preset, ...customOptions };
}

/**
 * Validate batch task configuration
 * @param {Object} task - Task configuration object
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateBatchTask(task) {
  const errors = [];

  if (!task.operation) {
    errors.push('Task missing required field: operation');
  }

  if (!task.input) {
    errors.push('Task missing required field: input');
  }

  if (!task.output) {
    errors.push('Task missing required field: output');
  }

  const validOperations = ['compress', 'convert', 'greenscreen', 'resize'];
  if (task.operation && !validOperations.includes(task.operation)) {
    errors.push(`Invalid operation: ${task.operation}. Must be one of: ${validOperations.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
