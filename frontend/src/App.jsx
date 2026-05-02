import { useState } from "react"
import AIS from "./apps/AIS"
import Alerts from "./apps/Alerts"
import Dashboard from "./apps/Dashboard"
import Energy from "./apps/Energy"
import Pilot from "./apps/Pilot"
import Plotter from "./apps/Plotter"
import Settings from "./apps/Settings"
import System from "./apps/System"
import TopBar from "./components/TopBar"
import { useBoatData } from "./hooks/useBoatData"
import { themes, getLauncherButtonStyle } from "./styles/theme"

function App() {
  const [currentApp, setCurrentApp] = useState("Dashboard")
  const {
    data,
    loading,
    error,
    backendOnline,
    lastSuccessfulUpdate,
  } = useBoatData()

  const nightMode = data?.preferences?.display?.nightMode ?? true
  const tabletMode = data?.preferences?.display?.tabletMode ?? true

  const theme = nightMode ? themes.night : themes.day
  const launcherCardStyle = getLauncherButtonStyle(theme, tabletMode)

  const sharedProps = {
    data,
    loading,
    error,
    theme,
    tabletMode,
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
  }

  const containerStyle = {
    ...styles.container,
    backgroundColor: theme.background,
    color: theme.text,
  }

  const appBoxStyle = {
    ...styles.appBox,
    width: tabletMode ? "72%" : "62%",
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

        <h1 style={{ ...styles.title, color: theme.text }}>{currentApp}</h1>

        <div style={appBoxStyle}>
          {apps[currentApp]}
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
      />

      <h1 style={{ ...styles.title, color: theme.text }}>Aplicaciones</h1>
      <p style={{ ...styles.subtitle, color: theme.textMuted }}>
        Selecciona una sección del barco
      </p>

      <div style={styles.section}>
        <h2 style={{ ...styles.sectionTitle, color: theme.text }}>Navegación</h2>

        <div style={styles.grid}>
          <button style={launcherCardStyle} onClick={() => setCurrentApp("Plotter")}>Plotter</button>
          <button style={launcherCardStyle} onClick={() => setCurrentApp("AIS")}>AIS</button>
          <button style={launcherCardStyle} onClick={() => setCurrentApp("Piloto")}>Piloto</button>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={{ ...styles.sectionTitle, color: theme.text }}>Barco</h2>

        <div style={styles.grid}>
          <button style={launcherCardStyle} onClick={() => setCurrentApp("Dashboard")}>Dashboard</button>
          <button style={launcherCardStyle} onClick={() => setCurrentApp("Energía")}>Energía</button>
          <button style={launcherCardStyle} onClick={() => setCurrentApp("Sistema")}>Sistema</button>
          <button style={launcherCardStyle} onClick={() => setCurrentApp("Alertas")}>Alertas</button>
          <button style={launcherCardStyle} onClick={() => setCurrentApp("Ajustes")}>Ajustes</button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: "100vh",
    textAlign: "center",
    paddingTop: "90px",
    fontFamily: "Arial, sans-serif",
    transition: "background-color 0.2s ease, color 0.2s ease",
  },
  title: {
    marginBottom: "8px",
  },
  subtitle: {
    marginBottom: "40px",
  },
  section: {
    marginBottom: "34px",
  },
  sectionTitle: {
    marginBottom: "18px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 150px)",
    gap: "20px",
    justifyContent: "center",
  },
  navButton: {
    position: "fixed",
    top: "75px",
    left: "20px",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    zIndex: 1001,
    fontWeight: "bold",
  },
  appBox: {
    margin: "0 auto",
    borderRadius: "18px",
  },
}

export default App