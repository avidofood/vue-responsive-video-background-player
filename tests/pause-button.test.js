import {
    describe, expect, it, vi,
} from 'vitest';
import { flushPromises } from '@vue/test-utils';
import {
    buttonOf, makeReady, mountBackground, resizeTo, sourceOf, sources, videoIsShown, videoOf,
} from './helpers';

describe('pause button', () => {
    it('renders no button by default', () => {
        const wrapper = mountBackground();

        expect(wrapper.find('button').exists()).toBe(false);
    });

    it('renders a native button before the content, so that it comes first in the tab order', () => {
        const wrapper = mountBackground({ pauseButton: true }, {
            slots: { default: '<a href="/next">Next</a>' },
        });
        const button = buttonOf(wrapper);

        expect(button.attributes('type')).toBe('button');
        expect(button.attributes('aria-label')).toBe('Pause background video');
        expect(button.attributes('aria-pressed')).toBeUndefined();
        const focusable = wrapper.element.querySelectorAll('button, a');
        expect(focusable[0]).toBe(button.element);
        expect(button.find('svg').attributes('aria-hidden')).toBe('true');
    });

    it('pauses the video and changes the label to play', async () => {
        const wrapper = mountBackground({ pauseButton: true });
        await makeReady(wrapper);
        HTMLMediaElement.prototype.pause.mockClear();

        await buttonOf(wrapper).trigger('click');

        expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledTimes(1);
        expect(wrapper.emitted('paused')).toHaveLength(1);
        expect(buttonOf(wrapper).attributes('aria-label')).toBe('Play background video');
    });

    it('plays the video again from the point where it was paused', async () => {
        const wrapper = mountBackground({ pauseButton: true });
        await makeReady(wrapper);
        await buttonOf(wrapper).trigger('click');
        videoOf(wrapper).currentTime = 7;

        await buttonOf(wrapper).trigger('click');
        await flushPromises();

        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);
        expect(videoOf(wrapper).currentTime).toBe(7);
        expect(wrapper.emitted('playing')).toHaveLength(2);
        expect(buttonOf(wrapper).attributes('aria-label')).toBe('Pause background video');
    });

    it('keeps the video paused when the window switches to another source', async () => {
        vi.useFakeTimers();
        window.innerWidth = 900;
        const wrapper = mountBackground({ pauseButton: true, sources });
        await makeReady(wrapper);
        await buttonOf(wrapper).trigger('click');

        await resizeTo(500);
        vi.advanceTimersByTime(1000);
        await makeReady(wrapper);

        expect(sourceOf(wrapper).attributes('src')).toBe('/videos/mobile.mp4');
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
        expect(buttonOf(wrapper).attributes('aria-label')).toBe('Play background video');
        wrapper.unmount();
    });

    it('does not start the video when the user pauses it before it is ready', async () => {
        const wrapper = mountBackground({ pauseButton: true });

        await buttonOf(wrapper).trigger('click');
        await makeReady(wrapper);

        expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
        expect(buttonOf(wrapper).attributes('aria-label')).toBe('Play background video');
    });

    it('starts a video without autoplay when the user presses play before it is ready', async () => {
        const wrapper = mountBackground({ pauseButton: true, autoplay: false });
        expect(buttonOf(wrapper).attributes('aria-label')).toBe('Play background video');

        await buttonOf(wrapper).trigger('click');
        expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
        await makeReady(wrapper);

        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
        expect(videoIsShown(wrapper)).toBe(true);
    });

    it('offers play when the browser blocked autoplay, and plays after the click', async () => {
        const blocked = new DOMException('play() failed', 'NotAllowedError');
        HTMLMediaElement.prototype.play.mockImplementationOnce(() => Promise.reject(blocked));
        const wrapper = mountBackground({ pauseButton: true });
        await makeReady(wrapper);
        expect(buttonOf(wrapper).attributes('aria-label')).toBe('Play background video');

        await buttonOf(wrapper).trigger('click');
        await flushPromises();

        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);
        expect(videoIsShown(wrapper)).toBe(true);
        expect(buttonOf(wrapper).attributes('aria-label')).toBe('Pause background video');
    });

    it('offers play after the video ended', async () => {
        const wrapper = mountBackground({ pauseButton: true, loop: false });
        await makeReady(wrapper);

        videoOf(wrapper).dispatchEvent(new Event('ended'));
        await flushPromises();

        expect(buttonOf(wrapper).attributes('aria-label')).toBe('Play background video');
    });

    it('follows pause() and play() of the player', async () => {
        const wrapper = mountBackground({ pauseButton: true });
        await makeReady(wrapper);

        wrapper.vm.player.pause();
        await flushPromises();
        expect(buttonOf(wrapper).attributes('aria-label')).toBe('Play background video');

        wrapper.vm.player.play();
        await flushPromises();
        expect(buttonOf(wrapper).attributes('aria-label')).toBe('Pause background video');
    });

    it('uses your labels', async () => {
        const wrapper = mountBackground({
            pauseButton: true, pauseLabel: 'Video anhalten', playLabel: 'Video abspielen',
        });
        expect(buttonOf(wrapper).attributes('aria-label')).toBe('Video anhalten');
        await makeReady(wrapper);

        await buttonOf(wrapper).trigger('click');

        expect(buttonOf(wrapper).attributes('aria-label')).toBe('Video abspielen');
    });

    it('passes paused to the pause-button slot', async () => {
        const wrapper = mountBackground({ pauseButton: true }, {
            slots: {
                'pause-button': '<template #pause-button="{ paused }"><i>{{ paused ? \'play\' : \'pause\' }}</i></template>',
            },
        });
        await makeReady(wrapper);
        expect(buttonOf(wrapper).find('i').text()).toBe('pause');
        expect(buttonOf(wrapper).find('svg').exists()).toBe(false);

        await buttonOf(wrapper).trigger('click');

        expect(buttonOf(wrapper).find('i').text()).toBe('play');
    });

    it('renders no button for a source that has only a poster', async () => {
        vi.useFakeTimers();
        window.innerWidth = 500;
        const posterOnly = [{
            src: '', res: 575, autoplay: false, poster: '/images/mobile.jpg',
        }];
        const wrapper = mountBackground({ pauseButton: true, sources: posterOnly });
        expect(buttonOf(wrapper).exists()).toBe(false);

        await resizeTo(1200);

        expect(buttonOf(wrapper).exists()).toBe(true);
        wrapper.unmount();
    });
});
