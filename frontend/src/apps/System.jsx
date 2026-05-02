import { useHealthData } from "../hooks/useHealthData"
import { InfoCard, SectionHeader, ServiceRow, StatusBadge } from "../components/ui"

function System({ data, loading, error, theme, tabletMode }) {
  const { health, loadingHealth, healthError } = useHealthData()

  if (loading) return <p style={{ color: theme.text }}>Cargando sistema...</p>
  if (error) return <p style={{ color: theme.danger }}>Error cargando datos del sistema</p>

  const styles = getStyles(theme)

  const lastStatusUpdate = data?.meta?.timestamp
    ? new Date(data.meta.timestamp).toLocaleTimeString()
    : "-"

  const lastHealthUpdate = health?.timestamp
    ? new Date(health.timestamp).toLocaleTimeString()
    : "-"

  const backendOk = !healthError && health?.status === "ok"
  const simulatorActive = health?.dataSource?.simulator
  const signalKEnabled = health?.dataSource?.signalK?.enabled
  const signalKConnected = health?.dataSource?.signalK?.connected
  const signalKUrl = health?.dataSource?.signalK?.url
  const openCpnEnabled = health?.opencpn?.enabled
  const systemMonitorAvailable = health?.systemMonitor?.available
  const simulatorDynamic = health?.simulator?.dynamicEnabled
  const simulatorTimeScale = health?.simulator?.timeScale

  return (
    <div style={styles.container}>
      <SectionHeader
        title="Sistema"
        subtitle="Diagnóstico local de Boat OS"
        badge={
          <StatusBadge
            theme={theme}
            color={backendOk ? theme.success : theme.danger}
          >
            {backendOk ? "Sistema OK" : "Error sistema"}
          </StatusBadge>
        }
      />

      <div style={styles.grid}>
        <InfoCard
          theme={theme}
          tabletMode={tabletMode}
          label="Backend"
          value={health?.backend?.name ?? "Boat OS Backend"}
          description={healthError ? "Sin conexión" : "Activo"}
        />

        <InfoCard
          theme={theme}
          tabletMode={tabletMode}
          label="Fuente de datos"
          value={health?.dataSource?.active ?? data?.meta?.dataSource ?? "-"}
          description={data?.meta?.mode ?? "-"}
        />

        <InfoCard
          theme={theme}
          tabletMode={tabletMode}
          label="Simulador"
          value={simulatorDynamic ? "Dinámico" : "Estático"}
          description={`Escala x${simulatorTimeScale ?? "-"}`}
        />

        <InfoCard
          theme={theme}
          tabletMode={tabletMode}
          label="Signal K"
          value={
            signalKConnected
              ? "Conectado"
              : signalKEnabled
                ? "Activado"
                : "En espera"
          }
          description={signalKUrl ?? "Sin URL configurada"}
        />

        <InfoCard
          theme={theme}
          tabletMode={tabletMode}
          label="OpenCPN"
          value={openCpnEnabled ? "Activado" : "Desactivado"}
          description={health?.opencpn?.platform ?? "-"}
        />

        <InfoCard
          theme={theme}
          tabletMode={tabletMode}
          label="Sistema"
          value={`${data.raspberry.temperature} ºC`}
          description={`CPU ${data.raspberry.cpu}% · RAM ${data.raspberry.ram}% · ${data.raspberry.platform ?? "Raspberry"}`}
        />

        <InfoCard
          theme={theme}
          tabletMode={tabletMode}
          label="Último /status"
          value={lastStatusUpdate}
          description="Datos operativos"
        />

        <InfoCard
          theme={theme}
          tabletMode={tabletMode}
          label="Último /health"
          value={loadingHealth ? "Cargando..." : lastHealthUpdate}
          description="Diagnóstico backend"
        />
      </div>

      <div style={styles.panel}>
        <h3 style={styles.panelTitle}>Estado de servicios</h3>

        <ServiceRow
          theme={theme}
          label="Backend FastAPI"
          status={healthError ? "ERROR" : "OK"}
          color={healthError ? theme.danger : theme.success}
        />

        <ServiceRow
          theme={theme}
          label="Simulador"
          status={
            simulatorActive
              ? simulatorDynamic
                ? "ACTIVO DINÁMICO"
                : "ACTIVO ESTÁTICO"
              : "INACTIVO"
          }
          color={simulatorActive ? theme.success : theme.warning}
        />

        <ServiceRow
          theme={theme}
          label="Signal K conexión"
          status={signalKConnected ? "CONECTADO" : "SIN CONEXIÓN"}
          color={signalKConnected ? theme.success : theme.warning}
        />

        <ServiceRow
          theme={theme}
          label="Signal K como fuente"
          status={signalKEnabled ? "ACTIVO" : "INACTIVO"}
          color={signalKEnabled ? theme.success : theme.warning}
        />

        <ServiceRow
          theme={theme}
          label="OpenCPN launcher"
          status={openCpnEnabled ? "ACTIVO" : "DESACTIVADO"}
          color={openCpnEnabled ? theme.success : theme.warning}
        />

        <ServiceRow
          theme={theme}
          label="AIS engine"
          status="OK"
          color={theme.success}
        />

        <ServiceRow
          theme={theme}
          label="Preferencias locales"
          status={data?.preferences ? "OK" : "ERROR"}
          color={data?.preferences ? theme.success : theme.danger}
        />

        <ServiceRow
          theme={theme}
          label="Monitor sistema"
          status={systemMonitorAvailable ? "ACTIVO" : "NO DISPONIBLE"}
          color={systemMonitorAvailable ? theme.success : theme.warning}
        />
      </div>
    </div>
  )
}

function getStyles(theme) {
  return {
    container: {
      display: "flex",
      flexDirection: "column",
      gap: "22px",
      textAlign: "left",
      color: theme.text,
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
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

export default System