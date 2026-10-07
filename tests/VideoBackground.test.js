import {
    describe, expect, it, vi,
} from 'vitest';
import { createApp } from 'vue';
import { flushPromises } from '@vue/test-utils';
import VideoBackground, { Plugin } from '../src/index';
import {
    makeReady, mountBackground, sourceOf, sources, videoIsShown, videoOf,
} from './helpers';

describe('rendering', () => {
    it('renders the slot, the overlay and the poster', () => {
        const wrapper = mountBackground({
            poster: '/images/poster.jpg',
            overlay: 'linear-gradient(45deg, red, blue)',
        }, {
            slots: { default: '<h1>Hello</h1>' },
        });

        expect(wrapper.find('section.vue-responsive-videobg').exists()).toBe(true);
        expect(wrapper.find('.videobg-content h1').text()).toBe('Hello');
        expect(wrapper.find('.video-overlay').attributes('style')).toContain('linear-gradient');
        expect(wrapper.find('.video-buffering').attributes('style')).toContain('/images/poster.jpg');
    });

    it('renders no poster and no overlay when the props are empty', () => {
        const wrapper = mountBackground();

        expect(wrapper.find('.video-buffering').exists()).toBe(false);
        expect(wrapper.find('.video-overlay').exists()).toBe(false);
    });

    it('renders a muted, looping, inline video', () => {
        const wrapper = mountBackground();
        const video = videoOf(wrapper);

        expect(video.muted).toBe(true);
        expect(video.loop).toBe(true);
        expect(video.hasAttribute('playsinline')).toBe(true);
        expect(video.getAttribute('preload')).toBe('auto');
        expect(sourceOf(wrapper).attributes('src')).toBe('/videos/desktop.mp4');
        expect(sourceOf(wrapper).attributes('type')).toBe('video/mp4');
    });

    it('passes objectFit and objectPosition to the video and the poster', () => {
        const wrapper = mountBackground({
            poster: '/images/poster.jpg',
            objectFit: 'contain',
            objectPosition: 'top',
            posterBgSize: 'contain',
        });

        expect(videoOf(wrapper).style.objectFit).toBe('contain');
        expect(videoOf(wrapper).style.objectPosition).toBe('top');
        expect(wrapper.find('.video-buffering').element.style.backgroundSize).toBe('contain');
        expect(wrapper.find('.video-buffering').element.style.backgroundPosition).toBe('center top');
    });
});

describe('responsive sources', () => {
    it.each([
        [500, '/videos/mobile.mp4'],
        [575, '/videos/mobile.mp4'],
        [800, '/videos/tablet.mp4'],
        [1200, '/videos/desktop.mp4'],
    ])('uses the right source for a %ipx wide window', (width, expected) => {
        window.innerWidth = width;
        const wrapper = mountBackground({ sources });

        expect(sourceOf(wrapper).attributes('src')).toBe(expected);
    });

    it('uses the poster of the source when it has one', () => {
        window.innerWidth = 500;
        const wrapper = mountBackground({ sources, poster: '/images/poster.jpg' });

        expect(wrapper.find('.video-buffering').attributes('style')).toContain('/images/mobile.jpg');
    });

    it('switches the source when the window is resized', async () => {
        vi.useFakeTimers();
        window.innerWidth = 900;
        const wrapper = mountBackground({ sources });
        expect(sourceOf(wrapper).attributes('src')).toBe('/videos/tablet.mp4');

        window.innerWidth = 500;
        window.dispatchEvent(new Event('resize'));
        vi.advanceTimersByTime(250);
        await flushPromises();

        expect(sourceOf(wrapper).attributes('src')).toBe('/videos/mobile.mp4');

        vi.advanceTimersByTime(1000);
        expect(HTMLMediaElement.prototype.load).toHaveBeenCalled();
        expect(wrapper.emitted('loading')).toHaveLength(1);
        wrapper.unmount();
    });
});

describe('playback', () => {
    it('plays the video when it is ready', async () => {
        const wrapper = mountBackground();
        expect(videoIsShown(wrapper)).toBe(false);

        await makeReady(wrapper);

        expect(wrapper.emitted('ready')).toHaveLength(1);
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
        expect(wrapper.emitted('playing')).toHaveLength(1);
        expect(videoIsShown(wrapper)).toBe(true);
    });

    it('does not play the video when autoplay is false', async () => {
        const wrapper = mountBackground({ autoplay: false });

        await makeReady(wrapper);

        expect(wrapper.emitted('ready')).toHaveLength(1);
        expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
        expect(wrapper.emitted('playing')).toBeUndefined();
    });

    it('waits for the event that playsWhen names', async () => {
        const wrapper = mountBackground({ playsWhen: 'canplaythrough' });

        await makeReady(wrapper, 'canplay');
        expect(wrapper.emitted('ready')).toBeUndefined();

        await makeReady(wrapper, 'canplaythrough');
        expect(wrapper.emitted('ready')).toHaveLength(1);
    });

    it('sets the playback rate before it plays', async () => {
        const wrapper = mountBackground({ playbackRate: 0.5 });

        await makeReady(wrapper);

        expect(videoOf(wrapper).playbackRate).toBe(0.5);
        expect(videoOf(wrapper).defaultPlaybackRate).toBe(0.5);
    });

    it('emits ended when the video ends', () => {
        const wrapper = mountBackground({ loop: false });

        videoOf(wrapper).dispatchEvent(new Event('ended'));

        expect(wrapper.emitted('ended')).toHaveLength(1);
    });

    it('lets you control the player through the player ref', async () => {
        const wrapper = mountBackground({ autoplay: false });
        await makeReady(wrapper);

        wrapper.vm.player.play();
        await flushPromises();
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);

        wrapper.vm.player.hide();
        await flushPromises();
        expect(videoIsShown(wrapper)).toBe(false);
    });
});

describe('player.video', () => {
    it('is the video element', () => {
        const wrapper = mountBackground();

        expect(wrapper.vm.player.video).toBe(videoOf(wrapper));
        expect(wrapper.vm.player.video).toBeInstanceOf(HTMLVideoElement);
    });
});

describe('stop()', () => {
    it('pauses the video and goes back to the start (#30)', async () => {
        const wrapper = mountBackground();
        await makeReady(wrapper);
        videoOf(wrapper).currentTime = 5;
        HTMLMediaElement.prototype.pause.mockClear();

        wrapper.vm.player.stop();

        expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledTimes(1);
        expect(videoOf(wrapper).currentTime).toBe(0);
        expect(wrapper.emitted('paused')).toHaveLength(1);
    });

    it('plays from the start again after stop()', async () => {
        const wrapper = mountBackground();
        await makeReady(wrapper);
        videoOf(wrapper).currentTime = 5;

        wrapper.vm.player.stop();
        wrapper.vm.player.play();
        await flushPromises();

        expect(videoOf(wrapper).currentTime).toBe(0);
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);
    });
});

describe('plugin', () => {
    it('registers the component as VideoBackground', () => {
        const app = createApp({});
        app.use(Plugin);

        expect(app.component('VideoBackground')).toBe(VideoBackground);
    });
});
