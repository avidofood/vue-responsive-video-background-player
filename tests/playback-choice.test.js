import {
    describe, expect, it, vi,
} from 'vitest';
import { flushPromises } from '@vue/test-utils';
import {
    fakeIntersectionObserver, fakeReducedMotion, makeReady, mountBackground, resizeTo, sourceOf,
    sources, videoIsShown,
} from './helpers';

describe('pause(), stop() and play() before the video is ready', () => {
    it.each(['pause', 'stop'])('keeps the video paused when %s() comes before it is ready', async (method) => {
        const wrapper = mountBackground();

        wrapper.vm.player[method]();
        await makeReady(wrapper);

        expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
        expect(videoIsShown(wrapper)).toBe(false);
        expect(wrapper.emitted('playing')).toBeUndefined();
    });

    it('plays a video without autoplay when play() comes before it is ready', async () => {
        const wrapper = mountBackground({ autoplay: false });

        wrapper.vm.player.play();
        await makeReady(wrapper);

        expect(wrapper.emitted('playing')).toHaveLength(1);
        expect(videoIsShown(wrapper)).toBe(true);
    });

    it('does not play a lazy video when pause() comes after play() and before it is ready', async () => {
        const observers = fakeIntersectionObserver();
        const wrapper = mountBackground({ lazy: true, pauseWhenHidden: true });
        const [, visibilityObserver] = observers;
        visibilityObserver.report(true);
        let resolved = false;
        wrapper.vm.player.play().then(() => {
            resolved = true;
        });
        await flushPromises();
        expect(sourceOf(wrapper).exists()).toBe(true);

        wrapper.vm.player.pause();
        await flushPromises();
        await makeReady(wrapper);
        visibilityObserver.report(false);
        await flushPromises();
        visibilityObserver.report(true);
        await flushPromises();

        expect(resolved).toBe(true);
        expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
    });

    it('keeps the next video paused when pause() comes while it loads, and the video after that plays', async () => {
        vi.useFakeTimers();
        window.innerWidth = 1200;
        const wrapper = mountBackground({ sources });
        await makeReady(wrapper);
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);

        await resizeTo(800);
        wrapper.vm.player.pause();
        vi.advanceTimersByTime(1000);
        await makeReady(wrapper);
        expect(sourceOf(wrapper).attributes('src')).toBe('/videos/tablet.mp4');
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);

        await resizeTo(500);
        vi.advanceTimersByTime(1000);
        await makeReady(wrapper);
        expect(sourceOf(wrapper).attributes('src')).toBe('/videos/mobile.mp4');
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);
    });

    it('lets the next source play after pause() of the player, as in 2.5', async () => {
        vi.useFakeTimers();
        window.innerWidth = 1200;
        const wrapper = mountBackground({ sources });
        await makeReady(wrapper);

        wrapper.vm.player.pause();
        await resizeTo(800);
        vi.advanceTimersByTime(1000);
        await makeReady(wrapper);

        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);
    });
});

describe('play() that waits for the video', () => {
    it('resolves when the window switches to a source with only a poster', async () => {
        vi.useFakeTimers();
        fakeIntersectionObserver();
        window.innerWidth = 1200;
        const posterOnPhones = [{
            src: '', res: 575, autoplay: false, poster: '/images/mobile.jpg',
        }];
        const wrapper = mountBackground({ lazy: true, sources: posterOnPhones });
        let resolved = false;
        wrapper.vm.player.play().then(() => {
            resolved = true;
        });
        await flushPromises();
        expect(sourceOf(wrapper).exists()).toBe(true);

        await resizeTo(500);

        expect(resolved).toBe(true);
    });

    it('resolves when the window switches to another video before the first one is ready', async () => {
        vi.useFakeTimers();
        fakeIntersectionObserver();
        window.innerWidth = 1200;
        const wrapper = mountBackground({ lazy: true, sources, autoplay: false });
        let resolved = false;
        wrapper.vm.player.play().then(() => {
            resolved = true;
        });
        await flushPromises();

        await resizeTo(500);

        expect(resolved).toBe(true);
    });
});

describe('reduced motion and play() of the player', () => {
    it('keeps playing a video that play() started when the user turns on reduced motion', async () => {
        const motion = fakeReducedMotion(false);
        const wrapper = mountBackground({ autoplay: false, respectReducedMotion: true });
        await makeReady(wrapper);
        wrapper.vm.player.play();
        await flushPromises();

        motion.change(true);
        await flushPromises();

        expect(wrapper.emitted('paused')).toBeUndefined();
        expect(videoIsShown(wrapper)).toBe(true);
    });
});
