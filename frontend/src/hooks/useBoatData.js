import { useEffect, useRef, useState } from "react"
import { getStatus } from "../services/api"

export function useBoatData(refreshTime = 2000) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [backendOnline, setBackendOnline] = useState(false)
  const [lastSuccessfulUpdate, setLastSuccessfulUpdate] = useState(null)
  const [dataAgeSeconds, setDataAgeSeconds] = useState(null)

  const dataRef = useRef(null)
  const lastUpdateRef = useRef(null)

  useEffect(() => {
    let mounted = true

    const updateDataAge = () => {
      if (!lastUpdateRef.current) {
        setDataAgeSeconds(null)
        return
      }

      const age = Math.round((Date.now() - lastUpdateRef.current.getTime()) / 1000)
      setDataAgeSeconds(age)
    }

    const loadData = async () => {
      try {
        const result = await getStatus()

        if (!mounted) return

        const now = new Date()

        dataRef.current = result
        lastUpdateRef.current = now

        setData(result)
        setError(null)
        setBackendOnline(true)
        setLastSuccessfulUpdate(now)
        setDataAgeSeconds(0)
      } catch (err) {
        console.error("Error cargando datos del barco:", err)

        if (!mounted) return

        setBackendOnline(false)
        updateDataAge()

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

    const dataInterval = setInterval(loadData, refreshTime)
    const ageInterval = setInterval(updateDataAge, 1000)

    return () => {
      mounted = false
      clearInterval(dataInterval)
      clearInterval(ageInterval)
    }
  }, [refreshTime])

  return {
    data,
    loading,
    error,
    backendOnline,
    lastSuccessfulUpdate,
    dataAgeSeconds,
  }
}