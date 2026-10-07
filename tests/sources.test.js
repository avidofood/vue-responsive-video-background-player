import {
    describe, expect, it, vi,
} from 'vitest';
import {
    fakeIntersectionObserver, mountBackground, resizeTo, sourceOf, sources,
} from './helpers';

describe('keepLargerSource (#14)', () => {
    it('switches to the smaller video by default', async () => {
        vi.useFakeTimers();
        window.innerWidth = 1200;
        const wrapper = mountBackground({ sources });

        await resizeTo(500);

        expect(sourceOf(wrapper).attributes('src')).toBe('/videos/mobile.mp4');
    });

    it('keeps the larger video when the window gets smaller', async () => {
        vi.useFakeTimers();
        window.innerWidth = 1200;
        const wrapper = mountBackground({ sources, keepLargerSource: true });

        await resizeTo(500);
        vi.advanceTimersByTime(1000);

        expect(sourceOf(wrapper).attributes('src')).toBe('/videos/desktop.mp4');
        expect(HTMLMediaElement.prototype.load).not.toHaveBeenCalled();
        expect(wrapper.emitted('loading')).toBeUndefined();
    });

    it('switches to a larger video when the window gets larger', async () => {
        vi.useFakeTimers();
        window.innerWidth = 500;
        const wrapper = mountBackground({ sources, keepLargerSource: true });

        await resizeTo(800);
        expect(sourceOf(wrapper).attributes('src')).toBe('/videos/tablet.mp4');

        await resizeTo(500);
        expect(sourceOf(wrapper).attributes('src')).toBe('/videos/tablet.mp4');
    });

    it('uses the window width of the moment when a lazy video starts to load', async () => {
        vi.useFakeTimers();
        const observers = fakeIntersectionObserver();
        window.innerWidth = 1200;
        const wrapper = mountBackground({ sources, keepLargerSource: true, lazy: true });

        await resizeTo(500);
        observers[0].report(true);
        await resizeTo(500);

        expect(sourceOf(wrapper).attributes('src')).toBe('/videos/mobile.mp4');
    });
});

describe('source with only a poster', () => {
    const posterOnPhones = [{
        src: '', res: 575, autoplay: false, poster: '/images/mobile.jpg',
    }];

    it('loads no video for small windows and shows the poster', () => {
        window.innerWidth = 500;

        const wrapper = mountBackground({ sources: posterOnPhones });

        expect(sourceOf(wrapper).exists()).toBe(false);
        expect(wrapper.find('.video-buffering').attributes('style')).toContain('/images/mobile.jpg');
    });

    it('loads the video when the window gets larger', async () => {
        vi.useFakeTimers();
        window.innerWidth = 500;
        const wrapper = mountBackground({ sources: posterOnPhones });

        await resizeTo(1200);

        expect(sourceOf(wrapper).attributes('src')).toBe('/videos/desktop.mp4');
    });

    it('resolves play() right away, because there is nothing to play', async () => {
        window.innerWidth = 500;
        const wrapper = mountBackground({ sources: posterOnPhones });

        await expect(wrapper.vm.player.play()).resolves.toBeUndefined();
        expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
    });
});
