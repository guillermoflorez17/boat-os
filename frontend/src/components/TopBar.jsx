import { useEffect, useRef } from "react"

function TopBar({
  data,
  loading,
  error,
  theme,
  backendOnline,
  lastSuccessfulUpdate,
}) {
  const alarmPlayed = useRef(false)

  const alerts = data?.alerts ?? []
  const criticalAlerts = alerts.filter((alert) => alert.level === "critical")
  const warningAlerts = alerts.filter((alert) => alert.level === "warning")

  const hasCriticalAlert = criticalAlerts.length > 0
  const soundEnabled = data?.preferences?.alerts?.soundEnabled ?? true
  const hasWarningAlert = warningAlerts.length > 0
  const mainAlert = criticalAlerts[0] ?? warningAlerts[0]

  const lastUpdate = lastSuccessfulUpdate
    ? lastSuccessfulUpdate.toLocaleTimeString()
    : data?.meta?.timestamp
      ? new Date(data.meta.timestamp).toLocaleTimeString()
      : "-"

  useEffect(() => {
    if (hasCriticalAlert && soundEnabled && !alarmPlayed.current) {
      const audio = new Audio("/alarm.mp3")
      audio.play().catch(() => {
        console.log("El navegador bloqueó el audio automático")
      })
      alarmPlayed.current = true
    }

    if (!hasCriticalAlert) {
      alarmPlayed.current = false
    }
  }, [hasCriticalAlert, soundEnabled])

  const topBarStyle = {
    ...styles.topBar,
    backgroundColor: theme.background,
    color: theme.text,
    borderBottom: `1px solid ${theme.border}`,
  }

  if (loading && !data) {
    return (
      <div style={topBarStyle}>
        <span style={styles.logo}>Boat OS</span>
        <span>Cargando sistema...</span>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div style={topBarStyle}>
        <span style={styles.logo}>Boat OS</span>
        <span style={{ color: theme.danger }}>Sin conexión backend</span>
      </div>
    )
  }

  if (!data) {
    return (
      <div style={topBarStyle}>
        <span style={styles.logo}>Boat OS</span>
        <span style={{ color: theme.warning }}>Sin datos</span>
      </div>
    )
  }

  return (
    <>
      <div style={topBarStyle}>
        <span style={styles.logo}>Boat OS</span>

        <div style={styles.status}>
          <span>🔋 {data.battery.voltage} V</span>
          <span>☀️ {data.solar.power} W</span>
          <span>📍 GPS {data.gps.status}</span>

          <span
            style={
              hasCriticalAlert
                ? { color: theme.danger, fontWeight: "bold" }
                : hasWarningAlert
                  ? { color: theme.warning, fontWeight: "bold" }
                  : undefined
            }
          >
            ⚠️ {alerts.length} alertas
          </span>

          <span>📡 AIS {data.ais.status}</span>

          <span
            style={{
              color: backendOnline ? theme.success : theme.danger,
              fontWeight: "bold",
            }}
          >
            {backendOnline ? "Backend OK" : "Backend OFFLINE"}
          </span>

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
              mainAlert.level === "critical" ? theme.danger : theme.warning,
            color: mainAlert.level === "critical" ? "white" : "#102230",
            boxShadow: theme.shadow,
          }}
        >
          <strong>{mainAlert.title}</strong>
          <span>{mainAlert.message}</span>
        </div>
      )}

      {!backendOnline && (
        <div
          style={{
            ...styles.offlineBox,
            backgroundColor: theme.danger,
            boxShadow: theme.shadow,
          }}
        >
          Backend sin respuesta. Mostrando últimos datos válidos.
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
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    boxSizing: "border-box",
    zIndex: 1000,
    fontFamily: "Arial, sans-serif",
  },
  logo: {
    fontWeight: "bold",
    fontSize: "18px",
  },
  status: {
    display: "flex",
    gap: "18px",
    fontSize: "14px",
    alignItems: "center",
  },
  alertBox: {
    position: "fixed",
    top: "70px",
    right: "20px",
    padding: "14px 20px",
    borderRadius: "12px",
    fontWeight: "bold",
    zIndex: 1002,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  offlineBox: {
    position: "fixed",
    top: "70px",
    left: "20px",
    color: "white",
    padding: "12px 18px",
    borderRadius: "12px",
    fontWeight: "bold",
    zIndex: 1002,
  },
}

export default TopBar