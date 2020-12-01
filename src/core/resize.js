import throttle from '../lib/throttle';

export default {
    data() {
        return {
            width: 0,
        };
    },
    computed: {
        current() {
            if (this.sources.length === 0) {
                return this.default;
            }

            const current = this.sources.sort((a, b) => a.res - b.res)
                .filter((source) => source.res >= this.width);

            if (current.length === 0) {
                return this.default;
            }

            return current[0];
        },
        default() {
            return {
                src: this.src,
                poster: this.poster,
                autoplay: this.autoplay,
            };
        },

    },
    methods: {
        $_change_video_resolution() {
            this.width = this.$_innerWidth();
        },
        $_innerWidth() {
            return window.innerWidth && document.documentElement.clientWidth
                ? Math.min(window.innerWidth, document.documentElement.clientWidth)
                : window.innerWidth
                || document.documentElement.clientWidth
                || document.getElementsByTagName('body')[0].clientWidth;
        },

    },
    beforeMount() {
        this.$_change_video_resolution();
    },
    mounted() {
        window.addEventListener('resize', throttle(this.$_change_video_resolution, 250));
    },
    beforeDestroy() {
        window.removeEventListener('resize', throttle(this.$_change_video_resolution, 250));
    },
};
