function StatusBadge({ children, color, theme }) {
  return (
    <div
      style={{
        ...styles.badge,
        color,
        borderColor: color,
        backgroundColor: `${color}22`,
        boxShadow: theme?.shadow,
      }}
    >
      {children}
    </div>
  )
}

const styles = {
  badge: {
    border: "1px solid",
    borderRadius: "999px",
    padding: "8px 14px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },
}

export default StatusBadge