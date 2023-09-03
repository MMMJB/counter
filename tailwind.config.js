/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx}", "./*.html"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        brand: "#0096FF",
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
