#!/usr/bin/env node

import { validateInputFile, validateOutputPath, generateOutputFilename } from './lib/file-utils.js';
import { getQualityPreset, mergeWithPreset } from './lib/config-loader.js';
import {
  checkFFmpegInstalled,
  executeFFmpeg,
  buildCompressArgs,
  displaySizeComparison
} from './lib/ffmpeg-wrapper.js';

/**
 * Compress a video file
 * @param {string} inputPath - Input video file path
 * @param {string} outputPath - Output video file path (optional)
 * @param {string} preset - Quality preset name (mobile, balanced, high)
 * @param {Object} customOptions - Custom compression options to override preset
 */
async function compressVideo(inputPath, outputPath = null, preset = 'balanced', customOptions = {}) {
  console.log('🎬 Video Compression Tool\n');

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

  // Generate output path if not provided
  if (!outputPath) {
    outputPath = generateOutputFilename(inputPath, '-compressed');
  }

  // Validate output path
  const outputValidation = validateOutputPath(outputPath);
  if (!outputValidation.valid) {
    console.error(`✗ ${outputValidation.error}`);
    process.exit(1);
  }

  // Load quality preset
  console.log(`📋 Using preset: ${preset}`);
  const options = mergeWithPreset(preset, customOptions);

  console.log(`   CRF: ${options.crf}`);
  console.log(`   Video bitrate: ${options.videoBitrate}`);
  console.log(`   Audio bitrate: ${options.audioBitrate}`);
  if (options.maxWidth && options.maxHeight) {
    console.log(`   Max resolution: ${options.maxWidth}x${options.maxHeight}`);
  }

  // Build ffmpeg arguments
  const args = buildCompressArgs(inputPath, outputPath, options);

  // Execute compression
  console.log(`\n🔄 Compressing video...`);
  console.log(`   Input:  ${inputPath}`);
  console.log(`   Output: ${outputPath}\n`);

  const result = await executeFFmpeg(args, { showProgress: true });

  if (result.success) {
    console.log('✓ Compression complete!');
    displaySizeComparison(inputPath, outputPath);
  } else {
    console.error('\n✗ Compression failed:');
    console.error(result.error);
    process.exit(1);
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Video Compression Tool

Usage:
  node compress.js <input> [output] [options]

Arguments:
  input          Path to input video file (required)
  output         Path to output file (optional, defaults to input-compressed.ext)

Options:
  --preset, -p   Quality preset: mobile, balanced, high (default: balanced)
  --crf          CRF value (0-51, lower = better quality)
  --bitrate, -b  Video bitrate (e.g., 2000k)
  --audio, -a    Audio bitrate (e.g., 128k)
  --help, -h     Show this help message

Examples:
  node compress.js public/videos/my-video.mp4
  node compress.js public/videos/my-video.mp4 public/videos/compressed.mp4
  node compress.js public/videos/my-video.mp4 --preset mobile
  node compress.js public/videos/my-video.mp4 --crf 28 --bitrate 1500k
    `);
    process.exit(0);
  }

  const config = {
    input: args[0],
    output: null,
    preset: 'balanced',
    customOptions: {}
  };

  // Check if second arg is output path or option
  if (args[1] && !args[1].startsWith('--') && !args[1].startsWith('-')) {
    config.output = args[1];
  }

  // Parse options
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--preset' || arg === '-p') {
      config.preset = args[++i];
    } else if (arg === '--crf') {
      config.customOptions.crf = parseInt(args[++i]);
    } else if (arg === '--bitrate' || arg === '-b') {
      config.customOptions.videoBitrate = args[++i];
    } else if (arg === '--audio' || arg === '-a') {
      config.customOptions.audioBitrate = args[++i];
    }
  }

  return config;
}

// Main execution
const config = parseArgs();
compressVideo(config.input, config.output, config.preset, config.customOptions)
  .catch(error => {
    console.error('✗ Unexpected error:', error.message);
    process.exit(1);
  });
