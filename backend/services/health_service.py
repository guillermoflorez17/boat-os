from datetime import datetime, timezone

from config import BOAT_OS_DATA_SOURCE, SIGNAL_K_URL


def build_health():
    return {
        "status": "ok",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "backend": {
            "name": "Boat OS Backend",
            "running": True
        },
        "dataSource": {
            "active": BOAT_OS_DATA_SOURCE,
            "simulator": BOAT_OS_DATA_SOURCE == "simulator",
            "signalK": {
                "enabled": BOAT_OS_DATA_SOURCE == "signalk",
                "url": SIGNAL_K_URL,
                "connected": False
            }
        }
    }