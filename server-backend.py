import asyncio
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from hypercorn.asyncio import serve
from hypercorn.config import Config

scoreboard = []
clients = set()

app = FastAPI()
app.mount("/VICI-Make-Money", StaticFiles(directory="web", html=True), name="VICI-Make-Money")

@app.get("/")
async def index():
    return RedirectResponse("/VICI-Make-Money/index.html")

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    clients.add(ws)
    client_addr = ws.client[0]
    print(f"New WS client connected: {client_addr}")
    try:
        while True:
            data_text = await ws.receive_text()
            data = json.loads(data_text)

            if data['action'] == 'upload_score':
                username = data['username']
                score = data['score']
                exists = any(s['username'] == username for s in scoreboard)
                if not exists:
                    scoreboard.append({"username": username, "score": score})
                    scoreboard.sort(key=lambda x: x['score'], reverse=True)
                    await ws.send_text(json.dumps({"status": "success"}))
                    print(f"Received score from {username}: {score}")
                else:
                    await ws.send_text(json.dumps({"status": "exists"}))
            elif data['action'] == 'get_rankings':
                rankings_list = [[item["username"], item["score"]] for item in scoreboard]
                await ws.send_text(json.dumps({"rankings": scoreboard}))
                print(f"Ranking requested by {client_addr}")

    except WebSocketDisconnect:
        clients.remove(ws)
        print(f"WS client disconnected: {client_addr}")

if __name__ == "__main__":
    config = Config()
    config.bind = ["0.0.0.0:80"]
    loop = asyncio.get_event_loop()
    loop.run_until_complete(serve(app, config))
