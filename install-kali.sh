#!/bin/bash

# C4ISR v3 - Kali Linux Installation Script
# Advanced Drone Operations and Military Surveillance System

set -e

echo "=================================="
echo "C4ISR v3 - KALI LINUX INSTALLER"
echo "Advanced Drone Operations System"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}This script should not be run as root${NC}"
   echo "Please run as regular user with sudo privileges"
   exit 1
fi

# Check if running on Kali Linux
if ! grep -q "Kali" /etc/os-release; then
    echo -e "${YELLOW}Warning: This script is designed for Kali Linux${NC}"
    echo "Some features may not work on other distributions"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "${BLUE}Starting C4ISR v3 installation...${NC}"

# Update system
echo -e "${GREEN}[1/10] Updating system packages...${NC}"
sudo apt-get update -qq
sudo apt-get upgrade -y -qq

# Install basic dependencies
echo -e "${GREEN}[2/10] Installing basic dependencies...${NC}"
sudo apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    git \
    curl \
    wget \
    chromium \
    nodejs \
    npm \
    build-essential \
    cmake \
    pkg-config \
    libusb-1.0-0-dev \
    libssl-dev

# Install SDR tools
echo -e "${GREEN}[3/10] Installing SDR (Software Defined Radio) tools...${NC}"
sudo apt-get install -y \
    rtl-sdr \
    hackrf \
    gqrx-sdr \
    dump1090-fa \
    gr-osmosdr \
    gnuradio \
    gnuradio-dev \
    gqrx-sdr

# Install wireless tools
echo -e "${GREEN}[4/10] Installing wireless penetration testing tools...${NC}"
sudo apt-get install -y \
    kismet \
    aircrack-ng \
    reaver \
    pixiewps \
    bully \
    wifite \
    hostapd \
    dnsmasq

# Install network analysis tools
echo -e "${GREEN}[5/10] Installing network analysis tools...${NC}"
sudo apt-get install -y \
    wireshark \
    tshark \
    nmap \
    masscan \
    zmap \
    netcat-openbsd \
    socat \
    tcpdump

# Install penetration testing frameworks
echo -e "${GREEN}[6/10] Installing penetration testing frameworks...${NC}"
sudo apt-get install -y \
    metasploit-framework \
    sqlmap \
    nikto \
    dirb \
    gobuster \
    hydra \
    john \
    hashcat

# Configure RTL-SDR
echo -e "${GREEN}[7/10] Configuring RTL-SDR devices...${NC}"
sudo usermod -a -G plugdev $USER

# Create udev rules for SDR devices
sudo tee /etc/udev/rules.d/20-rtlsdr.rules > /dev/null <<EOF
SUBSYSTEM=="usb", ATTRS{idVendor}=="0bda", ATTRS{idProduct}=="2832", GROUP="plugdev", MODE="0666", SYMLINK+="rtl_sdr"
SUBSYSTEM=="usb", ATTRS{idVendor}=="0bda", ATTRS{idProduct}=="2838", GROUP="plugdev", MODE="0666", SYMLINK+="rtl_sdr"
SUBSYSTEM=="usb", ATTRS{idVendor}=="1d50", ATTRS{idProduct}=="604b", GROUP="plugdev", MODE="0666", SYMLINK+="hackrf"
SUBSYSTEM=="usb", ATTRS{idVendor}=="1d50", ATTRS{idProduct}=="6089", GROUP="plugdev", MODE="0666", SYMLINK+="hackrf"
EOF

# Reload udev rules
sudo udevadm control --reload-rules
sudo udevadm trigger

# Install Python dependencies
echo -e "${GREEN}[8/10] Installing Python dependencies...${NC}"
pip3 install --user \
    numpy \
    scipy \
    matplotlib \
    PyQt5 \
    pyrtlsdr \
    gnuradio \
    websockets \
    asyncio \
    aiohttp \
    cryptography \
    requests \
    flask \
    socketio

# Create virtual environment for C4ISR
echo -e "${GREEN}[9/10] Setting up C4ISR v3 environment...${NC}"
python3 -m venv c4isr-v3-env
source c4isr-v3-env/bin/activate

# Install specific C4ISR dependencies
pip install \
    pyrtlsdr \
    scipy \
    numpy \
    matplotlib \
    websockets \
    cryptography \
    requests \
    psutil \
    python-dotenv

# Create configuration directory
mkdir -p ~/.config/c4isr-v3
mkdir -p ~/.local/share/c4isr-v3/logs
mkdir -p ~/.local/share/c4isr-v3/data

# Create default configuration
cat > ~/.config/c4isr-v3/config.json <<EOF
{
    "version": "3.0.0",
    "classification": "RESTRICTED",
    "sdr": {
        "rtl_sdr": {
            "enabled": true,
            "device_index": 0,
            "sample_rate": 2048000,
            "gain": "auto"
        },
        "hackrf": {
            "enabled": false,
            "sample_rate": 20000000,
            "gain": 14
        }
    },
    "frequencies": {
        "drone_control": [433920000, 868000000, 915000000, 2400000000],
        "gps_l1": 1575420000,
        "adsb": 1090000000
    },
    "network": {
        "port": 8000,
        "secure_port": 8443,
        "bind_address": "0.0.0.0",
        "protocols": {
            "http3": true,
            "quic": true,
            "websocket": true
        }
    },
    "security": {
        "encryption": "AES-256-GCM",
        "require_authentication": true,
        "log_level": "INFO"
    }
}
EOF

# Create startup script
cat > ~/.local/bin/c4isr-v3 <<'EOF'
#!/bin/bash
cd $(dirname $0)/../share/c4isr-v3/
source ../../c4isr-v3-env/bin/activate
python3 -m http.server 8000 --bind 0.0.0.0
EOF

chmod +x ~/.local/bin/c4isr-v3

# Add to PATH if not already there
if ! echo $PATH | grep -q "$HOME/.local/bin"; then
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
fi

# Configure Kismet
echo -e "${GREEN}[10/10] Configuring Kismet for drone detection...${NC}"
sudo usermod -a -G kismet $USER

# Create Kismet override config
sudo mkdir -p /etc/kismet/conf.d
sudo tee /etc/kismet/conf.d/c4isr.conf > /dev/null <<EOF
# C4ISR v3 Kismet Configuration
server_name=C4ISR-v3-Kismet
server_description=Military Drone Detection System

# Enable logging
log_types=kismet,pcapng,alert
log_title=C4ISR-v3

# Drone detection sources
source=wlan0:name=Drone-Detection
source=wlan1:name=Secondary-Monitor

# Alert on unknown devices
alert=NEWDEVICE

# GPS configuration
gps=gpsd:host=localhost,port=2947
EOF

# Create desktop shortcuts
echo -e "${BLUE}Creating desktop shortcuts...${NC}"
mkdir -p ~/Desktop

# Main C4ISR v3 shortcut
cat > ~/Desktop/C4ISR-v3.desktop <<EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=C4ISR v3 - Main Interface
Comment=Advanced Drone Operations System
Exec=chromium --app=http://localhost:8000/c4isr-v3.html --kiosk
Icon=applications-internet
Terminal=false
Categories=Network;Security;
EOF

# Kali version shortcut
cat > ~/Desktop/C4ISR-v3-Kali.desktop <<EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=C4ISR v3 - Kali Edition
Comment=Kali Linux Military Operations Interface
Exec=chromium --app=http://localhost:8000/kali-c4isr-v3.html --kiosk
Icon=applications-internet
Terminal=false
Categories=Network;Security;
EOF

chmod +x ~/Desktop/*.desktop

# Create system service (optional)
cat > ~/.local/share/systemd/user/c4isr-v3.service <<EOF
[Unit]
Description=C4ISR v3 Military Operations System
After=network.target

[Service]
Type=simple
ExecStart=%h/.local/bin/c4isr-v3
Restart=always
RestartSec=10
Environment=PATH=%h/.local/bin:/usr/bin:/bin

[Install]
WantedBy=default.target
EOF

# Enable user service
mkdir -p ~/.config/systemd/user
systemctl --user daemon-reload

echo
echo -e "${GREEN}=================================="
echo -e "C4ISR v3 INSTALLATION COMPLETE!"
echo -e "==================================${NC}"
echo
echo -e "${BLUE}IMPORTANT NOTES:${NC}"
echo "1. Please logout and login again for group changes to take effect"
echo "2. Connect your RTL-SDR or HackRF device before starting"
echo "3. Ensure you have proper authorization for military operations"
echo
echo -e "${BLUE}QUICK START:${NC}"
echo "1. Start the system: ./c4isr-v3"
echo "2. Open browser: http://localhost:8000"
echo "3. Choose your interface:"
echo "   - c4isr-v3.html (Main interface)"
echo "   - kali-c4isr-v3.html (Kali edition)"
echo "   - android-c4isr-v3.html (Mobile interface)"
echo
echo -e "${BLUE}TESTING SDR:${NC}"
echo "rtl_test -t"
echo
echo -e "${BLUE}LAUNCHING KISMET:${NC}"
echo "sudo kismet"
echo
echo -e "${YELLOW}WARNING: This system is for authorized military use only!${NC}"
echo -e "${YELLOW}Ensure compliance with local laws and regulations.${NC}"
echo
echo -e "${GREEN}Installation completed successfully!${NC}"