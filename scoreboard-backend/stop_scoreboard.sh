#!/bin/bash
if [ -f scoreboard.pid ]; then
    kill $(cat scoreboard.pid)
    rm scoreboard.pid
else
    echo "scoreboard.pid not found. Is the server running?"
fi
