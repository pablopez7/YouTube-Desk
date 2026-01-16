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
                    base: '#0f0f0f',
                    surface: '#1e1e1e', // slightly lighter for browser chrome
                    text: '#f1f1f1',
                    accent: '#ff0000',
                }
            }
        },
    },
    plugins: [],
}
