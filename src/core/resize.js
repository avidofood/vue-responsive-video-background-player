import throttle from '../lib/throttle';

/* eslint-disable no-underscore-dangle */
export default {
    data() {
        return {
            width: 0,
            // The server does not know the window width. It is known after the first measurement
            measured: false,
        };
    },
    computed: {
        current() {
            if (this.sources.length === 0) {
                return this.default;
            }

            // sort() changes the array in place, and the array belongs to the parent
            const current = [...this.sources].sort((a, b) => a.res - b.res)
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
        _change_video_resolution() {
            this.width = this._innerWidth();
            this.measured = true;
        },
        _innerWidth() {
            return window.innerWidth && document.documentElement.clientWidth
                ? Math.min(window.innerWidth, document.documentElement.clientWidth)
                : window.innerWidth
                || document.documentElement.clientWidth
                || document.getElementsByTagName('body')[0].clientWidth;
        },

    },
    beforeMount() {
        // While Vue hydrates server-rendered HTML, the vnode already holds the element from the
        // server, also in a container outside the document. Vue uses the same check. The first
        // render must then match the server, so the measurement waits until mounted.
        // ($el is no help here: in dev builds it is null.)
        if (!this.$.vnode.el) {
            this._change_video_resolution();
        }
    },
    mounted() {
        if (!this.measured) {
            this._change_video_resolution();
        }
        // removeEventListener needs the same function that addEventListener got
        this._resizeHandler = throttle(this._change_video_resolution, 250);
        window.addEventListener('resize', this._resizeHandler);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this._resizeHandler);
    },
};
/* eslint-enable no-underscore-dangle */
