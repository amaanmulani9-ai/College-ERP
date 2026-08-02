import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./frontend/src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
} satisfies Config;
