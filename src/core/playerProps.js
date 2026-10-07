export default {
    src: {
        type: String,
        required: true,
    },
    muted: {
        type: Boolean,
        default: true,
    },
    loop: {
        type: Boolean,
        default: true,
    },
    preload: {
        type: String,
        default: 'auto',
    },
    objectFit: {
        type: String,
        default: 'cover',
    },
    posterBgSize: {
        type: String,
        default: 'cover',
    },
    objectPosition: {
        type: String,
        default: 'center',
    },
    playsWhen: {
        type: String,
        default: 'canplay',
        note: 'Google HTML Video Events',
    },
    playbackRate: {
        type: Number,
        default: 1.0,
    },
    transition: {
        type: String,
        default: 'fade',
    },
    // The Hls class of hls.js. The component does not include hls.js
    hls: {
        type: Function,
        default: null,
    },
    // Options for new Hls()
    hlsConfig: {
        type: Object,
        default: undefined,
    },
};
