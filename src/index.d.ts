import type { ComponentOptionsMixin, DefineComponent, Plugin as VuePlugin } from 'vue';

/** A video for all windows up to `res` pixels wide. */
export interface VideoBackgroundSource {
    /** Path or URL of the video. */
    src: string;
    /** The widest window, in pixels, that uses this video. */
    res: number;
    /** Play the video when it is ready. */
    autoplay: boolean;
    /** Image that shows until the video plays. */
    poster?: string;
}

export interface VideoBackgroundProps {
    /** Path or URL of the default video. */
    src: string;
    /** Videos for smaller windows. */
    sources?: VideoBackgroundSource[];
    /** Play the video when it is ready. Default: true. */
    autoplay?: boolean;
    /** Image that shows until the video plays. */
    poster?: string;
    /** CSS background on top of the video, for example a gradient. */
    overlay?: string;
    /** Default: true. Browsers block autoplay for most videos with sound. */
    muted?: boolean;
    /** Default: true. */
    loop?: boolean;
    /** The preload attribute of the video. Default: 'auto'. */
    preload?: string;
    /** CSS object-fit of the video. Default: 'cover'. */
    objectFit?: string;
    /** CSS object-position of the video and background-position of the poster. Default: 'center'. */
    objectPosition?: string;
    /** CSS background-size of the poster. Default: 'cover'. */
    posterBgSize?: string;
    /** The media event that marks the video as ready. Default: 'canplay'. */
    playsWhen?: string;
    /** Default: 1. */
    playbackRate?: number;
    /** Name of the transition that shows the video. Default: 'fade'. */
    transition?: string;
}

/** The internal player. Get it from the `player` property of the component. */
export interface VideoBackgroundPlayer {
    /** Plays the video. The promise resolves when the video plays or the browser blocks it. */
    play(): Promise<void>;
    pause(): void;
    /** Pauses the video and goes back to the start. */
    stop(): void;
    /** Shows the video. */
    show(): void;
    /** Hides the video and shows the poster. */
    hide(): void;
    /** Hides the video and loads it again after one second. */
    load(): void;
}

export type VideoBackgroundEmits = {
    ready: () => void;
    playing: () => void;
    paused: () => void;
    /** An error event of the video, or the error when the browser blocks playback. */
    error: (reason: Event | DOMException) => void;
    loading: () => void;
    ended: () => void;
};

declare const VideoBackground: DefineComponent<
    VideoBackgroundProps,
    {},
    {},
    { player: () => VideoBackgroundPlayer },
    {},
    ComponentOptionsMixin,
    ComponentOptionsMixin,
    VideoBackgroundEmits
>;

/** Registers the component globally as VideoBackground. */
export declare const Plugin: VuePlugin;

export default VideoBackground;

declare module 'vue' {
    export interface GlobalComponents {
        VideoBackground: typeof VideoBackground;
    }
}
