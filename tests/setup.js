import { afterEach, beforeEach, vi } from 'vitest';
import { enableAutoUnmount } from '@vue/test-utils';

// Components of earlier tests must not react to window and document events
enableAutoUnmount(afterEach);

// jsdom has no media playback. These stubs stand in for the browser.
beforeEach(() => {
    // Server-side tests run without a DOM
    if (typeof window === 'undefined') return;
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
    vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
    window.innerWidth = 1024;
});

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
});
