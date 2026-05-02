from datetime import datetime, timezone

from config import (
    AIS_CPA_CRITICAL_NM,
    AIS_CPA_WARNING_NM,
    AIS_GUARD_ZONE_NM,
    AIS_TCPA_CRITICAL_MIN,
    AIS_TCPA_WARNING_MIN,
)

from services.ais_engine import build_ais_targets
from services.alert_service import build_alerts
from services.data_provider import (
    get_boat_ais_targets,
    get_boat_connection_status,
    get_boat_ownship,
    get_boat_power_status,
    get_boat_raspberry_status,
    get_data_source,
)
from services.preferences_service import get_preferences


def safe_call(callback, fallback):
    try:
        result = callback()
        return result if result is not None else fallback
    except Exception as error:
        print(f"[Boat OS] Error en servicio: {error}")
        return fallback


def build_status():
    data_source = get_data_source()

    ownship = safe_call(get_boat_ownship, {
        "latitude": 0,
        "longitude": 0,
        "speed": 0,
        "course": 0,
        "heading": 0,
    })

    raw_targets = safe_call(get_boat_ais_targets, [])

    power_status = safe_call(get_boat_power_status, {
        "battery": {
            "voltage": 0,
            "percentage": 0,
            "status": "Sin datos"
        },
        "solar": {
            "power": 0,
            "dailyYield": 0,
            "status": "Sin datos"
        }
    })

    raspberry_status = safe_call(get_boat_raspberry_status, {
        "temperature": 0,
        "cpu": 0,
        "ram": 0,
        "platform": "unknown",
        "monitor": "fallback",
    })

    preferences = safe_call(get_preferences, {
        "alerts": {
            "soundEnabled": True,
            "aisAlertsEnabled": True,
            "energyAlertsEnabled": True,
            "systemAlertsEnabled": True
        },
        "display": {
            "nightMode": True,
            "tabletMode": True
        },
        "navigation": {
            "units": "nm_kn",
            "aisView": "tactical"
        }
    })

    try:
        ais_targets = build_ais_targets(ownship, raw_targets)
    except Exception as error:
        print(f"[Boat OS] Error calculando AIS: {error}")
        ais_targets = []

    high_risk_targets = [
        target for target in ais_targets
        if target["risk"] == "Alto"
    ]

    try:
        alerts = build_alerts(
            power_status["battery"],
            raspberry_status,
            ais_targets,
            preferences
        )
    except Exception as error:
        print(f"[Boat OS] Error generando alertas: {error}")
        alerts = []

    return {
        "meta": {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "dataSource": data_source,
            "mode": "development"
        },
        "battery": power_status["battery"],
        "solar": power_status["solar"],
        "gps": {
            "status": "OK",
            "latitude": ownship["latitude"],
            "longitude": ownship["longitude"],
            "speed": ownship["speed"],
            "course": ownship["course"],
            "heading": ownship["heading"],
        },
        "ais": {
            "status": "Simulado",
            "targets": len(ais_targets),
            "guardZoneNm": AIS_GUARD_ZONE_NM,
            "riskConfig": {
                "criticalCpaNm": AIS_CPA_CRITICAL_NM,
                "criticalTcpaMin": AIS_TCPA_CRITICAL_MIN,
                "warningCpaNm": AIS_CPA_WARNING_NM,
                "warningTcpaMin": AIS_TCPA_WARNING_MIN,
            },
            "highRiskTargets": len(high_risk_targets),
            "nearby": ais_targets,
        },
        "alerts": alerts,
        "preferences": preferences,
        "connection": safe_call(get_boat_connection_status, {
            "type": "offline",
            "status": "Sin datos"
        }),
        "raspberry": raspberry_status
    }