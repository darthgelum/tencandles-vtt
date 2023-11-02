/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#f1f1f1",
        grey: "#595959",
        black: "#10100f",
        darkgrey: "#3a3a36",
        yellow: "rgb(255, 207, 74)",
        red: "#ff5644",
        green: "#58e955",
        blue: "#4ddbff",
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
  plugins: [],
}
