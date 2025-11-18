#!/usr/bin/env node

import { extname } from 'path';
import { validateInputFile, validateOutputPath, generateOutputFilename } from './lib/file-utils.js';
import { getFormatSettings, mergeWithPreset } from './lib/config-loader.js';
import {
  checkFFmpegInstalled,
  executeFFmpeg,
  buildConvertArgs,
  displaySizeComparison
} from './lib/ffmpeg-wrapper.js';

/**
 * Convert video format
 * @param {string} inputPath - Input video file path
 * @param {string} outputPath - Output video file path (optional)
 * @param {string} format - Target format (mp4, webm)
 * @param {string} preset - Optional quality preset
 */
async function convertVideo(inputPath, outputPath = null, format = 'webm', preset = null) {
  console.log('🎬 Video Format Converter\n');

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

  // Check if input and output formats are the same
  const inputExt = extname(inputPath).toLowerCase().slice(1);
  if (inputExt === format) {
    console.error(`✗ Error: Input is already in ${format} format`);
    console.error('  Use compress.js if you want to re-encode the same format');
    process.exit(1);
  }

  // Generate output path if not provided
  if (!outputPath) {
    outputPath = generateOutputFilename(inputPath, '', `.${format}`);
  }

  // Validate output path
  const outputValidation = validateOutputPath(outputPath);
  if (!outputValidation.valid) {
    console.error(`✗ ${outputValidation.error}`);
    process.exit(1);
  }

  // Load format settings
  console.log(`📋 Converting to: ${format.toUpperCase()}`);
  const formatSettings = getFormatSettings(format);
  console.log(`   Video codec: ${formatSettings.videoCodec}`);
  console.log(`   Audio codec: ${formatSettings.audioCodec}`);

  // Load quality options if preset specified
  let qualityOptions = {};
  if (preset) {
    console.log(`   Quality preset: ${preset}`);
    qualityOptions = mergeWithPreset(preset);
  }

  // Build ffmpeg arguments
  const args = buildConvertArgs(inputPath, outputPath, formatSettings, qualityOptions);

  // Execute conversion
  console.log(`\n🔄 Converting video...`);
  console.log(`   Input:  ${inputPath}`);
  console.log(`   Output: ${outputPath}\n`);

  const result = await executeFFmpeg(args, { showProgress: true });

  if (result.success) {
    console.log('✓ Conversion complete!');
    displaySizeComparison(inputPath, outputPath);
  } else {
    console.error('\n✗ Conversion failed:');
    console.error(result.error);
    process.exit(1);
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Video Format Converter

Usage:
  node convert.js <input> [output] [options]

Arguments:
  input          Path to input video file (required)
  output         Path to output file (optional, auto-generates with new extension)

Options:
  --format, -f   Target format: mp4, webm (default: webm)
  --preset, -p   Quality preset: mobile, balanced, high (optional)
  --help, -h     Show this help message

Examples:
  node convert.js public/videos/my-video.mp4
  node convert.js public/videos/my-video.mp4 --format webm
  node convert.js public/videos/my-video.mp4 public/videos/output.webm
  node convert.js public/videos/my-video.webm --format mp4 --preset balanced
    `);
    process.exit(0);
  }

  const config = {
    input: args[0],
    output: null,
    format: 'webm',
    preset: null
  };

  // Check if second arg is output path or option
  if (args[1] && !args[1].startsWith('--') && !args[1].startsWith('-')) {
    config.output = args[1];
    // Infer format from output extension
    const outputExt = extname(args[1]).toLowerCase().slice(1);
    if (outputExt) {
      config.format = outputExt;
    }
  }

  // Parse options
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--format' || arg === '-f') {
      config.format = args[++i];
    } else if (arg === '--preset' || arg === '-p') {
      config.preset = args[++i];
    }
  }

  return config;
}

// Main execution
const config = parseArgs();
convertVideo(config.input, config.output, config.format, config.preset)
  .catch(error => {
    console.error('✗ Unexpected error:', error.message);
    process.exit(1);
  });
