import json
import math
import urllib.request
from urllib.error import URLError, HTTPError

from config import SIGNAL_K_TIMEOUT, SIGNAL_K_URL


MPS_TO_KNOTS = 1.94384


def _request_json(path):
    url = f"{SIGNAL_K_URL.rstrip('/')}{path}"

    try:
        with urllib.request.urlopen(url, timeout=SIGNAL_K_TIMEOUT) as response:
            return json.loads(response.read().decode("utf-8"))
    except (URLError, HTTPError, TimeoutError, json.JSONDecodeError):
        return None


def _get_value(path):
    data = _request_json(f"/signalk/v1/api/vessels/self/{path}")

    if isinstance(data, dict) and "value" in data:
        return data["value"]

    return data


def _rad_to_deg(value):
    if value is None:
        return None

    return round((math.degrees(value) + 360) % 360)


def _mps_to_knots(value):
    if value is None:
        return None

    return round(value * MPS_TO_KNOTS, 2)


def is_signal_k_connected():
    data = _request_json("/signalk")
    return data is not None


def get_ownship_from_signal_k():
    position = _get_value("navigation/position")
    speed_mps = _get_value("navigation/speedOverGround")
    course_rad = _get_value("navigation/courseOverGroundTrue")
    heading_rad = _get_value("navigation/headingTrue")

    if not isinstance(position, dict):
        return None

    latitude = position.get("latitude")
    longitude = position.get("longitude")

    if latitude is None or longitude is None:
        return None

    return {
        "latitude": latitude,
        "longitude": longitude,
        "speed": _mps_to_knots(speed_mps) or 0,
        "course": _rad_to_deg(course_rad) or 0,
        "heading": _rad_to_deg(heading_rad) or _rad_to_deg(course_rad) or 0,
    }


def get_raw_ais_targets_from_signal_k():
    vessels = _request_json("/signalk/v1/api/vessels")

    if not isinstance(vessels, dict):
        return None

    targets = []

    for vessel_id, vessel in vessels.items():
        if vessel_id == "self":
            continue

        if not isinstance(vessel, dict):
            continue

        navigation = vessel.get("navigation", {})
        position_data = navigation.get("position", {})

        position = position_data.get("value", position_data)

        if not isinstance(position, dict):
            continue

        latitude = position.get("latitude")
        longitude = position.get("longitude")

        if latitude is None or longitude is None:
            continue

        speed_mps = navigation.get("speedOverGround", {}).get("value")
        course_rad = navigation.get("courseOverGroundTrue", {}).get("value")

        target = {
            "mmsi": str(vessel.get("mmsi", vessel_id)),
            "name": vessel.get("name", "AIS target"),
            "type": "AIS",
            "latitude": latitude,
            "longitude": longitude,
            "course": _rad_to_deg(course_rad) or 0,
            "speed": _mps_to_knots(speed_mps) or 0,
        }

        targets.append(target)

    return targets


def get_power_status_from_signal_k():
    return None


def get_connection_status_from_signal_k():
    return None


def get_raspberry_status_from_signal_k():
    return None