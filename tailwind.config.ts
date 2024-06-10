import { type Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    colors: {
      primary: "#66D7D1",
    },
    extend: {
      fontFamily: {
        peyda: ["Peyda", "cursive"],
      },
    },
  },
  darkMode: "class",
  plugins: [],
} satisfies Config;
