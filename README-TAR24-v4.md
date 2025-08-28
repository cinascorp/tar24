# TAR24 v4 - Top Grade Command & Control System

## 🚀 Overview

TAR24 v4 is a professional-grade Command, Control, Communications, Computers, Intelligence, Surveillance, and Reconnaissance (C4ISR) system designed for military and security operations. This advanced flight tracking and intelligence system provides real-time aircraft monitoring with comprehensive data analysis capabilities.

## ✨ Key Features

- **Real-Time Flight Tracking**: Live integration with FlightRadar24 for authentic flight data
- **19 Flight Parameters**: Complete aircraft information including position, altitude, speed, heading, and more
- **Advanced Categorization**: Automatic classification of military, passenger, cargo, private, and drone aircraft
- **High-Performance Map**: OpenLayers-based interactive map with real-time updates
- **Data Export**: CSV export functionality for intelligence analysis
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Pure JavaScript**: No framework dependencies for maximum performance
- **Cross-Platform**: Works on Windows, Linux, and Android web frameworks

## 🎯 Flight Data Parameters

The system tracks and displays 19 comprehensive flight parameters:

1. **ICAO24** - Aircraft ICAO24 identifier
2. **Latitude** - Current latitude position
3. **Longitude** - Current longitude position
4. **Heading** - Aircraft heading in degrees
5. **Altitude (ft)** - Altitude in feet
6. **Altitude (m)** - Altitude in meters
7. **Speed (km/h)** - Ground speed in kilometers per hour
8. **Speed (kts)** - Ground speed in knots
9. **Callsign** - Flight callsign
10. **Registration** - Aircraft registration number
11. **Aircraft Type** - Aircraft type code
12. **Origin** - Origin airport code
13. **Destination** - Destination airport code
14. **Squawk Code** - Transponder squawk code
15. **Timestamp** - Last update timestamp
16. **MLAT** - Multilateration source indicator
17. **ADSB** - ADSB source indicator
18. **Satellite** - Satellite source indicator
19. **Ground Speed** - Ground speed indicator

## 🚁 Aircraft Categories

- **🔴 Military**: RCH, QID, LAGR, NATO, PAT, BOMBER, USAF, RAF, AF, MIL
- **🟢 Passenger**: Commercial airline flights
- **🔵 Cargo**: Freight and cargo aircraft
- **🟡 Private**: Private and general aviation
- **🟣 Drone**: UAV and drone detection
- **⚪ Unknown**: Unclassified aircraft

## 🛠️ Installation

### Prerequisites

- Python 3.6 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for FlightRadar24 data

### Quick Start

#### Windows
1. Double-click `start-tar24.bat`
2. The server will start automatically
3. Your browser will open to the application

#### Linux/macOS
1. Open terminal in the project directory
2. Run: `./start-tar24.sh`
3. The server will start automatically
4. Your browser will open to the application

#### Manual Start
1. Open terminal/command prompt in the project directory
2. Run: `python server.py`
3. Navigate to the displayed URL in your browser

## 📱 Usage

### Starting the System
1. Launch the server using one of the methods above
2. The application will automatically connect to FlightRadar24
3. Real-time flight data will begin loading

### Flight Control Center
- **Start/Stop Tracking**: Control real-time data updates
- **Refresh Data**: Manually update flight information
- **Export Data**: Download flight data as CSV for analysis

### Flight Data Panel
- **Category Filter**: Filter flights by aircraft type
- **Search**: Find specific flights by callsign or registration
- **Grouped Display**: Flights are grouped by 1500 for optimal performance
- **Real-Time Updates**: Data refreshes every 5 seconds

### Interactive Map
- **Click Aircraft**: View detailed flight information
- **Zoom & Pan**: Navigate the global flight map
- **Color Coding**: Aircraft are color-coded by category
- **Live Tracking**: Real-time position updates

### Flight Details
- **19 Parameters**: Complete flight information display
- **Real-Time Data**: Live updates from FlightRadar24
- **Export Ready**: Data formatted for intelligence analysis

## 🔧 Technical Specifications

### Architecture
- **Frontend**: Pure JavaScript (ES6+)
- **Styling**: CSS3 with advanced animations
- **Mapping**: OpenLayers 7.4.0
- **Data Source**: FlightRadar24 API
- **Server**: Python HTTP Server

### Performance
- **Update Interval**: 5 seconds
- **Max Flights per Group**: 1,500
- **Data Age Limit**: 4 hours
- **Memory Efficient**: Optimized for large datasets
- **Responsive**: 60fps animations and updates

### Compatibility
- **Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Platforms**: Windows 10+, Linux, macOS 10.14+
- **Mobile**: Android WebView, iOS Safari
- **Frameworks**: Compatible with Android Web Framework

## 🌐 Network Requirements

### Outbound Connections
- **FlightRadar24 API**: `data-cloud.flightradar24.com`
- **OpenLayers CDN**: `cdn.jsdelivr.net`
- **Ports**: HTTP (80), HTTPS (443)

### Security
- **CORS Enabled**: Cross-origin resource sharing
- **No Authentication**: Public FlightRadar24 data
- **HTTPS Support**: Secure data transmission

## 📊 Data Sources

### FlightRadar24 Integration
- **Primary API**: `data-cloud.flightradar24.com`
- **Fallback API**: `data-live.flightradar24.com`
- **Data Format**: JavaScript function response
- **Update Frequency**: Real-time (5-second intervals)
- **Coverage**: Global aircraft tracking

### Data Quality
- **ADSB**: Automatic Dependent Surveillance-Broadcast
- **MLAT**: Multilateration positioning
- **Satellite**: Satellite-based tracking
- **Estimated**: Calculated positions when direct data unavailable

## 🚀 Deployment

### Local Development
```bash
python server.py
```

### Production Server
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

### Docker (Optional)
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY . .
EXPOSE 8000
CMD ["python", "server.py"]
```

## 🔍 Troubleshooting

### Common Issues

#### Flight Data Not Loading
- Check internet connection
- Verify FlightRadar24 API accessibility
- Check browser console for errors
- Ensure no firewall blocking outbound connections

#### Map Not Displaying
- Verify OpenLayers library loaded
- Check browser console for JavaScript errors
- Ensure HTTPS if using secure context

#### Performance Issues
- Reduce update frequency in CONFIG
- Limit maximum flights per group
- Use hardware acceleration in browser
- Close unnecessary browser tabs

### Error Messages
- **"Failed to fetch data"**: Network connectivity issue
- **"No flights found"**: No aircraft in current view
- **"Map initialization failed"**: OpenLayers loading issue

## 📈 Performance Optimization

### Browser Settings
- Enable hardware acceleration
- Disable unnecessary extensions
- Use dedicated graphics card
- Close background applications

### System Requirements
- **RAM**: 4GB minimum, 8GB recommended
- **CPU**: Multi-core processor
- **Storage**: 100MB free space
- **Network**: Stable internet connection

## 🔒 Security Considerations

### Data Privacy
- Flight data is publicly available
- No personal information collected
- Data sourced from FlightRadar24
- Export data for offline analysis

### Network Security
- Use HTTPS in production
- Implement firewall rules
- Monitor network traffic
- Regular security updates

## 📚 API Reference

### Flight Data Structure
```javascript
{
    hex: "ICAO24_ID",
    lat: 40.7128,
    lon: -74.0060,
    heading: 180,
    alt_ft: 35000,
    alt_m: 10668,
    spd_kmh: 800,
    spd_kts: 432,
    callsign: "UAL123",
    reg: "N12345",
    acType: "B738",
    origin: "JFK",
    destination: "LAX",
    squawk: "1234",
    timestamp: 1640995200000,
    mlat: "MLAT",
    adsb: "ADSB",
    sat: "SAT",
    gnd: "AIR"
}
```

### Configuration Options
```javascript
const CONFIG = {
    updateInterval: 5000,        // Update frequency in ms
    maxFlightsPerGroup: 1500,    // Flights per display group
    maxAge: 14400,               // Maximum data age in seconds
    bounds: {                    // Default map bounds
        north: 90,
        south: -90,
        east: 180,
        west: -180
    }
};
```

## 🤝 Contributing

### Development Setup
1. Clone the repository
2. Install Python 3.6+
3. Run `python server.py`
4. Open `tar24-v4.html` in browser

### Code Standards
- Pure JavaScript (no frameworks)
- ES6+ syntax
- Consistent naming conventions
- Comprehensive error handling
- Performance optimization

## 📄 License

This project is developed for military and security applications. Please ensure compliance with local regulations and FlightRadar24 terms of service.

## 🆘 Support

### Documentation
- This README file
- Inline code comments
- Browser developer console
- Network tab for API calls

### Contact
For technical support and feature requests, please refer to the development team.

---

**TAR24 v4 - Command & Control Excellence** 🚁⚡