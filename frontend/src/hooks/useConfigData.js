import { useEffect, useState } from "react"
import { getConfig } from "../services/api"

export function useConfigData(refreshTime = 10000) {
  const [config, setConfig] = useState(null)
  const [loadingConfig, setLoadingConfig] = useState(true)
  const [configError, setConfigError] = useState(null)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const result = await getConfig()
        setConfig(result)
        setConfigError(null)
      } catch (err) {
        console.error("Error cargando config:", err)
        setConfigError(err)
      } finally {
        setLoadingConfig(false)
      }
    }

    loadConfig()

    const interval = setInterval(loadConfig, refreshTime)

    return () => clearInterval(interval)
  }, [refreshTime])

  return {
    config,
    loadingConfig,
    configError,
  }
}