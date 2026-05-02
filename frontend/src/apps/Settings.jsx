import { InfoCard, SectionHeader, StatusBadge } from "../components/ui"
import { usePreferencesData } from "../hooks/usePreferencesData"

function Settings({ theme, tabletMode }) {
  const {
    preferences,
    loadingPreferences,
    preferencesError,
    savingPreferences,
    savePreferences,
  } = usePreferencesData()

  if (loadingPreferences) {
    return <p style={{ color: theme.text }}>Cargando ajustes...</p>
  }

  if (preferencesError) {
    return <p style={{ color: theme.danger }}>Error cargando preferencias</p>
  }

  const styles = getStyles(theme, tabletMode)

  function togglePreference(section, key) {
    const nextPreferences = {
      ...preferences,
      [section]: {
        ...preferences[section],
        [key]: !preferences[section][key],
      },
    }

    savePreferences(nextPreferences)
  }

  return (
    <div style={styles.container}>
      <SectionHeader
        title="Ajustes"
        subtitle="Preferencias reales de Boat OS"
        badge={
          <StatusBadge theme={theme} color={savingPreferences ? theme.warning : theme.success}>
            {savingPreferences ? "Guardando..." : "Local"}
          </StatusBadge>
        }
      />

      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Alertas y alarmas</h3>

        <div style={styles.grid}>
          <ToggleCard
            styles={styles}
            label="Alarma sonora"
            value={preferences.alerts.soundEnabled}
            description="Sonará ante alertas críticas."
            onClick={() => togglePreference("alerts", "soundEnabled")}
          />

          <ToggleCard
            styles={styles}
            label="Alertas AIS"
            value={preferences.alerts.aisAlertsEnabled}
            description="Avisos por riesgo de aproximación."
            onClick={() => togglePreference("alerts", "aisAlertsEnabled")}
          />

          <ToggleCard
            styles={styles}
            label="Alertas de energía"
            value={preferences.alerts.energyAlertsEnabled}
            description="Batería baja y estado de carga."
            onClick={() => togglePreference("alerts", "energyAlertsEnabled")}
          />

          <ToggleCard
            styles={styles}
            label="Alertas sistema"
            value={preferences.alerts.systemAlertsEnabled}
            description="Temperatura y estado Raspberry."
            onClick={() => togglePreference("alerts", "systemAlertsEnabled")}
          />
        </div>
      </section>

      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Pantalla</h3>

        <div style={styles.grid}>
          <ToggleCard
            styles={styles}
            label="Modo nocturno"
            value={preferences.display.nightMode}
            description="Interfaz oscura para navegación nocturna."
            onClick={() => togglePreference("display", "nightMode")}
          />

          <ToggleCard
            styles={styles}
            label="Interfaz tablet"
            value={preferences.display.tabletMode}
            description="Botones grandes y lectura rápida."
            onClick={() => togglePreference("display", "tabletMode")}
          />
        </div>
      </section>

      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Navegación</h3>

        <div style={styles.infoGrid}>
          <InfoCard
            theme={theme}
            tabletMode={tabletMode}
            label="Unidades"
            value="NM / kn"
            description="Millas náuticas y nudos."
          />

          <InfoCard
            theme={theme}
            tabletMode={tabletMode}
            label="Vista AIS"
            value="Táctica"
            description="Objetivos, rumbo, CPA, TCPA y riesgo."
          />

          <InfoCard
            theme={theme}
            tabletMode={tabletMode}
            label="Plotter"
            value="OpenCPN"
            description="Uso previsto como plotter principal."
          />
        </div>
      </section>

      <div style={styles.notice}>
        <strong>Estado</strong>
        <p>
          Las preferencias se guardan en <code>backend/data/preferences.json</code>.
          El modo visual, interfaz tablet y alertas ya usan estos ajustes.
        </p>
      </div>
    </div>
  )
}

function ToggleCard({ label, value, description, onClick, styles }) {
  return (
    <button style={styles.toggleCard} onClick={onClick}>
      <div style={styles.toggleHeader}>
        <span style={styles.label}>{label}</span>

        <span style={value ? styles.switchOn : styles.switchOff}>
          {value ? "ON" : "OFF"}
        </span>
      </div>

      <strong style={value ? styles.enabled : styles.disabled}>
        {value ? "Activado" : "Desactivado"}
      </strong>

      <p style={styles.description}>{description}</p>
    </button>
  )
}

function getStyles(theme, tabletMode) {
  return {
    container: {
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      textAlign: "left",
      color: theme.text,
    },
    section: {
      display: "flex",
      flexDirection: "column",
      gap: "14px",
    },
    sectionTitle: {
      margin: 0,
      color: theme.text,
      fontSize: tabletMode ? "22px" : "20px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: "16px",
    },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: "16px",
    },
    toggleCard: {
      backgroundColor: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: "16px",
      padding: tabletMode ? "22px" : "18px",
      minHeight: tabletMode ? "140px" : "125px",
      textAlign: "left",
      color: theme.text,
      cursor: "pointer",
      boxShadow: theme.shadow,
    },
    toggleHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px",
    },
    label: {
      color: theme.textMuted,
      fontSize: "13px",
    },
    switchOn: {
      backgroundColor: "rgba(66, 201, 125, 0.14)",
      color: theme.success,
      border: `1px solid ${theme.success}`,
      borderRadius: "999px",
      padding: "4px 10px",
      fontWeight: "bold",
      fontSize: "12px",
    },
    switchOff: {
      backgroundColor: "rgba(255, 107, 107, 0.14)",
      color: theme.danger,
      border: `1px solid ${theme.danger}`,
      borderRadius: "999px",
      padding: "4px 10px",
      fontWeight: "bold",
      fontSize: "12px",
    },
    enabled: {
      color: theme.success,
      fontSize: "18px",
    },
    disabled: {
      color: theme.danger,
      fontSize: "18px",
    },
    description: {
      color: theme.textMuted,
      marginTop: "10px",
      marginBottom: 0,
    },
    notice: {
      backgroundColor: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: "16px",
      padding: "18px",
      color: theme.textMuted,
      boxShadow: theme.shadow,
    },
  }
}

export default Settings