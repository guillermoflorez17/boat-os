from config import BOAT_OS_DATA_SOURCE
from services.boat_simulator import (
    get_connection_status,
    get_ownship,
    get_power_status,
    get_raspberry_status,
    get_raw_ais_targets,
)
from services.signal_k_client import (
    get_connection_status_from_signal_k,
    get_ownship_from_signal_k,
    get_power_status_from_signal_k,
    get_raspberry_status_from_signal_k,
    get_raw_ais_targets_from_signal_k,
)
from services.system_monitor import get_system_status

def get_data_source():
    return BOAT_OS_DATA_SOURCE


def get_boat_ownship():
    if BOAT_OS_DATA_SOURCE == "signalk":
        data = get_ownship_from_signal_k()
        if data:
            return data

    return get_ownship()


def get_boat_ais_targets():
    if BOAT_OS_DATA_SOURCE == "signalk":
        data = get_raw_ais_targets_from_signal_k()
        if data:
            return data

    return get_raw_ais_targets()


def get_boat_power_status():
    if BOAT_OS_DATA_SOURCE == "signalk":
        data = get_power_status_from_signal_k()
        if data:
            return data

    return get_power_status()


def get_boat_connection_status():
    if BOAT_OS_DATA_SOURCE == "signalk":
        data = get_connection_status_from_signal_k()
        if data:
            return data

    return get_connection_status()


def get_boat_raspberry_status():
    system_status = get_system_status()

    if system_status:
        return system_status

    if BOAT_OS_DATA_SOURCE == "signalk":
        data = get_raspberry_status_from_signal_k()
        if data:
            return data

    return get_raspberry_status()