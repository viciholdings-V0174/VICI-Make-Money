#!/bin/bash

PID_FILE="scoreboard.pid"

if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if kill -0 $PID > /dev/null 2>&1; then
        echo "Stopping server (PID $PID)..."
        kill $PID
        sleep 1
        # 如果還在跑，強制殺掉
        if kill -0 $PID > /dev/null 2>&1; then
            echo "Server did not stop, sending SIGKILL..."
            kill -9 $PID
        fi
    else
        echo "Process $PID not running."
    fi
    rm -f "$PID_FILE"
else
    echo "$PID_FILE not found. Is the server running?"
fi
