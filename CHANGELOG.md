# Changelog

This file lists the changes of version 2.x (Vue 3). Version 1.x (Vue 2) is on the `1x` branch.

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
