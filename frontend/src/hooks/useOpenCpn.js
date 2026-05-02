import { useEffect, useState } from "react"
import { getOpenCpnStatus, launchOpenCpn } from "../services/api"

export function useOpenCpn() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [launching, setLaunching] = useState(false)
  const [error, setError] = useState(null)
  const [lastResult, setLastResult] = useState(null)

  useEffect(() => {
    loadStatus()
  }, [])

  async function loadStatus() {
    try {
      const result = await getOpenCpnStatus()
      setStatus(result)
      setError(null)
    } catch (err) {
      console.error("Error cargando estado OpenCPN:", err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  async function launch() {
    setLaunching(true)

    try {
      const result = await launchOpenCpn()
      setLastResult(result)
      await loadStatus()
    } catch (err) {
      console.error("Error lanzando OpenCPN:", err)
      setError(err)
    } finally {
      setLaunching(false)
    }
  }

  return {
    status,
    loading,
    launching,
    error,
    lastResult,
    launch,
  }
}