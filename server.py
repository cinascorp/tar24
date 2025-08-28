#!/usr/bin/env python3
"""
TAR24 v4 Server
Simple HTTP server for TAR24 Command & Control System
Works on Windows and Linux
"""

import http.server
import socketserver
import os
import sys
import webbrowser
from pathlib import Path

class TAR24Handler(http.server.SimpleHTTPRequestHandler):
    """Custom handler for TAR24 v4 application"""
    
    def end_headers(self):
        # Add CORS headers for web framework compatibility
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()
    
    def log_message(self, format, *args):
        # Custom logging for TAR24
        print(f"[TAR24] {format % args}")

def get_available_port(start_port=8000, max_attempts=100):
    """Find an available port starting from start_port"""
    import socket
    
    for port in range(start_port, start_port + max_attempts):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('', port))
                return port
        except OSError:
            continue
    return None

def main():
    """Main server function"""
    print("=" * 60)
    print("TAR24 v4 - Top Grade Command & Control System")
    print("=" * 60)
    
    # Get current directory
    current_dir = Path(__file__).parent.absolute()
    os.chdir(current_dir)
    
    # Check if tar24-v4.html exists
    if not Path('tar24-v4.html').exists():
        print("❌ Error: tar24-v4.html not found!")
        print("Please ensure the file exists in the current directory.")
        sys.exit(1)
    
    # Find available port
    port = get_available_port()
    if port is None:
        print("❌ Error: No available ports found!")
        sys.exit(1)
    
    # Create server
    try:
        with socketserver.TCPServer(("", port), TAR24Handler) as httpd:
            print(f"✅ TAR24 v4 Server started successfully!")
            print(f"📍 Server running at: http://localhost:{port}")
            print(f"📁 Serving from: {current_dir}")
            print(f"🌐 Access URL: http://localhost:{port}/tar24-v4.html")
            print()
            print("🚀 Opening TAR24 v4 in your default browser...")
            print("⏹️  Press Ctrl+C to stop the server")
            print("=" * 60)
            
            # Open browser
            try:
                webbrowser.open(f'http://localhost:{port}/tar24-v4.html')
            except Exception as e:
                print(f"⚠️  Could not open browser automatically: {e}")
                print(f"   Please manually navigate to: http://localhost:{port}/tar24-v4.html")
            
            # Start server
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        print("👋 Thank you for using TAR24 v4!")
    except Exception as e:
        print(f"❌ Server error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()