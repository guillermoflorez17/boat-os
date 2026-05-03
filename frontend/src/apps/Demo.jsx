import { InfoCard, SectionHeader, ServiceRow, StatusBadge } from "../components/ui"
import { useSimulator } from "../hooks/useSimulator"

function Demo({ theme, tabletMode }) {
  const {
    simulator,
    loadingSimulator,
    simulatorError,
    working,
    lastAction,
    reset,
    changeScenario,
  } = useSimulator()

  const styles = getStyles(theme, tabletMode)

  if (loadingSimulator) {
    return <p style={{ color: theme.text }}>Cargando modo demo...</p>
  }

  if (simulatorError) {
    return <p style={{ color: theme.danger }}>Error cargando simulador</p>
  }

  const activeScenario = simulator?.scenario ?? "normal"
  const availableScenarios = simulator?.availableScenarios ?? []

  return (
    <div style={styles.container}>
      <SectionHeader
        title="Demo / Desarrollo"
        subtitle="Controles técnicos para probar Boat OS sin hardware real"
        badge={
          <StatusBadge theme={theme} color={theme.warning}>
            Simulador
          </StatusBadge>
        }
      />

      <div style={styles.grid}>
        <InfoCard
          theme={theme}
          tabletMode={tabletMode}
          label="Escenario AIS"
          value={activeScenario}
          description="Tráfico simulado activo"
        />

        <InfoCard
          theme={theme}
          tabletMode={tabletMode}
          label="Modo dinámico"
          value={simulator?.dynamicEnabled ? "Activado" : "Desactivado"}
          description={`Escala x${simulator?.timeScale ?? "-"}`}
        />

        <InfoCard
          theme={theme}
          tabletMode={tabletMode}
          label="Ciclo"
          value={`${simulator?.loopMinutes ?? "-"} min`}
          description={`${simulator?.elapsedMinutes ?? "-"} min simulados`}
        />
      </div>

      <div style={styles.panel}>
        <h3 style={styles.panelTitle}>Escenarios AIS</h3>

        <div style={styles.actions}>
          {availableScenarios.map((scenario) => {
            const active = scenario === activeScenario
            const dangerous = scenario === "high_risk"

            return (
              <button
                key={scenario}
                style={{
                  ...styles.actionButton,
                  borderColor: active
                    ? theme.accent
                    : dangerous
                      ? theme.danger
                      : theme.border,
                  backgroundColor: active
                    ? theme.accent
                    : dangerous
                      ? theme.danger
                      : theme.cardAlt,
                  color: active || dangerous ? "white" : theme.text,
                }}
                disabled={working}
                onClick={() => changeScenario(scenario)}
              >
                {scenario === "high_risk" ? "Riesgo alto" : "Normal"}
              </button>
            )
          })}

          <button
            style={{
              ...styles.actionButton,
              borderColor: theme.accent,
              backgroundColor: theme.cardAlt,
              color: theme.text,
            }}
            disabled={working}
            onClick={reset}
          >
            {working ? "Procesando..." : "Reiniciar simulador"}
          </button>
        </div>

        {lastAction && (
          <div style={styles.resultBox}>
            {lastAction}
          </div>
        )}
      </div>

      <div style={styles.panel}>
        <h3 style={styles.panelTitle}>Estado técnico</h3>

        <ServiceRow
          theme={theme}
          label="Simulador dinámico"
          status={simulator?.dynamicEnabled ? "ACTIVO" : "INACTIVO"}
          color={simulator?.dynamicEnabled ? theme.success : theme.warning}
        />

        <ServiceRow
          theme={theme}
          label="Escala temporal"
          status={`x${simulator?.timeScale ?? "-"}`}
          color={theme.success}
        />

        <ServiceRow
          theme={theme}
          label="Ciclo automático"
          status={`${simulator?.loopMinutes ?? "-"} MIN`}
          color={theme.success}
        />

        <ServiceRow
          theme={theme}
          label="Escenario actual"
          status={activeScenario.toUpperCase()}
          color={activeScenario === "high_risk" ? theme.danger : theme.success}
        />
      </div>

      <div style={styles.notice}>
        <strong>Importante</strong>
        <p>
          Estos controles solo afectan al simulador. En modo Signal K real no deben modificar datos reales ni hardware.
        </p>
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
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: "16px",
    },
    panel: {
      backgroundColor: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: "16px",
      padding: tabletMode ? "22px" : "18px",
      boxShadow: theme.shadow,
    },
    panelTitle: {
      marginTop: 0,
      marginBottom: "16px",
      color: theme.text,
    },
    actions: {
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
    },
    actionButton: {
      padding: tabletMode ? "14px 18px" : "12px 16px",
      borderRadius: "999px",
      border: "1px solid",
      fontWeight: "bold",
      cursor: "pointer",
    },
    resultBox: {
      marginTop: "14px",
      backgroundColor: theme.cardAlt,
      border: `1px solid ${theme.border}`,
      borderRadius: "12px",
      padding: "12px",
      color: theme.text,
    },
    notice: {
      backgroundColor: theme.card,
      border: `1px solid ${theme.warning}`,
      borderRadius: "16px",
      padding: "18px",
      color: theme.text,
      boxShadow: theme.shadow,
    },
  }
}

export default Demo