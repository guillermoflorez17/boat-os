from datetime import datetime, timezone
from config import BOAT_OS_DATA_SOURCE, SIGNAL_K_URL
from services.opencpn_service import get_opencpn_status
from services.signal_k_client import is_signal_k_connected
from services.system_monitor import get_system_monitor_health
from services.boat_simulator import get_simulator_status

def build_health():
    opencpn_status = get_opencpn_status()
    signal_k_connected = is_signal_k_connected()
    system_monitor_health = get_system_monitor_health()
    simulator_status = get_simulator_status()
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
                "connected": signal_k_connected
            }
        },
        "opencpn": opencpn_status,
        "systemMonitor": system_monitor_health,
        "simulator": simulator_status
    }