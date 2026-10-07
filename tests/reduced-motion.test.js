import {
    describe, expect, it,
} from 'vitest';
import { flushPromises } from '@vue/test-utils';
import {
    buttonOf, fakeReducedMotion, makeReady, mountBackground, sourceOf, videoIsShown,
} from './helpers';

describe('respectReducedMotion', () => {
    it('plays the video by default, also when the user prefers reduced motion', async () => {
        fakeReducedMotion(true);
        const wrapper = mountBackground();

        await makeReady(wrapper);

        expect(sourceOf(wrapper).exists()).toBe(true);
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
    });

    it('shows only the poster and does not load the video when the user prefers reduced motion', async () => {
        const motion = fakeReducedMotion(true);
        const wrapper = mountBackground({ respectReducedMotion: true, poster: '/images/poster.jpg' });
        await flushPromises();

        expect(motion.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
        expect(sourceOf(wrapper).exists()).toBe(false);
        expect(wrapper.find('.video-buffering').exists()).toBe(true);
        expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
        expect(videoIsShown(wrapper)).toBe(false);
    });

    it('plays the video as usual without the preference', async () => {
        fakeReducedMotion(false);
        const wrapper = mountBackground({ respectReducedMotion: true });

        await makeReady(wrapper);

        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
    });

    it('loads and plays the video when the user presses the play button', async () => {
        fakeReducedMotion(true);
        const wrapper = mountBackground({ respectReducedMotion: true, pauseButton: true });
        expect(buttonOf(wrapper).attributes('aria-label')).toBe('Play background video');

        await buttonOf(wrapper).trigger('click');
        expect(sourceOf(wrapper).attributes('src')).toBe('/videos/desktop.mp4');
        await makeReady(wrapper);

        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
        expect(videoIsShown(wrapper)).toBe(true);
        expect(buttonOf(wrapper).attributes('aria-label')).toBe('Pause background video');
    });

    it('loads and plays the video on play(), and the promise waits until it plays', async () => {
        fakeReducedMotion(true);
        const wrapper = mountBackground({ respectReducedMotion: true });
        let resolved = false;

        wrapper.vm.player.play().then(() => {
            resolved = true;
        });
        await flushPromises();
        expect(sourceOf(wrapper).exists()).toBe(true);
        expect(resolved).toBe(false);

        await makeReady(wrapper);

        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
        expect(wrapper.emitted('playing')).toHaveLength(1);
        expect(resolved).toBe(true);
    });

    it('pauses the video when the user turns on the setting', async () => {
        const motion = fakeReducedMotion(false);
        const wrapper = mountBackground({ respectReducedMotion: true, pauseButton: true });
        await makeReady(wrapper);

        motion.change(true);
        await flushPromises();

        expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
        expect(wrapper.emitted('paused')).toHaveLength(1);
        expect(buttonOf(wrapper).attributes('aria-label')).toBe('Play background video');
    });

    it('keeps playing when the user started the video before the setting changed', async () => {
        const motion = fakeReducedMotion(true);
        const wrapper = mountBackground({ respectReducedMotion: true, pauseButton: true });
        await buttonOf(wrapper).trigger('click');
        await makeReady(wrapper);

        motion.change(false);
        motion.change(true);
        await flushPromises();

        expect(wrapper.emitted('paused')).toBeUndefined();
    });

    it('loads and plays the video when the user turns off the setting', async () => {
        const motion = fakeReducedMotion(true);
        const wrapper = mountBackground({ respectReducedMotion: true });
        await flushPromises();
        expect(sourceOf(wrapper).exists()).toBe(false);

        motion.change(false);
        await flushPromises();
        await makeReady(wrapper);

        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
    });

    it('supports Safari before 14, which has only addListener', async () => {
        const motion = fakeReducedMotion(false, { legacy: true });
        const wrapper = mountBackground({ respectReducedMotion: true });
        await makeReady(wrapper);
        expect(motion.listeners.size).toBe(1);

        wrapper.unmount();

        expect(motion.listeners.size).toBe(0);
    });

    it('removes its listener when the component unmounts', () => {
        const motion = fakeReducedMotion(false);
        const wrapper = mountBackground({ respectReducedMotion: true });
        expect(motion.listeners.size).toBe(1);

        wrapper.unmount();

        expect(motion.listeners.size).toBe(0);
    });

    it('plays the video when the browser has no matchMedia', async () => {
        const wrapper = mountBackground({ respectReducedMotion: true });

        await makeReady(wrapper);

        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
    });
});
