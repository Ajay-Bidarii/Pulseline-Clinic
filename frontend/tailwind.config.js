/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        clinic: {
          950: "#0B231F",
          900: "#0F332C",
          800: "#124238",
          700: "#155245",
          600: "#146356",
          500: "#1B7A69",
          400: "#3D9C89",
          300: "#7CBEAD",
          200: "#B7DBCF",
          100: "#DEEEE6",
          50: "#F1F8F4",
        },
        coral: {
          600: "#D65A3F",
          500: "#E8674A",
          400: "#EF8468",
          100: "#FBE3DA",
        },
        amber: {
          600: "#B7791F",
          500: "#D69A2D",
          100: "#FBEACB",
        },
        ink: {
          900: "#15211D",
          700: "#33433D",
          500: "#5B6D66",
          300: "#93A29C",
          100: "#D9E2DE",
        },
        surface: {
          DEFAULT: "#F6F8F6",
          raised: "#FFFFFF",
          sunken: "#EEF3F0",
        },
      },
      fontFamily: {
        display: ["Lexend", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 51, 44, 0.06), 0 4px 16px rgba(15, 51, 44, 0.05)",
        pop: "0 8px 30px rgba(15, 51, 44, 0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        pulseLine: {
          "0%": { strokeDashoffset: "240" },
          "100%": { strokeDashoffset: "0" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pulseLine: "pulseLine 1.8s ease-in-out infinite",
        fadeUp: "fadeUp 0.35s ease-out both",
      },
    },
  },
  plugins: [],
};
