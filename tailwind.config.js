/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#f1f1f1",
        grey: "#4a4a4a",
        lightgrey: "#a7a7a7",
        black: "#10100f",
        darkgrey: "#3a3a36",
        yellow: "#fcc041",
        orange: "#ff811b",
        red: "#EF2D56",
        green: "#4ed457",
        lightblue: "#51dadc",
        blue: "#2C497F",
        brown: "#6e3813",
        yellowTransparent: "rgb(255, 207, 74, 0.25)",
      },
      screens: {
        xs: "480px",
      },
      fontFamily: {
        pixel: ["PixelMix"],
      },
      fontSize: {
        "1.5xl": "1.35rem",
      },
      borderWidth: {
        3: "3px",
        6: "6px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
