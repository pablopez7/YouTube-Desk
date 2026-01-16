import { defineConfig } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { builtinModules } from 'node:module'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    root: __dirname,
    build: {
        outDir: 'dist-electron',
        emptyOutDir: true,
        lib: {
            entry: 'src/main/main.ts',
            formats: ['cjs'],
            fileName: () => 'main.js',
        },
        rollupOptions: {
            external: [
                'electron',
                'electron-store',
                ...builtinModules,
            ],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})
