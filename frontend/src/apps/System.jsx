import { useHealthData } from "../hooks/useHealthData"

function System({ data, loading, error }) {
  const { health, loadingHealth, healthError } = useHealthData()

  if (loading) return <p>Cargando sistema...</p>
  if (error) return <p>Error cargando datos del sistema</p>

  const lastStatusUpdate = data?.meta?.timestamp
    ? new Date(data.meta.timestamp).toLocaleTimeString()
    : "-"

  const lastHealthUpdate = health?.timestamp
    ? new Date(health.timestamp).toLocaleTimeString()
    : "-"

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Sistema</h2>
          <p style={styles.subtitle}>Diagnóstico local de Boat OS</p>
        </div>

        <div style={styles.badge}>
          {health?.status === "ok" ? "Sistema OK" : "Sin diagnóstico"}
        </div>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <span style={styles.label}>Backend</span>
          <strong>{health?.backend?.name ?? "Boat OS Backend"}</strong>
          <p>{healthError ? "Sin conexión" : "Activo"}</p>
        </div>

        <div style={styles.card}>
          <span style={styles.label}>Fuente de datos</span>
          <strong>{health?.dataSource?.active ?? data?.meta?.dataSource ?? "-"}</strong>
          <p>{data?.meta?.mode ?? "-"}</p>
        </div>

        <div style={styles.card}>
          <span style={styles.label}>Signal K</span>
          <strong>
            {health?.dataSource?.signalK?.enabled ? "Activado" : "Desactivado"}
          </strong>
          <p>{health?.dataSource?.signalK?.connected ? "Conectado" : "No conectado"}</p>
        </div>

        <div style={styles.card}>
          <span style={styles.label}>Raspberry</span>
          <strong>{data.raspberry.temperature} ºC</strong>
          <p>CPU {data.raspberry.cpu}% · RAM {data.raspberry.ram}%</p>
        </div>

        <div style={styles.card}>
          <span style={styles.label}>Último /status</span>
          <strong>{lastStatusUpdate}</strong>
          <p>Datos operativos</p>
        </div>

        <div style={styles.card}>
          <span style={styles.label}>Último /health</span>
          <strong>{loadingHealth ? "Cargando..." : lastHealthUpdate}</strong>
          <p>Diagnóstico backend</p>
        </div>
      </div>

      <div style={styles.panel}>
        <h3 style={styles.panelTitle}>Estado de servicios</h3>

        <div style={styles.serviceRow}>
          <span>Backend FastAPI</span>
          <strong style={healthError ? styles.bad : styles.ok}>
            {healthError ? "ERROR" : "OK"}
          </strong>
        </div>

        <div style={styles.serviceRow}>
          <span>Simulador</span>
          <strong style={health?.dataSource?.simulator ? styles.ok : styles.warn}>
            {health?.dataSource?.simulator ? "ACTIVO" : "INACTIVO"}
          </strong>
        </div>

        <div style={styles.serviceRow}>
          <span>Signal K</span>
          <strong style={health?.dataSource?.signalK?.connected ? styles.ok : styles.warn}>
            {health?.dataSource?.signalK?.connected ? "CONECTADO" : "NO CONECTADO"}
          </strong>
        </div>

        <div style={styles.serviceRow}>
          <span>AIS engine</span>
          <strong style={styles.ok}>OK</strong>
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
  badge: {
    backgroundColor: "#123d2a",
    color: "#4caf50",
    border: "1px solid #2d7d46",
    borderRadius: "999px",
    padding: "8px 14px",
    fontWeight: "bold",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
  },
  card: {
    backgroundColor: "#07131d",
    border: "1px solid #1f455f",
    borderRadius: "14px",
    padding: "18px",
    minHeight: "100px",
  },
  label: {
    display: "block",
    color: "#8fa8bb",
    fontSize: "13px",
    marginBottom: "8px",
  },
  panel: {
    backgroundColor: "#07131d",
    border: "1px solid #1f455f",
    borderRadius: "14px",
    padding: "18px",
  },
  panelTitle: {
    marginTop: 0,
    marginBottom: "16px",
    color: "white",
  },
  serviceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #123247",
  },
  ok: {
    color: "#4caf50",
  },
  warn: {
    color: "#ffb300",
  },
  bad: {
    color: "#ff4d4d",
  },
}

export default System