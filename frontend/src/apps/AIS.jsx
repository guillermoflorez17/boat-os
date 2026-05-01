function getRiskColor(risk) {
  if (risk === "Alto") return "#ff4d4d"
  if (risk === "Medio") return "#ffb300"
  return "#4caf50"
}

function getTargetPosition(distanceNm, bearingDeg, maxRangeNm = 6) {
  const limitedDistance = Math.min(distanceNm, maxRangeNm)
  const radiusPercent = (limitedDistance / maxRangeNm) * 42

  const angleRad = ((bearingDeg - 90) * Math.PI) / 180
  const x = 50 + Math.cos(angleRad) * radiusPercent
  const y = 50 + Math.sin(angleRad) * radiusPercent

  return {
    left: `${x}%`,
    top: `${y}%`,
  }
}
function formatTcpa(tcpa) {
  if (tcpa < 0) return `Pasado hace ${Math.abs(tcpa)} min`
  if (tcpa === 0) return "Ahora"
  return `${tcpa} min`
}

function AIS({ data, loading, error }) {
  if (loading) return <p>Cargando AIS...</p>
  if (error) return <p>Error cargando AIS</p>

  const ownCourse = data?.gps?.course ?? 0
  const targets = data?.ais?.nearby ?? []
  const maxRangeNm = 6
  const guardZoneNm = data?.ais?.guardZoneNm ?? 1.5

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.sectionTitle}>AIS táctico</h2>
          <p style={styles.subtitle}>Vista rápida de tráfico cercano</p>
        </div>

        <div style={styles.summary}>
          <div style={styles.summaryBox}>
            <span style={styles.summaryLabel}>Estado</span>
            <strong>{data.ais.status}</strong>
          </div>

          <div style={styles.summaryBox}>
            <span style={styles.summaryLabel}>Objetivos</span>
            <strong>{data.ais.targets}</strong>
          </div>

          <div style={styles.summaryBox}>
            <span style={styles.summaryLabel}>Rumbo propio</span>
            <strong>{ownCourse}°</strong>
          </div>

          <div style={styles.summaryBox}>
            <span style={styles.summaryLabel}>Velocidad propia</span>
            <strong>{data.gps.speed} kn</strong>
          </div>
        </div>
      </div>

      <div style={styles.layout}>
        <div style={styles.mapCard}>
          <div style={styles.mapHeader}>
            <strong>Vista táctica</strong>
            <span>Rango {maxRangeNm} NM</span>
          </div>

          <div style={styles.mapArea}>
            <div style={styles.ringOuter}></div>
            <div style={styles.ringMiddle}></div>
            <div
              style={{
                ...styles.guardZone,
                width: `${(guardZoneNm / maxRangeNm) * 84}%`,
                height: `${(guardZoneNm / maxRangeNm) * 84}%`,
              }}
            ></div>

            <div style={styles.crossVertical}></div>
            <div style={styles.crossHorizontal}></div>

            <div style={styles.northLabel}>N</div>
            <div style={styles.eastLabel}>E</div>
            <div style={styles.southLabel}>S</div>
            <div style={styles.westLabel}>W</div>

            <div
              style={{
                ...styles.ownBoat,
                transform: `translate(-50%, -50%) rotate(${ownCourse}deg)`,
              }}
            >
              ▲
            </div>

            {targets.map((boat) => {
              const position = getTargetPosition(boat.distance, boat.bearing, maxRangeNm)

              return (
                <div
                  key={boat.mmsi}
                  style={{
                    ...styles.target,
                    ...position,
                    borderColor: getRiskColor(boat.risk),
                    color: getRiskColor(boat.risk),
                  }}
                  title={`${boat.name} • ${boat.distance} NM • CPA ${boat.cpa} NM`}
                >
                  <div
                    style={{
                      ...styles.targetArrow,
                      transform: `rotate(${boat.course}deg)`,
                    }}
                  >
                    ▲
                  </div>

                  <div
                    style={{
                      ...styles.targetDot,
                      backgroundColor: getRiskColor(boat.risk),
                    }}
                  ></div>

                  <div style={styles.targetLabel}>
                    <strong>{boat.name}</strong>
                    <span>{boat.distance} NM</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={styles.mapLegend}>
            <span><span style={{ ...styles.legendDot, backgroundColor: "#ff4d4d" }}></span> Alto</span>
            <span><span style={{ ...styles.legendDot, backgroundColor: "#ffb300" }}></span> Medio</span>
            <span><span style={{ ...styles.legendDot, backgroundColor: "#4caf50" }}></span> Bajo</span>
            <span><span style={{ ...styles.legendDot, backgroundColor: "transparent", border: "2px solid #2a6a8f" }}></span> Guard zone</span>
          </div>
        </div>

        <div style={styles.listCard}>
          <div style={styles.mapHeader}>
            <strong>Objetivos</strong>
            <span>Ordenados por prioridad visual</span>
          </div>

          <div style={styles.targetList}>
            {targets.map((boat) => (
              <div
                key={boat.mmsi}
                style={{
                  ...styles.boatCard,
                  borderLeft: `6px solid ${getRiskColor(boat.risk)}`
                }}
              >
                <div style={styles.boatHeader}>
                  <div>
                    <strong style={styles.boatName}>{boat.name}</strong>
                    <p style={styles.boatType}>{boat.type}</p>
                  </div>

                  <div
                    style={{
                      ...styles.riskBadge,
                      backgroundColor: getRiskColor(boat.risk),
                    }}
                  >
                    {boat.risk}
                  </div>
                </div>

                <div style={styles.boatGrid}>
                  <div><span style={styles.label}>MMSI</span><strong>{boat.mmsi}</strong></div>
                  <div><span style={styles.label}>Distancia</span><strong>{boat.distance} NM</strong></div>
                  <div><span style={styles.label}>Bearing</span><strong>{boat.bearing}°</strong></div>
                  <div><span style={styles.label}>Rumbo</span><strong>{boat.course}°</strong></div>
                  <div><span style={styles.label}>Velocidad</span><strong>{boat.speed} kn</strong></div>
                  <div><span style={styles.label}>CPA</span><strong>{boat.cpa} NM</strong></div>
                  <div><span style={styles.label}>TCPA</span><strong>{formatTcpa(boat.tcpa)}</strong></div>
                  <div><span style={styles.label}>Encuentro</span><strong>{boat.encounter}</strong></div>
                  <div><span style={styles.label}>Posición</span><strong>{boat.latitude}, {boat.longitude}</strong></div>
                </div>
              </div>
            ))}

            {targets.length === 0 && <p>No hay datos AIS disponibles</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    textAlign: "left",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    flexWrap: "wrap",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "28px",
    color: "white",
  },
  subtitle: {
    color: "#9fb3c8",
    marginTop: "6px",
  },
  summary: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  summaryBox: {
    minWidth: "110px",
    backgroundColor: "#0b1d2a",
    border: "1px solid #1f455f",
    borderRadius: "12px",
    padding: "12px 14px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  summaryLabel: {
    color: "#8fa8bb",
    fontSize: "12px",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1.1fr 1fr",
    gap: "20px",
    alignItems: "start",
  },
  mapCard: {
    backgroundColor: "#0f2838",
    borderRadius: "16px",
    padding: "18px",
    border: "1px solid #1f455f",
  },
  listCard: {
    backgroundColor: "#0f2838",
    borderRadius: "16px",
    padding: "18px",
    border: "1px solid #1f455f",
  },
  mapHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    color: "#d7e4ee",
  },
  mapArea: {
    position: "relative",
    width: "100%",
    aspectRatio: "1 / 1",
    borderRadius: "16px",
    backgroundColor: "#07131d",
    border: "1px solid #1f455f",
    overflow: "hidden",
  },
  ringOuter: {
    position: "absolute",
    width: "84%",
    height: "84%",
    border: "1px solid #244a63",
    borderRadius: "50%",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  ringMiddle: {
    position: "absolute",
    width: "56%",
    height: "56%",
    border: "1px dashed #244a63",
    borderRadius: "50%",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  guardZone: {
    position: "absolute",
    border: "2px solid #2a6a8f",
    borderRadius: "50%",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  crossVertical: {
    position: "absolute",
    left: "50%",
    top: 0,
    bottom: 0,
    width: "1px",
    backgroundColor: "#17384b",
    transform: "translateX(-50%)",
  },
  crossHorizontal: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: "1px",
    backgroundColor: "#17384b",
    transform: "translateY(-50%)",
  },
  northLabel: {
    position: "absolute",
    top: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    color: "#8fa8bb",
    fontWeight: "bold",
  },
  eastLabel: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#8fa8bb",
    fontWeight: "bold",
  },
  southLabel: {
    position: "absolute",
    bottom: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    color: "#8fa8bb",
    fontWeight: "bold",
  },
  westLabel: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#8fa8bb",
    fontWeight: "bold",
  },
  ownBoat: {
    position: "absolute",
    left: "50%",
    top: "50%",
    color: "#4fc3f7",
    fontSize: "26px",
    transformOrigin: "center center",
  },
  target: {
    position: "absolute",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  targetArrow: {
    fontSize: "12px",
    lineHeight: 1,
  },
  targetDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    boxShadow: "0 0 8px rgba(255,255,255,0.15)",
  },
  targetLabel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: "11px",
    color: "white",
    backgroundColor: "rgba(7, 19, 29, 0.9)",
    padding: "4px 6px",
    borderRadius: "8px",
    whiteSpace: "nowrap",
  },
  mapLegend: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
    marginTop: "16px",
    color: "#d7e4ee",
    fontSize: "13px",
  },
  legendDot: {
    display: "inline-block",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    marginRight: "6px",
    verticalAlign: "middle",
  },
  targetList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  boatCard: {
    backgroundColor: "#07131d",
    borderRadius: "14px",
    padding: "16px",
  },
  boatHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "14px",
    gap: "12px",
  },
  boatName: {
    color: "white",
    fontSize: "18px",
  },
  boatType: {
    color: "#8fa8bb",
    marginTop: "4px",
  },
  riskBadge: {
    color: "#07131d",
    fontWeight: "bold",
    padding: "6px 10px",
    borderRadius: "999px",
    minWidth: "70px",
    textAlign: "center",
  },
  boatGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
    color: "white",
  },
  label: {
    display: "block",
    color: "#8fa8bb",
    fontSize: "12px",
    marginBottom: "4px",
  },
}

export default AIS