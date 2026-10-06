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
