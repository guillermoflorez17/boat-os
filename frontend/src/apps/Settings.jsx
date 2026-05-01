function Settings() {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Ajustes</h2>
          <p style={styles.subtitle}>Preferencias de uso de Boat OS</p>
        </div>

        <div style={styles.badge}>
          Local
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Alertas y alarmas</h3>

        <div style={styles.grid}>
          <div style={styles.card}>
            <span style={styles.label}>Alarma sonora</span>
            <strong>Activada</strong>
            <p>Sonará ante alertas críticas.</p>
          </div>

          <div style={styles.card}>
            <span style={styles.label}>Alertas AIS</span>
            <strong>Activadas</strong>
            <p>Avisos por riesgo de aproximación.</p>
          </div>

          <div style={styles.card}>
            <span style={styles.label}>Alertas de energía</span>
            <strong>Activadas</strong>
            <p>Batería baja y estado de carga.</p>
          </div>

          <div style={styles.card}>
            <span style={styles.label}>Alertas sistema</span>
            <strong>Activadas</strong>
            <p>Temperatura y estado Raspberry.</p>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Pantalla</h3>

        <div style={styles.grid}>
          <div style={styles.card}>
            <span style={styles.label}>Modo visual</span>
            <strong>Nocturno</strong>
            <p>Interfaz oscura para navegación nocturna.</p>
          </div>

          <div style={styles.card}>
            <span style={styles.label}>Interfaz tablet</span>
            <strong>Activa</strong>
            <p>Botones grandes y lectura rápida.</p>
          </div>

          <div style={styles.card}>
            <span style={styles.label}>Brillo</span>
            <strong>Pendiente</strong>
            <p>Control futuro desde Raspberry/tablet.</p>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Navegación</h3>

        <div style={styles.grid}>
          <div style={styles.card}>
            <span style={styles.label}>Vista AIS</span>
            <strong>Táctica</strong>
            <p>Objetivos cercanos, CPA, TCPA y riesgo.</p>
          </div>

          <div style={styles.card}>
            <span style={styles.label}>Plotter</span>
            <strong>OpenCPN</strong>
            <p>Uso previsto como plotter principal.</p>
          </div>

          <div style={styles.card}>
            <span style={styles.label}>Unidades</span>
            <strong>NM / kn</strong>
            <p>Millas náuticas y nudos.</p>
          </div>
        </div>
      </div>

      <div style={styles.notice}>
        <strong>Nota técnica</strong>
        <p>
          Estos ajustes todavía son informativos. El siguiente paso será crear
          preferencias reales persistentes en backend para activar/desactivar
          alarmas, modo nocturno y otros parámetros desde la interfaz.
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    textAlign: "left",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    color: "white",
  },
  subtitle: {
    color: "#9fb3c8",
    marginTop: "6px",
  },
  badge: {
    backgroundColor: "#123247",
    color: "#9fb3c8",
    border: "1px solid #1f455f",
    borderRadius: "999px",
    padding: "8px 14px",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  sectionTitle: {
    margin: 0,
    color: "white",
    fontSize: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
  },
  card: {
    backgroundColor: "#07131d",
    border: "1px solid #1f455f",
    borderRadius: "14px",
    padding: "18px",
    minHeight: "105px",
  },
  label: {
    display: "block",
    color: "#8fa8bb",
    fontSize: "13px",
    marginBottom: "8px",
  },
  notice: {
    backgroundColor: "#07131d",
    border: "1px solid #1f455f",
    borderRadius: "14px",
    padding: "18px",
    color: "#d7e4ee",
  },
}

export default Settings