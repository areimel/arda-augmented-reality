#!/usr/bin/env node

import { validateInputFile, validateOutputPath, generateOutputFilename } from './lib/file-utils.js';
import { getGreenscreenSettings } from './lib/config-loader.js';
import {
  checkFFmpegInstalled,
  executeFFmpeg,
  buildGreenscreenArgs,
  displaySizeComparison
} from './lib/ffmpeg-wrapper.js';

/**
 * Remove greenscreen and create video with alpha channel
 * @param {string} inputPath - Input video file path
 * @param {string} outputPath - Output video file path (optional, must be WebM)
 * @param {Object} customOptions - Custom chromakey options
 */
async function processGreenscreen(inputPath, outputPath = null, customOptions = {}) {
  console.log('🎬 Greenscreen to Alpha Channel Converter\n');

  // Check ffmpeg installation
  const ffmpegInstalled = await checkFFmpegInstalled();
  if (!ffmpegInstalled) {
    console.error('✗ Error: ffmpeg is not installed or not in PATH');
    console.error('  Install ffmpeg: https://ffmpeg.org/download.html');
    process.exit(1);
  }

  // Validate input file
  const inputValidation = validateInputFile(inputPath);
  if (!inputValidation.valid) {
    console.error(`✗ ${inputValidation.error}`);
    process.exit(1);
  }

  // Generate output path if not provided (always WebM for alpha support)
  if (!outputPath) {
    outputPath = generateOutputFilename(inputPath, '-alpha', '.webm');
  }

  // Ensure output is WebM
  if (!outputPath.toLowerCase().endsWith('.webm')) {
    console.error('✗ Error: Output file must be WebM format for alpha channel support');
    console.error('  Change output extension to .webm or omit output path to auto-generate');
    process.exit(1);
  }

  // Validate output path
  const outputValidation = validateOutputPath(outputPath);
  if (!outputValidation.valid) {
    console.error(`✗ ${outputValidation.error}`);
    process.exit(1);
  }

  // Load greenscreen settings
  const defaultSettings = getGreenscreenSettings();
  const options = { ...defaultSettings, ...customOptions };

  console.log('📋 Chromakey settings:');
  console.log(`   Color: ${options.color}`);
  console.log(`   Similarity: ${options.similarity}`);
  console.log(`   Blend: ${options.blend}`);
  console.log(`   Output format: WebM with alpha channel`);

  // Build ffmpeg arguments
  const args = buildGreenscreenArgs(inputPath, outputPath, options);

  // Execute greenscreen processing
  console.log(`\n🔄 Processing greenscreen...`);
  console.log(`   Input:  ${inputPath}`);
  console.log(`   Output: ${outputPath}\n`);

  const result = await executeFFmpeg(args, { showProgress: true });

  if (result.success) {
    console.log('✓ Greenscreen processing complete!');
    console.log('  Video now has transparent background (alpha channel)');
    displaySizeComparison(inputPath, outputPath);
  } else {
    console.error('\n✗ Greenscreen processing failed:');
    console.error(result.error);
    process.exit(1);
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Greenscreen to Alpha Channel Converter

Removes greenscreen and creates a WebM video with transparent background (alpha channel).
Perfect for AR experiences that need transparent videos.

Usage:
  node greenscreen.js <input> [output] [options]

Arguments:
  input           Path to input video file with greenscreen (required)
  output          Path to output WebM file (optional, auto-generates with -alpha.webm)

Options:
  --color, -c     Chroma key color in hex (default: 0x00FF00 for green)
  --similarity    Color similarity threshold 0-1 (default: 0.3)
  --blend         Edge blend amount 0-1 (default: 0.1)
  --help, -h      Show this help message

Common Colors:
  Green:  0x00FF00 (default)
  Blue:   0x0000FF
  Red:    0xFF0000

Examples:
  node greenscreen.js public/videos/greenscreen-video.mp4
  node greenscreen.js public/videos/greenscreen-video.mp4 public/videos/transparent.webm
  node greenscreen.js public/videos/bluescreen.mp4 --color 0x0000FF
  node greenscreen.js public/videos/greenscreen.mp4 --similarity 0.4 --blend 0.15

Tips:
  - Higher similarity removes more of the background but may affect edges
  - Higher blend creates softer edges but may look blurry
  - Test different values to find the best settings for your video
    `);
    process.exit(0);
  }

  const config = {
    input: args[0],
    output: null,
    customOptions: {}
  };

  // Check if second arg is output path or option
  if (args[1] && !args[1].startsWith('--') && !args[1].startsWith('-')) {
    config.output = args[1];
  }

  // Parse options
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--color' || arg === '-c') {
      config.customOptions.color = args[++i];
    } else if (arg === '--similarity') {
      config.customOptions.similarity = parseFloat(args[++i]);
    } else if (arg === '--blend') {
      config.customOptions.blend = parseFloat(args[++i]);
    }
  }

  return config;
}

// Main execution
const config = parseArgs();
processGreenscreen(config.input, config.output, config.customOptions)
  .catch(error => {
    console.error('✗ Unexpected error:', error.message);
    process.exit(1);
  });
