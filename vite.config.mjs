import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

const fromRoot = (file) => fileURLToPath(new URL(file, import.meta.url));

const builds = {
    // npm run build:dist for npm
    dist: {
        outDir: './dist',
        // Vue 3 needs ES2016 and Proxy. ES2019 works in every browser that Vue supports
        target: 'es2019',
        lib: {
            entry: fromRoot('./src/index.js'),
            name: 'VueResponsiveVideoBackgroundPlayer',
            fileName: 'vue-responsive-video-background-player',
            formats: ['es', 'umd'],
        },
        rolldownOptions: {
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
    // npm run build:demo for the demo page
    demo: {
        outDir: './demo/public/build',
        rolldownOptions: {
            input: fromRoot('./demo/resources/js/app.js'),
            output: {
                chunkFileNames: 'js/[name].js',
                entryFileNames: 'js/[name].js',
            },
        },
    },
};

// Copies the hand-written types next to the build. Without "type": "module" in package.json,
// TypeScript reads a .d.ts file as CommonJS and a .d.mts file as ESM, so we ship both.
const types = () => ({
    name: 'types',
    generateBundle({ format }) {
        if (format !== 'es') return;
        const source = readFileSync(fromRoot('./src/index.d.ts'), 'utf8');
        this.emitFile({ type: 'asset', fileName: 'index.d.ts', source });
        this.emitFile({ type: 'asset', fileName: 'index.d.mts', source });
    },
});

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
    if (command === 'build' && builds[mode] === undefined) {
        throw new Error('Unknown build mode. Use npm run build:dist or npm run build:demo');
    }

    return {
        build: builds[mode],
        plugins: [
            vue(),
            cssInjectedByJsPlugin(),
            mode === 'dist' && types(),
        ],
        test: {
            environment: 'jsdom',
            include: ['tests/**/*.test.js'],
            setupFiles: ['tests/setup.js'],
        },
    };
});
