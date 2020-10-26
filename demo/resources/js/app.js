import { createApp } from 'vue';
import VideoBackground from '../../../src/index';

const app = createApp({});

app.component('VideoBackground', VideoBackground);

app.mount('#app');
