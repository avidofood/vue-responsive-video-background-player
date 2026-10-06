// Compile-time checks for src/index.d.ts. Run with: npm run test:types
import { createApp, h, type GlobalComponents } from 'vue';
import VideoBackground, {
    Plugin,
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

// @ts-expect-error src is required
h(VideoBackground, { poster: '/images/poster.jpg' });

// @ts-expect-error playbackRate is a number
h(VideoBackground, { src: '/videos/desktop.mp4', playbackRate: 'fast' });

// @ts-expect-error a source needs res
const incomplete: VideoBackgroundSource = { src: '/videos/mobile.mp4', autoplay: true };

declare const instance: InstanceType<typeof VideoBackground>;
const player: VideoBackgroundPlayer = instance.player;
const played: Promise<void> = player.play();
player.pause();
player.stop();
player.show();
player.hide();
player.load();

// The plugin registers the component globally for templates
const global: typeof VideoBackground = {} as GlobalComponents['VideoBackground'];

export {
    incomplete, played, global,
};
