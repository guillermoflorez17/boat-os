import { useEffect, useState } from "react"
import {
  getSimulatorStatus,
  resetSimulator,
  setSimulatorScenario,
} from "../services/api"

export function useSimulator() {
  const [simulator, setSimulator] = useState(null)
  const [loadingSimulator, setLoadingSimulator] = useState(true)
  const [simulatorError, setSimulatorError] = useState(null)
  const [working, setWorking] = useState(false)
  const [lastAction, setLastAction] = useState(null)

  useEffect(() => {
    loadSimulator()
  }, [])

  async function loadSimulator() {
    try {
      const result = await getSimulatorStatus()
      setSimulator(result)
      setSimulatorError(null)
    } catch (error) {
      console.error("Error cargando simulador:", error)
      setSimulatorError(error)
    } finally {
      setLoadingSimulator(false)
    }
  }

  async function reset() {
    setWorking(true)
    setLastAction(null)

    try {
      const result = await resetSimulator()
      setLastAction(result.reset ? "Simulador reiniciado" : "No se pudo reiniciar")
      await loadSimulator()
    } catch (error) {
      console.error("Error reiniciando simulador:", error)
      setLastAction("Error reiniciando simulador")
    } finally {
      setWorking(false)
    }
  }

  async function changeScenario(scenario) {
    setWorking(true)
    setLastAction(null)

    try {
      const result = await setSimulatorScenario(scenario)
      setLastAction(
        result.changed
          ? `Escenario cambiado: ${scenario}`
          : "No se pudo cambiar escenario"
      )
      await loadSimulator()
    } catch (error) {
      console.error("Error cambiando escenario:", error)
      setLastAction("Error cambiando escenario")
    } finally {
      setWorking(false)
    }
  }

  return {
    simulator,
    loadingSimulator,
    simulatorError,
    working,
    lastAction,
    reset,
    changeScenario,
    loadSimulator,
  }
}