function ServiceRow({ label, status, color, theme }) {
  return (
    <div
      style={{
        ...styles.row,
        borderBottom: `1px solid ${theme.border}`,
        color: theme.text,
      }}
    >
      <span>{label}</span>
      <strong style={{ color }}>{status}</strong>
    </div>
  )
}

const styles = {
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
  },
}

export default ServiceRow