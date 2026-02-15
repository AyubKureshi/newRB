/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      keyframes: {
        'bounce-in': {
          '0%': { transform: 'translate(-50%, -100%)', opacity: '0' },
          '100%': { transform: 'translate(-50%, 0)', opacity: '1' },
        }
      },
      animation: {
        'bounce-in': 'bounce-in 0.5s ease-out forwards',
      }
    }
  },
  plugins: [],
}

