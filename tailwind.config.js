/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx}", "./*.html"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        brand: "rgb(100, 150, 255)",
        "brand-dark": "rgb(125, 150, 255)",
        border: "#DADCE0",
        text: {
          light: "#5F6366",
          dark: "#404040",
        },
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
    },
    fontFamily: {
      serif: ["Open Sans", "sans-serif"],
    },
  },
  plugins: [],
};
