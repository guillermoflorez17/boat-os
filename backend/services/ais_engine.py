from math import radians, degrees, sin, cos, atan2, sqrt
from config import (
    AIS_CPA_CRITICAL_NM,
    AIS_CPA_WARNING_NM,
    AIS_CRITICAL_DISTANCE_NM,
    AIS_GUARD_ZONE_NM,
    AIS_TCPA_CRITICAL_MIN,
    AIS_TCPA_WARNING_MIN,
)


EARTH_RADIUS_NM = 3440.065


def calculate_distance_nm(lat1, lon1, lat2, lon2):
    lat1_rad = radians(lat1)
    lon1_rad = radians(lon1)
    lat2_rad = radians(lat2)
    lon2_rad = radians(lon2)

    d_lat = lat2_rad - lat1_rad
    d_lon = lon2_rad - lon1_rad

    a = (
        sin(d_lat / 2) ** 2
        + cos(lat1_rad) * cos(lat2_rad) * sin(d_lon / 2) ** 2
    )

    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return EARTH_RADIUS_NM * c


def calculate_bearing_deg(lat1, lon1, lat2, lon2):
    lat1_rad = radians(lat1)
    lat2_rad = radians(lat2)
    d_lon = radians(lon2 - lon1)

    x = sin(d_lon) * cos(lat2_rad)
    y = (
        cos(lat1_rad) * sin(lat2_rad)
        - sin(lat1_rad) * cos(lat2_rad) * cos(d_lon)
    )

    bearing = degrees(atan2(x, y))

    return (bearing + 360) % 360


def position_to_local_nm(origin_lat, origin_lon, target_lat, target_lon):
    distance = calculate_distance_nm(
        origin_lat,
        origin_lon,
        target_lat,
        target_lon
    )

    bearing = radians(
        calculate_bearing_deg(
            origin_lat,
            origin_lon,
            target_lat,
            target_lon
        )
    )

    x = distance * sin(bearing)
    y = distance * cos(bearing)

    return x, y


def velocity_vector_knots(course_deg, speed_knots):
    course_rad = radians(course_deg)

    vx = speed_knots * sin(course_rad)
    vy = speed_knots * cos(course_rad)

    return vx, vy


def calculate_cpa_tcpa(ownship, target):
    target_x, target_y = position_to_local_nm(
        ownship["latitude"],
        ownship["longitude"],
        target["latitude"],
        target["longitude"],
    )

    own_vx, own_vy = velocity_vector_knots(
        ownship["course"],
        ownship["speed"],
    )

    target_vx, target_vy = velocity_vector_knots(
        target["course"],
        target["speed"],
    )

    rel_x = target_x
    rel_y = target_y

    rel_vx = target_vx - own_vx
    rel_vy = target_vy - own_vy

    rel_speed_sq = rel_vx**2 + rel_vy**2

    if rel_speed_sq == 0:
        current_distance = sqrt(rel_x**2 + rel_y**2)
        return round(current_distance, 2), 0

    tcpa_hours = -((rel_x * rel_vx) + (rel_y * rel_vy)) / rel_speed_sq

    cpa_x = rel_x + rel_vx * tcpa_hours
    cpa_y = rel_y + rel_vy * tcpa_hours

    cpa_nm = sqrt(cpa_x**2 + cpa_y**2)
    tcpa_minutes = tcpa_hours * 60

    return round(cpa_nm, 2), round(tcpa_minutes)

def calculate_risk(distance_nm, cpa_nm, tcpa_min):
    cpa_is_future = tcpa_min > 0

    if distance_nm <= AIS_CRITICAL_DISTANCE_NM:
        return "Alto"

    if (
        cpa_is_future
        and cpa_nm <= AIS_CPA_CRITICAL_NM
        and tcpa_min <= AIS_TCPA_CRITICAL_MIN
    ):
        return "Alto"

    if (
        cpa_is_future
        and cpa_nm <= AIS_CPA_WARNING_NM
        and tcpa_min <= AIS_TCPA_WARNING_MIN
    ):
        return "Medio"

    if distance_nm <= AIS_GUARD_ZONE_NM:
        return "Medio"

    return "Bajo"

def calculate_encounter_status(cpa_nm, tcpa_min):
    if tcpa_min < 0:
        return "CPA pasado"

    if tcpa_min == 0:
        return "Sin movimiento relativo"

    if cpa_nm <= 0.25:
        return "Aproximación crítica"

    if cpa_nm <= 0.75:
        return "Aproximación cercana"

    return "Sin riesgo de cruce"


def build_ais_target(ownship, target):
    distance = calculate_distance_nm(
        ownship["latitude"],
        ownship["longitude"],
        target["latitude"],
        target["longitude"],
    )

    bearing = calculate_bearing_deg(
        ownship["latitude"],
        ownship["longitude"],
        target["latitude"],
        target["longitude"],
    )

    cpa, tcpa = calculate_cpa_tcpa(ownship, target)
    risk = calculate_risk(distance, cpa, tcpa)
    encounter = calculate_encounter_status(cpa, tcpa)

    return {
        **target,
        "distance": round(distance, 2),
        "bearing": round(bearing),
        "cpa": cpa,
        "tcpa": tcpa,
        "risk": risk,
        "encounter": encounter,
    }

def build_ais_targets(ownship, raw_targets):
    risk_priority = {
        "Alto": 0,
        "Medio": 1,
        "Bajo": 2,
    }

    targets = [
        build_ais_target(ownship, target)
        for target in raw_targets
    ]

    return sorted(
        targets,
        key=lambda target: (
            risk_priority.get(target["risk"], 3),
            target["distance"]
        )
    )   