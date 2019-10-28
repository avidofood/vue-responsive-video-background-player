import component from './VideoBackground';

export const Plugin = {
    install(Vue) {
        Vue.component('video-background', component);
    },
};

export default component;
