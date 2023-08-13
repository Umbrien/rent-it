import { type Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    // statuses
    "border-green-500",
    "text-green-500",
    "text-green-600",
    "text-green-700",
    "bg-green-100",
    "bg-green-200",
    "bg-green-500",

    "border-red-500",
    "text-red-500",
    "text-red-600",
    "text-red-700",
    "bg-red-100",
    "bg-red-200",
    "bg-red-500",

    "border-gray-500",
    "text-gray-500",
    "text-gray-600",
    "text-gray-700",
    "bg-gray-100",
    "bg-gray-200",
    "bg-gray-500",

    // alerts
    "border-yellow-500",
    "text-yellow-500",
    "text-yellow-700",
    "bg-yellow-100",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.blue,
      },
      height: {
        navbar: "76px",
      },
    },
  },
  plugins: [],
} satisfies Config;
