import {
    describe, expect, it, vi,
} from 'vitest';
import {
    createApp, createSSRApp, h, nextTick, ref,
} from 'vue';
import { renderToString } from 'vue/server-renderer';
import { flushPromises } from '@vue/test-utils';
import VideoBackground from '../src/index';
import { fakeIntersectionObserver, fakeReducedMotion, sources } from './helpers';

const app = () => createSSRApp({
    render: () => h(VideoBackground, {
        src: '/videos/desktop.mp4',
        poster: '/images/poster.jpg',
        sources,
    }, () => h('h1', 'Hello')),
});

const hydrate = async () => {
    const container = document.createElement('div');
    container.innerHTML = await renderToString(app());
    document.body.appendChild(container);
    app().mount(container);
    await flushPromises();
    return container;
};

describe('hydration', () => {
    it('hydrates without a mismatch', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const error = vi.spyOn(console, 'error').mockImplementation(() => {});
        window.innerWidth = 1200;

        await hydrate();

        const messages = [...warn.mock.calls, ...error.mock.calls].flat().join('\n');
        expect(messages).not.toMatch(/mismatch/i);
    });

    it('hydrates a container outside the document without a mismatch', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const error = vi.spyOn(console, 'error').mockImplementation(() => {});
        window.innerWidth = 1200;
        const container = document.createElement('div');
        container.innerHTML = await renderToString(app());

        app().mount(container);
        await flushPromises();

        const messages = [...warn.mock.calls, ...error.mock.calls].flat().join('\n');
        expect(messages).not.toMatch(/mismatch/i);
        expect(container.querySelector('source').getAttribute('src')).toBe('/videos/desktop.mp4');
    });

    it.each([
        [1200, '/videos/desktop.mp4', '/images/poster.jpg'],
        [800, '/videos/tablet.mp4', '/images/poster.jpg'],
        [500, '/videos/mobile.mp4', '/images/mobile.jpg'],
    ])('uses the right source and poster for %ipx after hydration', async (width, video, poster) => {
        window.innerWidth = width;

        const container = await hydrate();

        expect(container.querySelector('source').getAttribute('src')).toBe(video);
        expect(container.querySelector('.video-buffering').style.backgroundImage).toContain(poster);
    });

    it('plays the video after hydration', async () => {
        const container = await hydrate();

        container.querySelector('video').dispatchEvent(new Event('canplay'));
        await flushPromises();

        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
        expect(container.querySelector('.video-wrapper').style.display).toBe('');
    });

    it('does not load the video twice, because the browser loads a newly added source itself', async () => {
        vi.useFakeTimers();

        await hydrate();
        vi.advanceTimersByTime(2000);

        expect(HTMLMediaElement.prototype.load).not.toHaveBeenCalled();
    });

    it('mounts a component that appears after hydration like in a client-only app', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const show = ref(false);
        const lateApp = () => createSSRApp({
            render: () => (show.value ? h(VideoBackground, { src: '/videos/desktop.mp4', sources }) : h('div')),
        });
        const container = document.createElement('div');
        container.innerHTML = await renderToString(lateApp());
        document.body.appendChild(container);
        lateApp().mount(container);
        window.innerWidth = 500;

        show.value = true;
        await nextTick();

        expect(container.querySelector('source').getAttribute('src')).toBe('/videos/mobile.mp4');
        expect(warn).not.toHaveBeenCalled();
    });
});

describe('hydration with the 2.6 options', () => {
    const hydrateWith = async (props) => {
        const optionsApp = () => createSSRApp({
            render: () => h(VideoBackground, {
                src: '/videos/desktop.mp4',
                poster: '/images/poster.jpg',
                sources,
                pauseButton: true,
                ...props,
            }, () => h('h1', 'Hello')),
        });
        const container = document.createElement('div');
        container.innerHTML = await renderToString(optionsApp());
        document.body.appendChild(container);
        optionsApp().mount(container);
        await flushPromises();
        return container;
    };

    it('hydrates all new options without a mismatch', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const error = vi.spyOn(console, 'error').mockImplementation(() => {});
        fakeIntersectionObserver();
        fakeReducedMotion(true);
        window.innerWidth = 1200;

        const container = await hydrateWith({
            respectReducedMotion: true, pauseWhenHidden: true, lazy: true, keepLargerSource: true,
        });

        const messages = [...warn.mock.calls, ...error.mock.calls].flat().join('\n');
        expect(messages).not.toMatch(/mismatch/i);
        expect(container.querySelector('source')).toBeNull();
        // The server does not know the setting. The browser changes the label after hydration
        expect(container.querySelector('button').getAttribute('aria-label')).toBe('Play background video');
    });

    it('loads the video after hydration when the lazy section comes near the viewport', async () => {
        const observers = fakeIntersectionObserver();
        window.innerWidth = 1200;
        const container = await hydrateWith({ lazy: true });
        expect(container.querySelector('source')).toBeNull();

        observers[0].report(true);
        await flushPromises();

        expect(container.querySelector('source').getAttribute('src')).toBe('/videos/desktop.mp4');
    });

    it('starts hls.js after hydration', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const attachMedia = vi.fn();
        class Hls {
            static isSupported() {
                return true;
            }

            static get Events() {
                return { ERROR: 'hlsError' };
            }

            constructor() {
                this.attachMedia = attachMedia;
            }

            on() {
                return this;
            }

            loadSource(url) {
                this.url = url;
            }
        }
        window.innerWidth = 1200;

        const container = await hydrateWith({ src: '/videos/hero.m3u8', sources: [], hls: Hls });

        expect(warn.mock.calls.flat().join('\n')).not.toMatch(/mismatch/i);
        expect(attachMedia).toHaveBeenCalledWith(container.querySelector('video'));
        expect(container.querySelector('source')).toBeNull();
    });
});

describe('client-only app', () => {
    it('measures the window before the first render, so the first source is already right', () => {
        window.innerWidth = 500;
        const container = document.createElement('div');
        document.body.appendChild(container);

        createApp({ render: () => h(VideoBackground, { src: '/videos/desktop.mp4', sources }) }).mount(container);

        // No flush: the first render must already contain the right source
        expect(container.querySelector('source').getAttribute('src')).toBe('/videos/mobile.mp4');
    });
});
