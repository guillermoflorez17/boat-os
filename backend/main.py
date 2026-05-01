from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Boat OS backend funcionando"
    }


@app.get("/status")
def status():
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
        },
        "gps": {
            "status": "OK",
            "latitude": 37.2614,
            "longitude": -6.9447,
            "speed": 0.0
        },
        "ais": {
            "status": "Sin datos reales",
            "targets": 0
        },
        "connection": {
            "type": "4G",
            "status": "OK"
        },
        "raspberry": {
            "temperature": 41,
            "cpu": 18,
            "ram": 42
        }
    }