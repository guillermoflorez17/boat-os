import { useState } from "react"
import AIS from "./apps/AIS"
import Alerts from "./apps/Alerts"
import Dashboard from "./apps/Dashboard"
import Demo from "./apps/Demo"
import Energy from "./apps/Energy"
import Pilot from "./apps/Pilot"
import Plotter from "./apps/Plotter"
import Settings from "./apps/Settings"
import System from "./apps/System"
import AppErrorBoundary from "./components/AppErrorBoundary"
import TopBar from "./components/TopBar"
import { useBoatData } from "./hooks/useBoatData"
import { themes } from "./styles/theme"

function App() {
  const [currentApp, setCurrentApp] = useState("Dashboard")

  const {
    data,
    loading,
    error,
    backendOnline,
    lastSuccessfulUpdate,
    dataAgeSeconds,
  } = useBoatData()

  const nightMode = data?.preferences?.display?.nightMode ?? true
  const tabletMode = data?.preferences?.display?.tabletMode ?? true
  const isDevelopmentMode = data?.meta?.mode === "development"

  const theme = nightMode ? themes.night : themes.day

  const sharedProps = {
    data,
    loading,
    error,
    theme,
    tabletMode,
    backendOnline,
    lastSuccessfulUpdate,
    dataAgeSeconds,
  }

  const apps = {
    Dashboard: <Dashboard {...sharedProps} />,
    Plotter: <Plotter theme={theme} tabletMode={tabletMode} />,
    AIS: <AIS {...sharedProps} />,
    Energía: <Energy {...sharedProps} />,
    Piloto: <Pilot theme={theme} tabletMode={tabletMode} />,
    Sistema: <System {...sharedProps} />,
    Alertas: <Alerts {...sharedProps} />,
    Ajustes: <Settings theme={theme} tabletMode={tabletMode} />,
    ...(isDevelopmentMode
      ? {
          Demo: <Demo theme={theme} tabletMode={tabletMode} />,
        }
      : {}),
  }

  const appDefinitions = {
    Dashboard: {
      icon: "⛵",
      title: "Dashboard",
      description: "Resumen general del barco",
    },
    Plotter: {
      icon: "🗺️",
      title: "Plotter",
      description: "OpenCPN y navegación",
    },
    AIS: {
      icon: "📡",
      title: "AIS",
      description: "Tráfico y riesgo de aproximación",
    },
    Energía: {
      icon: "🔋",
      title: "Energía",
      description: "Baterías, solar y Victron",
    },
    Piloto: {
      icon: "🧭",
      title: "Piloto",
      description: "Piloto automático futuro",
    },
    Sistema: {
      icon: "🖥️",
      title: "Sistema",
      description: "Diagnóstico local",
    },
    Alertas: {
      icon: "⚠️",
      title: "Alertas",
      description: "Avisos críticos activos",
    },
    Ajustes: {
      icon: "⚙️",
      title: "Ajustes",
      description: "Preferencias de Boat OS",
    },
    Demo: {
      icon: "🧪",
      title: "Demo",
      description: "Simulación y desarrollo",
    },
  }

  const appGroups = [
    {
      title: "Navegación",
      apps: ["Plotter", "AIS", "Piloto"],
    },
    {
      title: "Barco",
      apps: ["Dashboard", "Energía", "Sistema", "Alertas", "Ajustes"],
    },
    ...(isDevelopmentMode
      ? [
          {
            title: "Desarrollo",
            apps: ["Demo"],
          },
        ]
      : []),
  ]

function getAppVisualState(appName) {
  const alerts = data?.alerts ?? []
  const hasCriticalAlert = alerts.some((alert) => alert.level === "critical")
  const hasWarningAlert = alerts.some((alert) => alert.level === "warning")
  const hasAisAlert = alerts.some((alert) => alert.source === "ais")
  const degraded = data?.meta?.degraded ?? false
  const batteryPercent = data?.battery?.percentage ?? 100

  if (appName === "Dashboard") {
    if (hasCriticalAlert) return { label: "Alerta crítica", color: theme.danger }
    if (hasWarningAlert) return { label: "Avisos", color: theme.warning }
    return { label: "Estable", color: theme.success }
  }

  if (appName === "AIS") {
    if (hasAisAlert && hasCriticalAlert) return { label: "Riesgo alto", color: theme.danger }
    if (hasAisAlert) return { label: "Vigilancia", color: theme.warning }
    return { label: "OK", color: theme.success }
  }

  if (appName === "Energía") {
    if (batteryPercent <= 20) return { label: "Crítica", color: theme.danger }
    if (batteryPercent <= 40) return { label: "Baja", color: theme.warning }
    return { label: "OK", color: theme.success }
  }

  if (appName === "Sistema") {
    if (!backendOnline) return { label: "Offline", color: theme.danger }
    if (degraded) return { label: "Degradado", color: theme.warning }
    return { label: "OK", color: theme.success }
  }

  if (appName === "Alertas") {
    if (hasCriticalAlert) return { label: "Críticas", color: theme.danger }
    if (alerts.length > 0) return { label: "Activas", color: theme.warning }
    return { label: "Sin alertas", color: theme.success }
  }

  if (appName === "Plotter") {
    return { label: "Pendiente", color: theme.warning }
  }

  if (appName === "Piloto") {
    return { label: "Bloqueado", color: theme.danger }
  }

  if (appName === "Ajustes") {
    return { label: "Local", color: theme.success }
  }

  if (appName === "Demo") {
    return { label: "Dev", color: theme.warning }
  }

  return { label: "OK", color: theme.success }
}

  const currentDefinition = appDefinitions[currentApp] ?? appDefinitions.Dashboard
  const currentContent = apps[currentApp] ?? apps.Dashboard

  const containerStyle = {
    ...styles.container,
    backgroundColor: theme.background,
    color: theme.text,
  }

  const appBoxStyle = {
    ...styles.appBox,
    width: tabletMode ? "min(1100px, 92vw)" : "min(980px, 88vw)",
    padding: tabletMode ? "34px" : "24px",
    backgroundColor: theme.panel,
    border: `1px solid ${theme.border}`,
    boxShadow: theme.shadow,
    color: theme.text,
  }

  const navButtonStyle = {
    ...styles.navButton,
    backgroundColor: theme.panel,
    color: theme.text,
    border: `1px solid ${theme.border}`,
    boxShadow: theme.shadow,
  }

  if (currentApp !== "desktop") {
    return (
      <div style={containerStyle}>
        <TopBar
          data={data}
          loading={loading}
          error={error}
          theme={theme}
          backendOnline={backendOnline}
          lastSuccessfulUpdate={lastSuccessfulUpdate}
          dataAgeSeconds={dataAgeSeconds}
        />

        {currentApp !== "Dashboard" && (
          <button style={navButtonStyle} onClick={() => setCurrentApp("Dashboard")}>
            ← Volver
          </button>
        )}

        {currentApp === "Dashboard" && (
          <button style={navButtonStyle} onClick={() => setCurrentApp("desktop")}>
            Apps
          </button>
        )}

        <h1 style={{ ...styles.title, color: theme.text }}>
          {currentDefinition.title}
        </h1>

        <div style={appBoxStyle}>
          <AppErrorBoundary
            theme={theme}
            resetKey={currentApp}
            onBack={() => setCurrentApp("Dashboard")}
          >
            {currentContent}
          </AppErrorBoundary>
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <TopBar
        data={data}
        loading={loading}
        error={error}
        theme={theme}
        backendOnline={backendOnline}
        lastSuccessfulUpdate={lastSuccessfulUpdate}
        dataAgeSeconds={dataAgeSeconds}
      />

      <h1 style={{ ...styles.title, color: theme.text }}>Aplicaciones</h1>

      <p style={{ ...styles.subtitle, color: theme.textMuted }}>
        Centro operativo de Boat OS
      </p>

      {appGroups.map((group) => (
        <section key={group.title} style={styles.section}>
          <h2 style={{ ...styles.sectionTitle, color: theme.text }}>
            {group.title}
          </h2>

          <div style={styles.grid}>
            {group.apps.map((appName) => {
            const app = appDefinitions[appName]
            const appState = getAppVisualState(appName)

            return (
                <button
                  key={appName}
                  style={{
                    ...styles.launcherCard,
                    backgroundColor: theme.card,
                    border: `1px solid ${appState.color}`,
                    boxShadow: theme.shadow,
                    color: theme.text,
                    minHeight: tabletMode ? "150px" : "135px",
                  }}
                  onClick={() => setCurrentApp(appName)}
                >
                  <div>
                    <span style={styles.appIcon}>{app.icon}</span>
                    <strong style={styles.appTitle}>{app.title}</strong>
                  </div>

                  <span style={{ ...styles.appDescription, color: theme.textMuted }}>
                    {app.description}
                  </span>
                  <span
                    style={{
                      ...styles.appStatus,
                      color: appState.color,
                      borderColor: appState.color,
                      backgroundColor: `${appState.color}22`,
                    }}
                  >
                    {appState.label}
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

const styles = {
  container: {
    minHeight: "100vh",
    textAlign: "center",
    paddingTop: "118px",
    paddingLeft: "16px",
    paddingRight: "16px",
    fontFamily: "Arial, sans-serif",
    transition: "background-color 0.2s ease, color 0.2s ease",
  },
  title: {
    marginTop: "10px",
    marginBottom: "8px",
  },
  subtitle: {
    marginBottom: "40px",
  },
  section: {
    marginBottom: "38px",
  },
  sectionTitle: {
    marginBottom: "18px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "22px",
    width: "min(980px, 92vw)",
    margin: "0 auto",
  },
  launcherCard: {
    borderRadius: "22px",
    cursor: "pointer",
    padding: "22px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "12px",
    textAlign: "left",
    transition: "transform 0.15s ease, border-color 0.15s ease",
    overflow: "hidden",
  },
  appIcon: {
    fontSize: "32px",
    display: "block",
    marginBottom: "6px",
  },
  appTitle: {
    fontSize: "18px",
    display: "block",
    lineHeight: 1.2,
  },
  appDescription: {
    fontSize: "14px",
    lineHeight: 1.35,
    display: "block",
  },
  appStatus: {
    marginTop: "6px",
    border: "1px solid",
    borderRadius: "999px",
    padding: "5px 10px",
    fontSize: "12px",
    fontWeight: "bold",
    display: "inline-block",
  },
  navButton: {
    position: "fixed",
    top: "86px",
    left: "20px",
    padding: "12px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    zIndex: 1001,
    fontWeight: "bold",
  },
  appBox: {
    margin: "0 auto",
    borderRadius: "20px",
    overflowX: "hidden",
  },
}

export default App