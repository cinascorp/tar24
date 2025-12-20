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
 * C4ISR Military Tracking System v2.0.0 - Data Sources Manager
 * Enhanced data source management with military-grade reliability and security
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
        this.retryAttempts = new Map();
        this.maxRetries = 3;
        this.isInitialized = false;
        this.eventListeners = new Map();
        
        // Initialize data sources
        this.initializeSources();
    }
    
    /**
     * Initialize the data source manager
     */
    async initialize() {
        try {
            console.log('🔧 Initializing Data Source Manager...');
            
            // Initialize all data sources
            await this.initializeDataSources();
            console.log('Initializing Data Source Manager...');
            
            // Initialize all data sources
            await this.initializeSources();
            
            // Setup connection monitoring
            this.setupConnectionMonitoring();
            
            // Setup data processing
            this.setupDataProcessing();
            
            this.isInitialized = true;
            console.log('✅ Data Source Manager initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize Data Source Manager:', error);
            console.log('Data Source Manager initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize Data Source Manager:', error);
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
    initializeSources() {
        // FlightRadar24
        this.addSource('flightradar24', {
            name: 'FlightRadar24',
            baseUrl: 'https://data-cloud.flightradar24.com/zones/fcgi/js',
            endpoints: {
                traffic: '/traffic.js',
                airports: '/airports.js',
                airlines: '/airlines.js'
            },
            updateInterval: 5000,
            maxRequestsPerMinute: 60,
            requiresApiKey: false,
            features: ['realtime', 'historical', 'weather', 'radar'],
            handler: this.handleFlightRadar24Data.bind(this)
        });
        
        // OpenSky Network
        this.addSource('opensky', {
            name: 'OpenSky Network',
            baseUrl: 'https://opensky-network.org/api',
            endpoints: {
                states: '/states/all',
                aircraft: '/aircraft',
                flights: '/flights/all'
            },
            updateInterval: 10000,
            maxRequestsPerMinute: 30,
            requiresApiKey: true,
            features: ['realtime', 'historical', 'trajectory'],
            handler: this.handleOpenSkyData.bind(this)
        });
        
        // ADSB.lol
        this.addSource('adsb', {
            name: 'ADSB.lol',
            baseUrl: 'https://api.adsb.lol/v2',
            endpoints: {
                military: '/mil',
                traffic: '/traffic',
                aircraft: '/aircraft'
            },
            updateInterval: 8000,
            maxRequestsPerMinute: 45,
            requiresApiKey: false,
            features: ['military', 'realtime', 'historical'],
            handler: this.handleADSBData.bind(this)
        });
        
        // KiwiSDR
        this.addSource('kiwisdr', {
            name: 'KiwiSDR',
            baseUrl: 'https://kiwisdr.com',
            endpoints: {
                spectrum: '/spectrum',
                audio: '/audio',
                status: '/status'
            },
            updateInterval: 1000,
            maxRequestsPerMinute: 120,
            requiresApiKey: false,
            features: ['spectrum', 'audio', 'radar_detection'],
            frequencyRange: { min: 0, max: 30000000 },
            handler: this.handleKiwiSDRData.bind(this)
        });
    }
    
    /**
     * Add a data source
     */
    addSource(id, config) {
        const source = {
            id,
            config,
            isActive: false,
            lastUpdate: null,
            errorCount: 0,
            requestCount: 0,
            dataBuffer: [],
            connection: null
        };
        
        this.sources.set(id, source);
        this.connectionStatus.set(id, 'disconnected');
        this.retryAttempts.set(id, 0);
        
        console.log(`Added data source: ${config.name}`);
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
     * Setup data processing
     */
    setupDataProcessing() {
        setInterval(() => {
            this.processDataBuffer();
        }, 1000); // Process every second
    }
    
    /**
     * Monitor all connections
     */
    monitorConnections() {
        for (const [id, source] of this.sources) {
            if (source.isActive) {
                this.checkConnectionHealth(id);
            }
        }
    }
    
    /**
     * Check connection health for a specific source
     */
    async checkConnectionHealth(sourceId) {
        const source = this.sources.get(sourceId);
        if (!source) return;
        
        try {
            const response = await fetch(`${source.config.baseUrl}/health`, {
                method: 'HEAD',
                timeout: 5000
            });
            
            if (response.ok) {
                this.connectionStatus.set(sourceId, 'connected');
                source.errorCount = 0;
            } else {
                this.connectionStatus.set(sourceId, 'error');
                source.errorCount++;
            }
        } catch (error) {
            this.connectionStatus.set(sourceId, 'disconnected');
            source.errorCount++;
            
            // Attempt to reconnect if too many errors
            if (source.errorCount >= 3) {
                this.attemptReconnection(sourceId);
            }
        }
    }
    
    /**
     * Attempt to reconnect to a data source
     */
    async attemptReconnection(sourceId) {
        const source = this.sources.get(sourceId);
        const retryCount = this.retryAttempts.get(sourceId);
        
        if (retryCount >= this.maxRetries) {
            console.warn(`Max retry attempts reached for ${sourceId}`);
            this.connectionStatus.set(sourceId, 'failed');
            return;
        }
        
        console.log(`Attempting to reconnect to ${sourceId} (attempt ${retryCount + 1})`);
        
        try {
            await this.activateSource(sourceId);
            this.retryAttempts.set(sourceId, 0);
            console.log(`Successfully reconnected to ${sourceId}`);
        } catch (error) {
            this.retryAttempts.set(sourceId, retryCount + 1);
            console.error(`Reconnection attempt failed for ${sourceId}:`, error);
        }
    }
    
    /**
     * Activate a data source
     */
    async activateSource(sourceId) {
        const source = this.sources.get(sourceId);
        if (!source) {
            throw new Error(`Data source ${sourceId} not found`);
        }
        
        if (source.isActive) {
            console.log(`Data source ${sourceId} is already active`);
            return;
        }
        
        try {
            console.log(`Activating data source: ${source.config.name}`);
            
            // Test connection
            await this.testConnection(sourceId);
            
            // Start data collection
            source.isActive = true;
            this.activeSources.add(sourceId);
            this.connectionStatus.set(sourceId, 'connected');
            
            // Start periodic updates
            this.startSourceUpdates(sourceId);
            
            console.log(`Data source ${sourceId} activated successfully`);
            this.emit('sourceActivated', { sourceId, source: source.config });
            
        } catch (error) {
            console.error(`Failed to activate data source ${sourceId}:`, error);
            this.connectionStatus.set(sourceId, 'error');
            throw error;
        }
    }
    
    /**
     * Deactivate a data source
     */
    deactivateSource(sourceId) {
        const source = this.sources.get(sourceId);
        if (!source) {
            console.warn(`Data source ${sourceId} not found`);
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
        const idMap = { FlightRadar24: 'fr24Status', OpenSky: 'openskyStatus', ADSB: 'adsbStatus', KiwiSDR: 'kiwisdrStatus' };
        const targetId = idMap[sourceName] || `${sourceName.toLowerCase()}Status`;
        const statusElement = document.getElementById(targetId);
        if (statusElement) {
            statusElement.className = `status-indicator ${status}`;
        }
    }
    
    /**
     * Update source toggle UI
     */
    updateSourceToggleUI(sourceName, enabled) {
        const idMap = { FlightRadar24: 'fr24Toggle', OpenSky: 'openskyToggle', ADSB: 'adsbToggle', KiwiSDR: 'kiwisdrToggle' };
        const targetId = idMap[sourceName] || `${sourceName.toLowerCase()}Toggle`;
        const toggleElement = document.getElementById(targetId);
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
            console.log(`Data source ${sourceId} is already inactive`);
            return;
        }
        
        console.log(`Deactivating data source: ${source.config.name}`);
        
        // Stop updates
        if (source.updateInterval) {
            clearInterval(source.updateInterval);
        }
        
        // Close connection
        if (source.connection) {
            source.connection.close();
            source.connection = null;
        }
        
        source.isActive = false;
        this.activeSources.delete(sourceId);
        this.connectionStatus.set(sourceId, 'disconnected');
        
        console.log(`Data source ${sourceId} deactivated successfully`);
        this.emit('sourceDeactivated', { sourceId, source: source.config });
    }
    
    /**
     * Test connection to a data source
     */
    async testConnection(sourceId) {
        const source = this.sources.get(sourceId);
        if (!source) {
            throw new Error(`Data source ${sourceId} not found`);
        }
        
        try {
            const response = await fetch(`${source.config.baseUrl}/status`, {
                method: 'GET',
                timeout: 10000
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return true;
        } catch (error) {
            throw new Error(`Connection test failed: ${error.message}`);
        }
    }
    
    /**
     * Start periodic updates for a data source
     */
    startSourceUpdates(sourceId) {
        const source = this.sources.get(sourceId);
        if (!source) return;
        
        const updateFunction = async () => {
            try {
                await this.fetchData(sourceId);
            } catch (error) {
                console.error(`Error updating ${sourceId}:`, error);
                source.errorCount++;
            }
        };
        
        // Initial fetch
        updateFunction();
        
        // Set up periodic updates
        source.updateInterval = setInterval(updateFunction, source.config.updateInterval);
    }
    
    /**
     * Fetch data from a specific source
     */
    async fetchData(sourceId) {
        const source = this.sources.get(sourceId);
        if (!source || !source.isActive) return;
        
        try {
            source.requestCount++;
            
            // Check rate limiting
            if (this.isRateLimited(sourceId)) {
                console.warn(`Rate limit reached for ${sourceId}`);
                return;
            }
            
            // Fetch data based on source type
            let data;
            switch (sourceId) {
                case 'flightradar24':
                    data = await this.fetchFlightRadar24Data();
                    break;
                case 'opensky':
                    data = await this.fetchOpenSkyData();
                    break;
                case 'adsb':
                    data = await this.fetchADSBData();
                    break;
                case 'kiwisdr':
                    data = await this.fetchKiwiSDRData();
                    break;
                default:
                    throw new Error(`Unknown data source: ${sourceId}`);
            }
            
            // Process the data
            if (data && source.config.handler) {
                const processedData = await source.config.handler(data);
                this.addToDataBuffer(sourceId, processedData);
            }
            
            source.lastUpdate = Date.now();
            source.errorCount = 0;
            
        } catch (error) {
            console.error(`Error fetching data from ${sourceId}:`, error);
            source.errorCount++;
            throw error;
        }
    }
    
    /**
     * Check if a source is rate limited
     */
    isRateLimited(sourceId) {
        const source = this.sources.get(sourceId);
        if (!source) return true;
        
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        
        // Count requests in the last minute
        const recentRequests = source.dataBuffer.filter(
            entry => entry.timestamp > oneMinuteAgo
        ).length;
        
        return recentRequests >= source.config.maxRequestsPerMinute;
    }
    
    /**
     * Add data to the processing buffer
     */
    addToDataBuffer(sourceId, data) {
        const source = this.sources.get(sourceId);
        if (!source) return;
        
        const bufferEntry = {
            sourceId,
            data,
            timestamp: Date.now()
        };
        
        source.dataBuffer.push(bufferEntry);
        
        // Keep buffer size manageable
        if (source.dataBuffer.length > 1000) {
            source.dataBuffer = source.dataBuffer.slice(-500);
        }
    }
    
    /**
     * Process data buffer
     */
    processDataBuffer() {
        const allData = [];
        
        for (const [sourceId, source] of this.sources) {
            if (source.isActive && source.dataBuffer.length > 0) {
                const latestData = source.dataBuffer[source.dataBuffer.length - 1];
                allData.push(latestData);
                
                // Clear processed data
                source.dataBuffer = [];
            }
        }
        
        if (allData.length > 0) {
            const combinedData = this.combineData(allData);
            this.emit('dataUpdated', combinedData);
        }
    }
    
    /**
     * Combine data from multiple sources
     */
    combineData(dataArray) {
        const combined = {
            flights: [],
            military: [],
            threats: [],
            spectrum: [],
            timestamp: Date.now(),
            sources: dataArray.map(d => d.sourceId)
        };
        
        for (const dataEntry of dataArray) {
            if (dataEntry.data.flights) {
                combined.flights.push(...dataEntry.data.flights);
            }
            if (dataEntry.data.military) {
                combined.military.push(...dataEntry.data.military);
            }
            if (dataEntry.data.threats) {
                combined.threats.push(...dataEntry.data.threats);
            }
            if (dataEntry.data.spectrum) {
                combined.spectrum.push(...dataEntry.data.spectrum);
            }
        }
        
        // Remove duplicates based on aircraft ID
        combined.flights = this.removeDuplicateFlights(combined.flights);
        combined.military = this.removeDuplicateFlights(combined.military);
        
        return combined;
    }
    
    /**
     * Remove duplicate flights
     */
    removeDuplicateFlights(flights) {
        const seen = new Set();
        return flights.filter(flight => {
            const key = flight.id || flight.icao24 || flight.callsign;
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }
    
    /**
     * Fetch FlightRadar24 data
     */
    async fetchFlightRadar24Data() {
        try {
            const response = await fetch('https://data-cloud.flightradar24.com/zones/fcgi/js/traffic.js');
            const data = await response.json();
            
            return {
                flights: this.parseFlightRadar24Data(data),
                timestamp: Date.now()
            };
        } catch (error) {
            throw new Error(`FlightRadar24 fetch failed: ${error.message}`);
        }
    }
    
    /**
     * Parse FlightRadar24 data
     */
    parseFlightRadar24Data(data) {
        const flights = [];
        
        if (data && data.full_count && data.version) {
            // Parse the specific FlightRadar24 format
            // This is a simplified parser - actual implementation would be more complex
            for (const flightData of Object.values(data)) {
                if (Array.isArray(flightData) && flightData.length >= 10) {
                    const flight = {
                        id: flightData[0],
                        callsign: flightData[16] || 'N/A',
                        latitude: flightData[1],
                        longitude: flightData[2],
                        altitude: flightData[4],
                        speed: flightData[5],
                        heading: flightData[3],
                        type: 'commercial',
                        source: 'flightradar24',
                        timestamp: Date.now()
                    };
                    flights.push(flight);
                }
            }
        }
        
        return flights;
    }
    
    /**
     * Fetch OpenSky data
     */
    async fetchOpenSkyData() {
        try {
            const response = await fetch('https://opensky-network.org/api/states/all');
            const data = await response.json();
            
            return {
                flights: this.parseOpenSkyData(data),
                timestamp: Date.now()
            };
        } catch (error) {
            throw new Error(`OpenSky fetch failed: ${error.message}`);
        }
    }
    
    /**
     * Parse OpenSky data
     */
    parseOpenSkyData(data) {
        const flights = [];
        
        if (data && data.states) {
            for (const state of data.states) {
                if (state.length >= 17) {
                    const flight = {
                        id: state[0],
                        callsign: state[1] || 'N/A',
                        latitude: state[6],
                        longitude: state[5],
                        altitude: state[7],
                        speed: state[9],
                        heading: state[10],
                        type: this.determineAircraftType(state[1], state[0]),
                        source: 'opensky',
                        timestamp: Date.now()
                    };
                    flights.push(flight);
                }
            }
        }
        
        return flights;
    }
    
    /**
     * Fetch ADSB.lol data
     */
    async fetchADSBData() {
        try {
            const response = await fetch('https://api.adsb.lol/v2/mil');
            const data = await response.json();
            
            return {
                flights: this.parseADSBData(data),
                military: this.extractMilitaryAircraft(data),
                timestamp: Date.now()
            };
        } catch (error) {
            throw new Error(`ADSB.lol fetch failed: ${error.message}`);
        }
    }
    
    /**
     * Parse ADSB.lol data
     */
    parseADSBData(data) {
        const flights = [];
        
        if (data && data.ac) {
            for (const aircraft of data.ac) {
                const flight = {
                    id: aircraft.icao,
                    callsign: aircraft.flight || 'N/A',
                    latitude: aircraft.lat,
                    longitude: aircraft.lon,
                    altitude: aircraft.alt_baro,
                    speed: aircraft.gs,
                    heading: aircraft.track,
                    type: aircraft.mil ? 'military' : 'civilian',
                    source: 'adsb',
                    timestamp: Date.now()
                };
                flights.push(flight);
            }
        }
        
        return flights;
    }
    
    /**
     * Extract military aircraft from ADSB data
     */
    extractMilitaryAircraft(data) {
        const military = [];
        
        if (data && data.ac) {
            for (const aircraft of data.ac) {
                if (aircraft.mil) {
                    military.push({
                        id: aircraft.icao,
                        callsign: aircraft.flight || 'N/A',
                        type: 'military',
                        source: 'adsb',
                        timestamp: Date.now()
                    });
                }
            }
        }
        
        return military;
    }
    
    /**
     * Fetch KiwiSDR data
     */
    async fetchKiwiSDRData() {
        try {
            const response = await fetch('https://kiwisdr.com/spectrum');
            const data = await response.json();
            
            return {
                spectrum: this.parseKiwiSDRData(data),
                timestamp: Date.now()
            };
        } catch (error) {
            throw new Error(`KiwiSDR fetch failed: ${error.message}`);
        }
    }
    
    /**
     * Parse KiwiSDR data
     */
    parseKiwiSDRData(data) {
        const spectrum = [];
        
        if (data && data.frequencies) {
            for (const freq of data.frequencies) {
                spectrum.push({
                    frequency: freq.freq,
                    power: freq.power,
                    timestamp: Date.now()
                });
            }
        }
        
        return spectrum;
    }
    
    /**
     * Handle FlightRadar24 data
     */
    async handleFlightRadar24Data(data) {
        return {
            flights: data.flights,
            source: 'flightradar24'
        };
    }
    
    /**
     * Handle OpenSky data
     */
    async handleOpenSkyData(data) {
        return {
            flights: data.flights,
            source: 'opensky'
        };
    }
    
    /**
     * Handle ADSB data
     */
    async handleADSBData(data) {
        return {
            flights: data.flights,
            military: data.military,
            source: 'adsb'
        };
    }
    
    /**
     * Handle KiwiSDR data
     */
    async handleKiwiSDRData(data) {
        return {
            spectrum: data.spectrum,
            source: 'kiwisdr'
        };
    }
    
    /**
     * Determine aircraft type based on callsign and ICAO
     */
    determineAircraftType(callsign, icao) {
        if (!callsign && !icao) return 'unknown';
        
        const militaryPrefixes = ['RCH', 'REACH', 'MIL', 'AF', 'NAVY', 'ARMY'];
        const militaryIcaoPrefixes = ['AE', 'AF', 'C0', 'C1', 'C2'];
        
        if (callsign) {
            const prefix = callsign.substring(0, 3).toUpperCase();
            if (militaryPrefixes.includes(prefix)) {
                return 'military';
            }
        }
        
        if (icao) {
            const prefix = icao.substring(0, 2).toUpperCase();
            if (militaryIcaoPrefixes.includes(prefix)) {
                return 'military';
            }
        }
        
        return 'commercial';
    }
    
    /**
     * Start all data sources
     */
    startAllSources() {
        for (const [sourceId] of this.sources) {
            this.activateSource(sourceId).catch(error => {
                console.error(`Failed to start ${sourceId}:`, error);
            });
        }
    }
    
    /**
     * Stop all data sources
     */
    stopAllSources() {
        for (const [sourceId] of this.sources) {
            this.deactivateSource(sourceId);
        }
    }
    
    /**
     * Check if a source is active
     */
    isSourceActive(sourceId) {
        const source = this.sources.get(sourceId);
        return source ? source.isActive : false;
    }
    
    /**
     * Get source status
     */
    getSourceStatus(sourceId) {
        const source = this.sources.get(sourceId);
        if (!source) return null;
        
        return {
            id: sourceId,
            name: source.config.name,
            isActive: source.isActive,
            connectionStatus: this.connectionStatus.get(sourceId),
            lastUpdate: source.lastUpdate,
            errorCount: source.errorCount,
            requestCount: source.requestCount
        };
    }
    
    /**
     * Get all source statuses
     */
    getAllSourceStatuses() {
        const statuses = {};
        for (const [sourceId] of this.sources) {
            statuses[sourceId] = this.getSourceStatus(sourceId);
        }
        return statuses;
    }
    
    /**
     * Get cached data
     */
    getCachedData(sourceId) {
        return this.dataCache.get(sourceId) || null;
    }
    
    /**
     * Clear cache
     */
    clearCache() {
        this.dataCache.clear();
        console.log('Data cache cleared');
    }
    
    /**
     * Event system methods
     */
    on(event, callback) {
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
                    console.error(`Error in event handler for ${event}:`, error);
                }
            });
        }
    }
    
    /**
     * Get system statistics
     */
    getStatistics() {
        const stats = {
            totalSources: this.sources.size,
            activeSources: this.activeSources.size,
            totalFlights: 0,
            militaryFlights: 0,
            connectionStatus: {}
        };
        
        for (const [sourceId, source] of this.sources) {
            stats.connectionStatus[sourceId] = this.connectionStatus.get(sourceId);
            
            if (source.dataBuffer.length > 0) {
                const latestData = source.dataBuffer[source.dataBuffer.length - 1];
                if (latestData.data.flights) {
                    stats.totalFlights += latestData.data.flights.length;
                    stats.militaryFlights += latestData.data.flights.filter(f => f.type === 'military').length;
                }
            }
        }
        
        return stats;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataSourceManager;
} else {
    window.DataSourceManager = DataSourceManager;
}