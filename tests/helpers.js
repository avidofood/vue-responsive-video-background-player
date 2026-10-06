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
