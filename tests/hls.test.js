import {
    describe, expect, it, vi,
} from 'vitest';
import { flushPromises } from '@vue/test-utils';
import {
    makeReady, mountBackground, resizeTo, sourceOf, videoIsShown, videoOf,
} from './helpers';

// Stands in for the Hls class of hls.js
const fakeHls = ({ supported = true } = {}) => {
    const instances = [];
    class Hls {
        static isSupported() {
            return supported;
        }

        static get Events() {
            return { ERROR: 'hlsError' };
        }

        constructor(config) {
            this.config = config;
            this.handlers = {};
            this.loadSource = vi.fn();
            this.attachMedia = vi.fn();
            this.destroy = vi.fn();
            instances.push(this);
        }

        on(event, handler) {
            this.handlers[event] = handler;
        }

        fail(data) {
            this.handlers.hlsError('hlsError', data);
        }
    }
    return { Hls, instances };
};

const stream = '/videos/hero.m3u8';

const hlsSources = [
    { src: '/videos/mobile.m3u8', res: 575, autoplay: true },
];

describe('hls', () => {
    it('lets the browser play HLS itself without the hls prop', () => {
        const wrapper = mountBackground({ src: stream });

        expect(sourceOf(wrapper).attributes('type')).toBe('application/vnd.apple.mpegurl');
    });

    it('plays an HLS stream with hls.js', async () => {
        const { Hls, instances } = fakeHls();
        const config = { capLevelToPlayerSize: true };
        const wrapper = mountBackground({ src: stream, hls: Hls, hlsConfig: config });

        expect(sourceOf(wrapper).exists()).toBe(false);
        expect(instances).toHaveLength(1);
        expect(instances[0].config).toBe(config);
        expect(instances[0].loadSource).toHaveBeenCalledWith(stream);
        expect(instances[0].attachMedia).toHaveBeenCalledWith(videoOf(wrapper));

        await makeReady(wrapper);
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
        expect(wrapper.emitted('playing')).toHaveLength(1);
    });

    it('lets the browser play the stream when hls.js is not supported, for example on older iPhones', () => {
        const { Hls, instances } = fakeHls({ supported: false });

        const wrapper = mountBackground({ src: stream, hls: Hls });

        expect(instances).toHaveLength(0);
        expect(sourceOf(wrapper).attributes('src')).toBe(stream);
    });

    it('does not use hls.js for other videos', () => {
        const { Hls, instances } = fakeHls();

        const wrapper = mountBackground({ hls: Hls });

        expect(instances).toHaveLength(0);
        expect(sourceOf(wrapper).attributes('src')).toBe('/videos/desktop.mp4');
    });

    it('starts hls.js for the next stream when the window switches the source', async () => {
        vi.useFakeTimers();
        window.innerWidth = 1200;
        const { Hls, instances } = fakeHls();
        const wrapper = mountBackground({ src: stream, sources: hlsSources, hls: Hls });

        await resizeTo(500);
        expect(instances).toHaveLength(1);
        vi.advanceTimersByTime(1000);

        expect(instances[0].destroy).toHaveBeenCalledTimes(1);
        expect(instances).toHaveLength(2);
        expect(instances[1].loadSource).toHaveBeenCalledWith('/videos/mobile.m3u8');
        expect(wrapper.emitted('loading')).toHaveLength(1);
    });

    it('stops hls.js before the browser loads an MP4 source', async () => {
        vi.useFakeTimers();
        window.innerWidth = 1200;
        const { Hls, instances } = fakeHls();
        const mp4Sources = [{ src: '/videos/mobile.mp4', res: 575, autoplay: true }];
        const wrapper = mountBackground({ src: stream, sources: mp4Sources, hls: Hls });

        await resizeTo(500);
        // hls.js removes all <source> elements when it stops. Ours comes after that
        expect(sourceOf(wrapper).exists()).toBe(false);
        vi.advanceTimersByTime(1000);
        await flushPromises();

        expect(instances[0].destroy).toHaveBeenCalledTimes(1);
        expect(sourceOf(wrapper).attributes('src')).toBe('/videos/mobile.mp4');
        expect(HTMLMediaElement.prototype.load).toHaveBeenCalledTimes(1);
    });

    it('starts hls.js after an MP4 source', async () => {
        vi.useFakeTimers();
        window.innerWidth = 500;
        const { Hls, instances } = fakeHls();
        const mp4Sources = [{ src: '/videos/mobile.mp4', res: 575, autoplay: true }];
        const wrapper = mountBackground({ src: stream, sources: mp4Sources, hls: Hls });
        expect(instances).toHaveLength(0);

        await resizeTo(1200);
        vi.advanceTimersByTime(1000);

        expect(sourceOf(wrapper).exists()).toBe(false);
        expect(instances).toHaveLength(1);
        expect(instances[0].loadSource).toHaveBeenCalledWith(stream);
    });

    it('keeps the poster and emits error with the data of hls.js on a fatal error', async () => {
        const { Hls, instances } = fakeHls();
        const wrapper = mountBackground({ src: stream, hls: Hls });
        await makeReady(wrapper);
        const data = { type: 'networkError', details: 'manifestLoadError', fatal: true };

        instances[0].fail(data);
        await flushPromises();

        const [[reason]] = wrapper.emitted('error');
        expect(reason).toBeInstanceOf(CustomEvent);
        expect(reason.type).toBe('error');
        expect(reason.detail).toBe(data);
        expect(instances[0].destroy).toHaveBeenCalledTimes(1);
        expect(videoIsShown(wrapper)).toBe(false);
        expect(sourceOf(wrapper).exists()).toBe(false);
    });

    it('ignores errors that hls.js handles itself', async () => {
        const { Hls, instances } = fakeHls();
        const wrapper = mountBackground({ src: stream, hls: Hls });
        await makeReady(wrapper);

        instances[0].fail({ type: 'networkError', details: 'fragLoadError', fatal: false });

        expect(wrapper.emitted('error')).toBeUndefined();
        expect(instances[0].destroy).not.toHaveBeenCalled();
    });

    it('stops hls.js when the component unmounts', () => {
        const { Hls, instances } = fakeHls();
        const wrapper = mountBackground({ src: stream, hls: Hls });

        wrapper.unmount();

        expect(instances[0].destroy).toHaveBeenCalledTimes(1);
    });

    it('starts hls.js when the Hls class arrives later, for example through a dynamic import', async () => {
        vi.useFakeTimers();
        const { Hls, instances } = fakeHls();
        const wrapper = mountBackground({ src: stream });

        await wrapper.setProps({ hls: Hls });
        expect(sourceOf(wrapper).exists()).toBe(false);
        vi.advanceTimersByTime(1000);

        expect(instances).toHaveLength(1);
        expect(instances[0].attachMedia).toHaveBeenCalledWith(videoOf(wrapper));
    });
});
