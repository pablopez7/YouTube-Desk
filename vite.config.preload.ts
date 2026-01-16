import { defineConfig } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { builtinModules } from 'node:module'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    root: __dirname,
    build: {
        outDir: 'dist-electron',
        emptyOutDir: false, // Don't wipe main.js
        lib: {
            entry: 'src/preload/preload.ts',
            formats: ['cjs'],
            fileName: () => 'preload.js',
        },
        rollupOptions: {
            external: [
                'electron',
                ...builtinModules,
            ],
        },
    },
})
