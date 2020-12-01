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
                    :src="src"
                    :type="getMediaType(src)"
                >
            </video>
        </div>
    </transition>
</template>

<script>
import props from '../core/playerProps';

export default {
    props,
    data() {
        return {
            showVideo: false,
        };
    },
    computed: {
        styleObject() {
            if (!this.objectFit) {
                return {};
            }
            return {
                objectFit: this.objectFit,
            };
        },
    },
    watch: {
        src() {
            this.load();
        },
    },
    methods: {
        pause() {
            if (this.$refs.video) {
                this.$refs.video.pause();
            }
        },
        load() {
            this.hide();
            // ugly, but we want to give hide 1 sec pause until we load the next video
            setTimeout(() => {
                this.$refs.video.load();
                this.$emit('loading');
            }, 1000);
        },
        play() {
            this.setPlaybackRate();
            this.$refs.video.play();
            this.show();
            this.$emit('playing');
        },
        show() {
            this.showVideo = true;
        },
        hide() {
            this.showVideo = false;
        },
        getMediaType(src) {
            return `video/${src.split('.').pop().split(/[?#]/)[0]}`;
        },
        videoCanPlay() {
            return !!this.$refs.video.canPlayType;
        },
        videoReady() {
            // Unfortunately we have the iOS bug, that we need to set autoplay always to true.
            // That means we need to first pause the video,
            // and later check if we want to autoplay or not
            this.pause();
            this.$emit('ready');
        },
        videoError() {
            this.$emit('error');
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

    .fade-enter{
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
