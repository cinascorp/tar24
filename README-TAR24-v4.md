# TAR24 v4 - Advanced C4ISR Command & Control System

## Overview

TAR24 v4 is a cutting-edge Command, Control, Communications, Computers, Intelligence, Surveillance, and Reconnaissance (C4ISR) system designed for top-grade military and security operations. This system provides real-time flight tracking and intelligence gathering capabilities using live data from FlightRadar24.

## Key Features

### 🚀 Real-Time Flight Intelligence
- **Live FlightRadar24 Integration**: Direct connection to FlightRadar24's real-time data feeds
- **All 19 Flight Parameters**: Complete aircraft data including ICAO24, position, altitude, speed, heading, and more
- **50,000+ Flight Capacity**: Handles massive amounts of flight data with efficient pagination (1,500 flights per page)
- **No Simulation Data**: 100% real flight data - no fake or simulated information

### 🎯 Advanced Aircraft Classification
- **Military Aircraft Detection**: Automatic identification of military flights using callsign patterns
- **Threat Assessment**: Real-time threat level monitoring based on military and drone presence
- **Aircraft Categorization**: Military, Passenger, Cargo, Private, and Drone/UAV classification
- **Intelligent Filtering**: Advanced filtering by altitude, speed, and aircraft type

### 🗺️ Professional Mapping Interface
- **Dark Theme**: Military-grade dark interface for low-light operations
- **Interactive Map**: Leaflet-based mapping with real-time flight markers
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Custom Aircraft Icons**: Color-coded markers for different aircraft types

### ⚡ Performance & Reliability
- **Pure JavaScript**: No heavy frameworks - optimized for Android Web Framework
- **Fast Loading**: Minimal dependencies for maximum performance
- **Auto-Refresh**: Automatic data updates every 10 seconds
- **Error Handling**: Robust error handling and fallback mechanisms

## Flight Data Parameters

The system extracts and displays all 19 available flight parameters from FlightRadar24:

1. **ICAO24 Hex Code** - Unique aircraft identifier
2. **Latitude** - Current position (decimal degrees)
3. **Longitude** - Current position (decimal degrees)
4. **Altitude (feet)** - Height above sea level
5. **Altitude (meters)** - Height in metric units
6. **Speed (knots)** - Airspeed in nautical miles per hour
7. **Speed (km/h)** - Airspeed in kilometers per hour
8. **Heading** - Aircraft direction in degrees
9. **Callsign** - Flight identification
10. **Registration** - Aircraft registration number
11. **Aircraft Type** - ICAO aircraft type code
12. **Origin Airport** - Departure airport
13. **Destination Airport** - Arrival airport
14. **Flight Number** - Airline flight number
15. **Airline Code** - Operating airline
16. **Vertical Speed** - Rate of climb/descent
17. **Squawk Code** - Transponder code
18. **Timestamp** - Last data update time
19. **Flight Status** - Current flight status

## Installation

### Prerequisites
- Python 3.7 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for FlightRadar24 data

### Quick Start

#### Windows Users
1. Download the project files
2. Double-click `start-tar24-v4.bat`
3. The system will automatically open in your default browser

#### Linux/Mac Users
1. Download the project files
2. Open terminal in the project directory
3. Run: `./start-tar24-v4.sh`
4. The system will automatically open in your default browser

#### Manual Start
1. Open terminal/command prompt in the project directory
2. Run: `python server.py` or `python3 server.py`
3. Open browser and navigate to the displayed URL

## Usage

### Basic Operation
1. **System Initialization**: Wait for the loading screen to complete
2. **Flight Display**: View real-time flights on the interactive map
3. **Sidebar Navigation**: Use the sidebar to browse flights and apply filters
4. **Flight Details**: Click on any flight marker to view detailed information
5. **Pagination**: Navigate through large numbers of flights using page controls

### Advanced Features
- **Threat Monitoring**: Monitor threat levels in real-time
- **Filtering**: Filter flights by aircraft type, altitude, and speed
- **Statistics**: View real-time flight statistics and counts
- **Map Controls**: Toggle sidebar, refresh data, and center map view

### Flight Selection
- Click on any flight in the sidebar to center the map on that aircraft
- Click on map markers to view detailed flight information
- Use filters to focus on specific types of aircraft or flight conditions

## System Architecture

### Frontend
- **Pure JavaScript**: No heavy frameworks for maximum performance
- **CSS3**: Modern styling with CSS variables and animations
- **Leaflet Maps**: Lightweight mapping library for flight visualization
- **Responsive Design**: Mobile-first approach for all devices

### Backend
- **Python HTTP Server**: Lightweight server with CORS support
- **Real-time Data**: Direct integration with FlightRadar24 APIs
- **Error Handling**: Robust error handling and fallback mechanisms
- **Cross-platform**: Works on Windows, Linux, and macOS

### Data Flow
1. **FlightRadar24 API**: Real-time flight data from multiple endpoints
2. **Data Processing**: Extraction and validation of all 19 parameters
3. **Client Display**: Real-time updates to map and interface
4. **User Interaction**: Filtering, selection, and detailed viewing

## Security Features

- **Real Data Only**: No simulation or fake data
- **Threat Assessment**: Automatic threat level monitoring
- **Military Detection**: Advanced pattern recognition for military aircraft
- **Secure Communication**: HTTPS-ready with proper CORS headers

## Performance Optimization

- **Efficient Pagination**: 1,500 flights per page for smooth performance
- **Smart Filtering**: Client-side filtering for instant results
- **Optimized Rendering**: Efficient map marker management
- **Memory Management**: Proper cleanup of unused resources

## Browser Compatibility

- **Chrome**: 80+ (Recommended)
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+
- **Mobile Browsers**: iOS Safari, Chrome Mobile

## Troubleshooting

### Common Issues

#### Server Won't Start
- Ensure Python 3.7+ is installed
- Check if port 8000+ is available
- Verify all files are in the same directory

#### No Flight Data
- Check internet connection
- Verify FlightRadar24 is accessible
- Check browser console for errors

#### Map Not Loading
- Ensure JavaScript is enabled
- Check browser compatibility
- Clear browser cache and reload

### Error Messages
- **"Python not found"**: Install Python 3.7+ and add to PATH
- **"Port already in use"**: Server will automatically find an available port
- **"File not found"**: Ensure you're running from the correct directory

## Development

### File Structure
```
tar24-v4/
├── tar24-v4.html      # Main application file
├── server.py          # Python HTTP server
├── start-tar24-v4.bat # Windows startup script
├── start-tar24-v4.sh  # Linux/Mac startup script
└── README-TAR24-v4.md # This documentation
```

### Customization
- **Colors**: Modify CSS variables in the `:root` section
- **Map Center**: Change default coordinates in `initMap()`
- **Update Frequency**: Adjust refresh interval in `startRealTimeUpdates()`
- **Flight Parameters**: Modify parameter extraction in `extractFlightParameters()`

### Adding Features
- **New Data Sources**: Extend `fetchFlightRadar24Data()` function
- **Additional Filters**: Add new filter options in the sidebar
- **Custom Markers**: Modify `addFlightMarker()` function
- **New Statistics**: Extend `updateStatistics()` function

## License

This project is developed for military and security applications. Please ensure compliance with all applicable laws and regulations.

## Support

For technical support or feature requests, please refer to the system documentation or contact your system administrator.

---

**TAR24 v4 - Command & Control Excellence** 🚀✈️🛡️