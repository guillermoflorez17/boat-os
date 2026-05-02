import { InfoCard, SectionHeader, StatusBadge } from "../components/ui"

function getAlertColor(level, theme) {
  if (level === "critical") return theme.danger
  if (level === "warning") return theme.warning
  return theme.success
}

function getAlertLabel(level) {
  if (level === "critical") return "CRÍTICA"
  if (level === "warning") return "AVISO"
  return "INFO"
}

function Alerts({ data, loading, error, theme, tabletMode }) {
  if (loading) return <p style={{ color: theme.text }}>Cargando alertas...</p>
  if (error) return <p style={{ color: theme.danger }}>Error cargando alertas</p>

  const styles = getStyles(theme, tabletMode)

  const alerts = data?.alerts ?? []
  const criticalCount = alerts.filter((alert) => alert.level === "critical").length
  const warningCount = alerts.filter((alert) => alert.level === "warning").length

  const statusColor = alerts.length > 0 ? theme.warning : theme.success
  const statusText = alerts.length > 0 ? `${alerts.length} activa(s)` : "Sin alertas"

  return (
    <div style={styles.container}>
      <SectionHeader
        title="Alertas"
        subtitle="Eventos importantes detectados por Boat OS"
        badge={
          <StatusBadge theme={theme} color={statusColor}>
            {statusText}
          </StatusBadge>
        }
      />

      {alerts.length === 0 && (
        <div style={styles.emptyState}>
          <strong>Sistema sin alertas activas</strong>
          <p>No hay riesgos AIS, energía crítica ni avisos del sistema.</p>
        </div>
      )}

      <div style={styles.list}>
        {alerts.map((alert) => {
          const alertColor = getAlertColor(alert.level, theme)

          return (
            <div
              key={alert.id}
              style={{
                ...styles.alertCard,
                borderLeft: `8px solid ${alertColor}`,
              }}
            >
              <div style={styles.alertHeader}>
                <div>
                  <strong style={styles.alertTitle}>{alert.title}</strong>
                  <p style={styles.source}>Origen: {alert.source}</p>
                </div>

                <span
                  style={{
                    ...styles.levelBadge,
                    color: alertColor,
                    borderColor: alertColor,
                    backgroundColor: `${alertColor}22`,
                  }}
                >
                  {getAlertLabel(alert.level)}
                </span>
              </div>

              <p style={styles.message}>{alert.message}</p>
            </div>
          )
        })}
      </div>

      <div style={styles.summaryGrid}>
        <InfoCard
          theme={theme}
          tabletMode={tabletMode}
          label="Críticas"
          value={criticalCount}
          description="Alertas de máxima prioridad"
        />

        <InfoCard
          theme={theme}
          tabletMode={tabletMode}
          label="Avisos"
          value={warningCount}
          description="Requieren vigilancia"
        />

        <InfoCard
          theme={theme}
          tabletMode={tabletMode}
          label="Fuente"
          value={data?.meta?.dataSource ?? "-"}
          description="Origen de datos"
        />

        <InfoCard
          theme={theme}
          tabletMode={tabletMode}
          label="Última actualización"
          value={
            data?.meta?.timestamp
              ? new Date(data.meta.timestamp).toLocaleTimeString()
              : "-"
          }
          description="Datos operativos"
        />
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
    emptyState: {
      backgroundColor: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: "16px",
      padding: tabletMode ? "24px" : "20px",
      color: theme.text,
      boxShadow: theme.shadow,
    },
    list: {
      display: "flex",
      flexDirection: "column",
      gap: "14px",
    },
    alertCard: {
      backgroundColor: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: "16px",
      padding: tabletMode ? "22px" : "18px",
      boxShadow: theme.shadow,
    },
    alertHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "14px",
    },
    alertTitle: {
      color: theme.text,
      fontSize: tabletMode ? "20px" : "18px",
    },
    source: {
      color: theme.textMuted,
      marginTop: "4px",
    },
    levelBadge: {
      fontWeight: "bold",
      borderRadius: "999px",
      border: "1px solid",
      padding: "6px 10px",
      minWidth: "80px",
      textAlign: "center",
    },
    message: {
      marginTop: "14px",
      color: theme.textMuted,
    },
    summaryGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
      gap: "16px",
    },
  }
}

export default Alerts