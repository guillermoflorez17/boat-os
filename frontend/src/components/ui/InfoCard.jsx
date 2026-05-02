function InfoCard({ label, value, description, theme, tabletMode }) {
  return (
    <div
      style={{
        ...styles.card,
        backgroundColor: theme.card,
        border: `1px solid ${theme.border}`,
        boxShadow: theme.shadow,
        padding: tabletMode ? "22px" : "18px",
        minHeight: tabletMode ? "120px" : "105px",
      }}
    >
      <span style={{ ...styles.label, color: theme.textMuted }}>{label}</span>
      <strong style={{ ...styles.value, color: theme.text }}>{value}</strong>
      {description && (
        <p style={{ ...styles.description, color: theme.textMuted }}>
          {description}
        </p>
      )}
    </div>
  )
}

const styles = {
  card: {
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "13px",
  },
  value: {
    fontSize: "18px",
  },
  description: {
    margin: 0,
  },
}

export default InfoCard