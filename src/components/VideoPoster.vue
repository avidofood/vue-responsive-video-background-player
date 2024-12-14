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
        backgroundSize: {
            type: String,
            default: 'cover',
        },
        backgroundPosition: {
            type: String,
            default: 'center',
        },
    },
    computed: {
        image() {
            return {
                backgroundImage: `url(${this.poster})`,
                backgroundSize: this.backgroundSize,
                backgroundPosition: this.backgroundPosition,
            };
        },
    },
};
</script>

<style scoped>
    .video-buffering{
        width: 100%;
        overflow: hidden;
        height: 100%;
        top: 0;
        left: 0;
        position: absolute;
    }
</style>
