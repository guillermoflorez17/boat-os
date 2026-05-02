function Pilot({ theme, tabletMode }) {
  const styles = getStyles(theme, tabletMode)

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Piloto automático</h2>
          <p style={styles.subtitle}>Control futuro del piloto desde Boat OS</p>
        </div>

        <div style={styles.badge}>
          Bloqueado
        </div>
      </div>

      <div style={styles.mainPanel}>
        <div style={styles.compassCard}>
          <div style={styles.compass}>
            <span style={styles.north}>N</span>
            <span style={styles.east}>E</span>
            <span style={styles.south}>S</span>
            <span style={styles.west}>W</span>

            <div style={styles.headingNeedle}>▲</div>
          </div>

          <div style={styles.headingInfo}>
            <span>Rumbo actual</span>
            <strong>86°</strong>
          </div>
        </div>

        <div style={styles.infoPanel}>
          <h3 style={styles.panelTitle}>Estado</h3>

          <p style={styles.description}>
            El control del piloto automático no se activará hasta tener hardware real,
            pruebas seguras y confirmación manual.
          </p>

          <div style={styles.serviceRow}>
            <span>Piloto automático</span>
            <strong style={{ color: theme.warning }}>NO CONECTADO</strong>
          </div>

          <div style={styles.serviceRow}>
            <span>Control remoto</span>
            <strong style={{ color: theme.danger }}>DESACTIVADO</strong>
          </div>

          <div style={styles.serviceRow}>
            <span>Modo seguridad</span>
            <strong style={{ color: theme.success }}>ACTIVO</strong>
          </div>
        </div>
      </div>

      <div style={styles.warningPanel}>
        <strong>Decisión de seguridad</strong>
        <p>
          Boat OS no enviará órdenes al piloto hasta implementar autorización,
          confirmación visual, parada rápida y pruebas con hardware real.
        </p>
      </div>
    </div>
  )
}

function getStyles(theme, tabletMode) {
  return {
    container: {
      display: "flex",
      flexDirection: "column",
      gap: "22px",
      textAlign: "left",
      color: theme.text,
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "20px",
    },
    title: {
      margin: 0,
      fontSize: tabletMode ? "30px" : "26px",
      color: theme.text,
    },
    subtitle: {
      color: theme.textMuted,
      marginTop: "6px",
    },
    badge: {
      color: theme.danger,
      border: `1px solid ${theme.danger}`,
      backgroundColor: "rgba(255, 107, 107, 0.14)",
      borderRadius: "999px",
      padding: "8px 14px",
      fontWeight: "bold",
      boxShadow: theme.shadow,
    },
    mainPanel: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "18px",
    },
    compassCard: {
      backgroundColor: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: "18px",
      padding: "24px",
      boxShadow: theme.shadow,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "18px",
    },
    compass: {
      position: "relative",
      width: tabletMode ? "260px" : "220px",
      height: tabletMode ? "260px" : "220px",
      borderRadius: "50%",
      border: `2px solid ${theme.border}`,
      backgroundColor: theme.cardAlt,
    },
    headingNeedle: {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%) rotate(86deg)",
      color: theme.accent,
      fontSize: "42px",
    },
    north: {
      position: "absolute",
      top: "12px",
      left: "50%",
      transform: "translateX(-50%)",
      color: theme.text,
      fontWeight: "bold",
    },
    east: {
      position: "absolute",
      right: "14px",
      top: "50%",
      transform: "translateY(-50%)",
      color: theme.textMuted,
      fontWeight: "bold",
    },
    south: {
      position: "absolute",
      bottom: "12px",
      left: "50%",
      transform: "translateX(-50%)",
      color: theme.textMuted,
      fontWeight: "bold",
    },
    west: {
      position: "absolute",
      left: "14px",
      top: "50%",
      transform: "translateY(-50%)",
      color: theme.textMuted,
      fontWeight: "bold",
    },
    headingInfo: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "6px",
      color: theme.textMuted,
    },
    infoPanel: {
      backgroundColor: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: "18px",
      padding: "20px",
      boxShadow: theme.shadow,
    },
    panelTitle: {
      marginTop: 0,
      color: theme.text,
    },
    description: {
      color: theme.textMuted,
      marginTop: "10px",
    },
    serviceRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 0",
      borderBottom: `1px solid ${theme.border}`,
      color: theme.text,
    },
    warningPanel: {
      backgroundColor: theme.card,
      border: `1px solid ${theme.warning}`,
      borderRadius: "16px",
      padding: "18px",
      color: theme.text,
      boxShadow: theme.shadow,
    },
  }
}

export default Pilot