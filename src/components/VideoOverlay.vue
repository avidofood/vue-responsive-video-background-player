<template>
    <div
        class="video-overlay"
        :style="{background: overlay}"
    />
</template>

<script>
export default {
    props: {
        overlay: {
            type: String,
            required: true,
        },
    },
};
</script>

<style scoped>
    .video-overlay{
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        position: absolute;
    }
</style>
