function Dashboard({ data, loading, error }) {

  if (loading) {
    return <p>Cargando datos del barco...</p>
  }

  if (error) {
    return <p>Error cargando datos del barco</p>
  }

  return (
    <div>
      <h2>Dashboard</h2>
        {data.alerts?.length > 0 && (
          <div style={styles.alertPanel}>
            <strong>Alertas activas</strong>

            {data.alerts.map((alert) => (
              <div
                key={alert.id}
                style={{
                  ...styles.alertItem,
                  borderLeft: `5px solid ${
                    alert.level === "critical" ? "#ff4d4d" : "#ffb300"
                  }`
                }}
              >
                <strong>{alert.title}</strong>
                <p>{alert.message}</p>
              </div>
            ))}
          </div>
        )}
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
          border: data.alerts?.some(alert => alert.source === "ais")
            ? "2px solid #ffb300"
            : "none"
        }}>
          <strong>AIS</strong>
          <p>{data.ais.status}</p>
          <p>{data.ais.targets} barcos</p>

          {data.alerts?.some(alert => alert.source === "ais") && (
            <p style={styles.alert}>⚠️ Alerta AIS activa</p>
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
  },
    alertPanel: {
    backgroundColor: "#07131d",
    border: "1px solid #1f455f",
    borderRadius: "14px",
    padding: "18px",
    marginBottom: "20px",
    textAlign: "left"
  },
  alertItem: {
    backgroundColor: "#0b1d2a",
    borderRadius: "10px",
    padding: "12px",
    marginTop: "12px"
  },
}

export default Dashboard