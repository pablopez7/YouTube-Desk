/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/renderer/index.html",
        "./src/renderer/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                youtube: {
                    // Dark theme
                    base: '#0f0f0f',
                    surface: '#1e1e1e',
                    text: '#f1f1f1',
                    accent: '#ff0000',
                    // Light theme
                    'light-base': '#ffffff',
                    'light-surface': '#f1f1f1',
                    'light-text': '#0f0f0f',
                }
            }
        },
    },
    plugins: [],
}

