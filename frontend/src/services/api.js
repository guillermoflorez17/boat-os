const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

async function request(endpoint) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`)

  if (!res.ok) {
    throw new Error(`Error API ${endpoint}`)
  }

  return await res.json()
}

export function getStatus() {
  return request("/status")
}

export function getHealth() {
  return request("/health")
}

export function getConfig() {
  return request("/config")
}