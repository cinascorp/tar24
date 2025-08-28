#!/bin/bash

# TAR24 v4 - Advanced C4ISR Command & Control System
# Linux startup script

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "============================================================"
echo "    TAR24 v4 - Advanced C4ISR Command & Control System"
echo "============================================================"
echo -e "${NC}"
echo "Starting TAR24 v4 server..."
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}ERROR: Python 3 is not installed!${NC}"
    echo "Please install Python 3.7+ using your package manager:"
    echo "  Ubuntu/Debian: sudo apt install python3"
    echo "  CentOS/RHEL: sudo yum install python3"
    echo "  Arch: sudo pacman -S python"
    echo
    read -p "Press Enter to exit..."
    exit 1
fi

# Check if tar24-v4.html exists
if [ ! -f "tar24-v4.html" ]; then
    echo -e "${RED}ERROR: tar24-v4.html not found!${NC}"
    echo "Please ensure this script is in the TAR24 v4 project folder."
    echo
    read -p "Press Enter to exit..."
    exit 1
fi

echo -e "${GREEN}Python 3 found. Starting server...${NC}"
echo

# Make server.py executable
chmod +x server.py

# Start the server
python3 server.py

echo
echo -e "${YELLOW}Server stopped. Press Enter to exit...${NC}"
read