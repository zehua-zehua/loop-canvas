import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      colors: {
        canvas: "#f7f8fb",
        ink: "#111827",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(15, 23, 42, 0.06)",
      },
    },
  },
  plugins: [],
} satisfies Config;
