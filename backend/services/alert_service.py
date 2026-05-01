from config import (
    BATTERY_CRITICAL_PERCENT,
    BATTERY_WARNING_PERCENT,
    RASPBERRY_TEMP_CRITICAL,
    RASPBERRY_TEMP_WARNING,
)


def build_alerts(battery, raspberry, ais_targets, preferences):
    alerts = []

    preferences = preferences or {}
    alert_preferences = preferences.get("alerts", {})

    ais_alerts_enabled = alert_preferences.get("aisAlertsEnabled", True)
    energy_alerts_enabled = alert_preferences.get("energyAlertsEnabled", True)
    system_alerts_enabled = alert_preferences.get("systemAlertsEnabled", True)

    if ais_alerts_enabled:
        high_risk_targets = [
            target for target in ais_targets
            if target["risk"] == "Alto"
        ]

        medium_risk_targets = [
            target for target in ais_targets
            if target["risk"] == "Medio"
        ]

        if high_risk_targets:
            alerts.append({
                "id": "ais_high_risk",
                "level": "critical",
                "source": "ais",
                "title": "Riesgo AIS alto",
                "message": f"{len(high_risk_targets)} objetivo(s) con riesgo alto de aproximación",
            })

        elif medium_risk_targets:
            alerts.append({
                "id": "ais_medium_risk",
                "level": "warning",
                "source": "ais",
                "title": "Tráfico AIS cercano",
                "message": f"{len(medium_risk_targets)} objetivo(s) requieren vigilancia",
            })

    if energy_alerts_enabled:
        if battery["percentage"] <= BATTERY_CRITICAL_PERCENT:
            alerts.append({
                "id": "battery_low",
                "level": "critical",
                "source": "energy",
                "title": "Batería baja",
                "message": f"Batería al {battery['percentage']}%",
            })

        elif battery["percentage"] <= BATTERY_WARNING_PERCENT:
            alerts.append({
                "id": "battery_warning",
                "level": "warning",
                "source": "energy",
                "title": "Batería moderada",
                "message": f"Batería al {battery['percentage']}%",
            })

    if system_alerts_enabled:
        if raspberry["temperature"] >= RASPBERRY_TEMP_CRITICAL:
            alerts.append({
                "id": "raspberry_hot",
                "level": "critical",
                "source": "system",
                "title": "Temperatura Raspberry alta",
                "message": f"CPU a {raspberry['temperature']} ºC",
            })

        elif raspberry["temperature"] >= RASPBERRY_TEMP_WARNING:
            alerts.append({
                "id": "raspberry_warm",
                "level": "warning",
                "source": "system",
                "title": "Temperatura Raspberry elevada",
                "message": f"CPU a {raspberry['temperature']} ºC",
            })

    return alerts