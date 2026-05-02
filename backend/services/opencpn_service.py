import os
import platform
import shlex
import subprocess

from config import OPENCPN_COMMAND, OPENCPN_ENABLED


def get_opencpn_status():
    return {
        "enabled": OPENCPN_ENABLED,
        "command": OPENCPN_COMMAND,
        "platform": platform.system(),
        "ready": OPENCPN_ENABLED,
    }


def launch_opencpn():
    if not OPENCPN_ENABLED:
        return {
            "launched": False,
            "reason": "OpenCPN launcher desactivado",
            "enabled": OPENCPN_ENABLED,
        }

    try:
        command = shlex.split(OPENCPN_COMMAND, posix=os.name != "nt")

        subprocess.Popen(
            command,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            stdin=subprocess.DEVNULL,
        )

        return {
            "launched": True,
            "command": OPENCPN_COMMAND,
        }

    except Exception as error:
        return {
            "launched": False,
            "reason": str(error),
            "command": OPENCPN_COMMAND,
        }