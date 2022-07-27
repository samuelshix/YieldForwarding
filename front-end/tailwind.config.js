/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx", "./src/**/**/*.tsx"],
  theme: {
    screens: {
      mob: "375px",
      tablet: "768px",
      laptop: "1024px",
      laptopl: "1440px",
      desktop: "1280px",
    },
    extend: {},
  },
  plugins: [],
}
