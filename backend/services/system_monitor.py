import platform
import subprocess

import psutil

from config import SYSTEM_MONITOR_ENABLED


def _get_raspberry_temperature():
    try:
        result = subprocess.run(
            ["vcgencmd", "measure_temp"],
            capture_output=True,
            text=True,
            timeout=1,
        )

        output = result.stdout.strip()

        if "temp=" in output:
            value = output.replace("temp=", "").replace("'C", "")
            return round(float(value))

    except Exception:
        return None

    return None


def get_system_status():
    if not SYSTEM_MONITOR_ENABLED:
        return None

    cpu = round(psutil.cpu_percent(interval=0.1))
    ram = round(psutil.virtual_memory().percent)

    temperature = _get_raspberry_temperature()

    if temperature is None:
        temperature = 41

    return {
        "temperature": temperature,
        "cpu": cpu,
        "ram": ram,
        "platform": platform.system(),
        "monitor": "real" if SYSTEM_MONITOR_ENABLED else "disabled",
    }


def get_system_monitor_health():
    status = get_system_status()

    return {
        "enabled": SYSTEM_MONITOR_ENABLED,
        "available": status is not None,
        "platform": status.get("platform") if status else None,
        "monitor": status.get("monitor") if status else "disabled",
    }