import { useEffect, useRef } from "react"

function TopBar({ data, loading, error }) {
  const alarmPlayed = useRef(false)

  const alerts = data?.alerts ?? []
  const criticalAlerts = alerts.filter((alert) => alert.level === "critical")
  const warningAlerts = alerts.filter((alert) => alert.level === "warning")

  const hasCriticalAlert = criticalAlerts.length > 0
  const hasWarningAlert = warningAlerts.length > 0
  const mainAlert = criticalAlerts[0] ?? warningAlerts[0]

  const lastUpdate = data?.meta?.timestamp
    ? new Date(data.meta.timestamp).toLocaleTimeString()
    : "-"

  useEffect(() => {
    if (hasCriticalAlert && !alarmPlayed.current) {
      const audio = new Audio("/alarm.mp3")
      audio.play().catch(() => {
        console.log("El navegador bloqueó el audio automático")
      })
      alarmPlayed.current = true
    }

    if (!hasCriticalAlert) {
      alarmPlayed.current = false
    }
  }, [hasCriticalAlert])

  if (loading) {
    return (
      <div style={styles.topBar}>
        <span style={styles.logo}>Boat OS</span>
        <span>Cargando sistema...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.topBar}>
        <span style={styles.logo}>Boat OS</span>
        <span style={styles.error}>Sin conexión backend</span>
      </div>
    )
  }

  return (
    <>
      <div style={styles.topBar}>
        <span style={styles.logo}>Boat OS</span>

        <div style={styles.status}>
          <span>🔋 {data.battery.voltage} V</span>
          <span>☀️ {data.solar.power} W</span>
          <span>📍 GPS {data.gps.status}</span>

          <span
            style={
              hasCriticalAlert
                ? styles.danger
                : hasWarningAlert
                  ? styles.warning
                  : undefined
            }
          >
            ⚠️ {alerts.length} alertas
          </span>

          <span>📡 AIS {data.ais.status}</span>
          <span>📶 {data.connection.type}</span>
          <span>🧪 {data.meta?.dataSource}</span>
          <span>⏱️ {lastUpdate}</span>
        </div>
      </div>

      {mainAlert && (
        <div
          style={{
            ...styles.alertBox,
            backgroundColor:
              mainAlert.level === "critical" ? "#8b0000" : "#8a5a00",
          }}
        >
          <strong>{mainAlert.title}</strong>
          <span>{mainAlert.message}</span>
        </div>
      )}
    </>
  )
}

const styles = {
  topBar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "56px",
    backgroundColor: "#07131d",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    boxSizing: "border-box",
    zIndex: 1000,
    fontFamily: "Arial, sans-serif",
    borderBottom: "1px solid #1f455f"
  },
  logo: {
    fontWeight: "bold",
    fontSize: "18px"
  },
  status: {
    display: "flex",
    gap: "18px",
    fontSize: "14px",
    alignItems: "center"
  },
  error: {
    color: "#ff6b6b"
  },
  danger: {
    color: "#ff4d4d",
    fontWeight: "bold"
  },
  warning: {
    color: "#ffb300",
    fontWeight: "bold"
  },
  alertBox: {
    position: "fixed",
    top: "70px",
    right: "20px",
    color: "white",
    padding: "14px 20px",
    borderRadius: "12px",
    fontWeight: "bold",
    zIndex: 1002,
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  }
}

export default TopBar