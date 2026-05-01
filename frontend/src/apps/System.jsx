import { useBoatData } from "../hooks/useBoatData"

function System() {
  const { data, loading, error } = useBoatData()

  if (loading) return <p>Cargando sistema...</p>
  if (error) return <p>Error cargando sistema</p>

  return (
    <div>
      <h2>Sistema</h2>

      <div style={styles.grid}>
        <div style={styles.card}>
          <strong>Temperatura Raspberry</strong>
          <p>{data.raspberry.temperature} ºC</p>
        </div>

        <div style={styles.card}>
          <strong>CPU</strong>
          <p>{data.raspberry.cpu}%</p>
        </div>

        <div style={styles.card}>
          <strong>RAM</strong>
          <p>{data.raspberry.ram}%</p>
        </div>

        <div style={styles.card}>
          <strong>Conexión</strong>
          <p>{data.connection.type}</p>
          <p>{data.connection.status}</p>
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

export default System