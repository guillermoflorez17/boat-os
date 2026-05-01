def get_ownship():
    return {
        "latitude": 37.2614,
        "longitude": -6.9447,
        "speed": 5.2,
        "course": 84,
        "heading": 86,
    }


def get_raw_ais_targets():
    return [
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