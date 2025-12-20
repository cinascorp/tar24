# سامانه ردیابی نظامی C4ISR

## نمای کلی
این سامانه برای پایش، تحلیل و فرماندهی عملیات‌های هوایی و شناسایی طراحی شده و امکان دریافت داده از منابع متعدد، تحلیل تهدیدات، نمایش نقشه‌های 2D/3D و پشتیبانی چندزبانه را فراهم می‌کند.

## ویژگی‌ها
- یکپارچه‌سازی منابع داده: OpenSky، ADSB.lol، FlightRadar24 (در صورت دسترسی)، KiwiSDR
- نقشه و تجسم: نقشه 2D، کره سه‌بعدی، لایه‌های ماهواره‌ای/توپوگرافی/آب‌وهوا
- تشخیص تهدید: ارزیابی خودکار سطح تهدید، شناسایی الگوهای مشکوک، هشدارهای لحظه‌ای
- امنیت GPS: حالت اخلال، حالت مخفی، بازیابی مسیر، لغو اضطراری
- چندزبانه: فارسی، انگلیسی، سوئدی و سوییچ زنده زبان (RTL/LTR)

## نصب و راه‌اندازی
1. نیازمندی‌ها: Node.js 16+، مرورگر مدرن با WebGL
2. دریافت کد و نصب وابستگی‌ها:
```bash
npm install
npm start
```
یا اجرای مستقیم فایل‌های HTML روی یک وب‌سرور ساده.

## پیکربندی
تنظیمات اصلی در `js/config.js` قرار دارد:
- منابع داده و بازه به‌روزرسانی
- تنظیمات نقشه و لایه‌ها
- آستانه‌های تشخیص تهدید
- حالت‌های امنیت GPS
- زبان‌ها و راست‌به‌چپ

## دسترسی و مجوزها
- نقش‌ها: viewer، operator، administrator، commander
- سطوح دسترسی: 1 تا 4 (فرمانده 4/بیشترین)
- نقش سطح‌بالا: `commander`

## استفاده
- مسیر پیش‌فرض فارسی: `index-fa.html` یا `index.html?lang=fa`
- تغییر زبان از داخل صفحات (ذخیره در LocalStorage)
- لینک به همه صفحات با پارامتر `?lang`

## نکات داده واقعی
- برای داده پرواز از OpenSky استفاده می‌شود. در صورت خطا و فعال بودن `DEVELOPMENT.MOCK_DATA` نمونه‌داده‌ها استفاده می‌شوند.
- برای ADSB.lol و FlightRadar24 ممکن است کلید/دسترسی لازم باشد.

## خطاهای متداول
- عدم کارکرد WebGL: مرورگر را به‌روز کنید
- خطای دسترسی میکروفون/مکان: مجوزهای مرورگر را بررسی کنید

## حق کپی‌رایت و مسئولیت
تمامی حقوق محفوظ است.
در خط پایانی تاکید می‌شود:

تمام اقدامات در این پروژه صرفاً جهت پژوهش است و Cinascorp ©® مسئول هرگونه سوء‌استفاده می‌باشد.

###############################################################################

# C4ISR Military Tracking System v2.0.0

## 🚀 Overview

The C4ISR Military Tracking System is a comprehensive, military-grade flight tracking and analysis application designed for Command, Control, Communications, Computers, Intelligence, Surveillance, and Reconnaissance operations. This system provides real-time monitoring of aircraft, UAVs, and potential threats with advanced military-grade features.

## ✨ Key Features

### 🌐 Multi-Source Data Integration
- **FlightRadar24 Integration**: Real-time commercial flight data
- **OpenSky Network**: Comprehensive ADS-B data coverage
- **ADSB.lol**: Military aircraft tracking and identification
- **KiwiSDR Support**: 0-30MHz spectrum analysis for radar detection

### 🗺️ Advanced Mapping & Visualization
- **2D Map View**: High-performance Leaflet-based mapping
- **3D Globe View**: Three.js powered spherical visualization
- **Multiple Map Layers**: Satellite, high-contrast, terrain, and weather layers
- **Scalable Display**: Support for up to 50,000 concurrent flights
- **Military Theme**: Dark, high-contrast interface optimized for operational use

### 🚨 Threat Detection & Analysis
- **Automatic Threat Assessment**: AI-powered threat level evaluation
- **Radar Evasion Detection**: Identification of stealth technology usage
- **Military Aircraft Recognition**: Automatic classification of military vs. commercial aircraft
- **Pattern Analysis**: Suspicious flight pattern detection
- **Real-time Alerts**: Audio and visual threat notifications

### 🛡️ GPS Security & Stealth Features
- **GPS Jamming Mode**: Confuse enemy drone GPS systems
- **GPS Spoofing**: Send false coordinates to mislead tracking
- **Stealth Mode**: Hide user location and path temporarily
- **Emergency Override**: Quick access to normal operation
- **Path Recovery**: Automatic restoration of user location data

### 🌍 Multi-Language Support
- **English**: Primary interface language
- **Persian (فارسی)**: Full RTL support for Persian users
- **Swedish (Svenska)**: Complete Swedish localization
- **Dynamic Language Switching**: Real-time interface updates

### 📡 HTTP/3 & Performance
- **HTTP/3 Support**: Modern protocol for enhanced performance
- **High Scalability**: Optimized for large-scale operations
- **Real-time Updates**: Sub-second data refresh rates
- **Memory Management**: Efficient resource utilization

## 🏗️ System Architecture

### Core Components
```
C4ISR Application
├── Language Manager (EN/FA/SV)
├── Data Source Manager
│   ├── FlightRadar24
│   ├── OpenSky Network
│   ├── ADSB.lol
│   └── KiwiSDR
├── Threat Detection System
├── GPS Jamming System
├── Map Controller (2D)
├── 3D Globe Renderer
└── Notification System
```

### Data Flow
1. **Data Collection**: Multiple sources provide real-time flight data
2. **Data Processing**: AI algorithms analyze and classify aircraft
3. **Threat Assessment**: Automatic threat level calculation
4. **Visualization**: Real-time display on 2D/3D interfaces
5. **User Interaction**: GPS jamming, stealth mode, and filtering

## 🚀 Installation & Setup

### Prerequisites
- Node.js 16.0.0 or higher
- Modern web browser with WebGL support
- Internet connection for data sources

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd c4isr-military-tracking-system

# Install dependencies
npm install

# Start the application
npm start

# Or for development
npm run dev
```

### Manual Setup
1. Download all files to a web server directory
2. Ensure all JavaScript files are in the `js/` folder
3. Ensure all CSS files are in the `styles/` folder
4. Open `index.html` in a modern web browser

## 🔧 Configuration

### System Configuration
The system is configured through `js/config.js` with the following key sections:

- **Data Sources**: API endpoints and update intervals
- **Map Settings**: Default center, zoom levels, and tile layers
- **Threat Detection**: Threat level thresholds and indicators
- **GPS Jamming**: Jamming modes and safety features
- **Performance**: Memory limits and rendering quality

### Customization
```javascript
// Example: Modify threat detection sensitivity
C4ISR_CONFIG.THREAT_DETECTION.THREAT_INDICATORS.MILITARY_ACTIVITY.weight = 5;

// Example: Change default map center
C4ISR_CONFIG.MAP.DEFAULT_CENTER = [40.7128, -74.0060]; // New York
```

## 📊 Usage Guide

### Basic Operation
1. **Launch**: Open the application in your browser
2. **Select Data Sources**: Choose which flight data sources to activate
3. **View Flights**: Monitor real-time aircraft positions on the map
4. **Apply Filters**: Use altitude, speed, and type filters
5. **Switch Views**: Toggle between 2D map and 3D globe

### Advanced Features
1. **GPS Jamming**: Click the satellite button to activate jamming mode
2. **Stealth Mode**: Use the stealth button to hide your location
3. **Threat Monitoring**: Monitor threat levels in the header
4. **Layer Management**: Toggle satellite, terrain, and weather layers
5. **Language Switching**: Change interface language from the header

### Threat Response
1. **Automatic Detection**: System automatically identifies threats
2. **Audio Alerts**: Hear threat notifications immediately
3. **Visual Indicators**: Red threat level indicators in the header
4. **Detailed Analysis**: Click on aircraft for detailed information
5. **Emergency Actions**: Quick access to GPS jamming and stealth modes

## 🔒 Security Features

### GPS Protection
- **Jamming Capability**: Disrupt enemy drone GPS signals
- **Spoofing Protection**: Send false coordinates to mislead tracking
- **Stealth Operations**: Hide user location during sensitive operations
- **Emergency Override**: Quick return to normal operation

### Data Security
- **Encrypted Communications**: Secure data transmission
- **Access Control**: Role-based user permissions
- **Audit Logging**: Complete system activity records
- **Sandbox Mode**: Isolated operation for testing

## 🌐 Data Sources

### FlightRadar24
- **Coverage**: Global commercial flight data
- **Update Rate**: Every 5 seconds
- **Features**: Real-time tracking, historical data, weather integration

### OpenSky Network
- **Coverage**: Worldwide ADS-B data
- **Update Rate**: Every 10 seconds
- **Features**: Military aircraft, trajectory analysis

### ADSB.lol
- **Coverage**: Military and civilian aircraft
- **Update Rate**: Every 8 seconds
- **Features**: Military identification, threat assessment

### KiwiSDR
- **Coverage**: 0-30MHz spectrum analysis
- **Update Rate**: Every 1 second
- **Features**: Radar detection, stealth technology identification

## 🎯 Military Applications

### Command & Control
- **Real-time Situational Awareness**: Complete airspace picture
- **Threat Assessment**: Automatic threat level calculation
- **Response Coordination**: Integrated command interface
- **Mission Planning**: Historical data analysis

### Intelligence & Surveillance
- **Pattern Recognition**: Identify suspicious flight patterns
- **Stealth Detection**: Detect radar-evading aircraft
- **Electronic Warfare**: GPS jamming and spoofing capabilities
- **Signal Intelligence**: KiwiSDR spectrum analysis

### Force Protection
- **GPS Security**: Protect friendly forces from GPS attacks
- **Stealth Operations**: Hide operational movements
- **Threat Warning**: Early warning of potential attacks
- **Counter-UAV**: Disrupt enemy drone operations

## 🔧 Technical Specifications

### Performance
- **Maximum Flights**: 50,000 concurrent aircraft
- **Update Rate**: 1-10 seconds depending on source
- **Memory Usage**: Optimized for 512MB limit
- **Frame Rate**: 60 FPS target for smooth operation

### Compatibility
- **Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Devices**: Desktop, tablet, and mobile support
- **Operating Systems**: Windows, macOS, Linux, iOS, Android
- **Hardware**: WebGL-capable graphics card recommended

### Standards
- **HTTP/3**: Modern web protocol support
- **WebGL**: Hardware-accelerated 3D rendering
- **Web Audio API**: Advanced audio capabilities
- **Service Workers**: Offline capability support

## 🚨 Emergency Procedures

### GPS Jamming Activation
1. Click the satellite button (red) in the header
2. Confirm activation in the dialog
3. Monitor jamming effectiveness
4. Use emergency override if needed

### Stealth Mode Activation
1. Click the stealth button (yellow) in the header
2. System will hide your location
3. Path recovery will be active
4. Normal operation resumes automatically

### Threat Response
1. **Low Threat**: Monitor and log
2. **Medium Threat**: Alert operators
3. **High Threat**: Audio alerts and notifications
4. **Critical Threat**: Emergency procedures and alerts

## 📈 Performance Optimization

### Rendering Quality
- **High**: Maximum detail, 60 FPS target
- **Medium**: Balanced performance and quality
- **Low**: Maximum performance, reduced detail

### Memory Management
- **Automatic Cleanup**: Old data removal
- **Cache Optimization**: Efficient data storage
- **LOD System**: Level-of-detail rendering
- **Particle Limits**: Configurable visual effects

## 🔍 Troubleshooting

### Common Issues
1. **Map Not Loading**: Check internet connection and browser compatibility
2. **No Flight Data**: Verify data source connections and API keys
3. **Performance Issues**: Reduce rendering quality or flight count
4. **Audio Not Working**: Check browser audio permissions

### Debug Mode
Enable debug mode in the configuration:
```javascript
C4ISR_CONFIG.DEVELOPMENT.DEBUG_MODE = true;
```

### Logging
System logs are available in the browser console and can be exported in multiple formats.

## 📚 API Reference

### Core Classes
- **C4ISRApplication**: Main application controller
- **LanguageManager**: Multi-language support
- **DataSourceManager**: Data source integration
- **ThreatDetectionSystem**: Threat analysis engine
- **GPSJammingSystem**: GPS security features
- **MapController**: 2D map management
- **Globe3D**: 3D globe rendering
- **NotificationManager**: User notification system

### Event System
The system uses a comprehensive event system for inter-component communication:
- `systemReady`: System initialization complete
- `threatDetected`: New threat identified
- `dataUpdated`: Flight data refreshed
- `languageChanged`: Interface language updated

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- ES6+ JavaScript
- Comprehensive error handling
- JSDoc documentation
- Unit test coverage
- Performance optimization

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This system is designed for military and defense applications. Users are responsible for compliance with local laws and regulations regarding GPS jamming, surveillance, and military operations.

## 🆘 Support

### Documentation
- **User Manual**: Comprehensive usage guide
- **API Reference**: Technical documentation
- **Video Tutorials**: Step-by-step instructions
- **FAQ**: Common questions and answers

### Contact
- **Technical Support**: [support@c4isr-system.com]
- **Feature Requests**: [features@c4isr-system.com]
- **Bug Reports**: [bugs@c4isr-system.com]

### Community
- **Forum**: [community.c4isr-system.com]
- **Discord**: [discord.gg/c4isr]
- **GitHub Issues**: [github.com/c4isr-system/issues]

---

**C4ISR Military Tracking System v2.0.0** - Empowering military operations with advanced technology and comprehensive situational awareness.

*Developed for military and defense applications with cutting-edge web technologies.* 


