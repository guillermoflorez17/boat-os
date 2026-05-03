from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.boat_simulator import (
    get_simulator_status,
    reset_simulation,
    set_simulator_scenario,
)
from services.config_service import build_config
from services.health_service import build_health
from services.preferences_service import get_preferences, update_preferences
from services.status_service import build_status
from config import BOAT_OS_MODE
from services.opencpn_service import get_opencpn_status, launch_opencpn


app = FastAPI(title="Boat OS Backend")
def require_development_mode():
    if BOAT_OS_MODE != "development":
        raise HTTPException(
            status_code=403,
            detail="Endpoint disponible solo en modo development"
        )

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Boat OS backend funcionando"
    }


@app.get("/health")
def health():
    return build_health()


@app.get("/config")
def config():
    return build_config()


@app.get("/preferences")
def preferences():
    return get_preferences()


@app.put("/preferences")
def preferences_update(preferences: dict):
    return update_preferences(preferences)

@app.get("/opencpn/status")
def opencpn_status():
    return get_opencpn_status()


@app.post("/opencpn/launch")
def opencpn_launch():
    return launch_opencpn()

@app.get("/simulator/status")
def simulator_status():
    return get_simulator_status()


@app.post("/simulator/reset")
def simulator_reset():
    require_development_mode()
    return reset_simulation()
    
@app.post("/simulator/scenario/{scenario}")
def simulator_scenario(scenario: str):
    require_development_mode()
    return set_simulator_scenario(scenario)

@app.get("/status")
def status():
    return build_status()