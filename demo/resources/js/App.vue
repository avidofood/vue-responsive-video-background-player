<template>
    <video-background
        class="video-container"
        src="/demo/public/videos/roadster-loop-imperial.mp4"
        overlay="linear-gradient(0deg, rgba(0, 0, 0, 0.88), rgba(251, 148, 158, 0.22), rgba(251, 148, 158, 0.42))"
        :sources="[
            {src: '/demo/public/videos/accessories-hero-desktop.mp4', res: 991, autoplay: true},
            {src: '/demo/public/videos/power-hero-mobile.mp4', res: 575, autoplay: true, poster: '/demo/public/images/hero-mobile@2.jpg'}
        ]"
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
</template>

<script setup>
import VideoBackground from '../../../src/index';
</script>
