#!/usr/bin/env node

import { validateInputFile, validateOutputPath } from './lib/file-utils.js';
import { loadBatchTasks, validateBatchTask, getQualityPreset, getFormatSettings, getGreenscreenSettings } from './lib/config-loader.js';
import {
  checkFFmpegInstalled,
  executeFFmpeg,
  buildCompressArgs,
  buildConvertArgs,
  buildGreenscreenArgs,
  buildResizeArgs,
  displaySizeComparison
} from './lib/ffmpeg-wrapper.js';

/**
 * Process a single batch task
 * @param {Object} task - Task configuration
 * @param {number} index - Task index
 * @param {number} total - Total number of tasks
 * @returns {Promise<Object>} Result
 */
async function processTask(task, index, total) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`📋 Task ${index + 1}/${total}: ${task.name || task.operation}`);
  console.log('='.repeat(70));

  // Validate task configuration
  const validation = validateBatchTask(task);
  if (!validation.valid) {
    console.error('✗ Invalid task configuration:');
    validation.errors.forEach(err => console.error(`  - ${err}`));
    return { success: false, error: 'Invalid configuration' };
  }

  // Validate input file
  const inputValidation = validateInputFile(task.input);
  if (!inputValidation.valid) {
    console.error(`✗ ${inputValidation.error}`);
    return { success: false, error: inputValidation.error };
  }

  // Validate output path
  const outputValidation = validateOutputPath(task.output);
  if (!outputValidation.valid) {
    console.error(`✗ ${outputValidation.error}`);
    return { success: false, error: outputValidation.error };
  }

  console.log(`Operation: ${task.operation}`);
  console.log(`Input:     ${task.input}`);
  console.log(`Output:    ${task.output}`);

  let args;

  try {
    // Build ffmpeg arguments based on operation
    switch (task.operation) {
      case 'compress': {
        const preset = task.preset || 'balanced';
        const options = getQualityPreset(preset);
        console.log(`Preset:    ${preset}`);
        args = buildCompressArgs(task.input, task.output, options);
        break;
      }

      case 'convert': {
        const format = task.format || 'webm';
        const formatSettings = getFormatSettings(format);
        const qualityOptions = task.preset ? getQualityPreset(task.preset) : {};
        console.log(`Format:    ${format}`);
        if (task.preset) console.log(`Preset:    ${task.preset}`);
        args = buildConvertArgs(task.input, task.output, formatSettings, qualityOptions);
        break;
      }

      case 'greenscreen': {
        const defaultSettings = getGreenscreenSettings();
        const chromakeyOptions = { ...defaultSettings, ...(task.chromakey || {}) };
        console.log(`Chromakey: color=${chromakeyOptions.color}, similarity=${chromakeyOptions.similarity}`);
        args = buildGreenscreenArgs(task.input, task.output, chromakeyOptions);
        break;
      }

      case 'resize': {
        if (!task.width && !task.height) {
          throw new Error('Resize operation requires width and/or height');
        }
        const resizeOptions = {
          width: task.width,
          height: task.height,
          maintainAspectRatio: task.maintainAspectRatio !== false
        };
        console.log(`Resize:    ${task.width || 'auto'}x${task.height || 'auto'}`);
        args = buildResizeArgs(task.input, task.output, resizeOptions);
        break;
      }

      default:
        throw new Error(`Unknown operation: ${task.operation}`);
    }

    // Execute ffmpeg
    console.log('\n🔄 Processing...\n');
    const result = await executeFFmpeg(args, { showProgress: true });

    if (result.success) {
      console.log('✓ Task completed successfully!');
      displaySizeComparison(task.input, task.output);
      return { success: true };
    } else {
      console.error('✗ Task failed:');
      console.error(result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('✗ Task failed:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Process batch tasks
 * @param {string} configFile - Path to config file (optional)
 */
async function processBatch(configFile = 'batch-tasks') {
  console.log('🎬 Batch Video Processing Tool\n');

  // Check ffmpeg installation
  const ffmpegInstalled = await checkFFmpegInstalled();
  if (!ffmpegInstalled) {
    console.error('✗ Error: ffmpeg is not installed or not in PATH');
    console.error('  Install ffmpeg: https://ffmpeg.org/download.html');
    process.exit(1);
  }

  // Load batch configuration
  let batchConfig;
  try {
    batchConfig = loadBatchTasks();
  } catch (error) {
    console.error('✗ Error loading batch configuration:');
    console.error(`  ${error.message}`);
    console.error('\n  Create a batch-tasks.json file in tools/video/config/');
    console.error('  Use batch-tasks.example.json as a template');
    process.exit(1);
  }

  const tasks = batchConfig.tasks;

  if (!tasks || tasks.length === 0) {
    console.error('✗ No tasks found in configuration');
    process.exit(1);
  }

  console.log(`📦 Found ${tasks.length} task${tasks.length > 1 ? 's' : ''} to process\n`);

  // Process each task
  const results = [];
  const startTime = Date.now();

  for (let i = 0; i < tasks.length; i++) {
    const result = await processTask(tasks[i], i, tasks.length);
    results.push({ task: tasks[i], result });
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(1);

  // Display summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 Batch Processing Summary');
  console.log('='.repeat(70) + '\n');

  const successful = results.filter(r => r.result.success).length;
  const failed = results.filter(r => !r.result.success).length;

  console.log(`Total tasks:     ${tasks.length}`);
  console.log(`Successful:      ${successful} ✓`);
  console.log(`Failed:          ${failed} ✗`);
  console.log(`Total time:      ${duration}s`);

  if (failed > 0) {
    console.log('\n❌ Failed tasks:');
    results.forEach((r, i) => {
      if (!r.result.success) {
        console.log(`   ${i + 1}. ${r.task.name || r.task.operation}: ${r.result.error}`);
      }
    });
  }

  console.log();

  if (failed > 0) {
    process.exit(1);
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Batch Video Processing Tool

Processes multiple videos using a configuration file.

Usage:
  node batch.js [options]

Options:
  --help, -h     Show this help message

Configuration:
  Create tools/video/config/batch-tasks.json with your processing tasks.
  Use batch-tasks.example.json as a template.

Example batch-tasks.json:
  {
    "tasks": [
      {
        "name": "Compress video",
        "operation": "compress",
        "input": "public/videos/large-video.mp4",
        "output": "public/videos/compressed.mp4",
        "preset": "mobile"
      },
      {
        "name": "Convert to WebM",
        "operation": "convert",
        "input": "public/videos/video.mp4",
        "output": "public/videos/video.webm",
        "format": "webm"
      }
    ]
  }

Supported Operations:
  - compress:     Compress video with quality preset
  - convert:      Convert video format (MP4 ↔ WebM)
  - greenscreen:  Remove greenscreen and create alpha channel
  - resize:       Resize video dimensions

Example:
  node batch.js
    `);
    process.exit(0);
  }

  return {};
}

// Main execution
parseArgs();
processBatch()
  .catch(error => {
    console.error('✗ Unexpected error:', error.message);
    process.exit(1);
  });
