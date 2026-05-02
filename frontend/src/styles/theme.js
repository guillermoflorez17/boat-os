export const themes = {
  night: {
    mode: "night",
    background: "#071722",
    surface: "#0d2433",
    panel: "#123247",
    card: "#081825",
    cardAlt: "#0c2232",
    border: "#214b63",
    text: "#f3f7fa",
    textMuted: "#9fb8c9",
    accent: "#55b7ff",
    success: "#42c97d",
    warning: "#f0b44c",
    danger: "#ff6b6b",
    shadow: "0 10px 24px rgba(0, 0, 0, 0.28)",
  },

  day: {
    mode: "day",
    background: "#dfe8ee",
    surface: "#eef4f7",
    panel: "#f8fbfd",
    card: "#ffffff",
    cardAlt: "#edf4f8",
    border: "#b7c9d5",
    text: "#102230",
    textMuted: "#5f7687",
    accent: "#1f6fae",
    success: "#2f9d63",
    warning: "#b97a13",
    danger: "#c44949",
    shadow: "0 10px 24px rgba(16, 34, 48, 0.10)",
  },
}

export function getLauncherButtonStyle(theme, tabletMode) {
  return {
    height: tabletMode ? "125px" : "105px",
    fontSize: tabletMode ? "18px" : "16px",
    borderRadius: "18px",
    border: `1px solid ${theme.border}`,
    cursor: "pointer",
    backgroundColor: theme.panel,
    color: theme.text,
    fontWeight: "bold",
    boxShadow: theme.shadow,
  }
}