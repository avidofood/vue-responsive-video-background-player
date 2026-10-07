# Changelog

This file lists the changes of version 2.x (Vue 3). Version 1.x (Vue 2) is on the `1x` branch.

## 2.6.0

All new options are off by default. Without them, the component works as in 2.5.1.

### Added

- `pauseButton`: a button that pauses and plays the video, for [WCAG 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) (Pause, Stop, Hide). It is a native button, first in the tab order inside the section. Its label changes between `pauseLabel` and `playLabel`. The `pause-button` slot replaces the icon. A pause with the button stays when the window switches to another source.
- `respectReducedMotion`: if the user prefers reduced motion, only the poster shows, and the video does not load. The play button or `play()` starts it.
- `pauseWhenHidden`: pauses the video while it is off screen or the page is in the background. It plays again when it is visible. A video that the user paused stays paused.
- `lazy`: loads the video when the section comes within 200px of the viewport.
- `keepLargerSource`: a smaller window keeps a larger video that already loads ([#14](https://github.com/avidofood/vue-responsive-video-background-player/issues/14)).
- `hls` and `hlsConfig`: give the component the `Hls` class of hls.js ([#44](https://github.com/avidofood/vue-responsive-video-background-player/issues/44)). Where the browser supports hls.js, hls.js plays the HLS streams. Elsewhere, the browser plays them itself, as before. The package does not include hls.js.
- `player.video`: the `<video>` element ([#30](https://github.com/avidofood/vue-responsive-video-background-player/issues/30)).
- `vue-responsive-video-background-player/style.css`: the CSS as a file, for server-side rendering and for a strict Content Security Policy. The JavaScript still injects the CSS. A type declaration comes with the file, because TypeScript 6 checks side-effect imports.
- `play()` on a video that waits because of `lazy` or `respectReducedMotion` loads it first. Its promise resolves when the video plays.
- `play()` and the pause button load a video again that failed to load, for example after a fatal hls.js error.

### Fixed

- `pause()` and `stop()` before the video is ready keep it paused. Before, autoplay started it when it was ready. After a switch to another source, the autoplay of that source decides again, as before.
- `play()` before the video is ready plays it when it is ready, also with `autoplay` set to false. Before, the video stayed paused.

### Changed

- The README shows how to show only the poster on small screens: a source with an empty `src` loads no video.
- The tests unmount every component after each test.
- The ESM file grows from 9.9 kB to 19 kB (gzip: from 3.4 kB to 5.7 kB).
- An independent review by Codex (gpt-6-astra) found problems in the new code before the release. They are fixed and have tests.

## 2.5.1

### Fixed

- A pending `play()` no longer shows the previous video after a source switch, for example after a resize. Before, the late promise showed the old video again and emitted `playing`.
- `pause()` and `stop()` cancel a pending `play()`. Before, the video showed up and the component emitted `playing` after the pause.
- Hydration of server-rendered HTML in a container outside the document no longer causes a hydration mismatch.
- With Vue 3.2, the types now require `src`. Before, a missing `src` compiled without an error.
- A URL that ends in `.constructor` or `.__proto__` gets no `type` attribute. Before, it got an invalid type, and the browser skipped the video.

### Changed

- Linting uses ESLint 9 and eslint-config-avidofood 4. This fixes the last Dependabot alert (`postcss-selector-parser`, dev only). The published files do not change.
- An independent review by Codex (gpt-6-astra) found these problems in 2.5.0.

## 2.5.0

### Added

- TypeScript types for the props, the sources, the events, the player methods and the plugin ([#2](https://github.com/avidofood/vue-responsive-video-background-player/issues/2)). The types also register `VideoBackground` as a global component for template type checks. If you added a `declare module` file for this package, you can delete it.
- `stop()` on the player: it pauses the video and goes back to the start ([#30](https://github.com/avidofood/vue-responsive-video-background-player/issues/30)).
- The `error` event carries the error event of the video or the error of `play()`.
- `play()` on the player returns a promise.

### Fixed

- Server-side rendering, for example with Nuxt, works without a hydration mismatch ([#39](https://github.com/avidofood/vue-responsive-video-background-player/issues/39), [#28](https://github.com/avidofood/vue-responsive-video-background-player/issues/28)). The server renders the video without a source, and the browser adds the right video after hydration. Before, the server rendered the source for a 0px window, and the browser started to load that video.
- The browser can block playback, for example on iOS in Low Power Mode or for a video with sound. Then the poster stays visible and the component emits `error`. Before, the component showed a stopped video and emitted `playing`.
- The component emits `playing` after playback really started.
- If the video file fails to load, for example on a 404, the component emits `error`. Before, the browser fired that error on the `<source>` element, and the component did not see it.
- The fade-in transition works again. Vue 3 renamed the class `fade-enter` to `fade-enter-from`.
- The `type` attribute of the source is only set for known file extensions. Before, a URL such as `video.mp4?v=1.2` got the type `video/2`, and the browser skipped the video.
- On unmount, the component removes its resize listener.
- The component no longer sorts the `sources` array of the parent in place.
- A source change shortly before unmount no longer throws a `TypeError`. Fast source changes load only the last source.
- The `ready` event fires once for each loaded video. Before, a `canplay` event after buffering paused the video again, and with `autoplay` set to `false` the video stayed paused.
- The internal pause before autoplay no longer emits `paused`.
- The private method `$_innerWidth` is now `_innerWidth`, as the notes of 2.4.0 already said.

### Changed

- `vue` (`^3.2.0`) is now a peer dependency. Before, it was only a dev dependency, so npm did not check the Vue version.
- The package declares `"type": "commonjs"` and `"exports"` with `types` conditions. The file names in `dist/` are unchanged.
- The build uses Vite 8. Tests use Vitest. The development tools need Node.js 22.12 or newer. The published files have no Node.js requirement.
- The `publish` script is removed. npm ran it after every `npm publish`, so it started a second publish. `npm pack` and `npm publish` now build `dist/` first (`prepack`).

## 2.4.1

- Package metadata update. No code change.

## 2.4.0

- **Breaking Change**: Removed `$` prefix from private methods to prevent potential conflicts with other libraries (for example jQuery).
  The following methods are renamed:
  - `$_change_video_resolution` → `_change_video_resolution`
  - `$_innerWidth` → `_innerWidth` (this rename only took effect in 2.5.0)

  If you were using these methods in your project, please update your code accordingly.

- Improved compatibility with legacy code and projects using jQuery.
- New `paused` event ([#43](https://github.com/avidofood/vue-responsive-video-background-player/pull/43)).
- New props `objectPosition` and `posterBgSize` ([#45](https://github.com/avidofood/vue-responsive-video-background-player/pull/45)).
