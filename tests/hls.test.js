import {
    describe, expect, it, vi,
} from 'vitest';
import { flushPromises } from '@vue/test-utils';
import {
    buttonOf, fakeIntersectionObserver, makeReady, mountBackground, resizeTo, sourceOf,
    videoIsShown, videoOf,
} from './helpers';

// Stands in for the Hls class of hls.js. Like hls.js with ManagedMediaSource (Safari 17 and
// newer), it removes all <source> elements of the video when it attaches and when it stops
const removeSources = (media) => media.querySelectorAll('source').forEach((source) => source.remove());

const fakeHls = ({ supported = true, failInLoadSource = null } = {}) => {
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
            this.loadSource = vi.fn(() => {
                if (failInLoadSource) this.fail(failInLoadSource);
            });
            this.attachMedia = vi.fn((media) => {
                this.media = media;
                removeSources(media);
                const source = document.createElement('source');
                source.src = 'blob:hls';
                media.appendChild(source);
            });
            this.destroy = vi.fn(() => {
                if (this.media) removeSources(this.media);
            });
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

const fatal = { type: 'networkError', details: 'manifestLoadError', fatal: true };

const stream = '/videos/hero.m3u8';

// The <source> elements of the component, not the one of the fake hls.js
const ownSources = (wrapper) => [...wrapper.element.querySelectorAll('source')]
    .filter((source) => source.getAttribute('src') !== 'blob:hls');

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

        expect(ownSources(wrapper)).toHaveLength(0);
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
        expect(ownSources(wrapper)).toHaveLength(0);
        vi.advanceTimersByTime(1000);
        await flushPromises();

        expect(instances[0].destroy).toHaveBeenCalledTimes(1);
        expect(ownSources(wrapper).map((source) => source.getAttribute('src'))).toEqual(['/videos/mobile.mp4']);
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

        expect(ownSources(wrapper)).toHaveLength(0);
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
        expect(ownSources(wrapper)).toHaveLength(0);
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
        expect(ownSources(wrapper)).toHaveLength(0);
        vi.advanceTimersByTime(1000);

        expect(instances).toHaveLength(1);
        expect(instances[0].attachMedia).toHaveBeenCalledWith(videoOf(wrapper));
    });

    it('starts hls.js when lazy loading reaches the section', async () => {
        const observers = fakeIntersectionObserver();
        const { Hls, instances } = fakeHls();
        mountBackground({ src: stream, hls: Hls, lazy: true });
        expect(instances).toHaveLength(0);

        observers[0].report(true);
        await flushPromises();

        expect(instances).toHaveLength(1);
        expect(instances[0].loadSource).toHaveBeenCalledWith(stream);
    });

    it('keeps exactly one <source> when it switches from HLS to MP4, also when hls.js removes them', async () => {
        vi.useFakeTimers();
        window.innerWidth = 1200;
        const { Hls, instances } = fakeHls();
        const mp4Sources = [{ src: '/videos/mobile.mp4', res: 575, autoplay: true }];
        const wrapper = mountBackground({ src: stream, sources: mp4Sources, hls: Hls });
        expect(ownSources(wrapper)).toHaveLength(0);

        await resizeTo(500);
        vi.advanceTimersByTime(1000);
        await flushPromises();

        expect(instances[0].destroy).toHaveBeenCalledTimes(1);
        const all = wrapper.element.querySelectorAll('source');
        expect(all).toHaveLength(1);
        expect(all[0].getAttribute('src')).toBe('/videos/mobile.mp4');
    });

    it('loads the stream again when the user presses play after a fatal error', async () => {
        const { Hls, instances } = fakeHls();
        const wrapper = mountBackground({ src: stream, hls: Hls, pauseButton: true });
        instances[0].fail(fatal);
        await flushPromises();
        expect(buttonOf(wrapper).attributes('aria-label')).toBe('Play background video');

        await buttonOf(wrapper).trigger('click');
        expect(instances).toHaveLength(2);
        expect(instances[1].attachMedia).toHaveBeenCalledWith(videoOf(wrapper));
        expect(wrapper.emitted('loading')).toHaveLength(1);
        await makeReady(wrapper);

        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
        expect(buttonOf(wrapper).attributes('aria-label')).toBe('Pause background video');

        instances[1].fail(fatal);
        await flushPromises();
        expect(buttonOf(wrapper).attributes('aria-label')).toBe('Play background video');
    });

    it('loads the stream again on play() after a fatal error, and the promise waits until it plays', async () => {
        const { Hls, instances } = fakeHls();
        const wrapper = mountBackground({ src: stream, hls: Hls });
        instances[0].fail(fatal);
        await flushPromises();
        let resolved = false;

        wrapper.vm.player.play().then(() => {
            resolved = true;
        });
        await flushPromises();
        expect(instances).toHaveLength(2);
        expect(resolved).toBe(false);
        await makeReady(wrapper);

        expect(resolved).toBe(true);
        expect(wrapper.emitted('playing')).toHaveLength(1);
    });

    it('does not end the wait of play() early when the old play() of a failed stream fails', async () => {
        const plays = [];
        HTMLMediaElement.prototype.play.mockImplementation(() => new Promise((resolve, reject) => {
            plays.push({ resolve, reject });
        }));
        const { Hls, instances } = fakeHls();
        const wrapper = mountBackground({ src: stream, hls: Hls });
        await makeReady(wrapper);
        expect(plays).toHaveLength(1);
        instances[0].fail(fatal);
        await flushPromises();
        let resolved = false;

        wrapper.vm.player.play().then(() => {
            resolved = true;
        });
        // The new load interrupts the old play() of the browser
        plays[0].reject(new DOMException('interrupted', 'AbortError'));
        await flushPromises();
        expect(resolved).toBe(false);

        await makeReady(wrapper);
        plays[1].resolve();
        await flushPromises();
        expect(resolved).toBe(true);
    });

    it('starts hls.js once when a play after a fatal error comes while the next source waits to load', async () => {
        vi.useFakeTimers();
        window.innerWidth = 1200;
        const { Hls, instances } = fakeHls();
        const wrapper = mountBackground({
            src: stream, sources: hlsSources, hls: Hls, pauseButton: true,
        });

        await resizeTo(500);
        instances[0].fail(fatal);
        await flushPromises();
        await buttonOf(wrapper).trigger('click');
        vi.advanceTimersByTime(1000);
        await flushPromises();

        expect(instances).toHaveLength(2);
        expect(instances[1].loadSource).toHaveBeenCalledWith('/videos/mobile.m3u8');
        expect(instances[1].destroy).not.toHaveBeenCalled();
        expect(wrapper.emitted('loading')).toHaveLength(1);
    });

    it('reports a fatal error that hls.js raises inside loadSource()', async () => {
        const { Hls, instances } = fakeHls({ failInLoadSource: { ...fatal, details: 'manifestParsingError' } });

        const wrapper = mountBackground({ src: stream, hls: Hls, pauseButton: true });
        await flushPromises();

        expect(wrapper.emitted('error')).toHaveLength(1);
        expect(wrapper.emitted('error')[0][0].detail.details).toBe('manifestParsingError');
        expect(instances[0].destroy).toHaveBeenCalledTimes(1);
        expect(instances[0].attachMedia).not.toHaveBeenCalled();
        expect(buttonOf(wrapper).attributes('aria-label')).toBe('Play background video');
    });

    it('starts hls.js once when the window goes to a poster-only source and back within one second', async () => {
        vi.useFakeTimers();
        window.innerWidth = 1200;
        const { Hls, instances } = fakeHls();
        const posterOnPhones = [{
            src: '', res: 575, autoplay: false, poster: '/images/mobile.jpg',
        }];
        const wrapper = mountBackground({ src: stream, sources: posterOnPhones, hls: Hls });
        expect(instances).toHaveLength(1);

        await resizeTo(500);
        vi.advanceTimersByTime(500);
        await resizeTo(1200);
        vi.advanceTimersByTime(1000);
        await flushPromises();

        expect(instances).toHaveLength(2);
        expect(instances[0].destroy).toHaveBeenCalledTimes(1);
        expect(instances[1].destroy).not.toHaveBeenCalled();
        expect(wrapper.emitted('loading')).toHaveLength(1);
        await makeReady(wrapper);
        expect(wrapper.emitted('ready')).toHaveLength(1);
    });
});

describe('a video that fails to load', () => {
    it('loads the video again when the user presses play after an error', async () => {
        const wrapper = mountBackground({ pauseButton: true });
        sourceOf(wrapper).element.dispatchEvent(new Event('error'));
        await flushPromises();
        expect(buttonOf(wrapper).attributes('aria-label')).toBe('Play background video');

        await buttonOf(wrapper).trigger('click');
        expect(HTMLMediaElement.prototype.load).toHaveBeenCalledTimes(1);
        expect(buttonOf(wrapper).attributes('aria-label')).toBe('Pause background video');

        sourceOf(wrapper).element.dispatchEvent(new Event('error'));
        await flushPromises();
        expect(buttonOf(wrapper).attributes('aria-label')).toBe('Play background video');
    });
});
