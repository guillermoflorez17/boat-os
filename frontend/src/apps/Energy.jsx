import { InfoCard, SectionHeader, ServiceRow, StatusBadge } from "../components/ui"

function Energy({ data, loading, error, theme, tabletMode }) {
  if (loading) return <p style={{ color: theme.text }}>Cargando energía...</p>
  if (error) return <p style={{ color: theme.danger }}>Error cargando energía</p>

  const styles = getStyles(theme, tabletMode)

  const batteryPercent = data?.battery?.percentage ?? 0

  const batteryColor =
    batteryPercent <= 20
      ? theme.danger
      : batteryPercent <= 40
        ? theme.warning
        : theme.success

  return (
    <div style={styles.container}>
      <SectionHeader
        title="Energía"
        subtitle="Estado eléctrico del barco"
        badge={
          <StatusBadge theme={theme} color={batteryColor}>
            {data.battery.status}
          </StatusBadge>
        }
      />

      <div style={styles.mainGrid}>
        <div style={styles.primaryCard}>
          <span style={styles.label}>Batería principal</span>

          <div style={styles.batteryValue}>
            <strong>{data.battery.percentage}%</strong>
            <span>{data.battery.voltage} V</span>
          </div>

          <div style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressFill,
                width: `${data.battery.percentage}%`,
                backgroundColor: batteryColor,
              }}
            />
          </div>

          <p style={styles.description}>
            Estado actual del banco de baterías. Futuro: integración Victron.
          </p>
        </div>

        <div style={styles.primaryCard}>
          <span style={styles.label}>Carga solar</span>

          <div style={styles.batteryValue}>
            <strong>{data.solar.power} W</strong>
            <span>{data.solar.status}</span>
          </div>

          <div style={styles.metricBox}>
            <span>Producción diaria</span>
            <strong>{data.solar.dailyYield} kWh</strong>
          </div>

          <p style={styles.description}>
            Datos simulados actuales. Futuro: MPPT Victron / Signal K.
          </p>
        </div>
      </div>

      <div style={styles.grid}>
        <InfoCard
          theme={theme}
          tabletMode={tabletMode}
          label="Voltaje"
          value={`${data.battery.voltage} V`}
          description="Banco principal"
        />

        <InfoCard
          theme={theme}
          tabletMode={tabletMode}
          label="Carga"
          value={`${data.battery.percentage}%`}
          description="Nivel estimado"
        />

        <InfoCard
          theme={theme}
          tabletMode={tabletMode}
          label="Solar"
          value={`${data.solar.power} W`}
          description="Potencia actual"
        />

        <InfoCard
          theme={theme}
          tabletMode={tabletMode}
          label="Producción"
          value={`${data.solar.dailyYield} kWh`}
          description="Producción diaria"
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
          label="Integración"
          value="Victron"
          description="Pendiente"
        />
      </div>

      <div style={styles.panel}>
        <h3 style={styles.panelTitle}>Próxima integración</h3>

        <ServiceRow
          theme={theme}
          label="Victron MPPT"
          status="PENDIENTE"
          color={theme.warning}
        />

        <ServiceRow
          theme={theme}
          label="Consumo instantáneo"
          status="PENDIENTE"
          color={theme.warning}
        />

        <ServiceRow
          theme={theme}
          label="Histórico energía"
          status="PENDIENTE"
          color={theme.warning}
        />

        <ServiceRow
          theme={theme}
          label="Alertas batería"
          status={data.preferences?.alerts?.energyAlertsEnabled ? "ACTIVAS" : "DESACTIVADAS"}
          color={data.preferences?.alerts?.energyAlertsEnabled ? theme.success : theme.danger}
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
    mainGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "18px",
    },
    primaryCard: {
      backgroundColor: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: "18px",
      padding: tabletMode ? "26px" : "22px",
      boxShadow: theme.shadow,
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    label: {
      color: theme.textMuted,
      fontSize: "13px",
    },
    batteryValue: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      color: theme.text,
      fontSize: tabletMode ? "22px" : "20px",
    },
    progressTrack: {
      width: "100%",
      height: "16px",
      backgroundColor: theme.cardAlt,
      border: `1px solid ${theme.border}`,
      borderRadius: "999px",
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      borderRadius: "999px",
    },
    metricBox: {
      backgroundColor: theme.cardAlt,
      border: `1px solid ${theme.border}`,
      borderRadius: "14px",
      padding: "14px",
      display: "flex",
      justifyContent: "space-between",
      color: theme.text,
    },
    description: {
      color: theme.textMuted,
      margin: 0,
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "16px",
    },
    panel: {
      backgroundColor: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: "16px",
      padding: "18px",
      boxShadow: theme.shadow,
    },
    panelTitle: {
      marginTop: 0,
      marginBottom: "16px",
      color: theme.text,
    },
  }
}

export default Energy