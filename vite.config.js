import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import fs from 'node:fs';
import path from 'node:path';
// Writes public/version.json on every build so the deployed app can detect updates
const buildVersionPlugin = {
    name: 'build-version',
    buildStart() {
        const versionFile = path.resolve(__dirname, 'public/version.json');
        fs.writeFileSync(versionFile, JSON.stringify({ buildTime: new Date().toISOString() }));
    },
};
export default defineConfig({
    plugins: [vue(), buildVersionPlugin],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use "@/styles/index.scss" as *;`,
            },
        },
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    build: {
        target: 'esnext',
    },
    server: {
        allowedHosts: [
            'testing-storybrand-frontend.bakano.ec'
        ]
    }
});
