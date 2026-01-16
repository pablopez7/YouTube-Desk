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
                // Entry is relative to the project root (where vite.config.ts is)
                entry: 'src/main/main.ts',
            },
            preload: {
                input: path.join(__dirname, 'src/preload/preload.ts'),
            },
            renderer: {}, // Re-enable renderer integration if needed, or leave empty/remove
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})
