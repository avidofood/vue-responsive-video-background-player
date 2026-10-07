# Responsive Video Background Player for Vue 2 & 3 ⚡️

<a href="https://www.npmjs.com/package/vue-responsive-video-background-player">
  <img src="https://img.shields.io/npm/dt/vue-responsive-video-background-player.svg" alt="Downloads">
</a>
<a href="https://www.npmjs.com/package/vue-responsive-video-background-player">
  <img src="https://img.shields.io/npm/v/vue-responsive-video-background-player.svg" alt="Version">
</a>
<a href="https://www.npmjs.com/package/vue-responsive-video-background-player">
  <img src="https://img.shields.io/npm/l/vue-responsive-video-background-player.svg" alt="License">
</a>

![Laravel Tongue](https://raw.githubusercontent.com/avidofood/vue-responsive-video-background-player/master/demo/public/images/roadster.png)

**If you are looking to play videos in the background, you've found the right Vue package! 😜 (Heads up: No YouTube videos... yet!)**

 >**Prerequisites**: Vue 3.2 or newer for version 2.x of this package. For Vue 2, use version 1.x.

## Installation in 2 Steps

### 1: Add with npm 💻
```bash
# For Vue 3.x.x
npm install vue-responsive-video-background-player

# For Vue 2.x.x
npm install vue-responsive-video-background-player@1x
```

### 2a: Import the component

```vue
<script setup>
import VideoBackground from 'vue-responsive-video-background-player';
</script>
```

Or register it globally:

```javascript
import { createApp } from 'vue';
import VideoBackground from 'vue-responsive-video-background-player';

const app = createApp(App);
app.component('VideoBackground', VideoBackground);
```

### 2b: Install as a plugin
```javascript
import { createApp } from 'vue';
import { Plugin } from 'vue-responsive-video-background-player';

const app = createApp(App);
app.use(Plugin);
```

The plugin registers the component as `VideoBackground`. You can use it as `<VideoBackground>` or `<video-background>`.

### (3: Only for Nuxt users)

#### Nuxt 3 and Nuxt 4

Since version 2.5.0 the component works with server-side rendering. Create a plugin file, for example `plugins/video-background.ts`:

```javascript
import { Plugin } from 'vue-responsive-video-background-player';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(Plugin);
});
```

Then use the `<video-background>` tag in any page. The server renders the section, the poster, the overlay and your slot content. The server does not know the window width, so the browser adds the video after hydration.

The component injects its CSS with JavaScript. Until the JavaScript runs, the page shows the server HTML without these styles. If you prefer to render the component only in the browser, name the plugin file `video-background.client.ts` and wrap the component in `<ClientOnly>`:

```html
<ClientOnly>
    <video-background src="/videos/hero.mp4" style="height: 100vh;" />
</ClientOnly>
```

A `.client` plugin alone is not enough: the server cannot resolve the component, and Vue reports a hydration mismatch.

#### Nuxt 2 (package version 1.x)
 >Thanks to [@skoulix](https://github.com/avidofood/vue-responsive-video-background-player/issues/8#issuecomment-654821213) for his instructions:

  Again this is only for Nuxt.js users. Gridsome users click [here](https://gridsome.org/docs/assets-scripts/#without-ssr-support). At your `nuxt.config.js` locate the part where you declare your plugins and import the file. Example:

```
plugins: [
  {
    src: '~/plugins/vue-video-background',
    ssr: false
  }
]
```

Now the component is globally available and can be used at any .vue file without issues.

### TypeScript

Since version 2.5.0 the package contains type declarations for the props, the events, the player methods and the plugin. If you added a `declare module 'vue-responsive-video-background-player'` file for older versions, you can delete it.

```typescript
import type { VideoBackgroundSource } from 'vue-responsive-video-background-player';

const sources: VideoBackgroundSource[] = [
    { src: '/videos/mobile.mp4', res: 638, autoplay: true },
];
```

## Usage - (or to make it runnable 🏃‍♂️)


### Easiest version 🔍

```html
 <video-background 
    src="<your-video-path>.mp4"
    style="max-height: 400px; height: 100vh;"
 >
    <h1 style="color: white;">Hello welcome!</h1>
 </video-background>
```

### Advanced version 🌐

```html
 <video-background 
    src="<your-default-video-path>.mp4"
    poster="/images/mainfoto.jpg"
    :sources="[
        {src: '<your-tablet-video-path>.mp4', res: 900, autoplay: true}, 
        {src: '<your-mobile-video-path>.mp4', res: 638, autoplay: true, poster: '<your-mobile-background-image-path>.png'}
    ]"
    style="max-height: 400px; height: 100vh;"
    overlay="linear-gradient(45deg,#2a4ae430,#fb949e6b)" 
>
    <h1 style="color: white;">Hallo welcome!</h1>
</video-background>
```

### Demo ⚡️

https://avidofood.github.io/vue-responsive-video-background-player/

## Props

This package is for responsive videos depicting different video resolution. Have you ever visited my favorite car company <a href="https://tesla.com">Tesla</a>? Have a look, they use a lot of video background videos and are using different resolutions for each device.

### Props values

- `src` (required: `true`)

This is your path to your video. You can just use this value for showing your video in every resolution.

 >**Note** for Vite and Nuxt: Put the video in the `public` folder and use the path from the site root, for example `src="/videos/hero.mp4"`. Or import the file, for example `import heroVideo from '@/assets/hero.mp4'`, and bind it with `:src="heroVideo"`. With Vue CLI, bind it like this: ``:src="require(`@/assets/video/timelapse.mp4`)"``. [Read here why](https://github.com/avidofood/vue-responsive-video-background-player/issues/10#issuecomment-646959090)

The component sets the `type` attribute of the video for `.mp4`, `.m4v`, `.webm`, `.ogv`, `.ogg` and `.m3u8` files. For other URLs, for example a URL without a file extension, it sets no type, and the browser checks the file itself.

 >**HLS** (`.m3u8`): Safari, iOS and some other browsers play HLS streams natively. The component does not include [hls.js](https://github.com/video-dev/hls.js), so other browsers do not play the stream.

- `poster` (default: `''`)

This is your first background image that is shown before the video is loaded.

 >**Note**: The same as for `src` applies. With Vue CLI, bind the image like this: ``:poster="require(`@/assets/img/logo.png`)"``.

- `sources` (default: `[]`)

This is the main reason for this package. I wanted to have the possibility to change the resolution of the video when the resize event is fired.

To make it work, sources is an array that contains objects. For example:

`[{src: '<your-mobile-video-path>.mp4', res: 638, autoplay: true, poster: '<your-mobile-background-image-path>.png'}]`

To make it work you need at least `src, res, autoplay`. 

`poster` is optional.

`res` stand for resolution. This example means that between 0px and 638px of the window's width only the mobile video will be shown. After that your default `src`.

- `autoplay` (default: `true`)

The video is going to be played immediately when the video is ready. If you are setting it to false, you can start the video just by `this.$refs.videobackground.player.play()`. But remember to set `ref=videobackground` to the HTML tag `<video-background>`, so that it can work.

- `overlay` (default: `''`)
If you love overlays, then copy the overlay from the advanced example.

- `muted` (default: `true`)

Browsers block autoplay for most videos with sound. If the browser blocks the video, the poster stays visible and the component emits `error`.

- `loop` (default: `true`)

Loops through the video. You can catch the event `ended` to show only the poster.

- `preload` (default: `auto`)

https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#preload

- `objectFit` (default: `cover`)

So the video fits perfectly in the container

- `objectPosition` (default: `center`)

So the video fits exact position in the container

> the value is also used as a poster background-position 

- `posterBgSize` (default: `cover`)

So the poster fits perfectly in the container

> Using the same values for `objectFit` and `posterBgSize` is recommended

- `playsWhen` (default: `canplay`)

If some of your users have a slow connection, use `canplaythrough`. Learn more in [video events](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement#events).

- `playbackRate` (default: `1.0`)
  
The playbackRate property sets the current playback speed of the video. [Example](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playbackRate) but negative values didn't work for me?

- `transition` (default: `fade`)
  
You can add your own transition styles here. If you set it to an empty string, the video shows without a transition.

The `fade` transition takes one second. For a different duration, give the transition your own name and add the CSS for it:

```html
<video-background src="/videos/hero.mp4" transition="slow-fade" />

<style>
.slow-fade-enter-active,
.slow-fade-leave-active {
    transition: opacity 3s;
}
.slow-fade-enter-from,
.slow-fade-leave-to {
    opacity: 0;
}
</style>
```

## Events 

- `ready`: Video is loaded. The event fires once for each video that loads.
- `playing`: Video is playing
- `paused`: Video is paused
- `error`: The video failed, for example because the file is missing, or the browser blocked playback. The event carries the error event of the video or the error of `play()`. The poster stays visible.
- `loading`: A new video is loading, for example after a resize
- `ended`: Video finished. This event fires only with `loop` set to false.

## Methods

If you happen to need more control over the player, you can use the internal methods. For that, you need to set `ref=videobackground` to the HTML tag `<video-background>`. After that you can call all methods like this `this.$refs.videobackground.player.play()`.

- `play()`: Plays the video and returns a promise. The promise resolves after playback starts or after the browser blocks it.
- `pause()`: Pauses the video
- `stop()`: Pauses the video and goes back to the start. Call `play()` to start it again.
- `show()`: Shows the video
- `hide()`: Hides the video and shows the poster
- `load()`: Hides the video and loads it again after one second
 
## Development

You need Node.js 22.12 or newer (see `.nvmrc`).

```bash
npm install
npm test          # unit tests and type checks
npm run lint
npm run build     # builds dist/ and the demo
```

`npm pack` and `npm publish` build `dist/` first.

### Releases

1. Set the new version in `package.json` and add it to `CHANGELOG.md`.
2. Merge the change into `master`.
3. Push a tag with the version number, for example `git tag 2.5.2 && git push origin 2.5.2`.

The `Release` workflow then runs the lint and the tests, and publishes the package to npm. It uses npm trusted publishing, so it needs no npm token and no 2FA prompt. The tag must match the version in `package.json` and must be on `master`. Run the workflow by hand to check the setup. That run publishes nothing.

On npmjs.com, the trusted publisher of the package points to this repository, the workflow `release.yml` and the environment `npm-publish`. Under "Allowed actions", it must allow `npm publish`. A new trusted publisher expires if it does not publish within 2 days, so create it right before a release.

## Security

If you discover any security problems, please, don't email me. (I'm a bit scared 😱) avidofood@protonmail.com

## Credits

Now comes the best part! 😍
This package was inspired by:

 - https://tesla.com

Wow, you really read all that?! If you enjoyed this, hit the ⭐️ button to give me a 🤩 face. 

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
