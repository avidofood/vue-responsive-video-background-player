import component from './VideoBackground.vue';

export const Plugin = {
    install(app) {
        app.component('VideoBackground', component);
    },
};

export default component;
