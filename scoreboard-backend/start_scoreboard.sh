#!/bin/bash
nohup python3 main.py > scoreboard.log 2>&1 &
echo $! > scoreboard.pid
