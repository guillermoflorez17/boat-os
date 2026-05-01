import json
from copy import deepcopy
from json import JSONDecodeError
from pathlib import Path


PREFERENCES_FILE = Path(__file__).resolve().parent.parent / "data" / "preferences.json"


DEFAULT_PREFERENCES = {
    "alerts": {
        "soundEnabled": True,
        "aisAlertsEnabled": True,
        "energyAlertsEnabled": True,
        "systemAlertsEnabled": True
    },
    "display": {
        "nightMode": True,
        "tabletMode": True
    },
    "navigation": {
        "units": "nm_kn",
        "aisView": "tactical"
    }
}


def deep_merge(defaults, overrides):
    result = deepcopy(defaults)

    if not isinstance(overrides, dict):
        return result

    for key, value in overrides.items():
        if (
            key in result
            and isinstance(result[key], dict)
            and isinstance(value, dict)
        ):
            result[key] = deep_merge(result[key], value)
        else:
            result[key] = value

    return result


def save_preferences(preferences):
    PREFERENCES_FILE.parent.mkdir(parents=True, exist_ok=True)

    normalized_preferences = deep_merge(DEFAULT_PREFERENCES, preferences)

    with open(PREFERENCES_FILE, "w", encoding="utf-8") as file:
        json.dump(normalized_preferences, file, indent=2, ensure_ascii=False)

    return normalized_preferences


def ensure_preferences_file():
    PREFERENCES_FILE.parent.mkdir(parents=True, exist_ok=True)

    if not PREFERENCES_FILE.exists() or PREFERENCES_FILE.stat().st_size == 0:
        return save_preferences(DEFAULT_PREFERENCES)

    return None


def get_preferences():
    ensure_preferences_file()

    try:
        with open(PREFERENCES_FILE, "r", encoding="utf-8") as file:
            stored_preferences = json.load(file)

        if not isinstance(stored_preferences, dict):
            return save_preferences(DEFAULT_PREFERENCES)

        return deep_merge(DEFAULT_PREFERENCES, stored_preferences)

    except JSONDecodeError:
        return save_preferences(DEFAULT_PREFERENCES)


def update_preferences(preferences):
    current_preferences = get_preferences()
    updated_preferences = deep_merge(current_preferences, preferences)

    return save_preferences(updated_preferences)