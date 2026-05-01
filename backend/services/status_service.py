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


def build_status():
    data_source = get_data_source()

    ownship = get_boat_ownship()
    raw_targets = get_boat_ais_targets()
    power_status = get_boat_power_status()
    raspberry_status = get_boat_raspberry_status()
    preferences = get_preferences()

    ais_targets = build_ais_targets(ownship, raw_targets)

    high_risk_targets = [
        target for target in ais_targets
        if target["risk"] == "Alto"
    ]

    alerts = build_alerts(
        power_status["battery"],
        raspberry_status,
        ais_targets,
        preferences
    )

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
        "connection": get_boat_connection_status(),
        "raspberry": raspberry_status
    }