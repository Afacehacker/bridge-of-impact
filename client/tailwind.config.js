/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#064e3b', // Deep Green
                    light: '#065f46',
                    dark: '#022c22',
                },
                accent: {
                    DEFAULT: '#fbbf24', // Gold
                    light: '#fcd34d',
                    dark: '#b45309',
                },
                secondary: {
                    DEFAULT: '#f8fafc', // Soft neutral background
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    plugins: [],
}
