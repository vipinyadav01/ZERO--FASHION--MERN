/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            colors: {
                brand: {
                    bg: '#FFFFFF',
                    surface: '#F5F5F0',
                    text: {
                        primary: '#1A1A1A',
                        secondary: '#6B6B6B',
                    },
                    border: '#E5E5E0',
                    accent: '#1A1A1A',
                },
            },
        },
    },
    plugins: [],
};
