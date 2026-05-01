import { useBoatData } from "../hooks/useBoatData"

function getRiskColor(risk) {
  if (risk === "Alto") return "#ff4d4d"
  if (risk === "Medio") return "#ffaa00"
  return "#4caf50"
}

function AIS() {
  const { data, loading, error } = useBoatData()

  if (loading) return <p>Cargando AIS...</p>
  if (error) return <p>Error cargando AIS</p>

  return (
    <div>
      <h2>AIS</h2>

      <p>Estado: {data.ais.status}</p>
      <p>Objetivos detectados: {data.ais.targets}</p>

      <div style={styles.list}>
        {data.ais.nearby?.map((boat) => (
          
          <div key={boat.mmsi} style={{ ...styles.card, borderLeft: `6px solid ${getRiskColor(boat.risk)}` }}>
            <strong>{boat.name}</strong>
            <p>MMSI: {boat.mmsi}</p>
            <p>Distancia: {boat.distance} NM</p>
            <p>Rumbo: {boat.course}º</p>
            <p>Velocidad: {boat.speed} kn</p>
            <p>
              Riesgo: <strong style={{ color: getRiskColor(boat.risk) }}>{boat.risk}</strong></p>
          </div>
        ))}
        {!data.ais.nearby && <p>No hay datos AIS disponibles</p>}
      </div>
    </div>
  )
}

const styles = {
  list: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    marginTop: "20px"
  },
  card: {
    backgroundColor: "#0b1d2a",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "left"
  }
}

export default AIS