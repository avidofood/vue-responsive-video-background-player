import { afterEach, beforeEach, vi } from 'vitest';

// jsdom has no media playback. These stubs stand in for the browser.
beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
    vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
    window.innerWidth = 1024;
});

afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
});
