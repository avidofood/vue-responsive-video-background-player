// The lazy prop starts loading this far before the section reaches the viewport
const lazyMargin = '200px 0px';

/* eslint-disable no-underscore-dangle */
export default {
    data() {
        return {
            // lazy: the video loads when the section comes near the viewport
            nearViewport: !this.lazy,
            // pauseWhenHidden: the section is on the screen, and the page is in the foreground
            onScreen: true,
            pageVisible: true,
        };
    },
    computed: {
        visible() {
            return this.onScreen && this.pageVisible;
        },
    },
    watch: {
        nearViewport(near) {
            if (near) this._stopLazyObserver();
        },
        pauseWhenHidden(on) {
            if (on) {
                this._observeVisibility();
            } else {
                this._stopVisibilityObserver();
            }
        },
    },
    methods: {
        _observeLazy() {
            if (typeof IntersectionObserver === 'undefined') {
                this.nearViewport = true;
                return;
            }
            this._lazyObserver = new IntersectionObserver((entries) => {
                if (entries.some((entry) => entry.isIntersecting)) this.nearViewport = true;
            }, { rootMargin: lazyMargin });
            this._lazyObserver.observe(this.$refs.vidbg);
        },
        _stopLazyObserver() {
            if (!this._lazyObserver) return;
            this._lazyObserver.disconnect();
            this._lazyObserver = null;
        },
        _observeVisibility() {
            if (this._watchesVisibility) return;
            this._watchesVisibility = true;
            if (typeof IntersectionObserver !== 'undefined') {
                this._visibilityObserver = new IntersectionObserver((entries) => {
                    // The last entry is the newest one
                    this.onScreen = entries[entries.length - 1].isIntersecting;
                });
                this._visibilityObserver.observe(this.$refs.vidbg);
            }
            this._pageVisibilityHandler = () => {
                this.pageVisible = document.visibilityState !== 'hidden';
            };
            this._pageVisibilityHandler();
            document.addEventListener('visibilitychange', this._pageVisibilityHandler);
        },
        _stopVisibilityObserver() {
            if (!this._watchesVisibility) return;
            this._watchesVisibility = false;
            if (this._visibilityObserver) {
                this._visibilityObserver.disconnect();
                this._visibilityObserver = null;
            }
            document.removeEventListener('visibilitychange', this._pageVisibilityHandler);
            this.onScreen = true;
            this.pageVisible = true;
        },
    },
    mounted() {
        if (!this.nearViewport) this._observeLazy();
        if (this.pauseWhenHidden) this._observeVisibility();
    },
    beforeUnmount() {
        this._stopLazyObserver();
        this._stopVisibilityObserver();
    },
};
/* eslint-enable no-underscore-dangle */
