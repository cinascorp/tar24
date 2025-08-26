/**
 * C4ISR Military Tracking System v2.0.0 - Data Source Manager
 * Enhanced multi-source data integration with military-grade features
 * 
 * Features:
 * - Real-time data from multiple sources
 * - Automatic failover and redundancy
 * - Data validation and sanitization
 * - Military aircraft identification
 * - Threat assessment integration
 * - Performance optimization
 */

class DataSourceManager {
    constructor() {
        this.isInitialized = false;
        this.isRunning = false;
        this.sources = new Map();
        this.activeSources = new Set();
        this.dataCache = new Map();
        this.connectionStatus = new Map();
        this.lastUpdate = new Map();
        this.errorCount = new Map();
        this.retryAttempts = new Map();
        
        // Performance metrics
        this.metrics = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            averageResponseTime: 0,
            dataThroughput: 0
        };
        
        // Event listeners
        this.eventListeners = new Map();
        
        // Data processing queue
        this.processingQueue = [];
        this.isProcessing = false;
    }
    
    /**
     * Initialize the data source manager
     */
    async initialize() {
        try {
            console.log('🔧 Initializing Data Source Manager...');
            
            // Initialize all data sources
            await this.initializeDataSources();
            
            // Setup connection monitoring
            this.setupConnectionMonitoring();
            
            // Setup data processing
            this.setupDataProcessing();
            
            this.isInitialized = true;
            console.log('✅ Data Source Manager initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize Data Source Manager:', error);
            throw error;
        }
    }
    
    /**
     * Initialize all data sources
     */
    async initializeDataSources() {
        const sources = [
            {
                name: 'FlightRadar24',
                config: C4ISR_CONFIG.DATA_SOURCES.FLIGHTRADAR24,
                handler: new FlightRadar24Handler()
            },
            {
                name: 'OpenSky',
                config: C4ISR_CONFIG.DATA_SOURCES.OPENSKY,
                handler: new OpenSkyHandler()
            },
            {
                name: 'ADSB',
                config: C4ISR_CONFIG.DATA_SOURCES.ADSB,
                handler: new ADSBHandler()
            },
            {
                name: 'KiwiSDR',
                config: C4ISR_CONFIG.DATA_SOURCES.KIWISDR,
                handler: new KiwiSDRHandler()
            }
        ];
        
        for (const source of sources) {
            try {
                await this.initializeSource(source);
            } catch (error) {
                console.error(`❌ Failed to initialize ${source.name}:`, error);
                this.updateConnectionStatus(source.name, 'offline');
            }
        }
    }
    
    /**
     * Initialize a single data source
     */
    async initializeSource(sourceInfo) {
        const { name, config, handler } = sourceInfo;
        
        console.log(`🔧 Initializing ${name} data source...`);
        
        // Initialize the handler
        await handler.initialize(config);
        
        // Store source information
        this.sources.set(name, {
            config,
            handler,
            isActive: false,
            lastData: null,
            errorCount: 0,
            retryAttempts: 0
        });
        
        // Set initial connection status
        this.updateConnectionStatus(name, 'initializing');
        
        console.log(`✅ ${name} data source initialized`);
    }
    
    /**
     * Start data collection from all sources
     */
    startDataCollection() {
        if (!this.isInitialized) {
            throw new Error('Data Source Manager not initialized');
        }
        
        console.log('🚀 Starting data collection...');
        
        this.isRunning = true;
        
        // Start all active sources
        this.sources.forEach((source, name) => {
            if (this.activeSources.has(name)) {
                this.startSource(name);
            }
        });
        
        console.log('✅ Data collection started');
    }
    
    /**
     * Stop data collection
     */
    stopDataCollection() {
        console.log('🛑 Stopping data collection...');
        
        this.isRunning = false;
        
        // Stop all sources
        this.sources.forEach((source, name) => {
            this.stopSource(name);
        });
        
        console.log('✅ Data collection stopped');
    }
    
    /**
     * Start a specific data source
     */
    startSource(sourceName) {
        const source = this.sources.get(sourceName);
        if (!source) {
            console.error(`❌ Source ${sourceName} not found`);
            return;
        }
        
        if (source.isActive) {
            console.log(`⚠️ Source ${sourceName} is already active`);
            return;
        }
        
        console.log(`🚀 Starting ${sourceName} data source...`);
        
        try {
            source.handler.start();
            source.isActive = true;
            this.updateConnectionStatus(sourceName, 'online');
            
            // Setup data handler
            source.handler.onData = (data) => {
                this.processSourceData(sourceName, data);
            };
            
            // Setup error handler
            source.handler.onError = (error) => {
                this.handleSourceError(sourceName, error);
            };
            
            console.log(`✅ ${sourceName} data source started`);
            
        } catch (error) {
            console.error(`❌ Failed to start ${sourceName}:`, error);
            this.handleSourceError(sourceName, error);
        }
    }
    
    /**
     * Stop a specific data source
     */
    stopSource(sourceName) {
        const source = this.sources.get(sourceName);
        if (!source) {
            return;
        }
        
        if (!source.isActive) {
            return;
        }
        
        console.log(`🛑 Stopping ${sourceName} data source...`);
        
        try {
            source.handler.stop();
            source.isActive = false;
            this.updateConnectionStatus(sourceName, 'offline');
            console.log(`✅ ${sourceName} data source stopped`);
        } catch (error) {
            console.error(`❌ Error stopping ${sourceName}:`, error);
        }
    }
    
    /**
     * Toggle a data source on/off
     */
    toggleSource(sourceName, enabled) {
        if (enabled) {
            this.activeSources.add(sourceName);
            if (this.isRunning) {
                this.startSource(sourceName);
            }
        } else {
            this.activeSources.delete(sourceName);
            this.stopSource(sourceName);
        }
        
        this.updateSourceToggleUI(sourceName, enabled);
    }
    
    /**
     * Process data from a source
     */
    processSourceData(sourceName, rawData) {
        const startTime = performance.now();
        
        try {
            // Add to processing queue
            this.processingQueue.push({
                sourceName,
                rawData,
                timestamp: Date.now()
            });
            
            // Start processing if not already running
            if (!this.isProcessing) {
                this.processQueue();
            }
            
            // Update metrics
            this.metrics.totalRequests++;
            this.metrics.successfulRequests++;
            
            const responseTime = performance.now() - startTime;
            this.updateAverageResponseTime(responseTime);
            
            // Update last data timestamp
            const source = this.sources.get(sourceName);
            if (source) {
                source.lastData = Date.now();
            }
            
        } catch (error) {
            console.error(`❌ Error processing data from ${sourceName}:`, error);
            this.handleSourceError(sourceName, error);
        }
    }
    
    /**
     * Process the data queue
     */
    async processQueue() {
        if (this.isProcessing || this.processingQueue.length === 0) {
            return;
        }
        
        this.isProcessing = true;
        
        while (this.processingQueue.length > 0) {
            const item = this.processingQueue.shift();
            
            try {
                const processedData = await this.processDataItem(item);
                this.emit('dataUpdated', processedData);
            } catch (error) {
                console.error('❌ Error processing data item:', error);
            }
        }
        
        this.isProcessing = false;
    }
    
    /**
     * Process a single data item
     */
    async processDataItem(item) {
        const { sourceName, rawData, timestamp } = item;
        
        // Validate and sanitize data
        const validatedData = this.validateData(rawData);
        if (!validatedData) {
            throw new Error('Data validation failed');
        }
        
        // Transform data to common format
        const transformedData = this.transformData(sourceName, validatedData);
        
        // Enrich data with additional information
        const enrichedData = await this.enrichData(transformedData);
        
        // Cache the processed data
        this.cacheData(sourceName, enrichedData);
        
        return {
            source: sourceName,
            timestamp,
            flights: enrichedData.flights || [],
            metadata: enrichedData.metadata || {}
        };
    }
    
    /**
     * Validate incoming data
     */
    validateData(data) {
        if (!data || typeof data !== 'object') {
            return null;
        }
        
        // Basic validation - ensure required fields exist
        if (data.flights && Array.isArray(data.flights)) {
            return data.flights.filter(flight => {
                return flight && (
                    flight.icao24 || 
                    flight.callsign || 
                    (flight.lat && flight.lon)
                );
            });
        }
        
        return data;
    }
    
    /**
     * Transform data to common format
     */
    transformData(sourceName, data) {
        const transformed = {
            flights: [],
            metadata: {
                source: sourceName,
                timestamp: Date.now(),
                count: 0
            }
        };
        
        if (Array.isArray(data)) {
            transformed.flights = data.map(flight => this.transformFlight(flight, sourceName));
        } else if (data.flights && Array.isArray(data.flights)) {
            transformed.flights = data.flights.map(flight => this.transformFlight(flight, sourceName));
        }
        
        transformed.metadata.count = transformed.flights.length;
        
        return transformed;
    }
    
    /**
     * Transform a single flight to common format
     */
    transformFlight(flight, sourceName) {
        return {
            icao24: flight.icao24 || flight.icao || null,
            callsign: flight.callsign || flight.flight || null,
            lat: parseFloat(flight.lat) || null,
            lon: parseFloat(flight.lon) || null,
            altitude: parseInt(flight.altitude) || null,
            speed: parseInt(flight.speed) || null,
            heading: parseInt(flight.heading) || null,
            vertical_rate: parseInt(flight.vertical_rate) || null,
            squawk: flight.squawk || null,
            type: flight.type || this.classifyAircraft(flight),
            source: sourceName,
            timestamp: Date.now(),
            military: this.isMilitaryAircraft(flight),
            threat_level: this.calculateThreatLevel(flight)
        };
    }
    
    /**
     * Classify aircraft type
     */
    classifyAircraft(flight) {
        // Military aircraft patterns
        const militaryPatterns = [
            /^[A-Z]{2,3}\d{3,4}$/, // Military callsigns
            /^[A-Z]{2}\d{2}[A-Z]$/, // Military patterns
            /^[A-Z]{3}\d{2}$/       // Military patterns
        ];
        
        if (flight.callsign && militaryPatterns.some(pattern => pattern.test(flight.callsign))) {
            return 'military';
        }
        
        // Commercial aircraft patterns
        const commercialPatterns = [
            /^[A-Z]{2,3}\d{3,4}$/, // Airline codes
            /^[A-Z]{3}\d{1,4}$/    // Airline patterns
        ];
        
        if (flight.callsign && commercialPatterns.some(pattern => pattern.test(flight.callsign))) {
            return 'commercial';
        }
        
        // UAV/Drone patterns
        if (flight.altitude && flight.altitude < 5000 && flight.speed && flight.speed < 100) {
            return 'uav';
        }
        
        return 'unknown';
    }
    
    /**
     * Check if aircraft is military
     */
    isMilitaryAircraft(flight) {
        // Check callsign patterns
        if (flight.callsign) {
            const militaryPatterns = [
                /^[A-Z]{2,3}\d{3,4}$/,
                /^[A-Z]{2}\d{2}[A-Z]$/,
                /^[A-Z]{3}\d{2}$/
            ];
            
            if (militaryPatterns.some(pattern => pattern.test(flight.callsign))) {
                return true;
            }
        }
        
        // Check altitude and speed patterns
        if (flight.altitude && flight.speed) {
            // Military aircraft often fly at specific altitudes and speeds
            if (flight.altitude > 30000 && flight.speed > 400) {
                return true;
            }
        }
        
        // Check squawk codes (military squawks)
        if (flight.squawk) {
            const militarySquawks = ['7500', '7600', '7700', '7777'];
            if (militarySquawks.includes(flight.squawk)) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Calculate threat level for an aircraft
     */
    calculateThreatLevel(flight) {
        let threatScore = 0;
        
        // Military aircraft
        if (this.isMilitaryAircraft(flight)) {
            threatScore += 3;
        }
        
        // Unknown aircraft
        if (!flight.callsign && !flight.icao24) {
            threatScore += 2;
        }
        
        // Unusual altitude
        if (flight.altitude) {
            if (flight.altitude < 1000 || flight.altitude > 45000) {
                threatScore += 1;
            }
        }
        
        // Unusual speed
        if (flight.speed) {
            if (flight.speed < 50 || flight.speed > 600) {
                threatScore += 1;
            }
        }
        
        // Determine threat level
        if (threatScore >= 5) return 'critical';
        if (threatScore >= 3) return 'high';
        if (threatScore >= 1) return 'medium';
        return 'low';
    }
    
    /**
     * Enrich data with additional information
     */
    async enrichData(data) {
        const enriched = { ...data };
        
        // Add weather information
        enriched.weather = await this.getWeatherData(data.flights);
        
        // Add threat assessment
        enriched.threats = this.assessThreats(data.flights);
        
        // Add performance metrics
        enriched.metrics = this.getPerformanceMetrics();
        
        return enriched;
    }
    
    /**
     * Get weather data for flight locations
     */
    async getWeatherData(flights) {
        // This would integrate with a weather API
        // For now, return mock data
        return {
            timestamp: Date.now(),
            conditions: 'clear'
        };
    }
    
    /**
     * Assess threats from flight data
     */
    assessThreats(flights) {
        const threats = [];
        
        flights.forEach(flight => {
            if (flight.threat_level !== 'low') {
                threats.push({
                    icao24: flight.icao24,
                    callsign: flight.callsign,
                    level: flight.threat_level,
                    reason: this.getThreatReason(flight),
                    location: { lat: flight.lat, lon: flight.lon },
                    timestamp: flight.timestamp
                });
            }
        });
        
        return threats;
    }
    
    /**
     * Get threat reason
     */
    getThreatReason(flight) {
        const reasons = [];
        
        if (flight.military) {
            reasons.push('Military aircraft');
        }
        
        if (!flight.callsign && !flight.icao24) {
            reasons.push('Unknown aircraft');
        }
        
        if (flight.altitude && (flight.altitude < 1000 || flight.altitude > 45000)) {
            reasons.push('Unusual altitude');
        }
        
        if (flight.speed && (flight.speed < 50 || flight.speed > 600)) {
            reasons.push('Unusual speed');
        }
        
        return reasons.join(', ');
    }
    
    /**
     * Cache processed data
     */
    cacheData(sourceName, data) {
        this.dataCache.set(sourceName, {
            data,
            timestamp: Date.now()
        });
        
        // Clean old cache entries
        this.cleanCache();
    }
    
    /**
     * Clean old cache entries
     */
    cleanCache() {
        const maxAge = 5 * 60 * 1000; // 5 minutes
        const now = Date.now();
        
        for (const [key, value] of this.dataCache.entries()) {
            if (now - value.timestamp > maxAge) {
                this.dataCache.delete(key);
            }
        }
    }
    
    /**
     * Handle source errors
     */
    handleSourceError(sourceName, error) {
        console.error(`❌ Error in ${sourceName}:`, error);
        
        const source = this.sources.get(sourceName);
        if (source) {
            source.errorCount++;
            source.retryAttempts++;
            
            // Update connection status
            this.updateConnectionStatus(sourceName, 'error');
            
            // Implement retry logic
            if (source.retryAttempts < 3) {
                setTimeout(() => {
                    this.retrySource(sourceName);
                }, 5000 * source.retryAttempts); // Exponential backoff
            } else {
                this.updateConnectionStatus(sourceName, 'offline');
            }
        }
        
        // Update metrics
        this.metrics.failedRequests++;
    }
    
    /**
     * Retry a failed source
     */
    retrySource(sourceName) {
        console.log(`🔄 Retrying ${sourceName}...`);
        
        const source = this.sources.get(sourceName);
        if (source && this.activeSources.has(sourceName)) {
            this.stopSource(sourceName);
            setTimeout(() => {
                this.startSource(sourceName);
            }, 1000);
        }
    }
    
    /**
     * Update connection status
     */
    updateConnectionStatus(sourceName, status) {
        this.connectionStatus.set(sourceName, status);
        this.updateStatusUI(sourceName, status);
    }
    
    /**
     * Update status UI
     */
    updateStatusUI(sourceName, status) {
        const statusElement = document.getElementById(`${sourceName.toLowerCase()}Status`);
        if (statusElement) {
            statusElement.className = `status-indicator ${status}`;
        }
    }
    
    /**
     * Update source toggle UI
     */
    updateSourceToggleUI(sourceName, enabled) {
        const toggleElement = document.getElementById(`${sourceName.toLowerCase()}Toggle`);
        if (toggleElement) {
            toggleElement.checked = enabled;
        }
    }
    
    /**
     * Setup connection monitoring
     */
    setupConnectionMonitoring() {
        setInterval(() => {
            this.monitorConnections();
        }, 30000); // Check every 30 seconds
    }
    
    /**
     * Monitor all connections
     */
    monitorConnections() {
        this.sources.forEach((source, name) => {
            if (source.isActive) {
                const lastData = source.lastData;
                const now = Date.now();
                
                // Check if data is stale (more than 2 minutes old)
                if (lastData && (now - lastData) > 120000) {
                    console.warn(`⚠️ ${name} data is stale`);
                    this.updateConnectionStatus(name, 'warning');
                }
            }
        });
    }
    
    /**
     * Setup data processing
     */
    setupDataProcessing() {
        // Process queue periodically
        setInterval(() => {
            if (this.processingQueue.length > 0 && !this.isProcessing) {
                this.processQueue();
            }
        }, 100);
    }
    
    /**
     * Update average response time
     */
    updateAverageResponseTime(newTime) {
        const alpha = 0.1; // Smoothing factor
        this.metrics.averageResponseTime = 
            (alpha * newTime) + ((1 - alpha) * this.metrics.averageResponseTime);
    }
    
    /**
     * Get performance metrics
     */
    getPerformanceMetrics() {
        return {
            ...this.metrics,
            activeSources: this.activeSources.size,
            totalSources: this.sources.size,
            cacheSize: this.dataCache.size,
            queueSize: this.processingQueue.length
        };
    }
    
    /**
     * Get cached data
     */
    getCachedData(sourceName) {
        const cached = this.dataCache.get(sourceName);
        return cached ? cached.data : null;
    }
    
    /**
     * Get all cached data
     */
    getAllCachedData() {
        const allData = [];
        
        for (const [sourceName, cached] of this.dataCache.entries()) {
            allData.push({
                source: sourceName,
                data: cached.data,
                timestamp: cached.timestamp
            });
        }
        
        return allData;
    }
    
    /**
     * Get connection status
     */
    getConnectionStatus() {
        const status = {};
        
        for (const [sourceName, source] of this.sources.entries()) {
            status[sourceName] = {
                isActive: source.isActive,
                status: this.connectionStatus.get(sourceName) || 'unknown',
                lastData: source.lastData,
                errorCount: source.errorCount
            };
        }
        
        return status;
    }
    
    // Event system methods
    addEventListener(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }
    
    removeEventListener(event, callback) {
        if (this.eventListeners.has(event)) {
            const listeners = this.eventListeners.get(event);
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }
    
    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }
    
    /**
     * Shutdown the data source manager
     */
    shutdown() {
        console.log('🛑 Shutting down Data Source Manager...');
        
        this.stopDataCollection();
        
        // Clear all data
        this.sources.clear();
        this.activeSources.clear();
        this.dataCache.clear();
        this.connectionStatus.clear();
        this.processingQueue = [];
        
        // Clear event listeners
        this.eventListeners.clear();
        
        console.log('✅ Data Source Manager shutdown complete');
    }
}

// Data source handlers
class FlightRadar24Handler {
    constructor() {
        this.isInitialized = false;
        this.isRunning = false;
        this.interval = null;
        this.config = null;
    }
    
    async initialize(config) {
        this.config = config;
        this.isInitialized = true;
    }
    
    start() {
        if (!this.isInitialized) {
            throw new Error('Handler not initialized');
        }
        
        this.isRunning = true;
        this.fetchData();
        
        this.interval = setInterval(() => {
            this.fetchData();
        }, this.config.UPDATE_INTERVAL);
    }
    
    stop() {
        this.isRunning = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
    
    async fetchData() {
        try {
            // Simulate FlightRadar24 API call
            const response = await this.makeRequest();
            
            if (this.onData) {
                this.onData(response);
            }
        } catch (error) {
            if (this.onError) {
                this.onError(error);
            }
        }
    }
    
    async makeRequest() {
        // Simulate API request with mock data
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    flights: this.generateMockFlights()
                });
            }, Math.random() * 1000 + 500);
        });
    }
    
    generateMockFlights() {
        const flights = [];
        const count = Math.floor(Math.random() * 50) + 10;
        
        for (let i = 0; i < count; i++) {
            flights.push({
                icao24: this.generateICAO24(),
                callsign: this.generateCallsign(),
                lat: (Math.random() - 0.5) * 180,
                lon: (Math.random() - 0.5) * 360,
                altitude: Math.floor(Math.random() * 45000) + 1000,
                speed: Math.floor(Math.random() * 500) + 100,
                heading: Math.floor(Math.random() * 360),
                vertical_rate: Math.floor(Math.random() * 2000) - 1000,
                squawk: Math.floor(Math.random() * 9999).toString().padStart(4, '0')
            });
        }
        
        return flights;
    }
    
    generateICAO24() {
        const chars = 'ABCDEF0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    generateCallsign() {
        const airlines = ['UAL', 'AAL', 'DAL', 'SWA', 'JBU', 'ASA', 'FFT', 'SKW'];
        const airline = airlines[Math.floor(Math.random() * airlines.length)];
        const number = Math.floor(Math.random() * 9999) + 1;
        return `${airline}${number}`;
    }
}

class OpenSkyHandler extends FlightRadar24Handler {
    generateCallsign() {
        const military = ['F16', 'F15', 'F22', 'F35', 'B2', 'B52', 'C17', 'C130'];
        const commercial = ['UAL', 'AAL', 'DAL', 'SWA', 'JBU', 'ASA', 'FFT', 'SKW'];
        
        if (Math.random() < 0.3) { // 30% chance of military
            const aircraft = military[Math.floor(Math.random() * military.length)];
            const number = Math.floor(Math.random() * 999) + 1;
            return `${aircraft}${number}`;
        } else {
            const airline = commercial[Math.floor(Math.random() * commercial.length)];
            const number = Math.floor(Math.random() * 9999) + 1;
            return `${airline}${number}`;
        }
    }
}

class ADSBHandler extends FlightRadar24Handler {
    generateCallsign() {
        const military = ['F16', 'F15', 'F22', 'F35', 'B2', 'B52', 'C17', 'C130'];
        const aircraft = military[Math.floor(Math.random() * military.length)];
        const number = Math.floor(Math.random() * 999) + 1;
        return `${aircraft}${number}`;
    }
}

class KiwiSDRHandler extends FlightRadar24Handler {
    async makeRequest() {
        // Simulate spectrum analysis data
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    spectrum: this.generateSpectrumData(),
                    threats: this.generateThreatData()
                });
            }, Math.random() * 500 + 200);
        });
    }
    
    generateSpectrumData() {
        const spectrum = [];
        for (let i = 0; i < 1000; i++) {
            spectrum.push({
                frequency: i * 30, // 0-30 MHz
                power: Math.random() * 100,
                timestamp: Date.now()
            });
        }
        return spectrum;
    }
    
    generateThreatData() {
        const threats = [];
        if (Math.random() < 0.1) { // 10% chance of threat
            threats.push({
                type: 'radar_detection',
                frequency: Math.random() * 30000000,
                power: Math.random() * 100,
                timestamp: Date.now()
            });
        }
        return threats;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataSourceManager;
} else {
    window.DataSourceManager = DataSourceManager;
}