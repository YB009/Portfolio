/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
    container: { center: true, padding: { DEFAULT: "1rem", lg: "2rem" } },
    extend: {
    fontFamily: {
    sans: ["Inter", "system-ui", "sans-serif"],
    display: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
    },
    colors: {
    primary: {
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    500: "#6366f1",
    600: "#5458ea",
    700: "#4f46e5",
    },
    },
    backgroundImage: {
    'radial-fade':
    'radial-gradient(1200px 600px at 50% -100px, rgba(99,102,241,0.25), transparent 60%)',
    'glass': 'linear-gradient(to bottom right, rgba(255,255,255,0.06), rgba(255,255,255,0.03))',
    },
    boxShadow: {
    glow: "0 0 120px 20px rgba(99,102,241,.12)",
    },
    keyframes: {
    floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)'} },
    shimmer: { '0%': { backgroundPosition: '0% 0%' }, '100%': { backgroundPosition: '200% 0%'} },
    },
    animation: {
    floaty: 'floaty 6s ease-in-out infinite',
    shimmer: 'shimmer 6s linear infinite',
    },
    },
    },
    plugins: [],
    };