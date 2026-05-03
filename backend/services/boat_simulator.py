import math
import time

from config import (
    SIMULATION_DEFAULT_SCENARIO,
    SIMULATION_DYNAMIC_ENABLED,
    SIMULATION_LOOP_MINUTES,
    SIMULATION_TIME_SCALE,
)


SIMULATION_START_TIME = time.time()
CURRENT_SCENARIO = SIMULATION_DEFAULT_SCENARIO


BASE_OWNSHIP = {
    "latitude": 37.2614,
    "longitude": -6.9447,
    "speed": 5.2,
    "course": 84,
    "heading": 86,
}


SCENARIOS = {
    "normal": [
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
    ],
    "high_risk": [
        {
            "mmsi": "224009001",
            "name": "Carguero Cruce",
            "type": "Cargo",
            "latitude": 37.263067,
            "longitude": -6.936310,
            "course": 180,
            "speed": 8.0,
        },
        {
            "mmsi": "224009002",
            "name": "Pesquero Cercano",
            "type": "Fishing",
            "latitude": 37.258800,
            "longitude": -6.938500,
            "course": 40,
            "speed": 5.5,
        },
        {
            "mmsi": "224009003",
            "name": "Velero Oeste",
            "type": "Sailing",
            "latitude": 37.255000,
            "longitude": -6.960000,
            "course": 310,
            "speed": 4.2,
        },
    ],
}


def get_available_scenarios():
    return list(SCENARIOS.keys())


def get_current_scenario():
    if CURRENT_SCENARIO in SCENARIOS:
        return CURRENT_SCENARIO

    return "normal"


def set_simulator_scenario(scenario):
    global CURRENT_SCENARIO

    if scenario not in SCENARIOS:
        return {
            "changed": False,
            "reason": f"Escenario no válido: {scenario}",
            "availableScenarios": get_available_scenarios(),
        }

    CURRENT_SCENARIO = scenario
    reset_simulation()

    return {
        "changed": True,
        "scenario": CURRENT_SCENARIO,
        "simulator": get_simulator_status(),
    }


def get_simulated_elapsed_hours():
    elapsed_seconds = time.time() - SIMULATION_START_TIME
    simulated_seconds = elapsed_seconds * SIMULATION_TIME_SCALE

    loop_seconds = SIMULATION_LOOP_MINUTES * 60

    if loop_seconds > 0:
        simulated_seconds = simulated_seconds % loop_seconds

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
    scenario = get_current_scenario()

    return [
        build_dynamic_position(target)
        for target in SCENARIOS[scenario]
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
    elapsed_hours = get_simulated_elapsed_hours()

    return {
        "dynamicEnabled": SIMULATION_DYNAMIC_ENABLED,
        "timeScale": SIMULATION_TIME_SCALE,
        "loopMinutes": SIMULATION_LOOP_MINUTES,
        "elapsedHours": round(elapsed_hours, 3),
        "elapsedMinutes": round(elapsed_hours * 60, 1),
        "scenario": get_current_scenario(),
        "availableScenarios": get_available_scenarios(),
    }


def reset_simulation():
    global SIMULATION_START_TIME

    SIMULATION_START_TIME = time.time()

    return {
        "reset": True,
        "simulator": get_simulator_status()
    }