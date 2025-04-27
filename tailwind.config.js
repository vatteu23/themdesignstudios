/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colors from the image
        'primary': '#f2ece2', // Beige/cream background
        'secondary': '#9a8f80', // Muted gray-brown from the numbered cards
        'text-dark': '#292524', // Dark text color
        'text-light': '#f5f5f5', // Light text color
        'card-bg': '#d1cbc3', // Light gray card background
        'customBrown': '#523D35',
      },
      fontFamily: {
        'sans': ['var(--font-ibm-plex-sans)', 'sans-serif'],
        'mono': ['var(--font-ibm-plex-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
} 