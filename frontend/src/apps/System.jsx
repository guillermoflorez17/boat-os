import { useState } from "react"
import { useHealthData } from "../hooks/useHealthData"
import { InfoCard, SectionHeader, ServiceRow, StatusBadge } from "../components/ui"
import { resetSimulator } from "../services/api"

  function System({
    data,
    loading,
    error,
    theme,
    tabletMode,
    backendOnline,
    dataAgeSeconds,
  }) {
  const { health, loadingHealth, healthError } = useHealthData()
  const [resettingSimulator, setResettingSimulator] = useState(false)
  const [simulatorResetResult, setSimulatorResetResult] = useState(null)

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
  const simulatorLoopMinutes = health?.simulator?.loopMinutes 

  async function handleResetSimulator() {
    setResettingSimulator(true)

    try {
      const result = await resetSimulator()
      setSimulatorResetResult(result)
    } catch (error) {
      console.error("Error reiniciando simulador:", error)
      setSimulatorResetResult({
        reset: false,
        error: "No se pudo reiniciar el simulador",
      })
    } finally {
      setResettingSimulator(false)
    }
  }

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
          description={`Escala x${simulatorTimeScale ?? "-"} · ciclo ${simulatorLoopMinutes ?? "-"} min`}
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

        <InfoCard
          theme={theme}
          tabletMode={tabletMode}
          label="Estado datos"
          value={data?.meta?.degraded ? "Degradado" : "Normal"}
          description={
            data?.meta?.errors?.length
              ? `${data.meta.errors.length} error(es) internos`
              : "Sin errores internos"
          }
        />

        <InfoCard
          theme={theme}
          tabletMode={tabletMode}
          label="Edad de datos"
          value={dataAgeSeconds !== null ? `${dataAgeSeconds}s` : "-"}
          description={backendOnline ? "Datos vivos" : "Últimos datos válidos"}
        />
      </div>

      <div style={styles.panel}>
        <h3 style={styles.panelTitle}>Estado de servicios</h3>

        <ServiceRow
          theme={theme}
          label="Backend FastAPI"
          status={backendOnline ? "ONLINE" : "OFFLINE"}
          color={backendOnline ? theme.success : theme.danger}
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

        <ServiceRow
          theme={theme}
          label="Estado /status"
          status={data?.meta?.degraded ? "DEGRADADO" : "NORMAL"}
          color={data?.meta?.degraded ? theme.warning : theme.success}
        />

        <div style={styles.simulatorActions}>
          <button
            style={styles.actionButton}
            onClick={handleResetSimulator}
            disabled={resettingSimulator}
          >
            {resettingSimulator ? "Reiniciando..." : "Reiniciar simulador AIS"}
          </button>

          {simulatorResetResult && (
            <div style={styles.resultBox}>
              {simulatorResetResult.reset
                ? "Simulador reiniciado correctamente"
                : "No se pudo reiniciar el simulador"}
            </div>
          )}
        </div>
      </div>
      {data?.meta?.errors?.length > 0 && (
      <div style={styles.panel}>
        <h3 style={styles.panelTitle}>Errores internos de /status</h3>

        {data.meta.errors.map((item, index) => (
          <div key={`${item.service}-${index}`} style={styles.errorItem}>
            <strong>{item.service}</strong>
            <p>{item.message}</p>
          </div>
        ))}
      </div>
    )}
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
    simulatorActions: {
      marginTop: "18px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    actionButton: {
      padding: "14px 18px",
      borderRadius: "14px",
      border: `1px solid ${theme.accent}`,
      backgroundColor: theme.accent,
      color: "white",
      fontWeight: "bold",
      cursor: "pointer",
    },
    resultBox: {
      backgroundColor: theme.cardAlt,
      border: `1px solid ${theme.border}`,
      borderRadius: "12px",
      padding: "12px",
      color: theme.text,
    },
    errorItem: {
      backgroundColor: theme.cardAlt,
      border: `1px solid ${theme.border}`,
      borderLeft: `6px solid ${theme.warning}`,
      borderRadius: "12px",
      padding: "12px",
      marginTop: "12px",
      color: theme.text,
    },
  }
}

export default System