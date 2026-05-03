import { InfoCard, SectionHeader, StatusBadge } from "../components/ui"

function Dashboard({ data, loading, error, theme, tabletMode }) {
  if (loading) return <p style={{ color: theme.text }}>Cargando dashboard...</p>
  if (error) return <p style={{ color: theme.danger }}>Error cargando dashboard</p>

  const styles = getStyles(theme, tabletMode)

  const alerts = data?.alerts ?? []
  const hasAlerts = alerts.length > 0
  const hasAisAlert = alerts.some((alert) => alert.source === "ais")
  const hasCriticalAlert = alerts.some((alert) => alert.level === "critical")

  const dashboardStatusColor = hasCriticalAlert
    ? theme.danger
    : hasAlerts
      ? theme.warning
      : theme.success

  const dashboardStatusText = hasCriticalAlert
    ? "Alerta crítica"
    : hasAlerts
      ? "Avisos activos"
      : "Sistema estable"

  return (
    <div style={styles.container}>
      <SectionHeader
        title="Dashboard"
        subtitle="Resumen operativo del barco"
        badge={
          <StatusBadge theme={theme} color={dashboardStatusColor}>
            {dashboardStatusText}
          </StatusBadge>
        }
      />

      {hasAlerts && (
        <div style={styles.alertPanel}>
          <div style={styles.alertPanelHeader}>
            <strong>Alertas activas</strong>
            <span>{alerts.length}</span>
          </div>

          <div style={styles.alertList}>
            {alerts.map((alert) => {
              const alertColor =
                alert.level === "critical" ? theme.danger : theme.warning

              return (
                <div
                  key={alert.id}
                  style={{
                    ...styles.alertItem,
                    borderLeft: `6px solid ${alertColor}`,
                  }}
                >
                  <strong style={{ color: theme.text }}>{alert.title}</strong>
                  <p style={styles.alertText}>{alert.message}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div style={styles.grid}>
        <InfoCard
          theme={theme}
          tabletMode={tabletMode}
          label="Batería"
          value={`${data.battery.voltage} V`}
          description={`${data.battery.percentage}% · ${data.battery.status}`}
        />

        <InfoCard
          theme={theme}
          tabletMode={tabletMode}
          label="Solar"
          value={`${data.solar.power} W`}
          description={data.solar.status}
        />

        <InfoCard
          theme={theme}
          tabletMode={tabletMode}
          label="GPS"
          value={data.gps.status}
          description={`${data.gps.latitude}, ${data.gps.longitude}`}
        />

        <div
          style={{
            ...styles.aisCard,
            border: hasAisAlert
              ? `2px solid ${theme.warning}`
              : `1px solid ${theme.border}`,
          }}
        >
          <span style={styles.label}>AIS</span>
          <strong style={styles.value}>{data.ais.status}</strong>
          <p style={styles.description}>{data.ais.targets} barcos</p>

          {hasAisAlert && (
            <p style={styles.aisAlert}>⚠️ Alerta AIS activa</p>
          )}
        </div>

        <InfoCard
          theme={theme}
          tabletMode={tabletMode}
          label="Conexión"
          value={data.connection.type}
          description={data.connection.status}
        />

        <InfoCard
          theme={theme}
          tabletMode={tabletMode}
          label="Raspberry"
          value={`${data.raspberry.temperature} ºC`}
          description={`CPU ${data.raspberry.cpu}% · RAM ${data.raspberry.ram}%`}
        />
      </div>

      <div style={styles.footerPanel}>
        <div style={styles.footerItem}>
          <span>Fuente de datos</span>
          <strong>{data.meta?.dataSource ?? "-"}</strong>
        </div>

        <div style={styles.footerItem}>
          <span>Modo</span>
          <strong>{data.meta?.mode ?? "-"}</strong>
        </div>

        <div style={styles.footerItem}>
          <span>Última actualización</span>
          <strong>
            {data.meta?.timestamp
              ? new Date(data.meta.timestamp).toLocaleTimeString()
              : "-"}
          </strong>
        </div>
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
    alertPanel: {
      backgroundColor: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: "16px",
      padding: tabletMode ? "22px" : "18px",
      boxShadow: theme.shadow,
    },
    alertPanelHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: theme.text,
      marginBottom: "14px",
    },
    alertList: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    alertItem: {
      backgroundColor: theme.cardAlt,
      border: `1px solid ${theme.border}`,
      borderRadius: "12px",
      padding: "14px",
    },
    alertText: {
      margin: "6px 0 0 0",
      color: theme.textMuted,
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "16px",
    },
    aisCard: {
      backgroundColor: theme.card,
      borderRadius: "16px",
      padding: tabletMode ? "22px" : "18px",
      minHeight: tabletMode ? "120px" : "105px",
      boxShadow: theme.shadow,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    label: {
      color: theme.textMuted,
      fontSize: "13px",
    },
    value: {
      color: theme.text,
      fontSize: "18px",
    },
    description: {
      color: theme.textMuted,
      margin: 0,
    },
    aisAlert: {
      margin: 0,
      color: theme.warning,
      fontWeight: "bold",
    },
    footerPanel: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "16px",
    },    
    footerItem: {
      backgroundColor: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: "16px",
      padding: "16px",
      boxShadow: theme.shadow,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      color: theme.text,
    },
  }
}

export default Dashboard