const mix = require('laravel-mix');

/**
 * Currently, I don't how to create the dist folder, because it just does not work...
 * All users using this package are going to use the uncompiled src folder.
 * This here is just for the demo
 */
mix.js('demo/resources/js/app.js', 'demo/public/js/app.js');
