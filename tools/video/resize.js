#!/usr/bin/env node

import { validateInputFile, validateOutputPath, generateOutputFilename } from './lib/file-utils.js';
import { getVideoInfo } from './lib/ffmpeg-wrapper.js';
import {
  checkFFmpegInstalled,
  executeFFmpeg,
  buildResizeArgs,
  displaySizeComparison
} from './lib/ffmpeg-wrapper.js';

/**
 * Resize video
 * @param {string} inputPath - Input video file path
 * @param {string} outputPath - Output video file path (optional)
 * @param {Object} resizeOptions - Resize options
 */
async function resizeVideo(inputPath, outputPath = null, resizeOptions = {}) {
  console.log('🎬 Video Resize Tool\n');

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

  // Validate resize options
  if (!resizeOptions.width && !resizeOptions.height) {
    console.error('✗ Error: Must specify at least width or height');
    console.error('  Use --width, --height, or both');
    process.exit(1);
  }

  // Get video info
  try {
    const videoInfo = await getVideoInfo(inputPath);
    const videoStream = videoInfo.streams.find(s => s.codec_type === 'video');

    if (videoStream) {
      console.log('📹 Current video dimensions:');
      console.log(`   ${videoStream.width}x${videoStream.height}`);
    }
  } catch (error) {
    console.warn('⚠ Could not read video info:', error.message);
  }

  // Generate output path if not provided
  if (!outputPath) {
    const suffix = resizeOptions.width && resizeOptions.height
      ? `-${resizeOptions.width}x${resizeOptions.height}`
      : resizeOptions.width
        ? `-w${resizeOptions.width}`
        : `-h${resizeOptions.height}`;
    outputPath = generateOutputFilename(inputPath, suffix);
  }

  // Validate output path
  const outputValidation = validateOutputPath(outputPath);
  if (!outputValidation.valid) {
    console.error(`✗ ${outputValidation.error}`);
    process.exit(1);
  }

  // Display resize settings
  console.log('\n📋 Resize settings:');
  if (resizeOptions.width) console.log(`   Width: ${resizeOptions.width}px`);
  if (resizeOptions.height) console.log(`   Height: ${resizeOptions.height}px`);
  console.log(`   Maintain aspect ratio: ${resizeOptions.maintainAspectRatio ? 'Yes' : 'No'}`);

  // Build ffmpeg arguments
  const args = buildResizeArgs(inputPath, outputPath, resizeOptions);

  // Execute resize
  console.log(`\n🔄 Resizing video...`);
  console.log(`   Input:  ${inputPath}`);
  console.log(`   Output: ${outputPath}\n`);

  const result = await executeFFmpeg(args, { showProgress: true });

  if (result.success) {
    console.log('✓ Resize complete!');
    displaySizeComparison(inputPath, outputPath);

    // Show final dimensions
    try {
      const outputInfo = await getVideoInfo(outputPath);
      const outputStream = outputInfo.streams.find(s => s.codec_type === 'video');
      if (outputStream) {
        console.log(`\n📹 New video dimensions: ${outputStream.width}x${outputStream.height}`);
      }
    } catch {
      // Ignore if we can't read output info
    }
  } else {
    console.error('\n✗ Resize failed:');
    console.error(result.error);
    process.exit(1);
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Video Resize Tool

Usage:
  node resize.js <input> [output] [options]

Arguments:
  input              Path to input video file (required)
  output             Path to output file (optional, auto-generates with size suffix)

Options:
  --width, -w        Target width in pixels
  --height, -h       Target height in pixels
  --no-aspect        Don't maintain aspect ratio (stretches video)
  --help             Show this help message

Notes:
  - Specify width, height, or both
  - By default, aspect ratio is maintained
  - If both dimensions specified with aspect ratio, video fits within bounds
  - If only one dimension specified, the other is calculated automatically

Common AR-optimized sizes:
  720p:   --width 1280 --height 720
  1080p:  --width 1920 --height 1080
  480p:   --width 854 --height 480

Examples:
  node resize.js public/videos/my-video.mp4 --width 1280
  node resize.js public/videos/my-video.mp4 --height 720
  node resize.js public/videos/my-video.mp4 --width 1280 --height 720
  node resize.js public/videos/4k-video.mp4 public/videos/720p.mp4 --width 1280 --height 720
  node resize.js public/videos/video.mp4 --width 800 --height 600 --no-aspect
    `);
    process.exit(0);
  }

  const config = {
    input: args[0],
    output: null,
    resizeOptions: {
      maintainAspectRatio: true
    }
  };

  // Check if second arg is output path or option
  if (args[1] && !args[1].startsWith('--') && !args[1].startsWith('-')) {
    config.output = args[1];
  }

  // Parse options
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--width' || arg === '-w') {
      config.resizeOptions.width = parseInt(args[++i]);
    } else if (arg === '--height' && args[i + 1] && !args[i + 1].startsWith('-')) {
      // Only parse height if next arg is a number (not -h for help)
      config.resizeOptions.height = parseInt(args[++i]);
    } else if (arg === '--no-aspect') {
      config.resizeOptions.maintainAspectRatio = false;
    }
  }

  return config;
}

// Main execution
const config = parseArgs();
resizeVideo(config.input, config.output, config.resizeOptions)
  .catch(error => {
    console.error('✗ Unexpected error:', error.message);
    process.exit(1);
  });
