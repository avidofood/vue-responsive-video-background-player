// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import VideoBackground from '../src/index';
import { sources } from './helpers';

const render = (props) => renderToString(createSSRApp({
    render: () => h(VideoBackground, {
        src: '/videos/desktop.mp4',
        poster: '/images/poster.jpg',
        overlay: 'rgba(0, 0, 0, 0.5)',
        ...props,
    }, () => h('h1', 'Hello')),
}));

describe('server-side rendering', () => {
    it('renders without window and document', async () => {
        expect(typeof window).toBe('undefined');

        const html = await render({ sources });

        expect(html).toContain('class="vue-responsive-videobg"');
        expect(html).toContain('<h1>Hello</h1>');
        expect(html).toContain('video-overlay');
    });

    it('renders a muted video without a source, because the server does not know the width', async () => {
        const html = await render({ sources });

        expect(html).toMatch(/<video[^>]* muted/);
        expect(html).not.toContain('<source');
        expect(html).not.toContain('.mp4');
    });
});

describe('server-side rendering of the 2.6 options', () => {
    it('renders the pause button and no source with all new options', async () => {
        class Hls {
            static isSupported() {
                throw new Error('The server must not ask hls.js');
            }
        }

        const html = await render({
            sources,
            pauseButton: true,
            respectReducedMotion: true,
            pauseWhenHidden: true,
            lazy: true,
            hls: Hls,
            src: '/videos/hero.m3u8',
        });

        expect(html).toContain('<button type="button" class="videobg-pause-button"');
        expect(html).toContain('aria-label="Pause background video"');
        expect(html).not.toContain('<source');
        // The button comes before the content
        expect(html.indexOf('videobg-pause-button')).toBeLessThan(html.indexOf('videobg-content'));
    });

    it('renders the play label when autoplay is off', async () => {
        const html = await render({ pauseButton: true, autoplay: false });

        expect(html).toContain('aria-label="Play background video"');
    });
});
