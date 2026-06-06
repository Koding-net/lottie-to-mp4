#!/usr/bin/env node
/**
 * @kodeking/lottie-to-mp4
 *
 * Convert a Lottie JSON animation to MP4 (H.264).
 * Uses Puppeteer to render frames and ffmpeg for encoding.
 *
 * CLI:  npx lottie-to-mp4 input.json output.mp4 [--fps 24] [--width 480]
 * API:  const { convertToMp4 } = require('@kodeking/lottie-to-mp4')
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const os   = require('os');
const { execFileSync, execSync } = require('child_process');
const { renderFrames } = require('./render');

/**
 * Convert a Lottie JSON file to MP4 (H.264/yuv420p, web-optimised).
 *
 * @param {object} options
 * @param {string} options.input    Path to the Lottie JSON file
 * @param {string} options.output   Path for the output MP4
 * @param {number} [options.fps=24]     Frame rate
 * @param {number} [options.width=480]  Output width in px
 * @param {number} [options.height]     Output height in px (default: same as width)
 */
async function convertToMp4({ input, output, fps = 24, width = 480, height } = {}) {
  if (!input)  throw new Error('input is required');
  if (!output) throw new Error('output is required');

  const h = height ?? width;
  const ffmpeg  = requireBin('ffmpeg', 'Install ffmpeg: https://ffmpeg.org/download.html');
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lottie-mp4-'));

  try {
    const manifest = await renderFrames({ inputPath: input, outputDir: workDir, fps, width, height: h });

    execFileSync(ffmpeg, [
      '-y',
      '-framerate', String(manifest.fps),
      '-i', path.join(workDir, 'frames', 'frame-%06d.png'),
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
      output,
    ], { stdio: 'pipe' });

    return { output, frames: manifest.totalFrames, fps: manifest.fps, width, height: h };
  } finally {
    fs.rmSync(workDir, { recursive: true, force: true });
  }
}

function requireBin(name, hint) {
  try {
    const p = execSync(`which ${name} 2>/dev/null`).toString().trim();
    if (p) return p;
  } catch { /* noop */ }
  throw new Error(`${name} not found. ${hint}`);
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const flags = {};
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) { flags[args[i].slice(2)] = args[++i]; }
    else { positional.push(args[i]); }
  }
  const [input, output = input?.replace(/\.json$/i, '.mp4')] = positional;
  if (!input) {
    console.error('Usage: lottie-to-mp4 <input.json> [output.mp4] [--fps 24] [--width 480]');
    process.exit(1);
  }
  convertToMp4({ input, output, fps: Number(flags.fps ?? 24), width: Number(flags.width ?? 480), height: flags.height ? Number(flags.height) : undefined })
    .then(r => console.log(`✓ MP4 saved to ${r.output} (${r.frames} frames at ${r.fps}fps)`))
    .catch(e => { console.error(`✗ ${e.message}`); process.exit(1); });
}

module.exports = { convertToMp4 };
