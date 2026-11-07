/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // toggled via <html class="dark">, controlled by assets/js/theme.js
  content: [
    "./src/pages/**/*.{njk,md,html}",
    "./src/_includes/**/*.{njk,md,html}",
    "./src/assets/js/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Instrument Serif: display type, numerals, sign-off
        display: ['"Instrument Serif"', "Georgia", "serif"],
        // Inter: body copy and statements
        sans: ["Inter", "system-ui", "sans-serif"],
        // JetBrains Mono: labels, meta, data
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        // All values are CSS variables defined in main.css. They switch per
        // theme (.dark) and per contrast band (.band), so components never
        // hardcode a mode.
        bg: "var(--bg)",
        fg: "var(--fg)",
        muted: "var(--muted)",
        rule: "var(--rule)",
        accent: "var(--accent)",
        card: { bg: "var(--card-bg)", fg: "var(--card-fg)" },
        gold: "#c9a227",
        silver: "#a3a3b2",
        bronze: "#b0703c",
      },
      fontSize: {
        "display-xl": ["clamp(4rem, 13vw, 12rem)", { lineHeight: "0.9", letterSpacing: "-0.03em" }],
        display: ["clamp(3rem, 7vw, 6.5rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        "display-sm": ["clamp(2.25rem, 4.5vw, 4rem)", { lineHeight: "1", letterSpacing: "-0.015em" }],
        statement: ["clamp(1.75rem, 3.6vw, 3.25rem)", { lineHeight: "1.12", letterSpacing: "-0.02em" }],
        lede: ["clamp(1.125rem, 1.6vw, 1.375rem)", { lineHeight: "1.5", letterSpacing: "-0.01em" }],
        label: ["0.75rem", { lineHeight: "1", letterSpacing: "0.12em" }],
      },
      maxWidth: {
        frame: "1440px",
      },
    },
  },
  plugins: [],
};
