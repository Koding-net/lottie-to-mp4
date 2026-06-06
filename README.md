# @kodeking/lottie-to-mp4

> Convert Lottie JSON animations to **MP4** (H.264) — Node.js CLI + programmatic API

[![npm](https://img.shields.io/npm/v/@kodeking/lottie-to-mp4)](https://www.npmjs.com/package/@kodeking/lottie-to-mp4)
[![license](https://img.shields.io/npm/l/@kodeking/lottie-to-mp4)](LICENSE)

Renders every frame with **Puppeteer + lottie-web**, then encodes to H.264 MP4 with **ffmpeg**. The output is `+faststart` web-optimised and ready for `<video>`, presentations, and social media. Try it live at [iconking.net/tools/lottie-to-mp4](https://iconking.net/tools/lottie-to-mp4).

---

## Prerequisites

| Tool | Required | Install |
|---|---|---|
| Node.js ≥ 18 | ✅ | — |
| ffmpeg | ✅ | `brew install ffmpeg` / [ffmpeg.org](https://ffmpeg.org/download.html) |

Puppeteer (Chromium) is bundled — no separate browser install needed.

---

## Install

```bash
npm install -g @kodeking/lottie-to-mp4
# or without installing:
npx @kodeking/lottie-to-mp4 input.json output.mp4
```

---

## CLI

```bash
lottie-to-mp4 input.json output.mp4 [--fps 24] [--width 480]
```

```bash
# 720p at 30fps
lottie-to-mp4 animation.json animation.mp4 --fps 30 --width 720

# Output filename inferred from input
lottie-to-mp4 my-animation.json
# → my-animation.mp4
```

---

## Programmatic API

```js
const { convertToMp4 } = require('@kodeking/lottie-to-mp4');

const result = await convertToMp4({
  input:  'animation.json',
  output: 'animation.mp4',
  fps:    24,
  width:  480,
});
// { output: 'animation.mp4', frames: 48, fps: 24, width: 480, height: 480 }
```

### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `input` | `string` | required | Path to Lottie JSON |
| `output` | `string` | required | Path for output MP4 |
| `fps` | `number` | `24` | Frame rate |
| `width` | `number` | `480` | Width in px |
| `height` | `number` | same as width | Height in px |

---

## Notes

- **No transparency** — H.264 MP4 does not support alpha. For transparent video use [@kodeking/lottie-to-webm](https://github.com/Koding-net/lottie-to-webm) (VP9 with alpha).
- Output is `yuv420p` for maximum compatibility (QuickTime, PowerPoint, social media).
- `+faststart` flag moves the moov atom to the beginning for instant web playback.

---

## License

MIT © [KodeKing](https://github.com/Koding-net)

See all tools at [github.com/Koding-net/lottie-tools](https://github.com/Koding-net/lottie-tools).
