# Video Processing Tools

FFmpeg-based video processing tools for optimizing AR video assets. These tools help compress, convert, and process videos for use in AR experiences.

## Prerequisites

**FFmpeg must be installed on your system:**

- **Windows**: Download from [ffmpeg.org](https://ffmpeg.org/download.html) or use `winget install ffmpeg`
- **Mac**: Install via Homebrew: `brew install ffmpeg`
- **Linux**: Install via package manager: `sudo apt install ffmpeg` or `sudo yum install ffmpeg`

Verify installation: `ffmpeg -version`

## Tools Overview

| Tool | Purpose | Usage |
|------|---------|-------|
| **compress.js** | Reduce file size with quality presets | `npm run video:compress <input> [options]` |
| **convert.js** | Convert between formats (MP4 ↔ WebM) | `npm run video:convert <input> [options]` |
| **greenscreen.js** | Remove greenscreen, create alpha channel | `npm run video:greenscreen <input> [options]` |
| **resize.js** | Resize video dimensions | `npm run video:resize <input> [options]` |
| **batch.js** | Process multiple videos from config | `npm run video:batch` |

## Quick Start

### Compress a Video

Reduce file size for mobile AR performance:

```bash
npm run video:compress public/videos/my-video.mp4 -- --preset mobile
```

### Convert MP4 to WebM

WebM supports alpha channel transparency:

```bash
npm run video:convert public/videos/my-video.mp4 -- --format webm
```

### Remove Greenscreen

Create transparent video for AR overlays:

```bash
npm run video:greenscreen public/videos/greenscreen-video.mp4
```

### Resize Video

Optimize for mobile (720p):

```bash
npm run video:resize public/videos/4k-video.mp4 -- --width 1280 --height 720
```

## Detailed Usage

### Video Compression (`compress.js`)

Compress videos with user-configurable quality settings.

**Basic usage:**
```bash
npm run video:compress public/videos/input.mp4
```

**Options:**
- `--preset, -p` - Quality preset: `mobile`, `balanced`, `high` (default: balanced)
- `--crf` - Custom CRF value (0-51, lower = better quality)
- `--bitrate, -b` - Video bitrate (e.g., `1500k`)
- `--audio, -a` - Audio bitrate (e.g., `128k`)

**Quality Presets:**
- **mobile**: 720p max, CRF 28, 1500k bitrate - Best for mobile AR
- **balanced**: 1080p max, CRF 23, 2500k bitrate - Desktop & mobile
- **high**: Original resolution, CRF 18, 5000k bitrate - Best quality

**Examples:**
```bash
# Compress for mobile with auto-generated output filename
npm run video:compress public/videos/large-video.mp4 -- --preset mobile

# Compress with custom output path
npm run video:compress public/videos/input.mp4 public/videos/compressed.mp4

# Custom compression settings
npm run video:compress public/videos/input.mp4 -- --crf 25 --bitrate 2000k
```

### Format Conversion (`convert.js`)

Convert between MP4 and WebM formats.

**Basic usage:**
```bash
npm run video:convert public/videos/input.mp4 -- --format webm
```

**Options:**
- `--format, -f` - Target format: `mp4` or `webm` (default: webm)
- `--preset, -p` - Apply quality preset during conversion

**Why WebM?**
- Native alpha channel support (transparency)
- Better compression than MP4
- Ideal for AR overlays with transparency

**Examples:**
```bash
# Convert MP4 to WebM
npm run video:convert public/videos/video.mp4

# Convert WebM to MP4
npm run video:convert public/videos/video.webm -- --format mp4

# Convert with compression preset
npm run video:convert public/videos/input.mp4 -- --format webm --preset balanced
```

### Greenscreen Removal (`greenscreen.js`)

Remove greenscreen and create video with alpha channel (transparent background).

**Basic usage:**
```bash
npm run video:greenscreen public/videos/greenscreen-video.mp4
```

**Options:**
- `--color, -c` - Chroma key color in hex (default: `0x00FF00` for green)
- `--similarity` - Color similarity threshold 0-1 (default: `0.3`)
- `--blend` - Edge blend amount 0-1 (default: `0.1`)

**Common colors:**
- Green: `0x00FF00` (default)
- Blue: `0x0000FF`
- Red: `0xFF0000`

**Output:** Always WebM format with alpha channel (yuva420p pixel format)

**Examples:**
```bash
# Remove green background
npm run video:greenscreen public/videos/greenscreen.mp4

# Remove blue background
npm run video:greenscreen public/videos/bluescreen.mp4 -- --color 0x0000FF

# Fine-tune edge quality
npm run video:greenscreen public/videos/greenscreen.mp4 -- --similarity 0.4 --blend 0.15
```

**Tips:**
- Higher similarity removes more background but may affect subject edges
- Higher blend creates softer edges but may look blurry
- Test different values to find optimal settings for your footage

### Video Resizing (`resize.js`)

Resize video dimensions while optionally maintaining aspect ratio.

**Basic usage:**
```bash
npm run video:resize public/videos/input.mp4 -- --width 1280 --height 720
```

**Options:**
- `--width, -w` - Target width in pixels
- `--height` - Target height in pixels (not `-h` which shows help)
- `--no-aspect` - Don't maintain aspect ratio (stretches video)

**Common AR-optimized sizes:**
- 720p: `--width 1280 --height 720` (recommended for mobile)
- 1080p: `--width 1920 --height 1080` (desktop/tablet)
- 480p: `--width 854 --height 480` (low-end mobile)

**Examples:**
```bash
# Resize to 720p (maintains aspect ratio)
npm run video:resize public/videos/4k-video.mp4 -- --width 1280 --height 720

# Scale width, auto-calculate height
npm run video:resize public/videos/video.mp4 -- --width 1280

# Scale height, auto-calculate width
npm run video:resize public/videos/video.mp4 -- --height 720

# Resize without maintaining aspect ratio
npm run video:resize public/videos/video.mp4 -- --width 800 --height 600 --no-aspect
```

### Batch Processing (`batch.js`)

Process multiple videos using a JSON configuration file.

**Setup:**
1. Copy `config/batch-tasks.example.json` to `config/batch-tasks.json`
2. Edit `batch-tasks.json` with your video processing tasks
3. Run: `npm run video:batch`

**Configuration format:**
```json
{
  "tasks": [
    {
      "name": "Compress video for mobile",
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
    },
    {
      "name": "Remove greenscreen",
      "operation": "greenscreen",
      "input": "public/videos/greenscreen.mp4",
      "output": "public/videos/transparent.webm",
      "chromakey": {
        "color": "0x00FF00",
        "similarity": 0.3,
        "blend": 0.1
      }
    },
    {
      "name": "Resize to 720p",
      "operation": "resize",
      "input": "public/videos/4k-video.mp4",
      "output": "public/videos/720p-video.mp4",
      "width": 1280,
      "height": 720,
      "maintainAspectRatio": true
    }
  ]
}
```

**Supported operations:**
- `compress` - Requires `preset` field
- `convert` - Requires `format` field, optional `preset`
- `greenscreen` - Optional `chromakey` object
- `resize` - Requires `width` and/or `height`

## Configuration Files

### `config/video-settings.json`

Defines quality presets, format settings, and default options.

**Key sections:**
- `qualityPresets` - Mobile, balanced, and high quality settings
- `formats` - MP4 and WebM codec configurations
- `greenscreen` - Default chromakey settings

**Customize presets:**
```json
{
  "qualityPresets": {
    "custom": {
      "description": "My custom preset",
      "maxWidth": 1920,
      "maxHeight": 1080,
      "videoBitrate": "3000k",
      "audioBitrate": "192k",
      "crf": 20,
      "codec": "h264"
    }
  }
}
```

### `config/batch-tasks.json`

Your project-specific batch processing tasks. Not tracked in git by default.

## Best Practices for AR Videos

### File Size Optimization
- **Mobile AR target**: < 5MB per video
- Use `mobile` preset for videos viewed on phones
- Compress videos before adding to repository

### Format Selection
- **Standard video**: Use MP4 (H.264) for best compatibility
- **Transparent video**: Use WebM (VP9 + alpha) for greenscreen removal
- **Browser support**: Both formats work in modern browsers

### Resolution Guidelines
- **Mobile AR**: 720p (1280x720) maximum
- **Desktop AR**: 1080p (1920x1080) acceptable
- **File size vs quality**: Lower resolution = smaller files = faster loading

### Greenscreen Tips
- Use consistent, well-lit green background
- Avoid green clothing or objects
- Convert to WebM with alpha for true transparency
- Test similarity/blend values for best edge quality

## Troubleshooting

### "ffmpeg is not installed"
- Install ffmpeg using instructions in Prerequisites section
- Verify with `ffmpeg -version`
- Ensure ffmpeg is in your system PATH

### "Input file not found"
- Use paths relative to project root
- Example: `public/videos/my-video.mp4`
- Check file exists: `ls public/videos/`

### "Cannot create output directory"
- Ensure you have write permissions
- Output directories are created automatically
- Check disk space

### Poor greenscreen quality
- Adjust `--similarity` (0.2-0.5 range)
- Adjust `--blend` (0.05-0.2 range)
- Ensure good lighting on greenscreen
- Use high-quality source footage

### Large output file size
- Use lower quality preset (`mobile` instead of `balanced`)
- Increase CRF value (higher = smaller file)
- Reduce resolution with resize tool first
- Consider two-pass encoding for better compression

## Help

Each tool has built-in help:

```bash
npm run video:compress -- --help
npm run video:convert -- --help
npm run video:greenscreen -- --help
npm run video:resize -- --help
npm run video:batch -- --help
```

## Technical Details

### Dependencies
- **ffmpeg**: System-installed video processing
- **Node.js**: ES modules, child_process for ffmpeg execution

### Video Codecs
- **H.264 (libx264)**: MP4 format, best compatibility
- **VP9 (libvpx-vp9)**: WebM format, alpha support, better compression

### CRF (Constant Rate Factor)
- Range: 0-51 (lower = better quality, larger file)
- Recommended: 18-28
- 18 = visually lossless
- 23 = good quality (default)
- 28 = acceptable quality, smaller file

### Pixel Formats
- **yuv420p**: Standard video (no transparency)
- **yuva420p**: Video with alpha channel (transparency)
