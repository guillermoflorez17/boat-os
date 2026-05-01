function getAlertColor(level) {
  if (level === "critical") return "#ff4d4d"
  if (level === "warning") return "#ffb300"
  return "#4caf50"
}

function getAlertLabel(level) {
  if (level === "critical") return "CRÍTICA"
  if (level === "warning") return "AVISO"
  return "INFO"
}

function Alerts({ data, loading, error }) {
  if (loading) return <p>Cargando alertas...</p>
  if (error) return <p>Error cargando alertas</p>

  const alerts = data?.alerts ?? []

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Alertas</h2>
          <p style={styles.subtitle}>Eventos importantes detectados por Boat OS</p>
        </div>

        <div
          style={{
            ...styles.statusBadge,
            backgroundColor: alerts.length > 0 ? "#3d2d12" : "#123d2a",
            color: alerts.length > 0 ? "#ffb300" : "#4caf50",
            borderColor: alerts.length > 0 ? "#8a5a00" : "#2d7d46",
          }}
        >
          {alerts.length > 0 ? `${alerts.length} activa(s)` : "Sin alertas"}
        </div>
      </div>

      {alerts.length === 0 && (
        <div style={styles.emptyState}>
          <strong>Sistema sin alertas activas</strong>
          <p>No hay riesgos AIS, energía crítica ni avisos del sistema.</p>
        </div>
      )}

      <div style={styles.list}>
        {alerts.map((alert) => (
          <div
            key={alert.id}
            style={{
              ...styles.card,
              borderLeft: `8px solid ${getAlertColor(alert.level)}`
            }}
          >
            <div style={styles.cardHeader}>
              <div>
                <strong style={styles.cardTitle}>{alert.title}</strong>
                <p style={styles.source}>Origen: {alert.source}</p>
              </div>

              <span
                style={{
                  ...styles.levelBadge,
                  backgroundColor: getAlertColor(alert.level),
                }}
              >
                {getAlertLabel(alert.level)}
              </span>
            </div>

            <p style={styles.message}>{alert.message}</p>
          </div>
        ))}
      </div>

      <div style={styles.footerPanel}>
        <h3 style={styles.footerTitle}>Resumen</h3>

        <div style={styles.summaryGrid}>
          <div style={styles.summaryItem}>
            <span>Críticas</span>
            <strong>
              {alerts.filter((alert) => alert.level === "critical").length}
            </strong>
          </div>

          <div style={styles.summaryItem}>
            <span>Avisos</span>
            <strong>
              {alerts.filter((alert) => alert.level === "warning").length}
            </strong>
          </div>

          <div style={styles.summaryItem}>
            <span>Fuente</span>
            <strong>{data?.meta?.dataSource ?? "-"}</strong>
          </div>

          <div style={styles.summaryItem}>
            <span>Última actualización</span>
            <strong>
              {data?.meta?.timestamp
                ? new Date(data.meta.timestamp).toLocaleTimeString()
                : "-"}
            </strong>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    textAlign: "left",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    color: "white",
  },
  subtitle: {
    color: "#9fb3c8",
    marginTop: "6px",
  },
  statusBadge: {
    border: "1px solid",
    borderRadius: "999px",
    padding: "8px 14px",
    fontWeight: "bold",
  },
  emptyState: {
    backgroundColor: "#07131d",
    border: "1px solid #1f455f",
    borderRadius: "14px",
    padding: "24px",
    color: "white",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  card: {
    backgroundColor: "#07131d",
    borderRadius: "14px",
    padding: "18px",
    border: "1px solid #1f455f",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "14px",
  },
  cardTitle: {
    color: "white",
    fontSize: "18px",
  },
  source: {
    color: "#8fa8bb",
    marginTop: "4px",
  },
  levelBadge: {
    color: "#07131d",
    fontWeight: "bold",
    borderRadius: "999px",
    padding: "6px 10px",
    minWidth: "80px",
    textAlign: "center",
  },
  message: {
    marginTop: "14px",
    color: "#d7e4ee",
  },
  footerPanel: {
    backgroundColor: "#07131d",
    border: "1px solid #1f455f",
    borderRadius: "14px",
    padding: "18px",
  },
  footerTitle: {
    marginTop: 0,
    color: "white",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "14px",
  },
  summaryItem: {
    backgroundColor: "#0b1d2a",
    borderRadius: "12px",
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
}

export default Alerts