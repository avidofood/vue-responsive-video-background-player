const query = '(prefers-reduced-motion: reduce)';

/* eslint-disable no-underscore-dangle */
export default {
    data() {
        return {
            // The user asked the system for less motion
            prefersReducedMotion: false,
        };
    },
    computed: {
        // respectReducedMotion: only the poster shows, until the user starts the video
        posterOnly() {
            return this.respectReducedMotion && this.prefersReducedMotion;
        },
    },
    methods: {
        _readReducedMotion() {
            if (typeof window.matchMedia !== 'function') return;
            this._motionQuery = window.matchMedia(query);
            this.prefersReducedMotion = this._motionQuery.matches;
            this._motionHandler = (event) => {
                this.prefersReducedMotion = event.matches;
            };
            // Safari before 14 knows only addListener
            if (this._motionQuery.addEventListener) {
                this._motionQuery.addEventListener('change', this._motionHandler);
            } else {
                this._motionQuery.addListener(this._motionHandler);
            }
        },
    },
    beforeUnmount() {
        if (!this._motionQuery) return;
        if (this._motionQuery.removeEventListener) {
            this._motionQuery.removeEventListener('change', this._motionHandler);
        } else {
            this._motionQuery.removeListener(this._motionHandler);
        }
    },
};
/* eslint-enable no-underscore-dangle */
