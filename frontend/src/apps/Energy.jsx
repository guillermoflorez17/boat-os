import { useBoatData } from "../hooks/useBoatData"

function Energy() {
  const { data, loading, error } = useBoatData()

  if (loading) return <p>Cargando energía...</p>
  if (error) return <p>Error cargando energía</p>

  return (
    <div>
      <h2>Energía</h2>

      <div style={styles.grid}>
        <div style={styles.card}>
          <strong>Batería</strong>
          <p>Voltaje: {data.battery.voltage} V</p>
          <p>Carga: {data.battery.percentage}%</p>
          <p>Estado: {data.battery.status}</p>
        </div>

        <div style={styles.card}>
          <strong>Solar</strong>
          <p>Producción: {data.solar.power} W</p>
          <p>Hoy: {data.solar.dailyYield} kWh</p>
          <p>Estado: {data.solar.status}</p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
    marginTop: "20px"
  },
  card: {
    backgroundColor: "#0b1d2a",
    padding: "20px",
    borderRadius: "12px"
  }
}

export default Energy