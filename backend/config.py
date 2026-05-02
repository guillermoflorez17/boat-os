import os
from dotenv import load_dotenv


load_dotenv()

BOAT_OS_DATA_SOURCE = os.getenv("BOAT_OS_DATA_SOURCE", "simulator")
SIGNAL_K_URL = os.getenv("SIGNAL_K_URL", "http://localhost:3000")


# AIS safety thresholds
AIS_GUARD_ZONE_NM = float(os.getenv("AIS_GUARD_ZONE_NM", "1.5"))

AIS_CRITICAL_DISTANCE_NM = float(os.getenv("AIS_CRITICAL_DISTANCE_NM", "0.5"))

AIS_CPA_CRITICAL_NM = float(os.getenv("AIS_CPA_CRITICAL_NM", "0.25"))
AIS_TCPA_CRITICAL_MIN = int(os.getenv("AIS_TCPA_CRITICAL_MIN", "15"))

AIS_CPA_WARNING_NM = float(os.getenv("AIS_CPA_WARNING_NM", "0.75"))
AIS_TCPA_WARNING_MIN = int(os.getenv("AIS_TCPA_WARNING_MIN", "30"))


# Energy thresholds
BATTERY_CRITICAL_PERCENT = int(os.getenv("BATTERY_CRITICAL_PERCENT", "20"))
BATTERY_WARNING_PERCENT = int(os.getenv("BATTERY_WARNING_PERCENT", "40"))


# Raspberry thresholds
RASPBERRY_TEMP_CRITICAL = int(os.getenv("RASPBERRY_TEMP_CRITICAL", "70"))
RASPBERRY_TEMP_WARNING = int(os.getenv("RASPBERRY_TEMP_WARNING", "60"))

# OpenCPN launcher
OPENCPN_ENABLED = os.getenv("OPENCPN_ENABLED", "false").lower() == "true"
OPENCPN_COMMAND = os.getenv("OPENCPN_COMMAND", "opencpn")

SIGNAL_K_TIMEOUT = float(os.getenv("SIGNAL_K_TIMEOUT", "1.5"))
SYSTEM_MONITOR_ENABLED = os.getenv("SYSTEM_MONITOR_ENABLED", "true").lower() == "true"

# Simulator
SIMULATION_DYNAMIC_ENABLED = os.getenv("SIMULATION_DYNAMIC_ENABLED", "true").lower() == "true"
SIMULATION_TIME_SCALE = float(os.getenv("SIMULATION_TIME_SCALE", "20"))