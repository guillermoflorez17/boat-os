import { useEffect, useState } from "react"
import { getPreferences, updatePreferences } from "../services/api"

export function usePreferencesData() {
  const [preferences, setPreferences] = useState(null)
  const [loadingPreferences, setLoadingPreferences] = useState(true)
  const [preferencesError, setPreferencesError] = useState(null)
  const [savingPreferences, setSavingPreferences] = useState(false)

  useEffect(() => {
    loadPreferences()
  }, [])

  async function loadPreferences() {
    try {
      const result = await getPreferences()
      setPreferences(result)
      setPreferencesError(null)
    } catch (err) {
      console.error("Error cargando preferencias:", err)
      setPreferencesError(err)
    } finally {
      setLoadingPreferences(false)
    }
  }

  async function savePreferences(nextPreferences) {
    setSavingPreferences(true)

    try {
      const result = await updatePreferences(nextPreferences)
      setPreferences(result)
      setPreferencesError(null)
    } catch (err) {
      console.error("Error guardando preferencias:", err)
      setPreferencesError(err)
    } finally {
      setSavingPreferences(false)
    }
  }

  return {
    preferences,
    loadingPreferences,
    preferencesError,
    savingPreferences,
    savePreferences,
  }
}