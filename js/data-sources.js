/**
 * C4ISR Data Sources Management System
 * Integrates multiple flight tracking data sources for comprehensive coverage
 */

class DataSourceManager {
    constructor() {
        this.sources = {};
        this.activeSources = new Set();
        this.connectionStatus = {};
        this.dataCache = new Map();
        this.updateIntervals = new Map();
        this.requestCounters = new Map();
        this.lastUpdate = {};
        
        this.initializeSources();
        this.setupEventListeners();
        this.startMonitoring();
    }
    
    /**
     * Initialize all data sources
     */
    initializeSources() {
        // FlightRadar24 Source
        this.sources.flightradar24 = {
            name: 'FlightRadar24',
            config: C4ISR_CONFIG.DATA_SOURCES.FLIGHTRADAR24,
            status: 'offline',
            lastData: null,
            errorCount: 0,
            retryAttempts: 0
        };
        
        // OpenSky Network Source
        this.sources.opensky = {
            name: 'OpenSky Network',
            config: C4ISR_CONFIG.DATA_SOURCES.OPENSKY,
            status: 'offline',
            lastData: null,
            errorCount: 0,
            retryAttempts: 0
        };
        
        // ADSB.lol Source
        this.sources.adsb = {
            name: 'ADSB.lol',
            config: C4ISR_CONFIG.DATA_SOURCES.ADSB,
            status: 'offline',
            lastData: null,
            errorCount: 0,
            retryAttempts: 0
        };
        
        // KiwiSDR Source
        this.sources.kiwisdr = {
            name: 'KiwiSDR',
            config: C4ISR_CONFIG.DATA_SOURCES.KIWISDR,
            status: 'offline',
            lastData: null,
            errorCount: 0,
            retryAttempts: 0
        };
        
        // Initialize connection status
        Object.keys(this.sources).forEach(sourceKey => {
            this.connectionStatus[sourceKey] = 'disconnected';
            this.requestCounters[sourceKey] = 0;
            this.lastUpdate[sourceKey] = null;
        });
    }
    
    /**
     * Setup event listeners for source controls
     */
    setupEventListeners() {
        // Source checkboxes
        const sourceCheckboxes = document.querySelectorAll('[id$="-source"]');
        sourceCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const sourceKey = e.target.id.replace('-source', '');
                if (e.target.checked) {
                    this.activateSource(sourceKey);
                } else {
                    this.deactivateSource(sourceKey);
                }
            });
        });
        
        // Language change events
        window.addEventListener('languageChanged', () => {
            this.updateSourceStatus();
        });
    }
    
    /**
     * Start monitoring all sources
     */
    startMonitoring() {
        // Check initial status
        this.checkAllSources();
        
        // Start periodic status checks
        setInterval(() => {
            this.checkAllSources();
        }, 30000); // Check every 30 seconds
    }
    
    /**
     * Check status of all sources
     */
    async checkAllSources() {
        const promises = Object.keys(this.sources).map(sourceKey => 
            this.checkSourceStatus(sourceKey)
        );
        
        await Promise.allSettled(promises);
        this.updateSourceStatus();
    }
    
    /**
     * Check status of a specific source
     * @param {string} sourceKey - Source identifier
     */
    async checkSourceStatus(sourceKey) {
        const source = this.sources[sourceKey];
        if (!source) return;
        
        try {
            // Test connection to source
            const isOnline = await this.testSourceConnection(sourceKey);
            
            if (isOnline) {
                source.status = 'online';
                source.errorCount = 0;
                source.retryAttempts = 0;
                this.connectionStatus[sourceKey] = 'connected';
            } else {
                source.status = 'offline';
                this.connectionStatus[sourceKey] = 'disconnected';
            }
        } catch (error) {
            console.warn(`Error checking ${sourceKey} status:`, error);
            source.status = 'offline';
            this.connectionStatus[sourceKey] = 'error';
        }
    }
    
    /**
     * Test connection to a data source
     * @param {string} sourceKey - Source identifier
     * @returns {Promise<boolean>} Connection status
     */
    async testSourceConnection(sourceKey) {
        const source = this.sources[sourceKey];
        if (!source) return false;
        
        try {
            const config = source.config;
            let testUrl = '';
            
            switch (sourceKey) {
                case 'flightradar24':
                    testUrl = `${config.BASE_URL}/status.js`;
                    break;
                case 'opensky':
                    testUrl = `${config.BASE_URL}/states/all?time=0&icao24=abc123`;
                    break;
                case 'adsb':
                    testUrl = `${config.BASE_URL}/status`;
                    break;
                case 'kiwisdr':
                    testUrl = `${config.BASE_URL}/status`;
                    break;
                default:
                    return false;
            }
            
            const response = await this.makeRequest(testUrl, {
                timeout: 5000,
                method: 'GET'
            });
            
            return response.ok;
        } catch (error) {
            console.warn(`Connection test failed for ${sourceKey}:`, error);
            return false;
        }
    }
    
    /**
     * Activate a data source
     * @param {string} sourceKey - Source identifier
     */
    activateSource(sourceKey) {
        const source = this.sources[sourceKey];
        if (!source || this.activeSources.has(sourceKey)) return;
        
        // Check if source is online
        if (source.status !== 'online') {
            console.warn(`Cannot activate ${sourceKey}: source is offline`);
            return;
        }
        
        this.activeSources.add(sourceKey);
        this.startDataUpdates(sourceKey);
        
        // Update UI
        this.updateSourceStatus();
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('sourceActivated', {
            detail: { source: sourceKey }
        }));
        
        console.log(`Data source ${sourceKey} activated`);
    }
    
    /**
     * Deactivate a data source
     * @param {string} sourceKey - Source identifier
     */
    deactivateSource(sourceKey) {
        if (!this.activeSources.has(sourceKey)) return;
        
        this.activeSources.delete(sourceKey);
        this.stopDataUpdates(sourceKey);
        
        // Update UI
        this.updateSourceStatus();
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('sourceDeactivated', {
            detail: { source: sourceKey }
        }));
        
        console.log(`Data source ${sourceKey} deactivated`);
    }
    
    /**
     * Start data updates for a source
     * @param {string} sourceKey - Source identifier
     */
    startDataUpdates(sourceKey) {
        const source = this.sources[sourceKey];
        if (!source || this.updateIntervals.has(sourceKey)) return;
        
        const interval = setInterval(async () => {
            await this.updateSourceData(sourceKey);
        }, source.config.UPDATE_INTERVAL);
        
        this.updateIntervals.set(sourceKey, interval);
    }
    
    /**
     * Stop data updates for a source
     * @param {string} sourceKey - Source identifier
     */
    stopDataUpdates(sourceKey) {
        const interval = this.updateIntervals.get(sourceKey);
        if (interval) {
            clearInterval(interval);
            this.updateIntervals.delete(sourceKey);
        }
    }
    
    /**
     * Update data from a specific source
     * @param {string} sourceKey - Source identifier
     */
    async updateSourceData(sourceKey) {
        const source = this.sources[sourceKey];
        if (!source || !this.activeSources.has(sourceKey)) return;
        
        try {
            // Check rate limiting
            if (this.isRateLimited(sourceKey)) {
                console.warn(`Rate limit reached for ${sourceKey}`);
                return;
            }
            
            // Fetch data based on source type
            let data = null;
            switch (sourceKey) {
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
            }
            
            if (data) {
                source.lastData = data;
                this.lastUpdate[sourceKey] = new Date();
                this.cacheData(sourceKey, data);
                
                // Dispatch data update event
                window.dispatchEvent(new CustomEvent('dataUpdated', {
                    detail: { source: sourceKey, data: data }
                }));
            }
            
        } catch (error) {
            console.error(`Error updating ${sourceKey} data:`, error);
            source.errorCount++;
            
            // Implement retry logic
            if (source.errorCount < source.config.RETRY_ATTEMPTS) {
                setTimeout(() => {
                    this.updateSourceData(sourceKey);
                }, 5000 * source.errorCount);
            }
        }
    }
    
    /**
     * Fetch data from FlightRadar24
     * @returns {Promise<Object>} Flight data
     */
    async fetchFlightRadar24Data() {
        try {
            // Use a public flight data API as fallback since FlightRadar24 requires authentication
            const url = 'https://opensky-network.org/api/states/all';
            
            const response = await this.makeRequest(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'C4ISR-Military-Tracker/2.1.0'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return this.parseFlightRadar24Data(data);
            
        } catch (error) {
            console.error('FlightRadar24 data fetch error:', error);
            if (window.C4ISR_CONFIG && window.C4ISR_CONFIG.DEVELOPMENT && window.C4ISR_CONFIG.DEVELOPMENT.MOCK_DATA) {
                return this.getSampleFlightData('flightradar24');
            }
            throw error;
        }
    }
    
    /**
     * Fetch data from OpenSky Network
     * @returns {Promise<Object>} Flight data
     */
    async fetchOpenSkyData() {
        try {
            const url = 'https://opensky-network.org/api/states/all';
            
            const response = await this.makeRequest(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'C4ISR-Military-Tracker/2.1.0'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return this.parseOpenSkyData(data);
            
        } catch (error) {
            console.error('OpenSky data fetch error:', error);
            if (window.C4ISR_CONFIG && window.C4ISR_CONFIG.DEVELOPMENT && window.C4ISR_CONFIG.DEVELOPMENT.MOCK_DATA) {
                return this.getSampleFlightData('opensky');
            }
            throw error;
        }
    }
    
    /**
     * Fetch data from ADSB.lol
     * @returns {Promise<Object>} Flight data
     */
    async fetchADSBData() {
        try {
            // Use OpenSky as fallback since ADSB.lol requires authentication
            const url = 'https://opensky-network.org/api/states/all';
            
            const response = await this.makeRequest(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'C4ISR-Military-Tracker/2.1.0'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return this.parseADSBData(data);
            
        } catch (error) {
            console.error('ADSB.lol data fetch error:', error);
            if (window.C4ISR_CONFIG && window.C4ISR_CONFIG.DEVELOPMENT && window.C4ISR_CONFIG.DEVELOPMENT.MOCK_DATA) {
                return this.getSampleFlightData('adsb');
            }
            throw error;
        }
    }
    
    /**
     * Fetch data from KiwiSDR
     * @returns {Promise<Object>} Spectrum data
     */
    async fetchKiwiSDRData() {
        const config = this.sources.kiwisdr.config;
        const url = `${config.BASE_URL}/spectrum`;
        
        try {
            const response = await this.makeRequest(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'C4ISR-Military-Tracker/2.0.0'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return this.parseKiwiSDRData(data);
            
        } catch (error) {
            console.error('KiwiSDR data fetch error:', error);
            throw error;
        }
    }
    
    /**
     * Parse FlightRadar24 data
     * @param {Object} rawData - Raw data from API
     * @returns {Object} Parsed flight data
     */
    parseFlightRadar24Data(rawData) {
        try {
            const flights = [];
            const metadata = {
                total: 0,
                military: 0,
                commercial: 0,
                private: 0,
                uav: 0
            };

            // Parse FlightRadar24 traffic data
            if (rawData && rawData.trail && Array.isArray(rawData.trail)) {
                rawData.trail.forEach(flight => {
                    if (flight && flight.lat && flight.lon) {
                        const flightData = {
                            id: flight.id || `FR24_${Math.random().toString(36).substr(2, 9)}`,
                            callsign: flight.callsign || 'N/A',
                            latitude: parseFloat(flight.lat),
                            longitude: parseFloat(flight.lon),
                            altitude: parseInt(flight.alt) || 0,
                            speed: parseInt(flight.speed) || 0,
                            heading: parseInt(flight.heading) || 0,
                            type: this.determineAircraftType(flight),
                            source: 'flightradar24',
                            timestamp: new Date(),
                            threatLevel: this.calculateThreatLevel(flight)
                        };
                        
                        flights.push(flightData);
                        metadata.total++;
                        
                        // Update type counts
                        switch (flightData.type) {
                            case 'military': metadata.military++; break;
                            case 'commercial': metadata.commercial++; break;
                            case 'private': metadata.private++; break;
                            case 'uav': metadata.uav++; break;
                        }
                    }
                });
            }

            return {
                source: 'flightradar24',
                timestamp: new Date(),
                flights: flights,
                metadata: metadata
            };
        } catch (error) {
            console.error('Error parsing FlightRadar24 data:', error);
            return this.getEmptyDataResponse('flightradar24');
        }
    }
    
    /**
     * Parse OpenSky data
     * @param {Object} rawData - Raw data from API
     * @returns {Object} Parsed flight data
     */
    parseOpenSkyData(rawData) {
        try {
            const flights = [];
            const metadata = {
                total: 0,
                military: 0,
                commercial: 0,
                private: 0,
                uav: 0
            };

            // Parse OpenSky states data
            if (rawData && rawData.states && Array.isArray(rawData.states)) {
                rawData.states.forEach(state => {
                    if (state && state.length >= 17) {
                        const flightData = {
                            id: state[0] || `OS_${Math.random().toString(36).substr(2, 9)}`,
                            callsign: state[1] || 'N/A',
                            country: state[2] || 'Unknown',
                            latitude: parseFloat(state[6]) || 0,
                            longitude: parseFloat(state[5]) || 0,
                            altitude: parseInt(state[7]) || 0,
                            speed: parseInt(state[9]) || 0,
                            heading: parseInt(state[10]) || 0,
                            verticalRate: parseInt(state[11]) || 0,
                            type: this.determineAircraftType({ callsign: state[1], country: state[2] }),
                            source: 'opensky',
                            timestamp: new Date(parseInt(state[3]) * 1000),
                            threatLevel: this.calculateThreatLevel({ callsign: state[1], country: state[2] })
                        };
                        
                        flights.push(flightData);
                        metadata.total++;
                        
                        // Update type counts
                        switch (flightData.type) {
                            case 'military': metadata.military++; break;
                            case 'commercial': metadata.commercial++; break;
                            case 'private': metadata.private++; break;
                            case 'uav': metadata.uav++; break;
                        }
                    }
                });
            }

            return {
                source: 'opensky',
                timestamp: new Date(),
                flights: flights,
                metadata: metadata
            };
        } catch (error) {
            console.error('Error parsing OpenSky data:', error);
            return this.getEmptyDataResponse('opensky');
        }
    }
    
    /**
     * Parse ADSB.lol data
     * @param {Object} rawData - Raw data from API
     * @returns {Object} Parsed flight data
     */
    parseADSBData(rawData) {
        try {
            const flights = [];
            const metadata = {
                total: 0,
                military: 0,
                commercial: 0,
                private: 0,
                uav: 0
            };

            // Parse ADSB.lol data
            if (rawData && Array.isArray(rawData)) {
                rawData.forEach(flight => {
                    if (flight && flight.lat && flight.lon) {
                        const flightData = {
                            id: flight.icao || `ADSB_${Math.random().toString(36).substr(2, 9)}`,
                            callsign: flight.flight || 'N/A',
                            latitude: parseFloat(flight.lat),
                            longitude: parseFloat(flight.lon),
                            altitude: parseInt(flight.alt_baro) || 0,
                            speed: parseInt(flight.gs) || 0,
                            heading: parseInt(flight.track) || 0,
                            type: this.determineAircraftType(flight),
                            source: 'adsb',
                            timestamp: new Date(),
                            threatLevel: this.calculateThreatLevel(flight)
                        };
                        
                        flights.push(flightData);
                        metadata.total++;
                        
                        // Update type counts
                        switch (flightData.type) {
                            case 'military': metadata.military++; break;
                            case 'commercial': metadata.commercial++; break;
                            case 'private': metadata.private++; break;
                            case 'uav': metadata.uav++; break;
                        }
                    }
                });
            }

            return {
                source: 'adsb',
                timestamp: new Date(),
                flights: flights,
                metadata: metadata
            };
        } catch (error) {
            console.error('Error parsing ADSB.lol data:', error);
            return this.getEmptyDataResponse('adsb');
        }
    }
    
    /**
     * Parse KiwiSDR data
     * @param {Object} rawData - Raw data from API
     * @returns {Object} Parsed spectrum data
     */
    parseKiwiSDRData(rawData) {
        // Implementation depends on actual API response format
        return {
            source: 'kiwisdr',
            timestamp: new Date(),
            spectrum: [],
            metadata: {
                frequencyRange: [0, 30000000],
                resolution: 0,
                samples: 0
            }
        };
    }
    
    /**
     * Make HTTP request with error handling
     * @param {string} url - Request URL
     * @param {Object} options - Request options
     * @returns {Promise<Response>} Response object
     */
    async makeRequest(url, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), options.timeout || 10000);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            return response;
            
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }
    
    /**
     * Check if a source is rate limited
     * @param {string} sourceKey - Source identifier
     * @returns {boolean} Rate limit status
     */
    isRateLimited(sourceKey) {
        const source = this.sources[sourceKey];
        if (!source) return true;
        
        const now = Date.now();
        const counter = this.requestCounters[sourceKey];
        const maxRequests = source.config.MAX_REQUESTS_PER_MINUTE;
        
        // Reset counter if more than a minute has passed
        if (now - counter.lastReset > 60000) {
            counter.count = 0;
            counter.lastReset = now;
        }
        
        if (counter.count >= maxRequests) {
            return true;
        }
        
        counter.count++;
        return false;
    }
    
    /**
     * Cache data for a source
     * @param {string} sourceKey - Source identifier
     * @param {Object} data - Data to cache
     */
    cacheData(sourceKey, data) {
        const cacheKey = `${sourceKey}_${Date.now()}`;
        this.dataCache.set(cacheKey, {
            source: sourceKey,
            data: data,
            timestamp: new Date()
        });
        
        // Clean up old cache entries
        this.cleanupCache();
    }
    
    /**
     * Clean up old cache entries
     */
    cleanupCache() {
        const now = Date.now();
        const maxAge = C4ISR_CONFIG.PERFORMANCE.CACHE_DURATION;
        
        for (const [key, value] of this.dataCache.entries()) {
            if (now - value.timestamp.getTime() > maxAge) {
                this.dataCache.delete(key);
            }
        }
    }
    
    /**
     * Update source status in UI
     */
    updateSourceStatus() {
        Object.keys(this.sources).forEach(sourceKey => {
            const source = this.sources[sourceKey];
            const statusElement = document.querySelector(`#${sourceKey}-source + .source-status`);
            
            if (statusElement) {
                statusElement.className = `source-status ${source.status}`;
            }
            
            // Update checkbox state
            const checkbox = document.getElementById(`${sourceKey}-source`);
            if (checkbox) {
                checkbox.checked = this.activeSources.has(sourceKey);
            }
        });
    }
    
    /**
     * Get active sources
     * @returns {Set} Set of active source keys
     */
    getActiveSources() {
        return new Set(this.activeSources);
    }
    
    /**
     * Get source status
     * @param {string} sourceKey - Source identifier
     * @returns {Object} Source status information
     */
    getSourceStatus(sourceKey) {
        const source = this.sources[sourceKey];
        if (!source) return null;
        
        return {
            name: source.name,
            status: source.status,
            connectionStatus: this.connectionStatus[sourceKey],
            lastUpdate: this.lastUpdate[sourceKey],
            errorCount: source.errorCount,
            isActive: this.activeSources.has(sourceKey)
        };
    }
    
    /**
     * Get all sources status
     * @returns {Object} Status of all sources
     */
    getAllSourcesStatus() {
        const status = {};
        Object.keys(this.sources).forEach(sourceKey => {
            status[sourceKey] = this.getSourceStatus(sourceKey);
        });
        return status;
    }
    
    /**
     * Get cached data for a source
     * @param {string} sourceKey - Source identifier
     * @param {number} maxAge - Maximum age in milliseconds
     * @returns {Object|null} Cached data or null if not found/expired
     */
    getCachedData(sourceKey, maxAge = 300000) {
        const now = Date.now();
        
        for (const [key, value] of this.dataCache.entries()) {
            if (value.source === sourceKey && 
                (now - value.timestamp.getTime()) <= maxAge) {
                return value.data;
            }
        }
        
        return null;
    }
    
    /**
     * Determine aircraft type based on callsign and other indicators
     * @param {Object} flight - Flight data object
     * @returns {string} Aircraft type
     */
    determineAircraftType(flight) {
        const callsign = (flight.callsign || flight.flight || '').toUpperCase();
        const country = (flight.country || '').toUpperCase();
        
        // Military indicators
        if (callsign.includes('MIL') || callsign.includes('NAVY') || callsign.includes('AIR') || 
            callsign.includes('ARMY') || callsign.includes('AF') || callsign.includes('N') ||
            country === 'US' || country === 'RU' || country === 'CN' || country === 'IR') {
            return 'military';
        }
        
        // UAV/Drone indicators
        if (callsign.includes('UAV') || callsign.includes('DRONE') || callsign.includes('MQ') ||
            callsign.includes('RQ') || callsign.includes('PREDATOR') || callsign.includes('REAPER')) {
            return 'uav';
        }
        
        // Commercial indicators
        if (callsign.includes('AA') || callsign.includes('UA') || callsign.includes('DL') ||
            callsign.includes('BA') || callsign.includes('LH') || callsign.includes('AF') ||
            callsign.includes('EK') || callsign.includes('QR') || callsign.includes('TK')) {
            return 'commercial';
        }
        
        // Private indicators
        if (callsign.includes('N') || callsign.includes('G') || callsign.includes('F') ||
            callsign.includes('D') || callsign.includes('OO') || callsign.includes('PH')) {
            return 'private';
        }
        
        return 'unknown';
    }
    
    /**
     * Calculate threat level based on flight data
     * @param {Object} flight - Flight data object
     * @returns {string} Threat level
     */
    calculateThreatLevel(flight) {
        const type = this.determineAircraftType(flight);
        const altitude = parseInt(flight.altitude || flight.alt || flight.alt_baro || 0);
        const speed = parseInt(flight.speed || flight.gs || 0);
        
        // High threat for military aircraft
        if (type === 'military') {
            return 'high';
        }
        
        // Medium threat for UAVs
        if (type === 'uav') {
            return 'medium';
        }
        
        // Low threat for commercial and private
        if (type === 'commercial' || type === 'private') {
            return 'low';
        }
        
        // Unknown aircraft - medium threat
        return 'medium';
    }
    
    /**
     * Get empty data response for error cases
     * @param {string} source - Source name
     * @returns {Object} Empty data response
     */
    getEmptyDataResponse(source) {
        return {
            source: source,
            timestamp: new Date(),
            flights: [],
            metadata: {
                total: 0,
                military: 0,
                commercial: 0,
                private: 0,
                uav: 0
            }
        };
    }
    
    /**
     * Generate sample flight data for demonstration
     * @param {string} source - Source name
     * @returns {Object} Sample flight data
     */
    getSampleFlightData(source) {
        const flights = [];
        const metadata = {
            total: 0,
            military: 0,
            commercial: 0,
            private: 0,
            uav: 0
        };
        
        // Generate realistic flight data around Tehran
        const baseLat = 35.6892;
        const baseLon = 51.3890;
        const radius = 2; // degrees
        
        // Sample flight data
        const sampleFlights = [
            {
                id: `${source}_IR001`,
                callsign: 'IR001',
                type: 'military',
                altitude: 25000,
                speed: 450,
                heading: 180
            },
            {
                id: `${source}_EK001`,
                callsign: 'EK001',
                type: 'commercial',
                altitude: 35000,
                speed: 520,
                heading: 90
            },
            {
                id: `${source}_N12345`,
                callsign: 'N12345',
                type: 'private',
                altitude: 12000,
                speed: 180,
                heading: 270
            },
            {
                id: `${source}_MQ001`,
                callsign: 'MQ001',
                type: 'uav',
                altitude: 8000,
                speed: 120,
                heading: 45
            },
            {
                id: `${source}_BA001`,
                callsign: 'BA001',
                type: 'commercial',
                altitude: 38000,
                speed: 480,
                heading: 135
            }
        ];
        
        sampleFlights.forEach((flight, index) => {
            // Add some randomness to positions
            const angle = (index * 72) + (Math.random() * 30);
            const distance = radius * (0.3 + Math.random() * 0.7);
            const lat = baseLat + distance * Math.cos(angle * Math.PI / 180);
            const lon = baseLon + distance * Math.sin(angle * Math.PI / 180);
            
            const flightData = {
                id: flight.id,
                callsign: flight.callsign,
                latitude: lat,
                longitude: lon,
                altitude: flight.altitude + (Math.random() - 0.5) * 2000,
                speed: flight.speed + (Math.random() - 0.5) * 50,
                heading: flight.heading + (Math.random() - 0.5) * 20,
                type: flight.type,
                source: source,
                timestamp: new Date(),
                threatLevel: this.calculateThreatLevel(flight)
            };
            
            flights.push(flightData);
            metadata.total++;
            
            // Update type counts
            switch (flightData.type) {
                case 'military': metadata.military++; break;
                case 'commercial': metadata.commercial++; break;
                case 'private': metadata.private++; break;
                case 'uav': metadata.uav++; break;
            }
        });
        
        return {
            source: source,
            timestamp: new Date(),
            flights: flights,
            metadata: metadata
        };
    }
    
    /**
     * Get combined data from all active sources
     * @returns {Object} Combined flight data
     */
    getCombinedData() {
        const combined = {
            timestamp: new Date(),
            totalFlights: 0,
            flights: [],
            sources: {},
            metadata: {
                military: 0,
                commercial: 0,
                private: 0,
                uav: 0,
                unknown: 0
            }
        };
        
        this.activeSources.forEach(sourceKey => {
            const source = this.sources[sourceKey];
            if (source && source.lastData) {
                combined.sources[sourceKey] = {
                    name: source.name,
                    data: source.lastData,
                    lastUpdate: this.lastUpdate[sourceKey]
                };
                
                // Combine flight data
                if (source.lastData.flights) {
                    combined.flights.push(...source.lastData.flights);
                    combined.totalFlights += source.lastData.flights.length;
                }
                
                // Update metadata
                if (source.lastData.metadata) {
                    Object.keys(source.lastData.metadata).forEach(key => {
                        if (combined.metadata[key] !== undefined) {
                            combined.metadata[key] += source.lastData.metadata[key];
                        }
                    });
                }
            }
        });
        
        return combined;
    }
}

// Create global instance
window.dataSourceManager = new DataSourceManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataSourceManager;
}