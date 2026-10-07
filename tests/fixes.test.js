import {
    describe, expect, it, vi,
} from 'vitest';
import { flushPromises } from '@vue/test-utils';
import {
    makeReady, mountBackground, sourceOf, sources, videoIsShown, videoOf,
} from './helpers';

describe('resize listener', () => {
    it('removes the resize listener when the component unmounts', () => {
        const add = vi.spyOn(window, 'addEventListener');
        const remove = vi.spyOn(window, 'removeEventListener');
        const wrapper = mountBackground({ sources });

        const [, handler] = add.mock.calls.find(([type]) => type === 'resize');
        wrapper.unmount();

        expect(remove).toHaveBeenCalledWith('resize', handler);
    });
});

describe('sources prop', () => {
    it('does not change the order of the sources array', () => {
        // A fresh array in descending order, so an in-place sort would change it
        const unsorted = [
            { src: '/videos/tablet.mp4', res: 991, autoplay: true },
            { src: '/videos/mobile.mp4', res: 575, autoplay: true },
        ];
        const snapshot = JSON.parse(JSON.stringify(unsorted));
        window.innerWidth = 500;
        mountBackground({ sources: unsorted });

        expect(unsorted).toEqual(snapshot);
    });
});

describe('source switch', () => {
    it('does not throw when the component unmounts while the next video waits to load', async () => {
        vi.useFakeTimers();
        const errors = [];
        window.innerWidth = 900;
        const wrapper = mountBackground({ sources }, {
            global: { config: { errorHandler: (error) => errors.push(error) } },
        });

        window.innerWidth = 500;
        window.dispatchEvent(new Event('resize'));
        vi.advanceTimersByTime(250);
        await flushPromises();
        wrapper.unmount();

        expect(() => vi.advanceTimersByTime(1000)).not.toThrow();
        expect(errors).toEqual([]);
    });

    it('loads only the last source when the source changes twice within one second', async () => {
        vi.useFakeTimers();
        window.innerWidth = 900;
        const wrapper = mountBackground({ sources });

        await wrapper.setProps({ src: '/videos/other.mp4', sources: [] });
        vi.advanceTimersByTime(500);
        await wrapper.setProps({ src: '/videos/last.mp4' });
        vi.advanceTimersByTime(1000);

        expect(HTMLMediaElement.prototype.load).toHaveBeenCalledTimes(1);
        expect(wrapper.emitted('loading')).toHaveLength(1);
        wrapper.unmount();
    });
});

describe('autoplay blocked by the browser', () => {
    it('keeps the poster and emits error when play() is rejected', async () => {
        const blocked = new DOMException('play() failed', 'NotAllowedError');
        HTMLMediaElement.prototype.play.mockImplementation(() => Promise.reject(blocked));
        const wrapper = mountBackground({ poster: '/images/poster.jpg' });

        await makeReady(wrapper);

        expect(wrapper.emitted('playing')).toBeUndefined();
        expect(wrapper.emitted('error')).toEqual([[blocked]]);
        expect(videoIsShown(wrapper)).toBe(false);
    });

    it('ignores an AbortError, because a new load interrupted play()', async () => {
        const aborted = new DOMException('interrupted', 'AbortError');
        HTMLMediaElement.prototype.play.mockImplementation(() => Promise.reject(aborted));
        const wrapper = mountBackground();

        await makeReady(wrapper);

        expect(wrapper.emitted('playing')).toBeUndefined();
        expect(wrapper.emitted('error')).toBeUndefined();
    });

    it('does not show the old video when its play() resolves after a source switch', async () => {
        let resolvePlay;
        HTMLMediaElement.prototype.play.mockImplementation(() => new Promise((resolve) => {
            resolvePlay = resolve;
        }));
        const wrapper = mountBackground();
        await makeReady(wrapper);

        await wrapper.setProps({ src: '/videos/other.mp4' });
        resolvePlay();
        await flushPromises();

        expect(videoIsShown(wrapper)).toBe(false);
        expect(wrapper.emitted('playing')).toBeUndefined();
        wrapper.unmount();
    });

    it.each(['pause', 'stop'])('does not show the video when %s() comes before play() resolved', async (method) => {
        let resolvePlay;
        HTMLMediaElement.prototype.play.mockImplementation(() => new Promise((resolve) => {
            resolvePlay = resolve;
        }));
        const wrapper = mountBackground({ autoplay: false });
        await makeReady(wrapper);

        wrapper.vm.player.play();
        wrapper.vm.player[method]();
        resolvePlay();
        await flushPromises();

        expect(videoIsShown(wrapper)).toBe(false);
        expect(wrapper.emitted('playing')).toBeUndefined();
        expect(wrapper.emitted('paused')).toHaveLength(1);
    });

    it('emits playing only after play() resolved', async () => {
        let resolvePlay;
        HTMLMediaElement.prototype.play.mockImplementation(() => new Promise((resolve) => {
            resolvePlay = resolve;
        }));
        const wrapper = mountBackground();

        await makeReady(wrapper);
        expect(wrapper.emitted('playing')).toBeUndefined();

        resolvePlay();
        await flushPromises();
        expect(wrapper.emitted('playing')).toHaveLength(1);
        expect(videoIsShown(wrapper)).toBe(true);
    });
});

describe('ready and paused events', () => {
    it('handles the ready event once per loaded video', async () => {
        const wrapper = mountBackground({ autoplay: false });
        await makeReady(wrapper);
        wrapper.vm.player.play();
        await flushPromises();
        HTMLMediaElement.prototype.pause.mockClear();

        // The browser fires canplay again after the video waited for data
        await makeReady(wrapper);

        expect(wrapper.emitted('ready')).toHaveLength(1);
        expect(HTMLMediaElement.prototype.pause).not.toHaveBeenCalled();
    });

    it('does not emit paused for the internal pause before autoplay', async () => {
        const wrapper = mountBackground();

        await makeReady(wrapper);

        expect(wrapper.emitted('paused')).toBeUndefined();
    });

    it('emits paused when you call pause()', async () => {
        const wrapper = mountBackground();
        await makeReady(wrapper);

        wrapper.vm.player.pause();

        expect(wrapper.emitted('paused')).toHaveLength(1);
    });
});

describe('error event', () => {
    it('emits error with the event when the source fails to load', () => {
        const wrapper = mountBackground();
        const event = new Event('error');

        sourceOf(wrapper).element.dispatchEvent(event);

        expect(wrapper.emitted('error')).toEqual([[event]]);
    });

    it('emits error with the event when the video fails', () => {
        const wrapper = mountBackground();
        const event = new Event('error');

        videoOf(wrapper).dispatchEvent(event);

        expect(wrapper.emitted('error')).toEqual([[event]]);
    });
});

describe('media type of the source', () => {
    it.each([
        ['/videos/a.mp4', 'video/mp4'],
        ['/videos/a.MP4', 'video/mp4'],
        ['/videos/a.m4v', 'video/mp4'],
        ['/videos/a.webm', 'video/webm'],
        ['/videos/a.ogv', 'video/ogg'],
        ['/videos/a.ogg', 'video/ogg'],
        ['/videos/a.m3u8', 'application/vnd.apple.mpegurl'],
        ['/videos/a.mp4?v=1.2', 'video/mp4'],
        ['/videos/a.webm#t=10', 'video/webm'],
        ['https://cdn.example.com/a.mp4?token=x.y', 'video/mp4'],
    ])('sets the type of %s to %s', (src, type) => {
        const wrapper = mountBackground({ src });

        expect(sourceOf(wrapper).attributes('type')).toBe(type);
    });

    it.each([
        'https://cdn.example.com/video',
        'https://cdn.example.com/videos/12345?format=hd',
        '/videos/a.mov',
        'blob:https://example.com/0c2b1b7e',
        '/videos/a.constructor',
        '/videos/a.toString',
        '/videos/a.__proto__',
    ])('sets no type for %s, so that the browser decides', (src) => {
        const wrapper = mountBackground({ src });

        expect(sourceOf(wrapper).attributes('type')).toBeUndefined();
    });
});
