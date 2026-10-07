import {
    describe, expect, it, vi,
} from 'vitest';
import { flushPromises } from '@vue/test-utils';
import {
    buttonOf, fakeIntersectionObserver, makeReady, mountBackground, setPageVisibility, sourceOf,
} from './helpers';

const onlyObserver = (observers) => {
    expect(observers).toHaveLength(1);
    return observers[0];
};

describe('pauseWhenHidden', () => {
    it('observes nothing by default', () => {
        const observers = fakeIntersectionObserver();
        const add = vi.spyOn(document, 'addEventListener');

        mountBackground();

        expect(observers).toHaveLength(0);
        expect(add.mock.calls.map(([type]) => type)).not.toContain('visibilitychange');
    });

    it('pauses the video off screen and plays it again on screen', async () => {
        const observers = fakeIntersectionObserver();
        const wrapper = mountBackground({ pauseWhenHidden: true });
        const observer = onlyObserver(observers);
        observer.report(true);
        await makeReady(wrapper);
        HTMLMediaElement.prototype.pause.mockClear();

        observer.report(false);
        await flushPromises();
        expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledTimes(1);
        expect(wrapper.emitted('paused')).toHaveLength(1);

        observer.report(true);
        await flushPromises();
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);
        expect(wrapper.emitted('playing')).toHaveLength(2);
    });

    it('pauses the video while the page is in the background', async () => {
        fakeIntersectionObserver();
        const wrapper = mountBackground({ pauseWhenHidden: true });
        await makeReady(wrapper);
        HTMLMediaElement.prototype.pause.mockClear();

        setPageVisibility('hidden');
        await flushPromises();
        expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledTimes(1);

        setPageVisibility('visible');
        await flushPromises();
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);
    });

    it('does not start a video that becomes ready off screen until it is visible', async () => {
        const observers = fakeIntersectionObserver();
        const wrapper = mountBackground({ pauseWhenHidden: true });
        const observer = onlyObserver(observers);
        observer.report(false);

        await makeReady(wrapper);
        expect(wrapper.emitted('ready')).toHaveLength(1);
        expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();

        observer.report(true);
        await flushPromises();
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
    });

    it.each([
        ['the pause button', (wrapper) => buttonOf(wrapper).trigger('click')],
        ['pause()', (wrapper) => wrapper.vm.player.pause()],
    ])('does not play a video again that the user paused with %s', async (name, pause) => {
        const observers = fakeIntersectionObserver();
        const wrapper = mountBackground({ pauseWhenHidden: true, pauseButton: true });
        const observer = onlyObserver(observers);
        observer.report(true);
        await makeReady(wrapper);

        await pause(wrapper);
        observer.report(false);
        await flushPromises();
        observer.report(true);
        await flushPromises();

        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
        expect(buttonOf(wrapper).attributes('aria-label')).toBe('Play background video');
    });

    it('does not play a video without autoplay when it comes on screen', async () => {
        const observers = fakeIntersectionObserver();
        const wrapper = mountBackground({ pauseWhenHidden: true, autoplay: false });
        const observer = onlyObserver(observers);
        await makeReady(wrapper);

        observer.report(false);
        observer.report(true);
        await flushPromises();

        expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
    });

    it('keeps the pause button on pause while the video waits off screen', async () => {
        const observers = fakeIntersectionObserver();
        const wrapper = mountBackground({ pauseWhenHidden: true, pauseButton: true });
        const observer = onlyObserver(observers);
        await makeReady(wrapper);

        observer.report(false);
        await flushPromises();

        expect(buttonOf(wrapper).attributes('aria-label')).toBe('Pause background video');
    });

    it('plays the video again when pauseWhenHidden is turned off', async () => {
        const observers = fakeIntersectionObserver();
        const wrapper = mountBackground({ pauseWhenHidden: true });
        const observer = onlyObserver(observers);
        await makeReady(wrapper);
        observer.report(false);
        await flushPromises();

        await wrapper.setProps({ pauseWhenHidden: false });
        await flushPromises();

        expect(observer.disconnected).toBe(true);
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);
    });

    it('stops observing when the component unmounts', () => {
        const observers = fakeIntersectionObserver();
        const remove = vi.spyOn(document, 'removeEventListener');
        const wrapper = mountBackground({ pauseWhenHidden: true });

        wrapper.unmount();

        expect(onlyObserver(observers).disconnected).toBe(true);
        expect(remove.mock.calls.map(([type]) => type)).toContain('visibilitychange');
    });
});

describe('lazy', () => {
    it('loads the video right away by default', () => {
        const observers = fakeIntersectionObserver();

        const wrapper = mountBackground();

        expect(observers).toHaveLength(0);
        expect(sourceOf(wrapper).exists()).toBe(true);
    });

    it('loads the video when the section comes near the viewport', async () => {
        const observers = fakeIntersectionObserver();
        const wrapper = mountBackground({ lazy: true, poster: '/images/poster.jpg' });
        const observer = onlyObserver(observers);
        expect(observer.options.rootMargin).toBe('200px 0px');
        expect(observer.elements).toEqual([wrapper.element]);

        observer.report(false);
        await flushPromises();
        expect(sourceOf(wrapper).exists()).toBe(false);
        expect(wrapper.find('.video-buffering').exists()).toBe(true);

        observer.report(true);
        await flushPromises();
        expect(sourceOf(wrapper).attributes('src')).toBe('/videos/desktop.mp4');
        expect(observer.disconnected).toBe(true);

        await makeReady(wrapper);
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
    });

    it('loads the video on play() before the section comes near the viewport', async () => {
        fakeIntersectionObserver();
        const wrapper = mountBackground({ lazy: true, autoplay: false });

        wrapper.vm.player.play();
        await flushPromises();
        expect(sourceOf(wrapper).exists()).toBe(true);

        await makeReady(wrapper);
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
    });

    it('loads the video when lazy is turned off', async () => {
        const observers = fakeIntersectionObserver();
        const wrapper = mountBackground({ lazy: true });
        expect(sourceOf(wrapper).exists()).toBe(false);

        await wrapper.setProps({ lazy: false });
        await flushPromises();

        expect(sourceOf(wrapper).attributes('src')).toBe('/videos/desktop.mp4');
        expect(onlyObserver(observers).disconnected).toBe(true);
    });

    it('loads the video right away when the browser has no IntersectionObserver', async () => {
        vi.stubGlobal('IntersectionObserver', undefined);

        const wrapper = mountBackground({ lazy: true });
        await flushPromises();

        expect(sourceOf(wrapper).exists()).toBe(true);
    });

    it('works together with pauseWhenHidden', async () => {
        const observers = fakeIntersectionObserver();
        const wrapper = mountBackground({ lazy: true, pauseWhenHidden: true });
        expect(observers).toHaveLength(2);
        const [lazyObserver, visibilityObserver] = observers;

        lazyObserver.report(true);
        visibilityObserver.report(false);
        await flushPromises();
        await makeReady(wrapper);
        expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();

        visibilityObserver.report(true);
        await flushPromises();
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
    });
});
