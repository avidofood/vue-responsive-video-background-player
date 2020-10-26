const mix = require('laravel-mix');

/**
 * Somehow I cannot use Laravel mix to create the dist folder. So I'm just using it for the demo.
 * This here is just for the demo
 */

// https://github.com/KABBOUCHI/laravel-mix-vue3
require('laravel-mix-vue3');

mix.vue3('demo/resources/js/app.js', 'demo/public/js/app.js');

// Fixes bug! You can remove it when laravel-mix 6 is coming out
mix.webpackConfig({
    resolve: {
        alias: {
            vue: 'vue/dist/vue.esm-bundler.js', // or 'vue' : '...'
        },
    },
});
