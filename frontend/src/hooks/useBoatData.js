import { useEffect, useRef, useState } from "react"
import { getStatus } from "../services/api"

export function useBoatData(refreshTime = 2000) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [backendOnline, setBackendOnline] = useState(false)
  const [lastSuccessfulUpdate, setLastSuccessfulUpdate] = useState(null)

  const dataRef = useRef(null)

  useEffect(() => {
    let mounted = true

    const loadData = async () => {
      try {
        const result = await getStatus()

        if (!mounted) return

        dataRef.current = result
        setData(result)
        setError(null)
        setBackendOnline(true)
        setLastSuccessfulUpdate(new Date())
      } catch (err) {
        console.error("Error cargando datos del barco:", err)

        if (!mounted) return

        setBackendOnline(false)

        if (!dataRef.current) {
          setError(err)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadData()

    const interval = setInterval(loadData, refreshTime)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [refreshTime])

  return {
    data,
    loading,
    error,
    backendOnline,
    lastSuccessfulUpdate,
  }
}