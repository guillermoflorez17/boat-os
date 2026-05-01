import { useEffect, useState } from "react"
import { getHealth } from "../services/api"

export function useHealthData(refreshTime = 5000) {
  const [health, setHealth] = useState(null)
  const [loadingHealth, setLoadingHealth] = useState(true)
  const [healthError, setHealthError] = useState(null)

  useEffect(() => {
    const loadHealth = async () => {
      try {
        const result = await getHealth()
        setHealth(result)
        setHealthError(null)
      } catch (err) {
        console.error("Error cargando health:", err)
        setHealthError(err)
      } finally {
        setLoadingHealth(false)
      }
    }

    loadHealth()

    const interval = setInterval(loadHealth, refreshTime)

    return () => clearInterval(interval)
  }, [refreshTime])

  return {
    health,
    loadingHealth,
    healthError,
  }
}