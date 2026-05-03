from datetime import datetime, timezone

from config import (
    AIS_CPA_CRITICAL_NM,
    AIS_CPA_WARNING_NM,
    AIS_GUARD_ZONE_NM,
    AIS_TCPA_CRITICAL_MIN,
    AIS_TCPA_WARNING_MIN,
    BOAT_OS_MODE,
)

from services.ais_engine import build_ais_summary, build_ais_targets
from services.alert_service import build_alerts
from services.data_provider import (
    get_boat_ais_targets,
    get_boat_connection_status,
    get_boat_ownship,
    get_boat_power_status,
    get_boat_raspberry_status,
    get_data_source,
)
from services.preferences_service import DEFAULT_PREFERENCES, get_preferences


def safe_call(callback, fallback, errors, service_name):
    try:
        result = callback()

        if result is None:
            errors.append({
                "service": service_name,
                "message": "Servicio sin datos, usando fallback"
            })
            return fallback

        return result

    except Exception as error:
        errors.append({
            "service": service_name,
            "message": str(error)
        })
        print(f"[Boat OS] Error en {service_name}: {error}")
        return fallback


def build_status():
    errors = []
    data_source = get_data_source()

    ownship = safe_call(get_boat_ownship, {
        "latitude": 0,
        "longitude": 0,
        "speed": 0,
        "course": 0,
        "heading": 0,
    }, errors, "ownship")

    raw_targets = safe_call(
        get_boat_ais_targets,
        [],
        errors,
        "ais_targets"
    )

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
    }, errors, "power")

    raspberry_status = safe_call(get_boat_raspberry_status, {
        "temperature": 0,
        "cpu": 0,
        "ram": 0,
        "platform": "unknown",
        "monitor": "fallback",
    }, errors, "system_monitor")

    preferences = safe_call(
        get_preferences,
        DEFAULT_PREFERENCES,
        errors,
        "preferences"
    )

    connection_status = safe_call(get_boat_connection_status, {
        "type": "offline",
        "status": "Sin datos"
    }, errors, "connection")

    try:
        ais_targets = build_ais_targets(ownship, raw_targets)
    except Exception as error:
        errors.append({
            "service": "ais_engine",
            "message": str(error)
        })
        print(f"[Boat OS] Error calculando AIS: {error}")
        ais_targets = []

    high_risk_targets = [
        target for target in ais_targets
        if target["risk"] == "Alto"
    ]
    ais_summary = build_ais_summary(ais_targets, AIS_GUARD_ZONE_NM)
    try:
        alerts = build_alerts(
            power_status["battery"],
            raspberry_status,
            ais_targets,
            preferences
        )
    except Exception as error:
        errors.append({
            "service": "alerts",
            "message": str(error)
        })
        print(f"[Boat OS] Error generando alertas: {error}")
        alerts = []

    return {
        "meta": {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "dataSource": data_source,
            "mode": BOAT_OS_MODE,
            "degraded": len(errors) > 0,
            "errors": errors
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
            "summary": ais_summary,
            "nearby": ais_targets,
        },
        "alerts": alerts,
        "preferences": preferences,
        "connection": connection_status,
        "raspberry": raspberry_status
    }