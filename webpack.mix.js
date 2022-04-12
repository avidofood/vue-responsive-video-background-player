const mix = require('laravel-mix');

/**
 * Somehow I cannot use Laravel mix to create the dist folder. So I'm just using it for the demo.
 * This here is just for the demo
 */
mix.js('demo/resources/js/app.js', 'demo/public/js')
    .vue();
