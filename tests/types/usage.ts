// Compile-time checks for src/index.d.ts. Run with: npm run test:types
import { createApp, h, type GlobalComponents } from 'vue';
import Hls from 'hls.js';
import VideoBackground, {
    Plugin,
    type VideoBackgroundHls,
    type VideoBackgroundPlayer,
    type VideoBackgroundProps,
    type VideoBackgroundSource,
} from '../../src/index';

createApp({}).use(Plugin);
createApp({}).component('VideoBackground', VideoBackground);

const sources: VideoBackgroundSource[] = [
    { src: '/videos/mobile.mp4', res: 638, autoplay: true, poster: '/images/mobile.jpg' },
];

const props: VideoBackgroundProps = {
    src: '/videos/desktop.mp4',
    sources,
    poster: '/images/poster.jpg',
    overlay: 'linear-gradient(45deg, #2a4ae430, #fb949e6b)',
    playbackRate: 0.5,
};

h(VideoBackground, {
    ...props,
    onReady: () => {},
    onError: (reason: Event | DOMException) => reason,
});

// The options of 2.6
h(VideoBackground, {
    src: '/videos/hero.m3u8',
    pauseButton: true,
    pauseLabel: 'Video anhalten',
    playLabel: 'Video abspielen',
    respectReducedMotion: true,
    pauseWhenHidden: true,
    lazy: true,
    keepLargerSource: true,
    hls: Hls,
    hlsConfig: { capLevelToPlayerSize: true },
});

// The Hls class of hls.js fits the type
const hlsClass: VideoBackgroundHls = Hls;
const options: VideoBackgroundProps = { src: '/videos/hero.m3u8', hls: Hls, hlsConfig: Hls.DefaultConfig };

// @ts-expect-error pauseButton is a boolean
h(VideoBackground, { src: '/videos/desktop.mp4', pauseButton: 'yes' });

// @ts-expect-error hls needs the Hls class, not an instance
h(VideoBackground, { src: '/videos/hero.m3u8', hls: new Hls() });

// @ts-expect-error src is required
h(VideoBackground, { poster: '/images/poster.jpg' });

// @ts-expect-error playbackRate is a number
h(VideoBackground, { src: '/videos/desktop.mp4', playbackRate: 'fast' });

// @ts-expect-error a source needs res
const incomplete: VideoBackgroundSource = { src: '/videos/mobile.mp4', autoplay: true };

declare const instance: InstanceType<typeof VideoBackground>;
const player: VideoBackgroundPlayer = instance.player;
const played: Promise<void> = player.play();
const video: HTMLVideoElement = player.video;
player.pause();
player.stop();
player.show();
player.hide();
player.load();

// The plugin registers the component globally for templates
const global: typeof VideoBackground = {} as GlobalComponents['VideoBackground'];

export {
    incomplete, played, global, hlsClass, options, video,
};
