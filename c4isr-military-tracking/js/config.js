/**
 * C4ISR Military Tracking System - Configuration
 * 
 * Comprehensive configuration management for all system components
 * Version: 2.0.0
 */

const C4ISR_CONFIG = {
    // Application Metadata
    APPLICATION: {
        NAME: 'C4ISR Military Tracking System',
        VERSION: '2.0.0',
        BUILD: Date.now(),
        ENVIRONMENT: 'production', // development, staging, production
        DEBUG_MODE: false,
        LOG_LEVEL: 'info' // debug, info, warn, error
    },

    // API Configuration
    API: {
        // FlightRadar24 Configuration
        FLIGHTRADAR24: {
            ENABLED: true,
            BASE_URL: 'https://data-live.flightradar24.com',
            ENDPOINTS: {
                ZONES: '/zones/fcgi/feed.js',
                FLIGHTS: '/clickhandler/',
                PLAYBACK: '/playback/',
                AIRLINES: '/airlines',
                AIRPORTS: '/airports'
            },
            RATE_LIMIT: {
                REQUESTS_PER_MINUTE: 60,
                BURST_LIMIT: 10
            },
            TIMEOUT: 30000,
            RETRY_ATTEMPTS: 3,
            UPDATE_INTERVAL: 5000 // 5 seconds
        },

        // OpenSky Network Configuration
        OPENSKY: {
            ENABLED: true,
            BASE_URL: 'https://opensky-network.org/api',
            ENDPOINTS: {
                STATES: '/states/all',
                OWN_STATES: '/states/own',
                TRACKS: '/tracks/all',
                FLIGHTS: '/flights/all'
            },
            CREDENTIALS: {
                USERNAME: null, // Set via environment or user input
                PASSWORD: null
            },
            RATE_LIMIT: {
                REQUESTS_PER_MINUTE: 60,
                ANONYMOUS_LIMIT: 10
            },
            TIMEOUT: 45000,
            RETRY_ATTEMPTS: 3,
            UPDATE_INTERVAL: 10000 // 10 seconds
        },

        // ADSB.lol Configuration
        ADSB_LOL: {
            ENABLED: false, // Disabled by default
            BASE_URL: 'https://api.adsb.lol',
            ENDPOINTS: {
                AIRCRAFT: '/v2/aircraft',
                MILITARY: '/v2/military',
                LADD: '/v2/ladd'
            },
            API_KEY: null, // Required for full access
            RATE_LIMIT: {
                REQUESTS_PER_MINUTE: 120,
                FREE_TIER_LIMIT: 30
            },
            TIMEOUT: 20000,
            RETRY_ATTEMPTS: 2,
            UPDATE_INTERVAL: 8000 // 8 seconds
        },

        // KiwiSDR Configuration
        KIWISDR: {
            ENABLED: false, // Disabled by default
            SERVERS: [
                {
                    NAME: 'KiwiSDR-1',
                    URL: 'ws://kiwisdr.example.com:8073',
                    LOCATION: 'Unknown',
                    ENABLED: false
                }
            ],
            FREQUENCY_RANGE: {
                MIN: 10000, // 10 kHz
                MAX: 30000000 // 30 MHz
            },
            TIMEOUT: 15000,
            RECONNECT_INTERVAL: 5000,
            UPDATE_INTERVAL: 1000 // 1 second
        }
    },

    // Map Configuration
    MAP: {
        // Default Map Settings
        DEFAULT_CENTER: [40.7128, -74.0060], // New York City
        DEFAULT_ZOOM: 8,
        MIN_ZOOM: 3,
        MAX_ZOOM: 18,
        
        // Tile Layers
        TILE_LAYERS: {
            SATELLITE: {
                NAME: 'Satellite',
                URL: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                ATTRIBUTION: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
                MAX_ZOOM: 18,
                ENABLED: true
            },
            HIGH_CONTRAST: {
                NAME: 'High Contrast',
                URL: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
                ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                MAX_ZOOM: 19,
                ENABLED: true
            },
            TERRAIN: {
                NAME: 'Terrain',
                URL: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
                ATTRIBUTION: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
                MAX_ZOOM: 17,
                ENABLED: false
            },
            WEATHER: {
                NAME: 'Weather',
                URL: 'https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid={apikey}',
                ATTRIBUTION: '&copy; <a href="https://openweathermap.org">OpenWeatherMap</a>',
                API_KEY: null, // Required
                MAX_ZOOM: 19,
                ENABLED: false
            }
        },

        // Performance Settings
        PERFORMANCE: {
            MAX_AIRCRAFT_DISPLAY: 50000,
            CLUSTERING_THRESHOLD: 1000,
            UPDATE_ANIMATION: true,
            SMOOTH_TRANSITIONS: true,
            MEMORY_LIMIT_MB: 512
        },

        // Aircraft Display
        AIRCRAFT_DISPLAY: {
            SHOW_TRAILS: true,
            TRAIL_LENGTH: 50,
            SHOW_LABELS: true,
            SHOW_ALTITUDE: true,
            SHOW_SPEED: true,
            ICON_SIZE: 16,
            SELECTED_ICON_SIZE: 24
        }
    },

    // 3D Globe Configuration
    GLOBE_3D: {
        ENABLED: true,
        QUALITY: 'medium', // low, medium, high, ultra
        TEXTURES: {
            EARTH: 'assets/textures/earth_8k.jpg',
            NIGHT: 'assets/textures/earth_night_8k.jpg',
            CLOUDS: 'assets/textures/earth_clouds_8k.jpg',
            SPECULAR: 'assets/textures/earth_specular_8k.jpg'
        },
        LIGHTING: {
            AMBIENT_INTENSITY: 0.3,
            SUN_INTENSITY: 1.0,
            ENABLE_SHADOWS: true
        },
        PERFORMANCE: {
            LOD_ENABLED: true,
            MAX_PARTICLES: 10000,
            RENDER_DISTANCE: 100000
        }
    },

    // Threat Detection Configuration
    THREAT_DETECTION: {
        ENABLED: true,
        SENSITIVITY: 'medium', // low, medium, high, maximum
        
        // Threat Indicators and Weights
        THREAT_INDICATORS: {
            MILITARY_ACTIVITY: {
                weight: 3,
                patterns: ['military', 'fighter', 'bomber', 'tanker', 'awacs', 'drone']
            },
            UNUSUAL_ALTITUDE: {
                weight: 2,
                thresholds: {
                    very_low: 500,   // Below 500ft
                    very_high: 45000 // Above 45,000ft
                }
            },
            UNUSUAL_SPEED: {
                weight: 2,
                thresholds: {
                    very_slow: 50,   // Below 50 knots
                    very_fast: 900   // Above 900 knots
                }
            },
            TRANSPONDER_ANOMALY: {
                weight: 4,
                detect_squawk_changes: true,
                suspicious_squawks: ['7500', '7600', '7700']
            },
            PATTERN_ANOMALY: {
                weight: 3,
                detect_circles: true,
                detect_sharp_turns: true,
                detect_altitude_changes: true
            },
            STEALTH_INDICATORS: {
                weight: 5,
                detect_radar_gaps: true,
                detect_intermittent_signals: true
            }
        },

        // Threat Levels
        THREAT_LEVELS: {
            LOW: { min: 0, max: 3, color: '#00ff00' },
            MEDIUM: { min: 4, max: 7, color: '#ffff00' },
            HIGH: { min: 8, max: 12, color: '#ff8000' },
            CRITICAL: { min: 13, max: 20, color: '#ff0000' }
        },

        // AI Processing
        AI_PROCESSING: {
            ENABLED: true,
            MODEL_CONFIDENCE_THRESHOLD: 0.7,
            LEARNING_RATE: 0.001,
            BATCH_SIZE: 32,
            UPDATE_INTERVAL: 30000 // 30 seconds
        }
    },

    // GPS Security Features
    GPS_SECURITY: {
        JAMMING: {
            ENABLED: false, // Disabled by default for safety
            POWER_LEVELS: ['low', 'medium', 'high'],
            FREQUENCIES: [
                { name: 'GPS L1', frequency: 1575.42, enabled: false },
                { name: 'GPS L2', frequency: 1227.60, enabled: false },
                { name: 'GPS L5', frequency: 1176.45, enabled: false },
                { name: 'GLONASS L1', frequency: 1602.00, enabled: false },
                { name: 'GLONASS L2', frequency: 1246.00, enabled: false }
            ],
            SAFETY_TIMEOUT: 300000, // 5 minutes maximum
            WARNING_INTERVAL: 30000  // 30 second warnings
        },
        
        SPOOFING: {
            ENABLED: false, // Disabled by default for safety
            FAKE_COORDINATES: {
                latitude: 0.0,
                longitude: 0.0,
                altitude: 0
            },
            TIME_OFFSET: 0,
            SIGNAL_STRENGTH: 0.5
        },
        
        STEALTH_MODE: {
            ENABLED: false,
            HIDE_LOCATION: true,
            ENCRYPT_TRANSMISSIONS: true,
            RANDOMIZE_INTERVALS: true
        }
    },

    // Notification System
    NOTIFICATIONS: {
        ENABLED: true,
        AUDIO_ALERTS: true,
        VISUAL_ALERTS: true,
        POPUP_ALERTS: false,
        
        // Alert Sounds
        SOUNDS: {
            THREAT_LOW: 'assets/audio/alert-low.wav',
            THREAT_MEDIUM: 'assets/audio/alert-medium.wav',
            THREAT_HIGH: 'assets/audio/alert-high.wav',
            THREAT_CRITICAL: 'assets/audio/alert-critical.wav',
            SYSTEM_READY: 'assets/audio/system-ready.wav',
            ERROR: 'assets/audio/error.wav'
        },
        
        // Display Settings
        DISPLAY: {
            MAX_NOTIFICATIONS: 5,
            AUTO_DISMISS_TIME: 10000, // 10 seconds
            POSITION: 'top-right',
            ANIMATION_DURATION: 300
        }
    },

    // Language Configuration
    LANGUAGES: {
        DEFAULT: 'en',
        SUPPORTED: ['en', 'fa', 'sv'],
        
        // Language Settings
        ENGLISH: {
            CODE: 'en',
            NAME: 'English',
            DIRECTION: 'ltr',
            FONT_FAMILY: '"Courier New", monospace'
        },
        
        PERSIAN: {
            CODE: 'fa',
            NAME: 'فارسی',
            DIRECTION: 'rtl',
            FONT_FAMILY: '"Tahoma", "Arial Unicode MS", sans-serif'
        },
        
        SWEDISH: {
            CODE: 'sv',
            NAME: 'Svenska',
            DIRECTION: 'ltr',
            FONT_FAMILY: '"Courier New", monospace'
        }
    },

    // Performance Configuration
    PERFORMANCE: {
        // Memory Management
        MEMORY: {
            MAX_AIRCRAFT_HISTORY: 1000,
            CLEANUP_INTERVAL: 60000, // 1 minute
            GC_THRESHOLD_MB: 256
        },
        
        // Rendering
        RENDERING: {
            TARGET_FPS: 60,
            QUALITY_ADJUSTMENT: true,
            BACKGROUND_PROCESSING: true,
            WEB_WORKERS: true
        },
        
        // Network
        NETWORK: {
            CONCURRENT_REQUESTS: 6,
            REQUEST_POOLING: true,
            COMPRESSION: true,
            HTTP3_ENABLED: true
        }
    },

    // Security Configuration
    SECURITY: {
        // Encryption
        ENCRYPTION: {
            ALGORITHM: 'AES-256-GCM',
            KEY_ROTATION_INTERVAL: 3600000, // 1 hour
            SECURE_STORAGE: true
        },
        
        // Access Control
        ACCESS_CONTROL: {
            REQUIRE_AUTHENTICATION: false,
            SESSION_TIMEOUT: 7200000, // 2 hours
            MAX_LOGIN_ATTEMPTS: 3
        },
        
        // Content Security
        CONTENT_SECURITY: {
            CSP_ENABLED: true,
            XSS_PROTECTION: true,
            FRAME_OPTIONS: 'DENY'
        }
    },

    // Development Configuration
    DEVELOPMENT: {
        DEBUG_MODE: false,
        MOCK_DATA: false,
        PERFORMANCE_MONITORING: true,
        ERROR_REPORTING: true,
        
        // Testing
        TESTING: {
            UNIT_TESTS: true,
            INTEGRATION_TESTS: true,
            E2E_TESTS: false
        }
    },

    // Feature Flags
    FEATURES: {
        EXPERIMENTAL_FEATURES: false,
        BETA_FEATURES: false,
        
        // Specific Features
        AIRCRAFT_CLUSTERING: true,
        PREDICTIVE_TRACKING: false,
        MACHINE_LEARNING: true,
        BLOCKCHAIN_LOGGING: false,
        QUANTUM_ENCRYPTION: false
    },

    // Storage Configuration
    STORAGE: {
        // Local Storage
        LOCAL_STORAGE: {
            ENABLED: true,
            PREFIX: 'c4isr_',
            QUOTA_MB: 50
        },
        
        // IndexedDB
        INDEXED_DB: {
            ENABLED: true,
            NAME: 'C4ISR_Database',
            VERSION: 1,
            STORES: ['aircraft', 'threats', 'settings', 'logs']
        },
        
        // Session Storage
        SESSION_STORAGE: {
            ENABLED: true,
            PREFIX: 'c4isr_session_'
        }
    },

    // Analytics Configuration
    ANALYTICS: {
        ENABLED: false,
        PROVIDER: null, // 'google', 'matomo', 'custom'
        TRACKING_ID: null,
        EVENTS: {
            THREAT_DETECTION: true,
            USER_INTERACTIONS: false,
            PERFORMANCE_METRICS: true,
            ERROR_TRACKING: true
        }
    },

    // Backup and Recovery
    BACKUP: {
        ENABLED: false,
        INTERVAL: 3600000, // 1 hour
        RETENTION_DAYS: 30,
        CLOUD_STORAGE: {
            PROVIDER: null, // 'aws', 'azure', 'gcp'
            BUCKET: null,
            ENCRYPTION: true
        }
    }
};

// Configuration validation and utility functions
const ConfigManager = {
    /**
     * Validate the configuration object
     */
    validate() {
        const errors = [];
        
        // Validate required fields
        if (!C4ISR_CONFIG.APPLICATION.NAME) {
            errors.push('Application name is required');
        }
        
        if (!C4ISR_CONFIG.APPLICATION.VERSION) {
            errors.push('Application version is required');
        }
        
        // Validate API configurations
        if (C4ISR_CONFIG.API.FLIGHTRADAR24.ENABLED && !C4ISR_CONFIG.API.FLIGHTRADAR24.BASE_URL) {
            errors.push('FlightRadar24 base URL is required when enabled');
        }
        
        if (C4ISR_CONFIG.API.OPENSKY.ENABLED && !C4ISR_CONFIG.API.OPENSKY.BASE_URL) {
            errors.push('OpenSky base URL is required when enabled');
        }
        
        // Validate map configuration
        if (!Array.isArray(C4ISR_CONFIG.MAP.DEFAULT_CENTER) || C4ISR_CONFIG.MAP.DEFAULT_CENTER.length !== 2) {
            errors.push('Map default center must be an array of [latitude, longitude]');
        }
        
        // Validate threat detection
        if (C4ISR_CONFIG.THREAT_DETECTION.ENABLED) {
            const sensitivity = C4ISR_CONFIG.THREAT_DETECTION.SENSITIVITY;
            if (!['low', 'medium', 'high', 'maximum'].includes(sensitivity)) {
                errors.push('Invalid threat detection sensitivity level');
            }
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    },

    /**
     * Get configuration value by path
     */
    get(path, defaultValue = null) {
        const keys = path.split('.');
        let current = C4ISR_CONFIG;
        
        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                return defaultValue;
            }
        }
        
        return current;
    },

    /**
     * Set configuration value by path
     */
    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let current = C4ISR_CONFIG;
        
        for (const key of keys) {
            if (!(key in current) || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }
        
        current[lastKey] = value;
        
        // Save to local storage if enabled
        if (this.get('STORAGE.LOCAL_STORAGE.ENABLED')) {
            this.saveToLocalStorage();
        }
    },

    /**
     * Load configuration from local storage
     */
    loadFromLocalStorage() {
        try {
            const prefix = this.get('STORAGE.LOCAL_STORAGE.PREFIX', 'c4isr_');
            const stored = localStorage.getItem(prefix + 'config');
            
            if (stored) {
                const storedConfig = JSON.parse(stored);
                this.merge(storedConfig);
                console.log('Configuration loaded from local storage');
            }
        } catch (error) {
            console.error('Failed to load configuration from local storage:', error);
        }
    },

    /**
     * Save configuration to local storage
     */
    saveToLocalStorage() {
        try {
            const prefix = this.get('STORAGE.LOCAL_STORAGE.PREFIX', 'c4isr_');
            localStorage.setItem(prefix + 'config', JSON.stringify(C4ISR_CONFIG));
        } catch (error) {
            console.error('Failed to save configuration to local storage:', error);
        }
    },

    /**
     * Merge configuration objects
     */
    merge(newConfig) {
        function deepMerge(target, source) {
            for (const key in source) {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    if (!target[key]) target[key] = {};
                    deepMerge(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        }
        
        deepMerge(C4ISR_CONFIG, newConfig);
    },

    /**
     * Reset configuration to defaults
     */
    reset() {
        const prefix = this.get('STORAGE.LOCAL_STORAGE.PREFIX', 'c4isr_');
        localStorage.removeItem(prefix + 'config');
        location.reload();
    },

    /**
     * Export configuration
     */
    export() {
        return JSON.stringify(C4ISR_CONFIG, null, 2);
    },

    /**
     * Import configuration
     */
    import(configString) {
        try {
            const newConfig = JSON.parse(configString);
            const validation = this.validate();
            
            if (validation.valid) {
                this.merge(newConfig);
                this.saveToLocalStorage();
                return { success: true };
            } else {
                return { success: false, errors: validation.errors };
            }
        } catch (error) {
            return { success: false, errors: ['Invalid configuration format'] };
        }
    },

    /**
     * Initialize configuration manager
     */
    init() {
        // Load from local storage
        this.loadFromLocalStorage();
        
        // Validate configuration
        const validation = this.validate();
        if (!validation.valid) {
            console.warn('Configuration validation failed:', validation.errors);
        }
        
        // Set up environment-specific overrides
        if (this.get('APPLICATION.ENVIRONMENT') === 'development') {
            this.set('DEVELOPMENT.DEBUG_MODE', true);
            this.set('APPLICATION.LOG_LEVEL', 'debug');
        }
        
        console.log('Configuration manager initialized');
        
        return validation.valid;
    }
};

// Environment detection and configuration
const Environment = {
    isProduction() {
        return ConfigManager.get('APPLICATION.ENVIRONMENT') === 'production';
    },
    
    isDevelopment() {
        return ConfigManager.get('APPLICATION.ENVIRONMENT') === 'development';
    },
    
    isStaging() {
        return ConfigManager.get('APPLICATION.ENVIRONMENT') === 'staging';
    },
    
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    supportsWebGL() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
        } catch (e) {
            return false;
        }
    },
    
    supportsWebWorkers() {
        return typeof Worker !== 'undefined';
    },
    
    supportsServiceWorkers() {
        return 'serviceWorker' in navigator;
    },
    
    supportsGeolocation() {
        return 'geolocation' in navigator;
    },
    
    getConnectionType() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        return connection ? connection.effectiveType : 'unknown';
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { C4ISR_CONFIG, ConfigManager, Environment };
}

// Initialize on load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        ConfigManager.init();
    });
}