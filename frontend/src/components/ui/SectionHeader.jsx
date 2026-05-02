function SectionHeader({ title, subtitle, badge }) {
  return (
    <div style={styles.header}>
      <div>
        <h2 style={styles.title}>{title}</h2>
        {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
      </div>

      {badge && <div>{badge}</div>}
    </div>
  )
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    color: "inherit",
  },
  subtitle: {
    color: "inherit",
    opacity: 0.7,
    marginTop: "6px",
  },
}

export default SectionHeader