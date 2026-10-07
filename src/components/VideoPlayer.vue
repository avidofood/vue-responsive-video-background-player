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
                    v-if="src && !usesHls && !hlsAttached"
                    :src="src"
                    :type="getMediaType(src)"
                    @error="videoError"
                >
            </video>
        </div>
    </transition>
</template>

<script>
import { toRaw } from 'vue';
import props from '../core/playerProps';

const hlsType = 'application/vnd.apple.mpegurl';

// Only well-known types. Without a type attribute the browser checks the file itself
const mediaTypes = {
    mp4: 'video/mp4',
    m4v: 'video/mp4',
    webm: 'video/webm',
    ogv: 'video/ogg',
    ogg: 'video/ogg',
    m3u8: hlsType,
};

export default {
    props,
    emits: ['playing', 'paused', 'error', 'loading', 'ended', 'ready', 'request'],
    data() {
        return {
            showVideo: false,
            // hls.js removes all <source> elements when it detaches. Ours comes back after that
            hlsAttached: false,
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
        // hls.js plays an HLS stream if it gets the Hls class and the browser has Media Source
        // Extensions. Otherwise the browser plays the stream itself, for example on older iPhones
        usesHls() {
            return !!this.src
                && !!this.hls
                && this.getMediaType(this.src) === hlsType
                && this.hls.isSupported();
        },
    },
    watch: {
        src(newSrc, oldSrc) {
            // The first source after server-side rendering or lazy loading. The browser loads a
            // newly added <source> by itself, because the video has no source yet. hls.js does not
            if (!oldSrc) {
                if (this.usesHls) this.attachHls();
                return;
            }
            this.load();
        },
        hls() {
            // For example, hls.js arrived later through a dynamic import
            if (this.src && this.getMediaType(this.src) === hlsType) this.load();
        },
    },
    methods: {
        pause() {
            if (this.$refs.video) {
                this.cancelPlayRequest();
                this.resolveWaitingPlays();
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
                if (this.usesHls) {
                    this.attachHls();
                } else if (this.hlsAttached) {
                    this.destroyHls();
                    // The <source> comes back with the next render
                    this.$nextTick(() => this.$refs.video && this.$refs.video.load());
                } else {
                    this.$refs.video.load();
                }
                this.$emit('loading');
            }, 1000);
        },
        play() {
            if (!this.src) {
                // The background holds the video back, for example for lazy loading. It loads the
                // video now and plays it when it is ready. The promise waits for that
                return new Promise((resolve) => {
                    this.waitingPlays = [...(this.waitingPlays || []), resolve];
                    this.$emit('request');
                });
            }
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
                })
                .then(() => this.resolveWaitingPlays());
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
        // Ends the promises of play() calls that waited for the video
        resolveWaitingPlays() {
            const waiting = this.waitingPlays || [];
            this.waitingPlays = [];
            waiting.forEach((resolve) => resolve());
        },
        attachHls() {
            this.destroyHls();
            const Hls = this.hls;
            // hls.js gets your object, not the reactive proxy of Vue
            const hls = new Hls(this.hlsConfig && toRaw(this.hlsConfig));
            hls.on(Hls.Events.ERROR, (event, data) => {
                // hls.js handles the other errors itself
                if (!data.fatal || hls !== this.hlsPlayer) return;
                this.destroyHls();
                this.hide();
                this.resolveWaitingPlays();
                // A CustomEvent, so that error always gets an Event. detail has the data of hls.js
                this.$emit('error', new CustomEvent('error', { detail: data }));
            });
            hls.loadSource(this.src);
            hls.attachMedia(this.$refs.video);
            this.hlsPlayer = hls;
            this.hlsAttached = true;
        },
        destroyHls() {
            if (!this.hlsPlayer) return;
            this.hlsPlayer.destroy();
            this.hlsPlayer = null;
            this.hlsAttached = false;
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
            this.resolveWaitingPlays();
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
        // A client-only app has the source from the first render on
        if (this.usesHls) this.attachHls();
    },
    beforeUnmount() {
        clearTimeout(this.loadTimer);
        this.destroyHls();
        this.resolveWaitingPlays();
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
