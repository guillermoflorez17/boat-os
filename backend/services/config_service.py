from config import (
    AIS_CPA_CRITICAL_NM,
    AIS_CPA_WARNING_NM,
    AIS_CRITICAL_DISTANCE_NM,
    AIS_GUARD_ZONE_NM,
    AIS_TCPA_CRITICAL_MIN,
    AIS_TCPA_WARNING_MIN,
    BATTERY_CRITICAL_PERCENT,
    BATTERY_WARNING_PERCENT,
    BOAT_OS_DATA_SOURCE,
    RASPBERRY_TEMP_CRITICAL,
    RASPBERRY_TEMP_WARNING,
    SIGNAL_K_URL,
)


def build_config():
    return {
        "mode": "read-only",
        "dataSource": {
            "active": BOAT_OS_DATA_SOURCE,
            "signalKUrl": SIGNAL_K_URL,
            "signalKReady": BOAT_OS_DATA_SOURCE == "signalk",
        },
        "ais": {
            "guardZoneNm": AIS_GUARD_ZONE_NM,
            "criticalDistanceNm": AIS_CRITICAL_DISTANCE_NM,
            "criticalCpaNm": AIS_CPA_CRITICAL_NM,
            "criticalTcpaMin": AIS_TCPA_CRITICAL_MIN,
            "warningCpaNm": AIS_CPA_WARNING_NM,
            "warningTcpaMin": AIS_TCPA_WARNING_MIN,
        },
        "energy": {
            "batteryCriticalPercent": BATTERY_CRITICAL_PERCENT,
            "batteryWarningPercent": BATTERY_WARNING_PERCENT,
        },
        "raspberry": {
            "temperatureCritical": RASPBERRY_TEMP_CRITICAL,
            "temperatureWarning": RASPBERRY_TEMP_WARNING,
        },
    }