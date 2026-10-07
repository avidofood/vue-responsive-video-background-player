<template>
    <section
        class="vue-responsive-videobg"
        ref="vidbg"
    >
        <video-poster
            v-if="current.poster || poster"
            :poster="current.poster || poster"
            :background-size="posterBgSize"
            :background-position="objectPosition"
        />

        <video-player
            ref="player"
            :src="videoSrc"
            :muted="muted"
            :loop="loop"
            :preload="preload"
            :plays-when="playsWhen"
            :playback-rate="playbackRate"
            :transition="transition"
            :object-fit="objectFit"
            :object-position="objectPosition"
            :hls="hls"
            :hls-config="hlsConfig"
            @ready="playVideo"
            @playing="videoPlaying"
            @paused="videoPaused"
            @error="videoError"
            @loading="videoLoading"
            @ended="videoEnded"
            @intent="videoIntent"
        />

        <video-overlay
            v-if="overlay"
            :overlay="overlay"
        />

        <!-- Before the content, so that the button comes first in the tab order -->
        <button
            v-if="pauseButton && current.src"
            type="button"
            class="videobg-pause-button"
            :aria-label="running ? pauseLabel : playLabel"
            @click="togglePlayback"
        >
            <slot
                name="pause-button"
                :paused="!running"
            >
                <svg
                    class="videobg-pause-icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                >
                    <path
                        v-if="running"
                        d="M7 5h3.5v14H7zm6.5 0H17v14h-3.5z"
                    />
                    <path
                        v-else
                        d="M8 5v14l11-7z"
                    />
                </svg>
            </slot>
        </button>

        <div class="videobg-content">
            <slot />
        </div>
    </section>
</template>

<script>
import props from './core/props';
import VideoPlayer from './components/VideoPlayer.vue';
import VideoPoster from './components/VideoPoster.vue';
import VideoOverlay from './components/VideoOverlay.vue';

import resize from './core/resize';
import visibility from './core/visibility';
import reducedMotion from './core/reducedMotion';

/* eslint-disable no-underscore-dangle */
export default {
    props,
    mixins: [resize, visibility, reducedMotion],
    emits: ['playing', 'paused', 'error', 'loading', 'ended', 'ready'],
    components: {
        VideoPlayer,
        VideoPoster,
        VideoOverlay,
    },
    data() {
        return {
            // The video plays, or it starts by itself soon. The pause button shows this state
            running: this.autoplay,
            // 'play' or 'pause' from the pause button, or from play(), pause() and stop() of the
            // player. Without a choice, the autoplay of the source decides
            choice: null,
            // A choice of the pause button stays when the window switches to another source.
            // A choice through the player counts only for the current video, as before 2.6
            choiceStays: false,
            // The video of the current source is ready to play
            videoReady: false,
            // pauseWhenHidden paused the video. It plays again when it is visible
            suspended: false,
            // respectReducedMotion holds the video back until the user starts it
            heldBack: false,
        };
    },
    computed: {
        player() {
            return this.$refs.player;
        },
        // Empty while the video waits: on the server, for lazy loading, or behind the poster
        videoSrc() {
            return this.measured && this.nearViewport && !this.heldBack ? this.current.src : '';
        },
    },
    watch: {
        videoSrc(newSrc, oldSrc) {
            this.videoReady = false;
            // Another video: a choice through the player was for the old one
            if (oldSrc && !this.choiceStays) this.choice = null;
        },
        visible(visible) {
            if (visible) {
                this.resume();
            } else if (this.pauseWhenHidden) {
                this.suspend();
            }
        },
        posterOnly(on) {
            if (!this.measured) return;
            if (!on) {
                // A video that waited behind the poster loads now
                this.heldBack = false;
                return;
            }
            // The user started the video, or it does not play anyway
            if (this.choice === 'play' || !this.running) return;
            this.running = false;
            this.suspended = false;
            if (this.videoReady) this.player.pauseVideo();
        },
    },
    beforeMount() {
        // While Vue hydrates server-rendered HTML, the vnode already holds the element from the
        // server, also in a container outside the document. Vue uses the same check. The first
        // render must then match the server, so the measurement waits until mounted.
        // ($el is no help here: in dev builds it is null.)
        if (!this.$.vnode.el) {
            this.readClient();
        }
    },
    mounted() {
        if (!this.measured) {
            this.readClient();
        }
    },
    methods: {
        // The server knows neither the window width nor the settings of the user
        readClient() {
            this._change_video_resolution();
            this._readReducedMotion();
            this.heldBack = this.posterOnly;
            this.running = this.shouldPlay();
        },
        // Whether the video plays when it is ready
        shouldPlay() {
            if (this.choice) return this.choice === 'play';
            return !!this.current.autoplay && !this.posterOnly;
        },
        playVideo() {
            this.videoReady = true;
            this.$emit('ready');
            if (!this.shouldPlay()) {
                this.running = false;
                return;
            }
            this.running = true;
            if (this.pauseWhenHidden && !this.visible) {
                this.suspended = true;
                return;
            }
            this.player.startVideo();
        },
        videoPlaying() {
            this.running = true;
            this.suspended = false;
            this.$emit('playing');
        },
        videoPaused() {
            // suspend() keeps the state, because the video plays again when it is visible
            if (!this.suspending) {
                this.running = false;
                this.suspended = false;
            }
            this.$emit('paused');
        },
        videoLoading() {
            this.videoReady = false;
            this.$emit('loading');
        },
        videoError(reason) {
            this.running = false;
            this.suspended = false;
            this.$emit('error', reason);
        },
        videoEnded() {
            this.running = false;
            this.$emit('ended');
        },
        // play(), pause() or stop() of the player
        videoIntent(intent) {
            this.choice = intent;
            this.choiceStays = false;
            if (intent === 'pause') {
                this.running = false;
                this.suspended = false;
                return;
            }
            if (!this.current.src) {
                // This source has only a poster
                this.player.resolveWaitingPlays();
                return;
            }
            this.running = true;
            this.heldBack = false;
            this.nearViewport = true;
        },
        togglePlayback() {
            if (!this.running) {
                this.startPlayback();
                return;
            }
            this.choice = 'pause';
            this.choiceStays = true;
            this.running = false;
            this.suspended = false;
            // This also cancels a play() that is still pending
            this.player.pauseVideo();
        },
        startPlayback() {
            this.choice = 'play';
            this.choiceStays = true;
            this.running = true;
            this.heldBack = false;
            this.nearViewport = true;
            if (this.videoReady) {
                this.player.startVideo();
            } else {
                // A failed video loads again. Otherwise, the ready event plays it
                this.player.reloadAfterFailure();
            }
        },
        suspend() {
            if (this.suspended || !this.running || !this.videoReady) return;
            this.suspending = true;
            this.player.pauseVideo();
            this.suspending = false;
            this.suspended = true;
        },
        resume() {
            if (!this.suspended) return;
            this.suspended = false;
            if (this.videoReady) this.player.startVideo();
        },
    },
};
/* eslint-enable no-underscore-dangle */
</script>

<style scoped>
	.vue-responsive-videobg{
		background: none;
		position: relative;
		width: 100%;
		overflow: hidden;
    }
    .vue-responsive-videobg .videobg-content{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

</style>

<!--
    Not scoped: button.videobg-pause-button beats CSS resets such as button {} or [type='button'] {}
    of Bootstrap and Tailwind, and your selector with two classes beats it.
-->
<style>
    button.videobg-pause-button{
        position: absolute;
        right: 16px;
        bottom: 16px;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        padding: 0;
        /* The transparent border shows in forced colors mode */
        border: 2px solid transparent;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.6);
        color: #fff;
        cursor: pointer;
    }
    /* White and black rings, so that the focus shows on light and dark videos */
    button.videobg-pause-button:focus-visible{
        outline: 2px solid #fff;
        outline-offset: 2px;
        box-shadow: 0 0 0 6px #000;
    }
    svg.videobg-pause-icon{
        width: 20px;
        height: 20px;
        fill: currentColor;
    }
</style>
