import component from './VideoBackground.vue';

export const Plugin = {
    install(Vue) {
        Vue.component('VideoBackground', component);
    },
};

export default component;
