from fastapi import FastAPI, WebSocket
from fastapi.responses import JSONResponse
import json

app = FastAPI()

# Load mock data
with open('mock_data/locations.json') as f:
    LOCATIONS = json.load(f)

# with open('mock_data/menu.json') as f:
#     MENU = json.load(f)

with open('mock_data/items.json') as f:
    ITEMS = json.load(f)


@app.get("/locations")
async def get_locations(date: str, time: str):
    return JSONResponse(content={
        "response_code": 200,
        "message": "Locations retrieved successfully",
        "location_data": LOCATIONS
    })


# @app.get("/menu")
# async def get_menu(date: str, time: str, location_number: int):
#     return JSONResponse(content={
#         "response_code": 200,
#         "message": "Menu retrieved successfully",
#         "menu_data": MENU.get(str(location_number), {})
#     })


@app.get("/item")
async def get_item(id: int):
    return JSONResponse(content={
        "response_code": 200,
        "message": "Item retrieved successfully",
        "item_data": ITEMS.get(str(id), {})
    })


@app.post("/order")
async def send_order(order: dict):
    # Simulate storing order and sending confirmation
    return JSONResponse(content={
        "response_code": 201,
        "message": "Order received",
        "order_data": order
    })


# WebSocket for real-time confirmations
@app.websocket("/ws/confirm")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        print(f"Received order via WebSocket: {data}")
        confirmation = {"message": "Order confirmed!", "details": data}
        await websocket.send_json(confirmation)