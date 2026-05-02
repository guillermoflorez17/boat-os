import { InfoCard, SectionHeader, ServiceRow, StatusBadge } from "../components/ui"
import { useOpenCpn } from "../hooks/useOpenCpn"

function Plotter({ theme, tabletMode }) {
  const { status, loading, launching, error, lastResult, launch } = useOpenCpn()
  const styles = getStyles(theme, tabletMode)

  const enabled = status?.enabled ?? false

  return (
    <div style={styles.container}>
      <SectionHeader
        title="Plotter"
        subtitle="Integración prevista con OpenCPN"
        badge={
          <StatusBadge theme={theme} color={enabled ? theme.success : theme.warning}>
            {enabled ? "Preparado" : "Desactivado"}
          </StatusBadge>
        }
      />

      <div style={styles.mainPanel}>
        <div style={styles.plotterMock}>
          <div style={styles.gridLineVertical}></div>
          <div style={styles.gridLineHorizontal}></div>
          <div style={styles.routeLine}></div>

          <div style={styles.ownBoat}>▲</div>
          <div style={styles.markerOne}></div>
          <div style={styles.markerTwo}></div>

          <span style={styles.north}>N</span>
          <span style={styles.label}>OpenCPN launcher</span>
        </div>

        <div style={styles.infoPanel}>
          <h3 style={styles.panelTitle}>Control OpenCPN</h3>

          <p style={styles.description}>
            Boat OS usará OpenCPN como plotter náutico principal. Esta acción se ejecuta desde el backend local.
          </p>

          <button
            style={{
              ...styles.launchButton,
              opacity: enabled ? 1 : 0.55,
              cursor: enabled ? "pointer" : "not-allowed",
            }}
            disabled={!enabled || launching}
            onClick={launch}
          >
            {launching ? "Lanzando..." : "Abrir OpenCPN"}
          </button>

          {lastResult && (
            <div style={styles.resultBox}>
              <strong>
                {lastResult.launched ? "OpenCPN lanzado" : "No lanzado"}
              </strong>
              {lastResult.reason && <p>{lastResult.reason}</p>}
            </div>
          )}

          {error && (
            <div style={styles.errorBox}>
              Error comunicando con backend
            </div>
          )}
        </div>
      </div>

      <div style={styles.grid}>
        <InfoCard
          theme={theme}
          tabletMode={tabletMode}
          label="Estado"
          value={loading ? "Cargando..." : enabled ? "Activo" : "Desactivado"}
          description="Controlado desde backend/.env"
        />

        <InfoCard
          theme={theme}
          tabletMode={tabletMode}
          label="Plataforma"
          value={status?.platform ?? "-"}
          description="Sistema donde corre el backend"
        />

        <InfoCard
          theme={theme}
          tabletMode={tabletMode}
          label="Comando"
          value={status?.command ?? "-"}
          description="Comando local configurado"
        />
      </div>

      <div style={styles.panel}>
        <h3 style={styles.panelTitle}>Estado de integración</h3>

        <ServiceRow
          theme={theme}
          label="OpenCPN launcher"
          status={enabled ? "ACTIVO" : "DESACTIVADO"}
          color={enabled ? theme.success : theme.warning}
        />

        <ServiceRow
          theme={theme}
          label="Cartografía"
          status="OPENCPN"
          color={theme.success}
        />

        <ServiceRow
          theme={theme}
          label="Mapa propio Boat OS"
          status="FUTURO"
          color={theme.warning}
        />

        <ServiceRow
          theme={theme}
          label="Overlay AIS"
          status="FUTURO"
          color={theme.warning}
        />
      </div>
    </div>
  )
}

function getStyles(theme, tabletMode) {
  return {
    container: {
      display: "flex",
      flexDirection: "column",
      gap: "22px",
      textAlign: "left",
      color: theme.text,
    },
    mainPanel: {
      display: "grid",
      gridTemplateColumns: "1.2fr 0.8fr",
      gap: "18px",
    },
    plotterMock: {
      position: "relative",
      minHeight: tabletMode ? "360px" : "300px",
      backgroundColor: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: "18px",
      overflow: "hidden",
      boxShadow: theme.shadow,
    },
    gridLineVertical: {
      position: "absolute",
      left: "50%",
      top: 0,
      bottom: 0,
      width: "1px",
      backgroundColor: theme.border,
    },
    gridLineHorizontal: {
      position: "absolute",
      top: "50%",
      left: 0,
      right: 0,
      height: "1px",
      backgroundColor: theme.border,
    },
    routeLine: {
      position: "absolute",
      left: "22%",
      top: "62%",
      width: "55%",
      height: "3px",
      backgroundColor: theme.accent,
      transform: "rotate(-28deg)",
      borderRadius: "999px",
    },
    ownBoat: {
      position: "absolute",
      left: "48%",
      top: "55%",
      color: theme.accent,
      fontSize: "32px",
      transform: "translate(-50%, -50%) rotate(35deg)",
    },
    markerOne: {
      position: "absolute",
      left: "28%",
      top: "34%",
      width: "14px",
      height: "14px",
      borderRadius: "50%",
      backgroundColor: theme.warning,
    },
    markerTwo: {
      position: "absolute",
      right: "24%",
      bottom: "30%",
      width: "14px",
      height: "14px",
      borderRadius: "50%",
      backgroundColor: theme.success,
    },
    north: {
      position: "absolute",
      top: "16px",
      right: "18px",
      color: theme.textMuted,
      fontWeight: "bold",
    },
    label: {
      position: "absolute",
      left: "18px",
      bottom: "18px",
      color: theme.textMuted,
      fontWeight: "bold",
    },
    infoPanel: {
      backgroundColor: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: "18px",
      padding: "20px",
      boxShadow: theme.shadow,
    },
    panelTitle: {
      marginTop: 0,
      color: theme.text,
    },
    description: {
      color: theme.textMuted,
      marginTop: "10px",
    },
    launchButton: {
      width: "100%",
      marginTop: "18px",
      padding: tabletMode ? "16px" : "14px",
      borderRadius: "14px",
      border: `1px solid ${theme.accent}`,
      backgroundColor: theme.accent,
      color: "white",
      fontWeight: "bold",
      fontSize: tabletMode ? "18px" : "16px",
    },
    resultBox: {
      marginTop: "14px",
      padding: "12px",
      borderRadius: "12px",
      backgroundColor: theme.cardAlt,
      border: `1px solid ${theme.border}`,
      color: theme.text,
    },
    errorBox: {
      marginTop: "14px",
      padding: "12px",
      borderRadius: "12px",
      backgroundColor: "rgba(255, 107, 107, 0.14)",
      border: `1px solid ${theme.danger}`,
      color: theme.danger,
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: "16px",
    },
    panel: {
      backgroundColor: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: "16px",
      padding: "18px",
      boxShadow: theme.shadow,
    },
  }
}

export default Plotter