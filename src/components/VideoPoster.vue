<template>
    <div
        class="video-buffering"
        :style="image"
    />
</template>

<script>
export default {
    props: {
        poster: {
            type: String,
            required: true,
        },
    },
    computed: {
        image() {
            return {
                backgroundImage: `url(${this.poster})`,
            };
        },
    },
};
</script>

<style scoped>
    .video-buffering{
        width: 100%;
        overflow: hidden;
        background-size: cover;
        background-position: center;
        height: 100%;
        top: 0;
        left: 0;
        position: absolute;
    }
</style>
