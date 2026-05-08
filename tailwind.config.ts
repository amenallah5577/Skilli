import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#122032",
        mist: "#f5f7f8",
        emerald: {
          50: "#ecfdf4",
          100: "#d1fae0",
          600: "#039f6d",
          700: "#047857",
          900: "#064e3b"
        },
        saffron: {
          100: "#fff3d6",
          500: "#f59e0b",
          600: "#d97706"
        },
        skyline: {
          100: "#e0f2fe",
          500: "#0ea5e9",
          700: "#0369a1"
        },
        coral: "#ef6f5e"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(18, 32, 50, 0.08)",
        night: "0 18px 70px rgba(0, 0, 0, 0.35)"
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-cormorant)", "Georgia", "serif"]
      }
    }
  },
  plugins: [forms]
} satisfies Config;

export default config;
