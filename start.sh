#!/bin/bash

# C4ISR Military Tracking System v2.0.0 - Startup Script
# Advanced military-grade flight tracking and analysis system

echo "=========================================="
echo "C4ISR Military Tracking System v2.0.0"
echo "=========================================="
echo ""

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Error: Python 3 is required but not installed."
    echo "Please install Python 3 and try again."
    exit 1
fi

# Check if we're in the correct directory
if [ ! -f "c4isr-v2.html" ]; then
    echo "❌ Error: c4isr-v2.html not found in current directory."
    echo "Please run this script from the C4ISR system directory."
    exit 1
fi

# Set port (default: 8000)
PORT=${1:-8000}

echo "🚀 Starting C4ISR Military Tracking System..."
echo "📡 Port: $PORT"
echo "🌐 URL: http://localhost:$PORT/c4isr-v2.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the HTTP server
echo "✅ Server starting..."
$PYTHON_CMD -m http.server $PORT

echo ""
echo "👋 C4ISR system stopped."