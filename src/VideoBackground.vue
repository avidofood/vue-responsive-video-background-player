<template>
    <section
        class="vue-responsive-videobg"
        ref="vidbg"
    >
        <video-poster
            v-if="current.poster || poster"
            :poster="current.poster || poster"
        />

        <video-player
            ref="player"
            :src="current.src"
            :muted="muted"
            :loop="loop"
            :preload="preload"
            :plays-when="playsWhen"
            :playback-rate="playbackRate"
            :transition="transition"
            :object-fit="objectFit"
            @ready="playVideo"
            @playing="$emit('playing')"
            @error="$emit('error')"
            @loading="$emit('loading')"
            @ended="$emit('ended')"
        />

        <video-overlay
            v-if="overlay"
            :overlay="overlay"
        />

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

export default {
    props,
    mixins: [resize],
    components: {
        VideoPlayer,
        VideoPoster,
        VideoOverlay,
    },
    computed: {
        player() {
            return this.$refs.player;
        },
    },
    methods: {
        playVideo() {
            this.$emit('ready');
            if (!this.current.autoplay) return;
            this.player.play();
        },
    },
};
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
