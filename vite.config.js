// https://www.raulmelo.dev/blog/build-javascript-library-with-multiple-entry-points-using-vite-3

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

const path = require('path');

const config = {
    // npm run build:dist for npm
    dist: {
        build: {
            outDir: './dist',
            lib: {
                entry: path.resolve(__dirname, './src/index.js'),
                name: 'VueResponsiveVideoBackgroundPlayer',
                fileName: 'vue-responsive-video-background-player',
            },
            rollupOptions: {
                external: ['vue'],
                output: {
                    // Provide global variables to use in the UMD build
                    // Add external deps here
                    globals: {
                        vue: 'Vue',
                    },
                    // in index.js we use a named + default export.
                    // We hide the error message with 'named'
                    exports: 'named',
                },
            },
        },
    },
    // npm run build:demo for the demo page
    demo: {
        build: {
            outDir: './demo/public/build',
            rollupOptions: {
                input: './demo/resources/js/app.js',
                output: {
                    chunkFileNames: 'js/[name].js',
                    entryFileNames: 'js/[name].js',
                },
            },
        },
    },
};

const currentConfig = config[process.env.LIB_NAME];

if (currentConfig === undefined) {
    throw new Error('LIB_NAME is not defined or is not valid');
}

// https://vitejs.dev/config/
export default defineConfig({
    ...currentConfig,
    plugins: [
        vue(),
        cssInjectedByJsPlugin(),
    ],
});
