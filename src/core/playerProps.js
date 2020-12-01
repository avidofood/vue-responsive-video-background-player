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
};
