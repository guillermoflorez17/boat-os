import { useBoatData } from "../hooks/useBoatData"

function Dashboard() {
  const { data, loading, error } = useBoatData()

  if (loading) {
    return <p>Cargando datos del barco...</p>
  }

  if (error) {
    return <p>Error cargando datos del barco</p>
  }

  return (
    <div>
      <h2>Dashboard</h2>

      <div style={styles.grid}>
        <div style={styles.card}>
          <strong>Batería</strong>
          <p>{data.battery.voltage} V</p>
          <p>{data.battery.percentage}%</p>
        </div>

        <div style={styles.card}>
          <strong>Solar</strong>
          <p>{data.solar.power} W</p>
          <p>{data.solar.status}</p>
        </div>

        <div style={styles.card}>
          <strong>GPS</strong>
          <p>{data.gps.status}</p>
          <p>{data.gps.latitude}, {data.gps.longitude}</p>
        </div>

          <div style={{
          ...styles.card,
          border: data.ais.nearby?.some(boat => boat.risk === "Alto")
            ? "2px solid #ff4d4d"
            : "none"
        }}>
          <strong>AIS</strong>
          <p>{data.ais.status}</p>
          <p>{data.ais.targets} barcos</p>

          {data.ais.nearby?.some(boat => boat.risk === "Alto") && (
            <p style={styles.alert}>⚠️ Riesgo AIS alto</p>
          )}
        </div>

        <div style={styles.card}>
          <strong>Conexión</strong>
          <p>{data.connection.type}</p>
          <p>{data.connection.status}</p>
        </div>

        <div style={styles.card}>
          <strong>Raspberry</strong>
          <p>{data.raspberry.temperature} ºC</p>
          <p>CPU {data.raspberry.cpu}%</p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    marginTop: "20px"
  },
  card: {
  backgroundColor: "#0b1d2a",
  padding: "20px",
  borderRadius: "12px"
  },
  alert: {
    color: "#ff4d4d",
    fontWeight: "bold"
  }
}

export default Dashboard