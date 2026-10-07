import type {
    ComponentOptionsMixin, DefineComponent, Plugin as VuePlugin, PropType,
} from 'vue';

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

/** The parts of an hls.js instance that the component uses. */
export interface VideoBackgroundHlsInstance {
    loadSource(url: string): void;
    attachMedia(media: HTMLMediaElement): void;
    destroy(): void;
    on(event: any, listener: (event: any, data: any) => void): void;
}

/** The Hls class of hls.js, for example from `import Hls from 'hls.js'`. */
export interface VideoBackgroundHls {
    new (config?: any): VideoBackgroundHlsInstance;
    isSupported(): boolean;
    readonly Events: { readonly ERROR: string };
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
    /** The Hls class of hls.js. With it, HLS streams play in browsers without native HLS. */
    hls?: VideoBackgroundHls | null;
    /** Options for `new Hls()`. */
    hlsConfig?: object;
}

/** The internal player. Get it from the `player` property of the component. */
export interface VideoBackgroundPlayer {
    /** The `<video>` element. */
    readonly video: HTMLVideoElement;
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
    /**
     * An error event of the video, or the error when the browser blocks playback.
     * For a fatal hls.js error, a CustomEvent with the error data of hls.js in `detail`.
     */
    error: (reason: Event | DOMException) => void;
    loading: () => void;
    ended: () => void;
};

/**
 * The props as runtime options, like in the component. Vue 3.2 reads required props only from
 * this form, not from a plain interface.
 */
type VideoBackgroundPropOptions = {
    src: { type: PropType<string>; required: true };
    sources: { type: PropType<VideoBackgroundSource[]>; default: () => VideoBackgroundSource[] };
    autoplay: { type: PropType<boolean>; default: boolean };
    poster: { type: PropType<string>; default: string };
    overlay: { type: PropType<string>; default: string };
    muted: { type: PropType<boolean>; default: boolean };
    loop: { type: PropType<boolean>; default: boolean };
    preload: { type: PropType<string>; default: string };
    objectFit: { type: PropType<string>; default: string };
    objectPosition: { type: PropType<string>; default: string };
    posterBgSize: { type: PropType<string>; default: string };
    playsWhen: { type: PropType<string>; default: string };
    playbackRate: { type: PropType<number>; default: number };
    transition: { type: PropType<string>; default: string };
    hls: { type: PropType<VideoBackgroundHls | null>; default: null };
    hlsConfig: { type: PropType<object> };
};

declare const VideoBackground: DefineComponent<
    VideoBackgroundPropOptions,
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
