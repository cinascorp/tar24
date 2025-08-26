/**
 * C4ISR Military Tracking System Configuration
 * Comprehensive configuration for military-grade flight tracking and analysis
 */

const C4ISR_CONFIG = {
    // System Information
    SYSTEM_NAME: "C4ISR Military Tracking System",
    VERSION: "2.1.0",
    BUILD_DATE: "2025",
    
    // HTTP/3 Configuration
    HTTP3: {
        ENABLED: true,
        FALLBACK_TIMEOUT: 5000,
        RETRY_ATTEMPTS: 3
    },
    
    // Data Sources Configuration
    DATA_SOURCES: {
        FLIGHTRADAR24: {
            NAME: "FlightRadar24",
            BASE_URL: "https://data-cloud.flightradar24.com/zones/fcgi/js",
            ENDPOINTS: {
                TRAFFIC: "/traffic.js",
                AIRPORTS: "/airports.js",
                AIRLINES: "/airlines.js"
            },
            UPDATE_INTERVAL: 5000, // 5 seconds
            MAX_REQUESTS_PER_MINUTE: 60,
            API_KEY_REQUIRED: false,
            SUPPORTED_FEATURES: ["realtime", "historical", "weather", "radar"]
        },
        
        OPENSKY: {
            NAME: "OpenSky Network",
            BASE_URL: "https://opensky-network.org/api",
            ENDPOINTS: {
                STATES: "/states/all",
                AIRCRAFT: "/aircraft",
                FLIGHTS: "/flights/all"
            },
            UPDATE_INTERVAL: 10000, // 10 seconds
            MAX_REQUESTS_PER_MINUTE: 30,
            API_KEY_REQUIRED: true,
            SUPPORTED_FEATURES: ["realtime", "historical", "trajectory"]
        },
        
        ADSB: {
            NAME: "ADSB.lol",
            BASE_URL: "https://api.adsb.lol/v2",
            ENDPOINTS: {
                MILITARY: "/mil",
                TRAFFIC: "/traffic",
                AIRCRAFT: "/aircraft"
            },
            UPDATE_INTERVAL: 8000, // 8 seconds
            MAX_REQUESTS_PER_MINUTE: 45,
            API_KEY_REQUIRED: false,
            SUPPORTED_FEATURES: ["military", "realtime", "historical"]
        },
        
        KIWISDR: {
            NAME: "KiwiSDR",
            BASE_URL: "https://kiwisdr.com",
            ENDPOINTS: {
                SPECTRUM: "/spectrum",
                AUDIO: "/audio",
                STATUS: "/status"
            },
            UPDATE_INTERVAL: 1000, // 1 second for real-time spectrum
            MAX_REQUESTS_PER_MINUTE: 120,
            API_KEY_REQUIRED: false,
            SUPPORTED_FEATURES: ["spectrum", "audio", "radar_detection"],
            FREQUENCY_RANGE: {
                MIN: 0, // Hz
                MAX: 30000000 // 30 MHz
            }
        }
    },
    
    // Map Configuration
    MAP: {
        DEFAULT_CENTER: [35.6892, 51.3890], // Tehran, Iran
        DEFAULT_ZOOM: 8,
        MIN_ZOOM: 3,
        MAX_ZOOM: 18,
        MAX_FLIGHTS_DISPLAY: 50000,
        
        // Tile Layers
        TILE_LAYERS: {
            OPENSTREETMAP: {
                name: "OpenStreetMap",
                url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                attribution: "© OpenStreetMap contributors"
            },
            SATELLITE: {
                name: "Satellite",
                url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                attribution: "© Esri"
            },
            HIGH_CONTRAST: {
                name: "High Contrast",
                url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                attribution: "© OpenStreetMap contributors",
                style: "high-contrast"
            },
            TERRAIN: {
                name: "Terrain",
                url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
                attribution: "© OpenTopoMap"
            }
        },
        
        // Flight Icons
        FLIGHT_ICONS: {
            MILITARY: {
                icon: "military-plane",
                color: "#ff0000",
                size: [32, 32]
            },
            COMMERCIAL: {
                icon: "commercial-plane",
                color: "#00ff41",
                size: [24, 24]
            },
            PRIVATE: {
                icon: "private-plane",
                color: "#0066cc",
                size: [20, 20]
            },
            UAV: {
                icon: "drone",
                color: "#ffaa00",
                size: [28, 28]
            },
            UNKNOWN: {
                icon: "unknown-plane",
                color: "#888888",
                size: [22, 22]
            }
        }
    },
    
    // 3D Globe Configuration
    GLOBE: {
        EARTH_RADIUS: 6371000, // meters
        ATMOSPHERE_HEIGHT: 100000, // meters
        ORBIT_HEIGHT: 2000000, // meters
        ROTATION_SPEED: 0.1,
        AUTO_ROTATE: true,
        SHOW_GRID: true,
        SHOW_ATMOSPHERE: true
    },
    
    // Threat Detection Configuration
    THREAT_DETECTION: {
        ENABLED: true,
        UPDATE_INTERVAL: 2000, // 2 seconds
        
        // Threat Levels
        THREAT_LEVELS: {
            LOW: {
                color: "#00ff41",
                description: "Low threat level",
                actions: ["monitor", "log"]
            },
            MEDIUM: {
                color: "#ffaa00",
                description: "Medium threat level",
                actions: ["monitor", "log", "alert"]
            },
            HIGH: {
                color: "#ff0000",
                description: "High threat level",
                actions: ["monitor", "log", "alert", "notify", "sound"]
            },
            CRITICAL: {
                color: "#8b0000",
                description: "Critical threat level",
                actions: ["monitor", "log", "alert", "notify", "sound", "emergency"]
            }
        },
        
        // Threat Indicators
        THREAT_INDICATORS: {
            UNKNOWN_AIRCRAFT: {
                weight: 1,
                description: "Unknown aircraft type"
            },
            MILITARY_ACTIVITY: {
                weight: 3,
                description: "Military aircraft activity"
            },
            SUSPICIOUS_PATTERN: {
                weight: 2,
                description: "Suspicious flight pattern"
            },
            RADAR_EVASION: {
                weight: 4,
                description: "Potential radar evasion"
            },
            STEALTH_TECHNOLOGY: {
                weight: 5,
                description: "Stealth technology detected"
            },
            GPS_JAMMING: {
                weight: 4,
                description: "GPS jamming detected"
            }
        }
    },
    
    // GPS Jamming Configuration
    GPS_JAMMING: {
        ENABLED: true,
        MODES: {
            JAM: {
                name: "GPS Jamming",
                description: "Jam GPS signals to confuse enemy drones",
                power: "high",
                range: "500m"
            },
            SPOOF: {
                name: "GPS Spoofing",
                description: "Send false GPS coordinates",
                power: "medium",
                range: "1km"
            },
            STEALTH: {
                name: "Stealth Mode",
                description: "Hide user location and path",
                power: "low",
                range: "100m"
            }
        },
        
        SAFETY_FEATURES: {
            EMERGENCY_OVERRIDE: true,
            LOCATION_BACKUP: true,
            PATH_RECOVERY: true,
            USER_PROTECTION: true
        }
    },
    
    // Language Configuration
    LANGUAGES: {
        EN: {
            code: "en",
            name: "English",
            direction: "ltr",
            flag: "🇺🇸"
        },
        FA: {
            code: "fa",
            name: "فارسی",
            direction: "rtl",
            flag: "🇮🇷"
        },
        SV: {
            code: "sv",
            name: "Svenska",
            direction: "ltr",
            flag: "🇸🇪"
        }
    },
    
    // Notification Configuration
    NOTIFICATIONS: {
        ENABLED: true,
        TYPES: {
            INFO: {
                icon: "info-circle",
                color: "#0066cc",
                sound: false
            },
            SUCCESS: {
                icon: "check-circle",
                color: "#00ff41",
                sound: false
            },
            WARNING: {
                icon: "exclamation-triangle",
                color: "#ffaa00",
                sound: true
            },
            DANGER: {
                icon: "times-circle",
                color: "#ff0000",
                sound: true
            }
        },
        
        AUDIO: {
            ENABLED: true,
            VOLUME: 0.7,
            FILES: {
                THREAT_ALERT: "audio/threat-alert.mp3",
                SYSTEM_ALERT: "audio/system-alert.mp3",
                NOTIFICATION: "audio/notification.mp3"
            }
        }
    },
    
    // Performance Configuration
    PERFORMANCE: {
        MAX_CONCURRENT_REQUESTS: 10,
        REQUEST_TIMEOUT: 10000,
        CACHE_DURATION: 300000, // 5 minutes
        MEMORY_LIMIT: 512, // MB
        CPU_THROTTLING: true,
        
        // Rendering
        RENDER_QUALITY: "high", // low, medium, high
        FRAME_RATE: 60,
        LOD_DISTANCE: 1000,
        PARTICLE_COUNT: 1000
    },
    
    // Security Configuration
    SECURITY: {
        ENCRYPTION_ENABLED: true,
        API_KEY_ROTATION: true,
        RATE_LIMITING: true,
        CORS_ENABLED: false,
        SANDBOX_MODE: false,
        
        // Access Control
        USER_ROLES: {
            VIEWER: "viewer",
            OPERATOR: "operator",
            ADMINISTRATOR: "administrator",
            COMMANDER: "commander"
        },
        
        // Permission grading for roles (higher is more privileged)
        PERMISSION_LEVELS: {
            viewer: 1,
            operator: 2,
            administrator: 3,
            commander: 4
        },
        TOP_LEVEL_ROLE: "commander"
    },
    
    // Logging Configuration
    LOGGING: {
        ENABLED: true,
        LEVEL: "info", // debug, info, warn, error
        MAX_ENTRIES: 10000,
        AUTO_CLEANUP: true,
        EXPORT_FORMATS: ["json", "csv", "xml"]
    },
    
    // Development Configuration
    DEVELOPMENT: {
    DEBUG_MODE: false,
    MOCK_DATA: false,
    PERFORMANCE_MONITORING: true,
    ERROR_REPORTING: true,
    HOT_RELOAD: false
    }
};

// Export configuration for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = C4ISR_CONFIG;
} else {
    window.C4ISR_CONFIG = C4ISR_CONFIG;
}