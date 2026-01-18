import { defineConfig } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    root: 'src/renderer', // App root for renderer
    base: './',
    build: {
        outDir: '../../dist', // Output to project-root/dist
        emptyOutDir: true,
    },
    plugins: [
        react(),
        electron({
            main: {
                // Use absolute path to avoid issues with root directory
                entry: path.join(__dirname, 'src/main/main.ts'),
            },
            preload: {
                input: path.join(__dirname, 'src/preload/preload.ts'),
            },
            renderer: {},
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})
