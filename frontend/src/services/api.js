const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

async function request(endpoint, options = {}) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  })

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

export function getPreferences() {
  return request("/preferences")
}

export function updatePreferences(preferences) {
  return request("/preferences", {
    method: "PUT",
    body: JSON.stringify(preferences),
  })
}

export function getOpenCpnStatus() {
  return request("/opencpn/status")
}

export function launchOpenCpn() {
  return request("/opencpn/launch", {
    method: "POST",
  })
}