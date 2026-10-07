<!-- eslint-disable max-len -->
<template>
    <video-background
        class="video-container"
        src="demo/public/videos/roadster-loop-imperial.mp4"
        poster="demo/public/images/roadster-poster.jpg"
        overlay="linear-gradient(0deg, rgba(0, 0, 0, 0.88), rgba(251, 148, 158, 0.22), rgba(251, 148, 158, 0.42))"
        :sources="[
            {src: 'demo/public/videos/accessories-hero-desktop.mp4', res: 991, autoplay: true, poster: 'demo/public/images/accessories-poster.jpg'},
            {src: 'demo/public/videos/power-hero-mobile.mp4', res: 575, autoplay: true, poster: 'demo/public/images/hero-mobile@2.jpg'}
        ]"
        pause-button
        respect-reduced-motion
        pause-when-hidden
        keep-larger-source
    >
        <div class="d-flex justify-content-center align-items-center h-50 px-2">
            <h4
                class="text-white text-center d-md-none"
                style="font-weight: 600;"
            >
                Vue Responsive Background Player
            </h4>
            <h1
                class="text-white d-none d-md-block"
                style="font-weight: 600;"
            >
                Vue Responsive Background Player
            </h1>
        </div>
    </video-background>

    <section class="container text-center mt-3">
        <h6 class="text-light">
            Vue.js component
        </h6>
        <a
            class="btn btn-danger"
            href="https://github.com/avidofood/vue-responsive-video-background-player"
            role="button"
        >Source on GitHub</a>

        <div class="social mt-4">
            <a
                href="https://twitter.com/share?ref_src=twsrc%5Etfw"
                class="twitter-share-button"
                data-show-count="false"
            >Tweet</a>
            <a
                class="github-button"
                href="https://github.com/avidofood/vue-responsive-video-background-player"
                data-show-count="true"
                aria-label="Star avidofood/vue-responsive-video-background-player on GitHub"
            >Star</a>
        </div>
    </section>

    <section class="container mt-5">
        <div class="row">
            <div class="col-12 col-md-6">
                <h4
                    class="text-white d-md-none"
                    style="font-weight: 600;"
                >
                    Designed for Vue 2 & 3
                </h4>
                <h2
                    class="text-white d-none d-md-block"
                    style="font-weight: 600; "
                >
                    Designed for Vue 2 & 3
                </h2>
            </div>
            <div class="col-12 col-md-6">
                <p class="text-white">
                    You can even change the video resolution with different breakpoints. Try it out, resize your window!
                </p>
            </div>
        </div>
    </section>

    <section class="container mt-5">
        <h2
            class="text-white"
            style="font-weight: 600;"
        >
            New in 2.6
        </h2>
        <ul class="text-white">
            <li>The button in the corner pauses and plays the video (WCAG 2.2.2).</li>
            <li>With "reduce motion" in your system settings, the video above shows only its poster.</li>
            <li>The videos pause when you scroll away or switch the tab.</li>
            <li>A smaller window keeps the larger video that already loaded.</li>
            <li>The video below loads only when you scroll to it, and it is an HLS stream that plays with hls.js.</li>
        </ul>
    </section>

    <video-background
        class="video-container mt-5"
        src="demo/public/videos/hls/accessories.m3u8"
        poster="demo/public/images/accessories-poster.jpg"
        overlay="linear-gradient(0deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.2))"
        :hls="Hls"
        pause-button
        respect-reduced-motion
        pause-when-hidden
        lazy
        @ready="log('ready')"
        @playing="log('playing')"
        @paused="log('paused')"
        @loading="log('loading')"
        @error="log('error')"
    >
        <div class="d-flex flex-column justify-content-center align-items-center h-100 px-2 text-center">
            <h2
                class="text-white"
                style="font-weight: 600;"
            >
                HLS with hls.js, loaded lazily
            </h2>
            <p class="text-white mb-0">
                Events: {{ events.join(', ') || 'none yet' }}
            </p>
        </div>
    </video-background>

    <div style="height: 50vh;" />
</template>

<script setup>
import { onMounted, ref, shallowRef } from 'vue';
import VideoBackground from '../../../src/index';

// The demo loads hls.js from a CDN only for the second video. The package does not include it
const hlsUrl = 'https://cdn.jsdelivr.net/npm/hls.js@1.7.3/dist/hls.light.mjs';
const Hls = shallowRef(null);
const events = ref([]);

const log = (event) => {
    events.value = [...events.value, event].slice(-5);
};

onMounted(async () => {
    const module = await import(/* @vite-ignore */ hlsUrl);
    Hls.value = module.default;
});
</script>
