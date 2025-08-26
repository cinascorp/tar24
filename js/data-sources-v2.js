/**
 * C4ISR Military Tracking System v2.0.0 - Data Sources Manager
 * Enhanced data source management with military-grade reliability and security
 */

class DataSourceManager {
    constructor() {
        this.sources = new Map();
        this.activeSources = new Set();
        this.dataCache = new Map();
        this.connectionStatus = new Map();
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
            console.log('Initializing Data Source Manager...');
            
            // Initialize all data sources
            await this.initializeSources();
            
            // Setup connection monitoring
            this.setupConnectionMonitoring();
            
            // Setup data processing
            this.setupDataProcessing();
            
            this.isInitialized = true;
            console.log('Data Source Manager initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize Data Source Manager:', error);
            throw error;
        }
    }
    
    /**
     * Initialize all data sources
     */
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
    
    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
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