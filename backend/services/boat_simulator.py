import math
import time

from config import SIMULATION_DYNAMIC_ENABLED, SIMULATION_TIME_SCALE


SIMULATION_START_TIME = time.time()


BASE_OWNSHIP = {
    "latitude": 37.2614,
    "longitude": -6.9447,
    "speed": 5.2,
    "course": 84,
    "heading": 86,
}


BASE_AIS_TARGETS = [
    {
        "mmsi": "224001001",
        "name": "Ferry Huelva",
        "type": "Passenger",
        "latitude": 37.2670,
        "longitude": -6.9350,
        "course": 45,
        "speed": 18.2,
    },
    {
        "mmsi": "224001002",
        "name": "Pesquero Norte",
        "type": "Fishing",
        "latitude": 37.2505,
        "longitude": -6.9315,
        "course": 120,
        "speed": 6.5,
    },
    {
        "mmsi": "224001003",
        "name": "Velero Azul",
        "type": "Sailing",
        "latitude": 37.2400,
        "longitude": -6.9700,
        "course": 280,
        "speed": 4.1,
    },
]


def get_simulated_elapsed_hours():
    elapsed_seconds = time.time() - SIMULATION_START_TIME
    simulated_seconds = elapsed_seconds * SIMULATION_TIME_SCALE

    return simulated_seconds / 3600


def move_position(latitude, longitude, course, speed, elapsed_hours):
    distance_nm = speed * elapsed_hours
    course_rad = math.radians(course)

    delta_north_nm = math.cos(course_rad) * distance_nm
    delta_east_nm = math.sin(course_rad) * distance_nm

    delta_lat = delta_north_nm / 60

    latitude_rad = math.radians(latitude)
    longitude_scale = max(math.cos(latitude_rad), 0.01)
    delta_lon = delta_east_nm / (60 * longitude_scale)

    return {
        "latitude": round(latitude + delta_lat, 6),
        "longitude": round(longitude + delta_lon, 6),
    }


def build_dynamic_position(item):
    if not SIMULATION_DYNAMIC_ENABLED:
        return item

    elapsed_hours = get_simulated_elapsed_hours()

    position = move_position(
        item["latitude"],
        item["longitude"],
        item["course"],
        item["speed"],
        elapsed_hours,
    )

    return {
        **item,
        **position,
    }


def get_ownship():
    return build_dynamic_position(BASE_OWNSHIP)


def get_raw_ais_targets():
    return [
        build_dynamic_position(target)
        for target in BASE_AIS_TARGETS
    ]


def get_power_status():
    return {
        "battery": {
            "voltage": 12.7,
            "percentage": 84,
            "status": "OK"
        },
        "solar": {
            "power": 132,
            "dailyYield": 0.8,
            "status": "Cargando"
        }
    }


def get_connection_status():
    return {
        "type": "4G",
        "status": "OK"
    }


def get_raspberry_status():
    return {
        "temperature": 41,
        "cpu": 18,
        "ram": 42
    }

def get_simulator_status():
    return {
        "dynamicEnabled": SIMULATION_DYNAMIC_ENABLED,
        "timeScale": SIMULATION_TIME_SCALE,
        "elapsedHours": round(get_simulated_elapsed_hours(), 3),
    }