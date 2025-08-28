#!/usr/bin/env python3
"""
TAR24 v4 Server - Simple HTTP Server for C4ISR Command & Control System
Compatible with Windows and Linux
"""

import http.server
import socketserver
import os
import sys
import webbrowser
from pathlib import Path

class TAR24Handler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP handler for TAR24 v4 with CORS support"""
    
    def end_headers(self):
        # Add CORS headers for web framework compatibility
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def do_OPTIONS(self):
        """Handle preflight CORS requests"""
        self.send_response(200)
        self.end_headers()
    
    def log_message(self, format, *args):
        """Custom logging for TAR24 system"""
        timestamp = self.log_date_time_string()
        print(f"[{timestamp}] TAR24 v4: {format % args}")

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
    print("TAR24 v4 - Advanced C4ISR Command & Control System")
    print("=" * 60)
    print("Starting HTTP server...")
    
    # Get current directory
    current_dir = Path(__file__).parent.absolute()
    os.chdir(current_dir)
    
    # Check if tar24-v4.html exists
    if not Path("tar24-v4.html").exists():
        print("ERROR: tar24-v4.html not found in current directory!")
        print("Please ensure you're running this script from the TAR24 v4 project folder.")
        sys.exit(1)
    
    # Find available port
    port = get_available_port()
    if port is None:
        print("ERROR: No available ports found!")
        sys.exit(1)
    
    # Create server
    try:
        with socketserver.TCPServer(("", port), TAR24Handler) as httpd:
            print(f"✓ Server started successfully!")
            print(f"✓ Serving from: {current_dir}")
            print(f"✓ Local URL: http://localhost:{port}")
            print(f"✓ Network URL: http://0.0.0.0:{port}")
            print(f"✓ Main application: http://localhost:{port}/tar24-v4.html")
            print()
            print("Press Ctrl+C to stop the server")
            print("=" * 60)
            
            # Try to open browser automatically
            try:
                webbrowser.open(f"http://localhost:{port}/tar24-v4.html")
                print("✓ Browser opened automatically")
            except:
                print("ℹ Please open your browser and navigate to the URL above")
            
            # Start serving
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n" + "=" * 60)
        print("✓ Server stopped by user")
        print("✓ TAR24 v4 system shutdown complete")
        print("=" * 60)
    except Exception as e:
        print(f"\nERROR: Failed to start server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()