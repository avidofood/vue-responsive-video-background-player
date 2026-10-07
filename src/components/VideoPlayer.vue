<template>
    <transition :name="transition">
        <div
            class="video-wrapper"
            v-show="showVideo"
        >
            <video
                ref="video"
                autoplay
                playsinline
                :muted="muted"
                :loop="loop"
                :preload="preload"
                :style="styleObject"
            >
                <source
                    v-if="src"
                    :src="src"
                    :type="getMediaType(src)"
                    @error="videoError"
                >
            </video>
        </div>
    </transition>
</template>

<script>
import props from '../core/playerProps';

// Only well-known types. Without a type attribute the browser checks the file itself
const mediaTypes = {
    mp4: 'video/mp4',
    m4v: 'video/mp4',
    webm: 'video/webm',
    ogv: 'video/ogg',
    ogg: 'video/ogg',
    m3u8: 'application/vnd.apple.mpegurl',
};

export default {
    props,
    emits: ['playing', 'paused', 'error', 'loading', 'ended', 'ready'],
    data() {
        return {
            showVideo: false,
        };
    },
    computed: {
        styleObject() {
            if (!this.objectFit && !this.objectPosition) {
                return {};
            }
            return {
                objectFit: this.objectFit,
                objectPosition: this.objectPosition,
            };
        },
        // The <video> element, after the component mounted
        video() {
            return this.$refs.video;
        },
    },
    watch: {
        src(newSrc, oldSrc) {
            // The first source after server-side rendering. The browser loads a newly added
            // <source> by itself, because the video has no source yet
            if (!oldSrc) return;
            this.load();
        },
    },
    methods: {
        pause() {
            if (this.$refs.video) {
                this.cancelPlayRequest();
                this.$refs.video.pause();
                this.$emit('paused');
            }
        },
        stop() {
            if (this.$refs.video) {
                this.pause();
                this.$refs.video.currentTime = 0;
            }
        },
        load() {
            this.hide();
            clearTimeout(this.loadTimer);
            // ugly, but we want to give hide 1 sec pause until we load the next video
            this.loadTimer = setTimeout(() => {
                this.isReady = false;
                this.$refs.video.load();
                this.$emit('loading');
            }, 1000);
        },
        play() {
            this.setPlaybackRate();
            this.cancelPlayRequest();
            const request = this.playRequest;
            // Old browsers return nothing instead of a promise
            return Promise.resolve(this.$refs.video.play())
                .then(() => {
                    // pause(), hide() or a newer play() made this request obsolete
                    if (request !== this.playRequest) return;
                    this.show();
                    this.$emit('playing');
                })
                .catch((error) => {
                    if (request !== this.playRequest) return;
                    // A new load() interrupted play(). The next ready event plays the new video
                    if (error && error.name === 'AbortError') return;
                    // The browser blocked playback, for example iOS in Low Power Mode.
                    // The poster stays visible
                    this.hide();
                    this.$emit('error', error);
                });
        },
        show() {
            this.showVideo = true;
        },
        hide() {
            this.cancelPlayRequest();
            this.showVideo = false;
        },
        // A play() that is still pending must not show the video or emit playing afterwards
        cancelPlayRequest() {
            this.playRequest = (this.playRequest || 0) + 1;
        },
        getMediaType(src) {
            const extension = src.split(/[?#]/)[0].split('.').pop().toLowerCase();
            // Own properties only: ".constructor" must not find Object.prototype.constructor
            return Object.prototype.hasOwnProperty.call(mediaTypes, extension)
                ? mediaTypes[extension]
                : undefined;
        },
        videoCanPlay() {
            return !!this.$refs.video.canPlayType;
        },
        videoReady() {
            // The browser fires the playsWhen event again after the video waited for data.
            // Only the first one after a load counts
            if (this.isReady) return;
            this.isReady = true;
            // Unfortunately we have the iOS bug, that we need to set autoplay always to true.
            // That means we need to first pause the video,
            // and later check if we want to autoplay or not
            this.$refs.video.pause();
            this.$emit('ready');
        },
        videoError(event) {
            this.$emit('error', event);
        },
        videoEnded() {
            this.$emit('ended');
        },
        setPlaybackRate() {
            this.$refs.video.playbackRate = this.playbackRate;
            this.$refs.video.defaultPlaybackRate = this.playbackRate;
        },
    },
    mounted() {
        if (this.videoCanPlay()) {
            this.$refs.video[`on${this.playsWhen}`] = this.videoReady;
            this.$refs.video.onerror = this.videoError;
            this.$refs.video.onended = this.videoEnded;
        }
    },
    beforeUnmount() {
        clearTimeout(this.loadTimer);
    },
};
</script>

<style scoped>
    .video-wrapper{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        position: absolute;
        height: 100%;
        position: absolute;
        overflow: hidden;
        z-index: 0;
    }

    .fade{
        backface-visibility: hidden;
    }
    .fade-enter-active{
        transition: opacity 1s;
    }
    .fade-leave-active{
        transition: opacity 1s;
    }

    .fade-enter-from{
        opacity: 0;
    }
    .fade-leave-to{
        opacity: 0;
    }
    video {
        visibility: visible;
        pointer-events: none;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        height: 100%;
        width: 100%;
    }
</style>
