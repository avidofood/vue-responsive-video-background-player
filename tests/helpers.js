import { vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import VideoBackground from '../src/index';

export const sources = [
    { src: '/videos/tablet.mp4', res: 991, autoplay: true },
    {
        src: '/videos/mobile.mp4', res: 575, autoplay: true, poster: '/images/mobile.jpg',
    },
];

export const mountBackground = (props = {}, options = {}) => mount(VideoBackground, {
    props: {
        src: '/videos/desktop.mp4',
        ...props,
    },
    ...options,
});

export const videoOf = (wrapper) => wrapper.find('video').element;

export const sourceOf = (wrapper) => wrapper.find('source');

// v-show hides the video wrapper until the video plays
export const videoIsShown = (wrapper) => wrapper.find('.video-wrapper').element.style.display !== 'none';

// Fires the event that the playsWhen prop names (canplay by default) and waits for play()
export const makeReady = async (wrapper, event = 'canplay') => {
    videoOf(wrapper).dispatchEvent(new Event(event));
    await flushPromises();
};

export const buttonOf = (wrapper) => wrapper.find('button.videobg-pause-button');

// Resizes the window and waits for the throttled resize handler
export const resizeTo = async (width) => {
    window.innerWidth = width;
    window.dispatchEvent(new Event('resize'));
    vi.advanceTimersByTime(250);
    await flushPromises();
};

// jsdom has no IntersectionObserver. This one reports what a test tells it
class FakeIntersectionObserver {
    constructor(callback, options = {}) {
        this.callback = callback;
        this.options = options;
        this.elements = [];
        this.disconnected = false;
        FakeIntersectionObserver.instances.push(this);
    }

    observe(element) {
        this.elements.push(element);
    }

    disconnect() {
        this.disconnected = true;
        this.elements = [];
    }

    report(isIntersecting) {
        this.callback(this.elements.map((target) => ({ target, isIntersecting })), this);
    }
}

// Returns the list of observers that the component creates
export const fakeIntersectionObserver = () => {
    FakeIntersectionObserver.instances = [];
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
    return FakeIntersectionObserver.instances;
};

// jsdom has no matchMedia. Returns a function that changes the reduced motion setting
export const fakeReducedMotion = (reduce, { legacy = false } = {}) => {
    const listeners = new Set();
    const query = { matches: reduce, media: '(prefers-reduced-motion: reduce)' };
    if (legacy) {
        // Safari before 14
        query.addListener = (listener) => listeners.add(listener);
        query.removeListener = (listener) => listeners.delete(listener);
    } else {
        query.addEventListener = (type, listener) => listeners.add(listener);
        query.removeEventListener = (type, listener) => listeners.delete(listener);
    }
    const matchMedia = vi.fn(() => query);
    vi.stubGlobal('matchMedia', matchMedia);
    return {
        matchMedia,
        listeners,
        change(matches) {
            query.matches = matches;
            listeners.forEach((listener) => listener({ matches }));
        },
    };
};

export const setPageVisibility = (state) => {
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue(state);
    document.dispatchEvent(new Event('visibilitychange'));
};
