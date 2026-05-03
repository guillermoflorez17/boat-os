import { useState } from "react"

function getRiskColor(risk, theme) {
  if (risk === "Alto") return theme.danger
  if (risk === "Medio") return theme.warning
  return theme.success
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

function AIS({ data, loading, error, theme, tabletMode }) {
  const [selectedRangeNm, setSelectedRangeNm] = useState(6)

  if (loading) return <p style={{ color: theme.text }}>Cargando AIS...</p>
  if (error) return <p style={{ color: theme.danger }}>Error cargando AIS</p>

  const styles = getStyles(theme, tabletMode)

  const ownCourse = data?.gps?.course ?? 0
  const targets = data?.ais?.nearby ?? []
  const maxRangeNm = selectedRangeNm
  const guardZoneNm = data?.ais?.guardZoneNm ?? 1.5
  const aisSummary = data?.ais?.summary
  const visibleTargets = targets.filter((boat) => boat.distance <= maxRangeNm)
  const outOfRangeTargets = targets.filter((boat) => boat.distance > maxRangeNm)
  const allTargetsOutOfRange = targets.length > 0 && visibleTargets.length === 0

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>AIS táctico</h2>
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

      {aisSummary && (
        <div style={styles.tacticalSummary}>
          <div style={styles.summaryCard}>
            <span style={styles.summaryLabel}>Más cercano</span>
            <strong>
              {aisSummary.closestTarget ? aisSummary.closestTarget.name : "-"}
            </strong>
            <p style={styles.summaryText}>
              {aisSummary.closestTarget
                ? `${aisSummary.closestTarget.distance} NM · ${aisSummary.closestTarget.risk}`
                : "Sin objetivos"}
            </p>
          </div>

          <div style={styles.summaryCard}>
            <span style={styles.summaryLabel}>Más peligroso</span>
            <strong>
              {aisSummary.mostDangerousTarget
                ? aisSummary.mostDangerousTarget.name
                : "-"}
            </strong>
            <p style={styles.summaryText}>
              {aisSummary.mostDangerousTarget
                ? `CPA ${aisSummary.mostDangerousTarget.cpa} NM · TCPA ${formatTcpa(
                    aisSummary.mostDangerousTarget.tcpa
                  )}`
                : "Sin objetivos"}
            </p>
          </div>

          <div style={styles.summaryCard}>
            <span style={styles.summaryLabel}>Guard zone</span>
            <strong>{aisSummary.insideGuardZone}</strong>
            <p style={styles.summaryText}>Objetivos dentro</p>
          </div>

          <div style={styles.summaryCard}>
            <span style={styles.summaryLabel}>CPA futuro</span>
            <strong>{aisSummary.futureCpaTargets}</strong>
            <p style={styles.summaryText}>Objetivos aproximándose</p>
          </div>
        </div>
      )}
      {allTargetsOutOfRange && (
        <div style={styles.rangeWarning}>
          <strong>Objetivos fuera de rango</strong>
          <p>
            Hay {outOfRangeTargets.length} objetivo(s) AIS, pero ninguno dentro de {maxRangeNm} NM.
            Aumenta el rango para visualizarlos mejor.
          </p>
        </div>
      )}
      <div style={styles.layout}>
        <div style={styles.mapCard}>
          <div style={styles.mapHeader}>
            <strong>
              Vista táctica · {visibleTargets.length}/{targets.length} visibles
            </strong>

            <div style={styles.rangeButtons}>
              {[3, 6, 12, 24].map((range) => (
                <button
                  key={range}
                  style={{
                    ...styles.rangeButton,
                    backgroundColor:
                      selectedRangeNm === range ? theme.accent : theme.cardAlt,
                    color: selectedRangeNm === range ? "white" : theme.text,
                  }}
                  onClick={() => setSelectedRangeNm(range)}
                >
                  {range} NM
                </button>
              ))}
            </div>
          </div>

          <div style={styles.mapArea}>
            <div style={styles.ringOuter}></div>
            <div style={styles.ringMiddle}></div>

            <div
              style={{
                ...styles.guardZone,
                width: `${Math.min((guardZoneNm / maxRangeNm) * 84, 84)}%`,
                height: `${Math.min((guardZoneNm / maxRangeNm) * 84, 84)}%`,
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
              const position = getTargetPosition(
                boat.distance,
                boat.bearing,
                maxRangeNm
              )
              const riskColor = getRiskColor(boat.risk, theme)
              const outOfRange = boat.distance > maxRangeNm

              return (
                <div
                  key={boat.mmsi}
                  style={{
                    ...styles.target,
                    ...position,
                    color: riskColor,
                    opacity: outOfRange ? 0.65 : 1,
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
                      backgroundColor: riskColor,
                    }}
                  ></div>

                  <div style={styles.targetLabel}>
                    <strong>{boat.name}</strong>
                    <span>
                      {boat.distance} NM{outOfRange ? " · fuera" : ""}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={styles.mapLegend}>
            <span>
              <span
                style={{ ...styles.legendDot, backgroundColor: theme.danger }}
              ></span>
              Alto
            </span>

            <span>
              <span
                style={{ ...styles.legendDot, backgroundColor: theme.warning }}
              ></span>
              Medio
            </span>

            <span>
              <span
                style={{ ...styles.legendDot, backgroundColor: theme.success }}
              ></span>
              Bajo
            </span>

            <span>
              <span
                style={{
                  ...styles.legendDot,
                  backgroundColor: "transparent",
                  border: `2px solid ${theme.accent}`,
                }}
              ></span>
              Guard zone
            </span>
          </div>
        </div>

        <div style={styles.listCard}>
          <div style={styles.mapHeader}>
            <strong>Objetivos</strong>
            <span>Riesgo · CPA · distancia</span>
          </div>

          <div style={styles.targetList}>
            {targets.map((boat) => {
              const riskColor = getRiskColor(boat.risk, theme)

              return (
                <div
                  key={boat.mmsi}
                  style={{
                    ...styles.boatCard,
                    borderLeft: `7px solid ${riskColor}`,
                  }}
                >
                  <div style={styles.boatHeader}>
                    <div>
                      <strong style={styles.boatName}>{boat.name}</strong>
                      <p style={styles.boatType}>
                        {boat.type} · Prioridad {boat.priority ?? "-"}
                      </p>
                    </div>

                    <div
                      style={{
                        ...styles.riskBadge,
                        backgroundColor: riskColor,
                        color: boat.risk === "Medio" ? "#102230" : "white",
                      }}
                    >
                      {boat.risk}
                    </div>
                  </div>

                  <div style={styles.boatGrid}>
                    <DataItem label="MMSI" value={boat.mmsi} styles={styles} />
                    <DataItem
                      label="Distancia"
                      value={`${boat.distance} NM`}
                      styles={styles}
                    />
                    <DataItem
                      label="Bearing"
                      value={`${boat.bearing}°`}
                      styles={styles}
                    />
                    <DataItem
                      label="Rumbo"
                      value={`${boat.course}°`}
                      styles={styles}
                    />
                    <DataItem
                      label="Velocidad"
                      value={`${boat.speed} kn`}
                      styles={styles}
                    />
                    <DataItem
                      label="CPA"
                      value={`${boat.cpa} NM`}
                      styles={styles}
                    />
                    <DataItem
                      label="TCPA"
                      value={formatTcpa(boat.tcpa)}
                      styles={styles}
                    />
                    <DataItem
                      label="Encuentro"
                      value={boat.encounter}
                      styles={styles}
                    />
                  </div>
                </div>
              )
            })}

            {targets.length === 0 && (
              <p style={styles.subtitle}>No hay datos AIS disponibles</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function DataItem({ label, value, styles }) {
  return (
    <div>
      <span style={styles.label}>{label}</span>
      <strong style={styles.dataValue}>{value}</strong>
    </div>
  )
}

function getStyles(theme, tabletMode) {
  return {
    rangeWarning: {
      backgroundColor: "rgba(240, 180, 76, 0.14)",
      border: `1px solid ${theme.warning}`,
      borderRadius: "16px",
      padding: tabletMode ? "18px" : "14px",
      color: theme.text,
      boxShadow: theme.shadow,
    },
    container: {
      display: "flex",
      flexDirection: "column",
      gap: "22px",
      textAlign: "left",
      color: theme.text,
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "20px",
      flexWrap: "wrap",
    },
    title: {
      margin: 0,
      fontSize: tabletMode ? "30px" : "26px",
      color: theme.text,
    },
    subtitle: {
      color: theme.textMuted,
      marginTop: "6px",
    },
    summary: {
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
    },
    summaryBox: {
      minWidth: "110px",
      backgroundColor: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: "14px",
      padding: "12px 14px",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      boxShadow: theme.shadow,
      color: theme.text,
    },
    tacticalSummary: {
      display: "grid",
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
      gap: "16px",
    },
    summaryCard: {
      backgroundColor: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: "16px",
      padding: tabletMode ? "18px" : "14px",
      boxShadow: theme.shadow,
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },
    summaryLabel: {
      color: theme.textMuted,
      fontSize: "12px",
    },
    summaryText: {
      color: theme.textMuted,
      margin: 0,
      fontSize: "13px",
    },
    layout: {
      display: "grid",
      gridTemplateColumns: "1.1fr 1fr",
      gap: "20px",
      alignItems: "start",
    },
    mapCard: {
      backgroundColor: theme.surface,
      borderRadius: "18px",
      padding: "18px",
      border: `1px solid ${theme.border}`,
      boxShadow: theme.shadow,
    },
    listCard: {
      backgroundColor: theme.surface,
      borderRadius: "18px",
      padding: "18px",
      border: `1px solid ${theme.border}`,
      boxShadow: theme.shadow,
    },
    mapHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
      color: theme.text,
      gap: "12px",
    },
    rangeButtons: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
    },
    rangeButton: {
      border: `1px solid ${theme.border}`,
      borderRadius: "999px",
      padding: "6px 10px",
      fontWeight: "bold",
      cursor: "pointer",
    },
    mapArea: {
      position: "relative",
      width: "100%",
      aspectRatio: "1 / 1",
      borderRadius: "18px",
      backgroundColor: theme.card,
      border: `1px solid ${theme.border}`,
      overflow: "hidden",
    },
    ringOuter: {
      position: "absolute",
      width: "84%",
      height: "84%",
      border: `1px solid ${theme.border}`,
      borderRadius: "50%",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
    ringMiddle: {
      position: "absolute",
      width: "56%",
      height: "56%",
      border: `1px dashed ${theme.border}`,
      borderRadius: "50%",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
    guardZone: {
      position: "absolute",
      border: `2px solid ${theme.accent}`,
      borderRadius: "50%",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      opacity: 0.8,
    },
    crossVertical: {
      position: "absolute",
      left: "50%",
      top: 0,
      bottom: 0,
      width: "1px",
      backgroundColor: theme.border,
      transform: "translateX(-50%)",
    },
    crossHorizontal: {
      position: "absolute",
      top: "50%",
      left: 0,
      right: 0,
      height: "1px",
      backgroundColor: theme.border,
      transform: "translateY(-50%)",
    },
    northLabel: {
      position: "absolute",
      top: "10px",
      left: "50%",
      transform: "translateX(-50%)",
      color: theme.textMuted,
      fontWeight: "bold",
    },
    eastLabel: {
      position: "absolute",
      right: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      color: theme.textMuted,
      fontWeight: "bold",
    },
    southLabel: {
      position: "absolute",
      bottom: "10px",
      left: "50%",
      transform: "translateX(-50%)",
      color: theme.textMuted,
      fontWeight: "bold",
    },
    westLabel: {
      position: "absolute",
      left: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      color: theme.textMuted,
      fontWeight: "bold",
    },
    ownBoat: {
      position: "absolute",
      left: "50%",
      top: "50%",
      color: theme.accent,
      fontSize: "28px",
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
      boxShadow: "0 0 8px rgba(0,0,0,0.25)",
    },
    targetLabel: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontSize: "11px",
      color: theme.text,
      backgroundColor: theme.panel,
      border: `1px solid ${theme.border}`,
      padding: "4px 6px",
      borderRadius: "8px",
      whiteSpace: "nowrap",
      boxShadow: theme.shadow,
    },
    mapLegend: {
      display: "flex",
      gap: "14px",
      flexWrap: "wrap",
      marginTop: "16px",
      color: theme.text,
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
      backgroundColor: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: "16px",
      padding: "16px",
      boxShadow: theme.shadow,
    },
    boatHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "14px",
      gap: "12px",
    },
    boatName: {
      color: theme.text,
      fontSize: "18px",
    },
    boatType: {
      color: theme.textMuted,
      marginTop: "4px",
    },
    riskBadge: {
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
      color: theme.text,
    },
    label: {
      display: "block",
      color: theme.textMuted,
      fontSize: "12px",
      marginBottom: "4px",
    },
    dataValue: {
      color: theme.text,
    },
  }
}

export default AIS