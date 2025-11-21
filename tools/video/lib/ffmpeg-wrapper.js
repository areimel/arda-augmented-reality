import { spawn } from 'child_process';
import { resolveProjectPath, getFileSizeMB } from './file-utils.js';

/**
 * Check if ffmpeg is installed and accessible
 * @returns {Promise<boolean>} True if ffmpeg is available
 */
export async function checkFFmpegInstalled() {
  return new Promise((resolve) => {
    const ffmpeg = spawn('ffmpeg', ['-version']);

    ffmpeg.on('error', () => {
      resolve(false);
    });

    ffmpeg.on('close', (code) => {
      resolve(code === 0);
    });
  });
}

/**
 * Execute ffmpeg command
 * @param {string[]} args - FFmpeg command arguments
 * @param {Object} options - Execution options
 * @param {boolean} options.showProgress - Show progress output (default: true)
 * @param {boolean} options.showOutput - Show all output (default: false)
 * @returns {Promise<Object>} { success: boolean, output: string, error?: string }
 */
export function executeFFmpeg(args, options = {}) {
  const { showProgress = true, showOutput = false } = options;

  return new Promise((resolve) => {
    const ffmpeg = spawn('ffmpeg', args);
    let output = '';
    let errorOutput = '';

    ffmpeg.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      if (showOutput) {
        process.stdout.write(text);
      }
    });

    ffmpeg.stderr.on('data', (data) => {
      const text = data.toString();
      errorOutput += text;

      // FFmpeg outputs progress to stderr
      if (showProgress) {
        // Extract progress information (time, fps, etc.)
        if (text.includes('time=')) {
          const timeMatch = text.match(/time=(\S+)/);
          const fpsMatch = text.match(/fps=\s*(\d+)/);
          const sizeMatch = text.match(/size=\s*(\S+)/);

          if (timeMatch) {
            process.stdout.write(`\rProgress: ${timeMatch[1]}`);
            if (fpsMatch) process.stdout.write(` | fps: ${fpsMatch[1]}`);
            if (sizeMatch) process.stdout.write(` | size: ${sizeMatch[1]}`);
          }
        }
      } else if (showOutput) {
        process.stdout.write(text);
      }
    });

    ffmpeg.on('error', (error) => {
      console.error('\n✗ FFmpeg error:', error.message);
      resolve({
        success: false,
        output,
        error: `Failed to execute ffmpeg: ${error.message}`
      });
    });

    ffmpeg.on('close', (code) => {
      if (showProgress) {
        process.stdout.write('\n');
      }

      if (code === 0) {
        resolve({ success: true, output });
      } else {
        resolve({
          success: false,
          output,
          error: `FFmpeg exited with code ${code}\n${errorOutput}`
        });
      }
    });
  });
}

/**
 * Get video information using ffprobe
 * @param {string} inputPath - Path to video file
 * @returns {Promise<Object>} Video metadata
 */
export async function getVideoInfo(inputPath) {
  const absolutePath = resolveProjectPath(inputPath);

  return new Promise((resolve, reject) => {
    const ffprobe = spawn('ffprobe', [
      '-v', 'quiet',
      '-print_format', 'json',
      '-show_format',
      '-show_streams',
      absolutePath
    ]);

    let output = '';

    ffprobe.stdout.on('data', (data) => {
      output += data.toString();
    });

    ffprobe.on('error', (error) => {
      reject(new Error(`ffprobe not found: ${error.message}`));
    });

    ffprobe.on('close', (code) => {
      if (code === 0) {
        try {
          const info = JSON.parse(output);
          resolve(info);
        } catch (error) {
          reject(new Error(`Failed to parse video info: ${error.message}`));
        }
      } else {
        reject(new Error(`ffprobe exited with code ${code}`));
      }
    });
  });
}

/**
 * Build ffmpeg arguments for compression
 * @param {string} inputPath - Input file path
 * @param {string} outputPath - Output file path
 * @param {Object} options - Compression options
 * @returns {string[]} FFmpeg arguments
 */
export function buildCompressArgs(inputPath, outputPath, options) {
  const {
    videoBitrate,
    audioBitrate,
    crf,
    codec,
    maxWidth,
    maxHeight
  } = options;

  const args = [
    '-i', resolveProjectPath(inputPath),
    '-y' // Overwrite output file
  ];

  // Video codec
  if (codec === 'h264') {
    args.push('-c:v', 'libx264');
    args.push('-preset', 'medium');
  } else if (codec === 'vp9') {
    args.push('-c:v', 'libvpx-vp9');
  }

  // Quality settings
  if (crf !== null && crf !== undefined) {
    args.push('-crf', crf.toString());
  }
  if (videoBitrate) {
    args.push('-b:v', videoBitrate);
  }

  // Resolution scaling
  if (maxWidth && maxHeight) {
    args.push('-vf', `scale='min(${maxWidth},iw)':'min(${maxHeight},ih)':force_original_aspect_ratio=decrease`);
  }

  // Audio settings
  args.push('-c:a', 'aac');
  if (audioBitrate) {
    args.push('-b:a', audioBitrate);
  }

  // Pixel format for compatibility
  args.push('-pix_fmt', 'yuv420p');

  args.push(resolveProjectPath(outputPath));

  return args;
}

/**
 * Build ffmpeg arguments for format conversion
 * @param {string} inputPath - Input file path
 * @param {string} outputPath - Output file path
 * @param {Object} formatSettings - Format settings
 * @param {Object} qualityOptions - Optional quality settings
 * @returns {string[]} FFmpeg arguments
 */
export function buildConvertArgs(inputPath, outputPath, formatSettings, qualityOptions = {}) {
  const args = [
    '-i', resolveProjectPath(inputPath),
    '-y',
    '-c:v', formatSettings.videoCodec,
    '-c:a', formatSettings.audioCodec
  ];

  // Apply quality settings if provided
  if (qualityOptions.crf) {
    args.push('-crf', qualityOptions.crf.toString());
  }
  if (qualityOptions.videoBitrate) {
    args.push('-b:v', qualityOptions.videoBitrate);
  }
  if (qualityOptions.audioBitrate) {
    args.push('-b:a', qualityOptions.audioBitrate);
  }

  args.push('-pix_fmt', formatSettings.pixelFormat);
  args.push(resolveProjectPath(outputPath));

  return args;
}

/**
 * Build ffmpeg arguments for greenscreen removal
 * @param {string} inputPath - Input file path
 * @param {string} outputPath - Output file path (must be WebM)
 * @param {Object} chromakeyOptions - Chromakey settings
 * @returns {string[]} FFmpeg arguments
 */
export function buildGreenscreenArgs(inputPath, outputPath, chromakeyOptions) {
  const { color = '0x00FF00', similarity = 0.3, blend = 0.1 } = chromakeyOptions;

  // Convert hex color to RGB values for colorkey filter
  const colorInt = parseInt(color.replace('0x', ''), 16);
  const r = (colorInt >> 16) & 0xFF;
  const g = (colorInt >> 8) & 0xFF;
  const b = colorInt & 0xFF;
  const colorHex = `0x${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

  const args = [
    '-i', resolveProjectPath(inputPath),
    '-y',
    '-filter_complex',
    `[0:v]colorkey=${colorHex}:${similarity}:${blend}[ckout]`,
    '-map', '[ckout]',
    '-map', '0:a?',
    '-c:v', 'libvpx-vp9',
    '-c:a', 'libopus',
    '-pix_fmt', 'yuva420p',
    '-auto-alt-ref', '0',
    resolveProjectPath(outputPath)
  ];

  return args;
}

/**
 * Build ffmpeg arguments for resizing
 * @param {string} inputPath - Input file path
 * @param {string} outputPath - Output file path
 * @param {Object} resizeOptions - Resize settings
 * @returns {string[]} FFmpeg arguments
 */
export function buildResizeArgs(inputPath, outputPath, resizeOptions) {
  const { width, height, maintainAspectRatio = true } = resizeOptions;

  let scaleFilter;
  if (maintainAspectRatio) {
    if (width && height) {
      scaleFilter = `scale=${width}:${height}:force_original_aspect_ratio=decrease`;
    } else if (width) {
      scaleFilter = `scale=${width}:-1`;
    } else if (height) {
      scaleFilter = `scale=-1:${height}`;
    }
  } else {
    scaleFilter = `scale=${width}:${height}`;
  }

  const args = [
    '-i', resolveProjectPath(inputPath),
    '-y',
    '-vf', scaleFilter,
    '-c:v', 'libx264',
    '-c:a', 'copy',
    resolveProjectPath(outputPath)
  ];

  return args;
}

/**
 * Display file size comparison
 * @param {string} inputPath - Input file path
 * @param {string} outputPath - Output file path
 */
export function displaySizeComparison(inputPath, outputPath) {
  const inputSize = getFileSizeMB(resolveProjectPath(inputPath));
  const outputSize = getFileSizeMB(resolveProjectPath(outputPath));
  const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1);

  console.log('\n📊 File size comparison:');
  console.log(`   Input:  ${inputSize} MB`);
  console.log(`   Output: ${outputSize} MB`);
  console.log(`   ${reduction}% ${reduction > 0 ? 'reduction' : 'increase'}`);
}
