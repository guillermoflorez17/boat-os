import { useEffect, useRef } from "react"
import { useBoatData } from "../hooks/useBoatData"

function TopBar() {
  const { data, loading, error } = useBoatData()
  const alarmPlayed = useRef(false)

  const hasHighAisRisk = data?.ais?.nearby?.some((boat) => boat.risk === "Alto")

  useEffect(() => {
    if (hasHighAisRisk && !alarmPlayed.current) {
      const audio = new Audio("/alarm.mp3")
      audio.play().catch(() => {
        console.log("El navegador bloqueó el audio automático")
      })
      alarmPlayed.current = true
    }

    if (!hasHighAisRisk) {
      alarmPlayed.current = false
    }
  }, [hasHighAisRisk])

  if (loading) {
    return (
      <div style={styles.topBar}>
        <span style={styles.logo}>Boat OS</span>
        <span>Cargando sistema...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.topBar}>
        <span style={styles.logo}>Boat OS</span>
        <span style={styles.error}>Sin conexión backend</span>
      </div>
    )
  }

  return (
    <>
      <div style={styles.topBar}>
        <span style={styles.logo}>Boat OS</span>

        <div style={styles.status}>
          <span>🔋 {data.battery.voltage} V</span>
          <span>☀️ {data.solar.power} W</span>
          <span>📍 GPS {data.gps.status}</span>

          <span style={hasHighAisRisk ? styles.danger : undefined}>
            📡 AIS {hasHighAisRisk ? "RIESGO" : data.ais.status}
          </span>

          <span>📶 {data.connection.type}</span>
        </div>
      </div>

      {hasHighAisRisk && (
        <div style={styles.alertBox}>
          ⚠️ ALERTA AIS: barco con riesgo alto
        </div>
      )}
    </>
  )
}

const styles = {
  topBar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "56px",
    backgroundColor: "#07131d",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    boxSizing: "border-box",
    zIndex: 1000,
    fontFamily: "Arial, sans-serif",
    borderBottom: "1px solid #1f455f"
  },
  logo: {
    fontWeight: "bold",
    fontSize: "18px"
  },
  status: {
    display: "flex",
    gap: "18px",
    fontSize: "14px"
  },
  error: {
    color: "#ff6b6b"
  },
  danger: {
    color: "#ff4d4d",
    fontWeight: "bold"
  },
  alertBox: {
    position: "fixed",
    top: "70px",
    right: "20px",
    backgroundColor: "#8b0000",
    color: "white",
    padding: "14px 20px",
    borderRadius: "12px",
    fontWeight: "bold",
    zIndex: 1002,
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
  }
}

export default TopBar