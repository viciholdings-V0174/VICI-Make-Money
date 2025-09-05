from websocket_server import WebsocketServer
import json

# UserScore 與 Scoreboard 類別
class UserScore:
    def __init__(self, username: str, score: int):
        self.username = username
        self.score = score

    def to_dict(self):
        return {
            "username": self.username,
            "score": self.score
        }

class Scoreboard:
    def __init__(self):
        self.scores = []

    def add_score(self, user_score: UserScore):
        # 若已存在同名玩家則回傳 False，不覆蓋
        for s in self.scores:
            if s.username == user_score.username:
                return False
        self.scores.append(user_score)
        self.scores.sort(key=lambda x: x.score, reverse=True)
        return True

    def get_rankings(self):
        return [score.to_dict() for score in self.scores]

# 建立記分板實例
scoreboard = Scoreboard()

def new_client(client, server):
    print(f"New client connected: {client['id']}")

def message_received(client, server, message):
    data = json.loads(message)
    
    if data['action'] == 'upload_score':
        username = data['username']
        score = data['score']
        user_score = UserScore(username, score)
        added = scoreboard.add_score(user_score)
        if added:
            print(f"收到分數：{username} -> {score}")  # 顯示名稱與分數
            server.send_message(client, json.dumps({"status": "success", "message": "Score uploaded"}))
        else:
            print(f"名稱已存在：{username}，分數未更新")
            server.send_message(client, json.dumps({"status": "exists", "message": "Username already exists"}))
    
    elif data['action'] == 'get_rankings':
        rankings = [
            [item['username'], item['score']]
            for item in scoreboard.get_rankings()
        ]
        server.send_message(client, json.dumps({"rankings": rankings}))

def run_server():
    server = WebsocketServer(host='0.0.0.0', port=9001)
    server.set_fn_new_client(new_client)
    server.set_fn_message_received(message_received)
    server.run_forever()

if __name__ == "__main__":
    run_server()