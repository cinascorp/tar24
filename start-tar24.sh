#!/bin/bash

# TAR24 v4 - Command & Control System
# Linux Startup Script

echo ""
echo "============================================================"
echo "   TAR24 v4 - Top Grade Command & Control System"
echo "============================================================"
echo ""
echo "Starting TAR24 v4 Server..."
echo ""

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    python3 server.py
elif command -v python &> /dev/null; then
    python server.py
else
    echo "❌ Error: Python not found!"
    echo "Please install Python 3.6+ and try again."
    echo ""
    echo "Ubuntu/Debian: sudo apt-get install python3"
    echo "CentOS/RHEL: sudo yum install python3"
    echo "Arch: sudo pacman -S python"
    exit 1
fi

echo ""
echo "Press Enter to exit..."
read