import { useEffect, useRef } from "react"

function TopBar({
  data,
  loading,
  error,
  theme,
  backendOnline,
  lastSuccessfulUpdate,
  dataAgeSeconds,
}) {
  const alarmPlayed = useRef(false)

  const alerts = data?.alerts ?? []
  const criticalAlerts = alerts.filter((alert) => alert.level === "critical")
  const warningAlerts = alerts.filter((alert) => alert.level === "warning")

  const hasCriticalAlert = criticalAlerts.length > 0
  const hasWarningAlert = warningAlerts.length > 0
  const soundEnabled = data?.preferences?.alerts?.soundEnabled ?? true
  const mainAlert = criticalAlerts[0] ?? warningAlerts[0]

  const degraded = data?.meta?.degraded ?? false
  const staleData = dataAgeSeconds !== null && dataAgeSeconds > 10

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
        <strong style={styles.logo}>Boat OS</strong>
        <span style={{ color: theme.textMuted }}>Cargando sistema...</span>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div style={topBarStyle}>
        <strong style={styles.logo}>Boat OS</strong>
        <span style={{ color: theme.danger, fontWeight: "bold" }}>
          Backend sin conexión
        </span>
      </div>
    )
  }

  if (!data) {
    return (
      <div style={topBarStyle}>
        <strong style={styles.logo}>Boat OS</strong>
        <span style={{ color: theme.warning, fontWeight: "bold" }}>
          Sin datos
        </span>
      </div>
    )
  }

  return (
    <>
      <div style={topBarStyle}>
        <strong style={styles.logo}>Boat OS</strong>

        <div style={styles.statusGroup}>
          <StatusChip
            theme={theme}
            label="Bat"
            value={`${data.battery.voltage} V`}
          />

          <StatusChip
            theme={theme}
            label="Solar"
            value={`${data.solar.power} W`}
          />

          <StatusChip
            theme={theme}
            label="GPS"
            value={data.gps.status}
            color={data.gps.status === "OK" ? theme.success : theme.warning}
          />

          <StatusChip
            theme={theme}
            label="AIS"
            value={hasCriticalAlert ? "RIESGO" : data.ais.status}
            color={
              hasCriticalAlert
                ? theme.danger
                : hasWarningAlert
                  ? theme.warning
                  : theme.success
            }
          />

          <StatusChip
            theme={theme}
            label="Backend"
            value={backendOnline ? "OK" : "OFF"}
            color={backendOnline ? theme.success : theme.danger}
          />

          <StatusChip
            theme={theme}
            label="Datos"
            value={
              dataAgeSeconds !== null
                ? `${dataAgeSeconds}s`
                : lastUpdate
            }
            color={
              !backendOnline
                ? theme.danger
                : staleData || degraded
                  ? theme.warning
                  : theme.success
            }
          />
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
          Backend offline · últimos datos {dataAgeSeconds ?? "-"}s
        </div>
      )}

      {degraded && backendOnline && (
        <div
          style={{
            ...styles.degradedBox,
            backgroundColor: theme.warning,
            boxShadow: theme.shadow,
          }}
        >
          Datos degradados · revisar Sistema
        </div>
      )}
    </>
  )
}

function StatusChip({ theme, label, value, color }) {
  return (
    <div
      style={{
        ...styles.chip,
        backgroundColor: theme.card,
        border: `1px solid ${theme.border}`,
        color: theme.text,
      }}
    >
      <span style={{ color: theme.textMuted }}>{label}</span>
      <strong style={{ color: color ?? theme.text }}>{value}</strong>
    </div>
  )
}

const styles = {
  topBar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "auto",
    minHeight: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 24px",
    boxSizing: "border-box",
    zIndex: 1000,
    fontFamily: "Arial, sans-serif",
  },
  logo: {
    fontSize: "20px",
    whiteSpace: "nowrap",
  },
  statusGroup: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    maxWidth: "calc(100vw - 160px)",
    overflow: "hidden",
  },
  chip: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    borderRadius: "999px",
    padding: "7px 10px",
    fontSize: "13px",
    whiteSpace: "nowrap",
    minWidth: "fit-content",
  },
  alertBox: {
    position: "fixed",
    top: "82px",
    right: "20px",
    padding: "14px 20px",
    borderRadius: "14px",
    fontWeight: "bold",
    zIndex: 1002,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  offlineBox: {
    position: "fixed",
    top: "82px",
    left: "20px",
    color: "white",
    padding: "12px 18px",
    borderRadius: "14px",
    fontWeight: "bold",
    zIndex: 1002,
  },
  degradedBox: {
    position: "fixed",
    top: "82px",
    left: "20px",
    color: "#102230",
    padding: "12px 18px",
    borderRadius: "14px",
    fontWeight: "bold",
    zIndex: 1002,
  },
}

export default TopBar