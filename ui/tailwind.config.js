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
        toadnadoL1: {
          "primary": "#3b82f6",  
          "secondary": "#60a5fa",  
          "accent": "#93c5fd",  
          "neutral": "#1e3a8a", 
          "base-100": "#1e293b"  
        },
        toadnadoL2: {
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

