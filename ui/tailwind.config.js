/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"
export default {
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        toadnado: {
          "primary": "#84cc16",
          "secondary": "#f6d860",
          "accent": "#bafbc3",
          "neutral": "#3d4451",
          "base-100": "#141f18",
        },
      },
      "dark"
    ],
  },
}

