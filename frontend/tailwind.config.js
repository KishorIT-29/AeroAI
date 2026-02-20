/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                aviation: {
                    dark: '#05070A',
                    blue: '#00f2ff',
                    cyan: '#00e5ff',
                    amber: '#ffaa00',
                    red: '#ff3333',
                }
            },
            fontFamily: {
                outfit: ['Outfit', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
