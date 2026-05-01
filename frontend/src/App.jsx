import { useState } from "react"
import AIS from "./apps/AIS"
import Energy from "./apps/Energy"
import Plotter from "./apps/Plotter"
import Pilot from "./apps/Pilot"
import System from "./apps/System"
import Settings from "./apps/Settings"
import Dashboard from "./apps/Dashboard"
import TopBar from "./components/TopBar"

function App() {
  const [currentApp, setCurrentApp] = useState("Dashboard")

  const apps = {
    Dashboard: <Dashboard />,
    Plotter: <Plotter />,
    AIS: <AIS />,
    Energía: <Energy />,
    Piloto: <Pilot />,
    Sistema: <System />,
    Ajustes: <Settings />
  }

  if (currentApp !== "desktop") {
    return (
      <div style={styles.container}>
        <TopBar />

        {currentApp !== "Dashboard" && (
          <button style={styles.backButton} onClick={() => setCurrentApp("Dashboard")}>
            ← Volver
          </button>
        )}

        {currentApp === "Dashboard" && (
          <button style={styles.appsButton} onClick={() => setCurrentApp("desktop")}>
            Apps
          </button>
        )}

        <h1 style={styles.title}>{currentApp}</h1>

        <div style={styles.appBox}>
          {apps[currentApp]}
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <TopBar />

      <h1 style={styles.title}>Aplicaciones</h1>
      <p style={styles.subtitle}>Selecciona una sección del barco</p>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Navegación</h2>

        <div style={styles.grid}>
          <button style={styles.card} onClick={() => setCurrentApp("Plotter")}>Plotter</button>
          <button style={styles.card} onClick={() => setCurrentApp("AIS")}>AIS</button>
          <button style={styles.card} onClick={() => setCurrentApp("Piloto")}>Piloto</button>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Barco</h2>

        <div style={styles.grid}>
          <button style={styles.card} onClick={() => setCurrentApp("Dashboard")}>Dashboard</button>
          <button style={styles.card} onClick={() => setCurrentApp("Energía")}>Energía</button>
          <button style={styles.card} onClick={() => setCurrentApp("Sistema")}>Sistema</button>
          <button style={styles.card} onClick={() => setCurrentApp("Ajustes")}>Ajustes</button>
        </div>
      </div>
  </div>
)
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0b1d2a",
    color: "white",
    textAlign: "center",
    paddingTop: "90px",
    fontFamily: "Arial, sans-serif"
  },
  title: {
  marginBottom: "8px"
  },
  subtitle: {
    marginBottom: "40px",
    color: "#9fb3c8"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 150px)",
    gap: "20px",
    justifyContent: "center"
  },
  card: {
    height: "110px",
    fontSize: "16px",
    borderRadius: "16px",
    border: "1px solid #1f455f",
    cursor: "pointer",
    backgroundColor: "#123247",
    color: "white",
    fontWeight: "bold"
},
  backButton: {
    position: "fixed",
    top: "75px",
    left: "20px",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    zIndex: 1001
  },
appsButton: {
  position: "fixed",
  top: "75px",
  left: "20px",
  padding: "10px 16px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  zIndex: 1001
},  
  appBox: {
    backgroundColor: "#123247",
    margin: "0 auto",
    padding: "30px",
    borderRadius: "12px",
    width: "60%"
  }
}

export default App