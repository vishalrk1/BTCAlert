/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
      },
      colors: {
        alert: {
          active: "#4BB543",
          canceled: "#ff4545",
          triggered: "#3498db",
        },
        primary: "#DC2626",
        primaryLight: "#ee3e3e",
      },
    },
  },
  plugins: [],
};
