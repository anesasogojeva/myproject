/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        cream: {
          50: "#FEFDFB",
          100: "#FBF8F2",
          200: "#F5EFE4",
        },
      },
      boxShadow: {
        soft: "0 2px 10px rgba(23, 42, 33, 0.06)",
        card: "0 4px 20px rgba(23, 42, 33, 0.08)",
        elevated: "0 12px 32px rgba(23, 42, 33, 0.12)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};
