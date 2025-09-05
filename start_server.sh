#!/bin/bash

# 啟用虛擬環境
source venv/bin/activate

# 啟動程式並將輸出寫入 log
nohup python -u server-backend.py > scoreboard.log 2>&1 &

# 儲存 PID
echo $! > scoreboard.pid

# 可選：關閉虛擬環境（後台程序會繼續使用 venv 的 Python）
deactivate
