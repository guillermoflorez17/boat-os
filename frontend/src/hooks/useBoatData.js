import { useEffect, useState } from "react"
import { getStatus } from "../services/api"

export function useBoatData(refreshTime = 2000) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getStatus()
        setData(result)
        setError(null)
      } catch (err) {
        console.error("Error cargando datos del barco:", err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()

    const interval = setInterval(loadData, refreshTime)

    return () => clearInterval(interval)
  }, [refreshTime])

  return {
    data,
    loading,
    error
  }
}