/**
 * C4ISR Military Tracking System v2.0.0 - Main Application
 * Enhanced military-grade flight tracking and analysis application
 * 
 * Features:
 * - Real-time multi-source data integration
 * - Advanced threat detection and analysis
 * - GPS jamming and stealth capabilities
 * - 2D/3D visualization
 * - Multi-language support
 * - Military-grade security features
 */

class C4ISRApplication {
    constructor() {
        this.isInitialized = false;
        this.isRunning = false;
        this.components = {};
        this.eventListeners = new Map();
        this.flights = new Map();
        this.threats = new Map();
        this.systemStats = {
            activeFlights: 0,
            memoryUsage: 0,
            updateRate: 0,
            lastUpdate: Date.now()
        };
        
        // Performance monitoring
        this.performanceMetrics = {
            frameRate: 0,
            memoryUsage: 0,
            networkLatency: 0,
            cpuUsage: 0
        };
        
        this.initialize();
    }
    
    /**
     * Initialize the C4ISR application
     */
    async initialize() {
        try {
            console.log('🚀 Initializing C4ISR Military Tracking System v2.0.0...');
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }
            
            // Initialize core components
            await this.initializeComponents();
            
            // Setup event system
            this.setupEventSystem();
            
            // Setup UI event listeners
            this.setupUIEventListeners();
            
            // Initialize map system
            await this.initializeMapSystem();
            
            // Start performance monitoring
            this.startPerformanceMonitoring();
            
            // Start the application
            this.start();
            
            this.isInitialized = true;
            console.log('✅ C4ISR System initialized successfully');
            
            // Hide loading screen
            this.hideLoadingScreen();
            
        } catch (error) {
            console.error('❌ Failed to initialize C4ISR System:', error);
            this.showError('System initialization failed', error.message);
        }
    }
    
    /**
     * Initialize all system components
     */
    async initializeComponents() {
        console.log('🔧 Initializing system components...');
        
        // Initialize components in parallel for better performance
        const componentPromises = [
            this.initializeLanguageManager(),
            this.initializeDataSourceManager(),
            this.initializeNotificationManager(),
            this.initializeThreatDetection(),
            this.initializeGPSJamming(),
            this.initializeMapController(),
            this.initializeGlobe3D(),
            this.initializeFlightTracker()
        ];
        
        const results = await Promise.allSettled(componentPromises);
        
        // Check for any failed component initializations
        const failedComponents = results
            .map((result, index) => ({ result, index }))
            .filter(({ result }) => result.status === 'rejected');
        
        if (failedComponents.length > 0) {
            console.warn('⚠️ Some components failed to initialize:', failedComponents);
        }
        
        console.log('✅ Component initialization complete');
    }
    
    /**
     * Initialize Language Manager
     */
    async initializeLanguageManager() {
        try {
            this.components.languageManager = new LanguageManager();
            await this.components.languageManager.initialize();
            console.log('✅ Language Manager initialized');
        } catch (error) {
            console.error('❌ Language Manager initialization failed:', error);
            throw error;
        }
    }
    
    /**
     * Initialize Data Source Manager
     */
    async initializeDataSourceManager() {
        try {
            this.components.dataSourceManager = new DataSourceManager();
            await this.components.dataSourceManager.initialize();
            console.log('✅ Data Source Manager initialized');
        } catch (error) {
            console.error('❌ Data Source Manager initialization failed:', error);
            throw error;
        }
    }
    
    /**
     * Initialize Notification Manager
     */
    async initializeNotificationManager() {
        try {
            this.components.notifications = new NotificationManager();
            await this.components.notifications.initialize();
            console.log('✅ Notification Manager initialized');
        } catch (error) {
            console.error('❌ Notification Manager initialization failed:', error);
            throw error;
        }
    }
    
    /**
     * Initialize Threat Detection System
     */
    async initializeThreatDetection() {
        try {
            this.components.threatDetection = new ThreatDetectionSystem();
            await this.components.threatDetection.initialize();
            console.log('✅ Threat Detection System initialized');
        } catch (error) {
            console.error('❌ Threat Detection System initialization failed:', error);
            throw error;
        }
    }
    
    /**
     * Initialize GPS Jamming System
     */
    async initializeGPSJamming() {
        try {
            this.components.gpsJamming = new GPSJammingSystem();
            await this.components.gpsJamming.initialize();
            console.log('✅ GPS Jamming System initialized');
        } catch (error) {
            console.error('❌ GPS Jamming System initialization failed:', error);
            throw error;
        }
    }
    
    /**
     * Initialize Map Controller
     */
    async initializeMapController() {
        try {
            this.components.mapController = new MapController();
            await this.components.mapController.initialize();
            console.log('✅ Map Controller initialized');
        } catch (error) {
            console.error('❌ Map Controller initialization failed:', error);
            throw error;
        }
    }
    
    /**
     * Initialize 3D Globe
     */
    async initializeGlobe3D() {
        try {
            this.components.globe3D = new Globe3D();
            await this.components.globe3D.initialize();
            console.log('✅ 3D Globe initialized');
        } catch (error) {
            console.error('❌ 3D Globe initialization failed:', error);
            throw error;
        }
    }
    
    /**
     * Initialize Flight Tracker
     */
    async initializeFlightTracker() {
        try {
            this.components.flightTracker = new FlightTracker();
            await this.components.flightTracker.initialize();
            console.log('✅ Flight Tracker initialized');
        } catch (error) {
            console.error('❌ Flight Tracker initialization failed:', error);
            throw error;
        }
    }
    
    /**
     * Initialize map system
     */
    async initializeMapSystem() {
        try {
            // Initialize the map
            await this.components.mapController.initializeMap();
            
            // Setup map event listeners
            this.setupMapEventListeners();
            
            console.log('✅ Map system initialized');
        } catch (error) {
            console.error('❌ Map system initialization failed:', error);
            throw error;
        }
    }
    
    /**
     * Setup event system for inter-component communication
     */
    setupEventSystem() {
        console.log('🔗 Setting up event system...');
        
        // System events
        this.addEventListener('systemReady', this.onSystemReady.bind(this));
        this.addEventListener('threatDetected', this.onThreatDetected.bind(this));
        this.addEventListener('dataUpdated', this.onDataUpdated.bind(this));
        this.addEventListener('languageChanged', this.onLanguageChanged.bind(this));
        this.addEventListener('gpsJammingActivated', this.onGPSJammingActivated.bind(this));
        this.addEventListener('stealthModeActivated', this.onStealthModeActivated.bind(this));
        
        console.log('✅ Event system setup complete');
    }
    
    /**
     * Setup UI event listeners
     */
    setupUIEventListeners() {
        console.log('🎛️ Setting up UI event listeners...');
        
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        
        if (sidebarToggle && sidebar && mainContent) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
                mainContent.classList.toggle('expanded');
            });
        }
        
        // GPS Jamming button
        const gpsJammingBtn = document.getElementById('gpsJammingBtn');
        if (gpsJammingBtn) {
            gpsJammingBtn.addEventListener('click', () => {
                this.toggleGPSJamming();
            });
        }
        
        // Stealth mode button
        const stealthBtn = document.getElementById('stealthBtn');
        if (stealthBtn) {
            stealthBtn.addEventListener('click', () => {
                this.toggleStealthMode();
            });
        }
        
        // View controls
        const map2dBtn = document.getElementById('map2dBtn');
        const globe3dBtn = document.getElementById('globe3dBtn');
        
        if (map2dBtn && globe3dBtn) {
            map2dBtn.addEventListener('click', () => {
                this.switchTo2DView();
            });
            
            globe3dBtn.addEventListener('click', () => {
                this.switchTo3DView();
            });
        }
        
        // Data source toggles
        this.setupDataSourceToggles();
        
        // Layer controls
        this.setupLayerControls();
        
        // Flight info close button
        const flightClose = document.getElementById('flightClose');
        if (flightClose) {
            flightClose.addEventListener('click', () => {
                this.hideFlightInfo();
            });
        }
        
        console.log('✅ UI event listeners setup complete');
    }
    
    /**
     * Setup data source toggle controls
     */
    setupDataSourceToggles() {
        const toggles = {
            'fr24Toggle': 'FlightRadar24',
            'openskyToggle': 'OpenSky',
            'adsbToggle': 'ADSB',
            'kiwisdrToggle': 'KiwiSDR'
        };
        
        Object.entries(toggles).forEach(([toggleId, sourceName]) => {
            const toggle = document.getElementById(toggleId);
            if (toggle) {
                toggle.addEventListener('change', (event) => {
                    this.toggleDataSource(sourceName, event.target.checked);
                });
            }
        });
    }
    
    /**
     * Setup layer controls
     */
    setupLayerControls() {
        const layers = {
            'satelliteLayer': 'satellite',
            'terrainLayer': 'terrain',
            'weatherLayer': 'weather'
        };
        
        Object.entries(layers).forEach(([layerId, layerName]) => {
            const layer = document.getElementById(layerId);
            if (layer) {
                layer.addEventListener('change', (event) => {
                    this.toggleMapLayer(layerName, event.target.checked);
                });
            }
        });
    }
    
    /**
     * Setup map event listeners
     */
    setupMapEventListeners() {
        if (this.components.mapController && this.components.mapController.map) {
            this.components.mapController.map.on('click', (event) => {
                this.onMapClick(event);
            });
        }
    }
    
    /**
     * Start the application
     */
    start() {
        console.log('🚀 Starting C4ISR System...');
        
        this.isRunning = true;
        
        // Start data collection
        this.startDataCollection();
        
        // Start threat monitoring
        this.startThreatMonitoring();
        
        // Start system monitoring
        this.startSystemMonitoring();
        
        // Emit system ready event
        this.emit('systemReady');
        
        console.log('✅ C4ISR System started successfully');
    }
    
    /**
     * Start data collection from all sources
     */
    startDataCollection() {
        if (this.components.dataSourceManager) {
            this.components.dataSourceManager.startDataCollection();
        }
    }
    
    /**
     * Start threat monitoring
     */
    startThreatMonitoring() {
        if (this.components.threatDetection) {
            this.components.threatDetection.startMonitoring();
        }
    }
    
    /**
     * Start system monitoring
     */
    startSystemMonitoring() {
        setInterval(() => {
            this.updateSystemStats();
        }, 1000);
    }
    
    /**
     * Start performance monitoring
     */
    startPerformanceMonitoring() {
        let lastTime = performance.now();
        let frameCount = 0;
        
        const measurePerformance = () => {
            const currentTime = performance.now();
            frameCount++;
            
            if (currentTime - lastTime >= 1000) {
                this.performanceMetrics.frameRate = Math.round((frameCount * 1000) / (currentTime - lastTime));
                frameCount = 0;
                lastTime = currentTime;
                
                // Update memory usage
                if (performance.memory) {
                    this.performanceMetrics.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
                }
            }
            
            requestAnimationFrame(measurePerformance);
        };
        
        requestAnimationFrame(measurePerformance);
    }
    
    /**
     * Update system statistics
     */
    updateSystemStats() {
        // Update active flights count
        this.systemStats.activeFlights = this.flights.size;
        
        // Update memory usage
        this.systemStats.memoryUsage = this.performanceMetrics.memoryUsage;
        
        // Update update rate
        const now = Date.now();
        const timeDiff = now - this.systemStats.lastUpdate;
        this.systemStats.updateRate = Math.round(1000 / timeDiff);
        this.systemStats.lastUpdate = now;
        
        // Update UI
        this.updateSystemStatsUI();
    }
    
    /**
     * Update system statistics in UI
     */
    updateSystemStatsUI() {
        const activeFlightsEl = document.getElementById('activeFlights');
        const memoryUsageEl = document.getElementById('memoryUsage');
        const updateRateEl = document.getElementById('updateRate');
        
        if (activeFlightsEl) {
            activeFlightsEl.textContent = this.systemStats.activeFlights.toLocaleString();
        }
        
        if (memoryUsageEl) {
            memoryUsageEl.textContent = `${this.systemStats.memoryUsage} MB`;
        }
        
        if (updateRateEl) {
            updateRateEl.textContent = `${this.systemStats.updateRate} Hz`;
        }
    }
    
    /**
     * Toggle GPS jamming
     */
    toggleGPSJamming() {
        if (this.components.gpsJamming) {
            const isActive = this.components.gpsJamming.toggleJamming();
            
            const gpsJammingBtn = document.getElementById('gpsJammingBtn');
            if (gpsJammingBtn) {
                if (isActive) {
                    gpsJammingBtn.classList.add('active');
                    this.showNotification('GPS Jamming activated', 'warning');
                } else {
                    gpsJammingBtn.classList.remove('active');
                    this.showNotification('GPS Jamming deactivated', 'success');
                }
            }
        }
    }
    
    /**
     * Toggle stealth mode
     */
    toggleStealthMode() {
        if (this.components.gpsJamming) {
            const isActive = this.components.gpsJamming.toggleStealth();
            
            const stealthBtn = document.getElementById('stealthBtn');
            if (stealthBtn) {
                if (isActive) {
                    stealthBtn.classList.add('active');
                    this.showNotification('Stealth mode activated', 'warning');
                } else {
                    stealthBtn.classList.remove('active');
                    this.showNotification('Stealth mode deactivated', 'success');
                }
            }
        }
    }
    
    /**
     * Switch to 2D map view
     */
    switchTo2DView() {
        const map2dBtn = document.getElementById('map2dBtn');
        const globe3dBtn = document.getElementById('globe3dBtn');
        
        if (map2dBtn && globe3dBtn) {
            map2dBtn.classList.add('active');
            globe3dBtn.classList.remove('active');
        }
        
        if (this.components.mapController) {
            this.components.mapController.show();
        }
        
        if (this.components.globe3D) {
            this.components.globe3D.hide();
        }
    }
    
    /**
     * Switch to 3D globe view
     */
    switchTo3DView() {
        const map2dBtn = document.getElementById('map2dBtn');
        const globe3dBtn = document.getElementById('globe3dBtn');
        
        if (map2dBtn && globe3dBtn) {
            map2dBtn.classList.remove('active');
            globe3dBtn.classList.add('active');
        }
        
        if (this.components.mapController) {
            this.components.mapController.hide();
        }
        
        if (this.components.globe3D) {
            this.components.globe3D.show();
        }
    }
    
    /**
     * Toggle data source
     */
    toggleDataSource(sourceName, enabled) {
        if (this.components.dataSourceManager) {
            this.components.dataSourceManager.toggleSource(sourceName, enabled);
        }
    }
    
    /**
     * Toggle map layer
     */
    toggleMapLayer(layerName, enabled) {
        if (this.components.mapController) {
            this.components.mapController.toggleLayer(layerName, enabled);
        }
    }
    
    /**
     * Handle map click events
     */
    onMapClick(event) {
        // Check if a flight was clicked
        const flight = this.getFlightAtPosition(event.latlng);
        if (flight) {
            this.showFlightInfo(flight);
        }
    }
    
    /**
     * Get flight at specific position
     */
    getFlightAtPosition(latlng) {
        // Implementation for finding flights at specific coordinates
        // This would check if any flight markers are at the clicked position
        return null;
    }
    
    /**
     * Show flight information
     */
    showFlightInfo(flight) {
        const flightInfo = document.getElementById('flightInfo');
        const flightTitle = document.getElementById('flightTitle');
        const flightDetails = document.getElementById('flightDetails');
        
        if (flightInfo && flightTitle && flightDetails) {
            flightTitle.textContent = `Flight ${flight.callsign || flight.icao24}`;
            
            flightDetails.innerHTML = `
                <div class="detail-item">
                    <span class="detail-label">Callsign:</span>
                    <span class="detail-value">${flight.callsign || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">ICAO24:</span>
                    <span class="detail-value">${flight.icao24 || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Altitude:</span>
                    <span class="detail-value">${flight.altitude ? `${flight.altitude} ft` : 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Speed:</span>
                    <span class="detail-value">${flight.speed ? `${flight.speed} kts` : 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Heading:</span>
                    <span class="detail-value">${flight.heading ? `${flight.heading}°` : 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Type:</span>
                    <span class="detail-value">${flight.type || 'Unknown'}</span>
                </div>
            `;
            
            flightInfo.classList.add('show');
        }
    }
    
    /**
     * Hide flight information
     */
    hideFlightInfo() {
        const flightInfo = document.getElementById('flightInfo');
        if (flightInfo) {
            flightInfo.classList.remove('show');
        }
    }
    
    /**
     * Hide loading screen
     */
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }
    
    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        if (this.components.notifications) {
            this.components.notifications.show(message, type);
        }
    }
    
    /**
     * Show error
     */
    showError(title, message) {
        console.error(`❌ ${title}:`, message);
        this.showNotification(`${title}: ${message}`, 'danger');
    }
    
    // Event handlers
    onSystemReady() {
        console.log('🎉 System is ready for operation');
        this.showNotification('C4ISR System ready', 'success');
    }
    
    onThreatDetected(threat) {
        console.log('🚨 Threat detected:', threat);
        this.updateThreatLevel(threat.level);
        this.showNotification(`Threat detected: ${threat.description}`, 'danger');
    }
    
    onDataUpdated(data) {
        console.log('📊 Data updated:', data.flights?.length || 0, 'flights');
        this.updateFlights(data.flights || []);
    }
    
    onLanguageChanged(language) {
        console.log('🌐 Language changed to:', language);
        this.updateUIForLanguage(language);
    }
    
    onGPSJammingActivated() {
        console.log('📡 GPS Jamming activated');
        this.showNotification('GPS Jamming system activated', 'warning');
    }
    
    onStealthModeActivated() {
        console.log('👻 Stealth mode activated');
        this.showNotification('Stealth mode activated', 'warning');
    }
    
    /**
     * Update threat level display
     */
    updateThreatLevel(level) {
        const threatLevel = document.getElementById('threatLevel');
        const threatIndicator = document.getElementById('threatIndicator');
        
        if (threatLevel && threatIndicator) {
            threatLevel.textContent = level.toUpperCase();
            
            // Update colors based on threat level
            threatIndicator.className = 'threat-indicator';
            switch (level.toLowerCase()) {
                case 'low':
                    threatIndicator.style.borderColor = 'var(--accent-green)';
                    threatIndicator.style.background = 'rgba(0, 255, 65, 0.1)';
                    break;
                case 'medium':
                    threatIndicator.style.borderColor = 'var(--accent-yellow)';
                    threatIndicator.style.background = 'rgba(255, 170, 0, 0.1)';
                    break;
                case 'high':
                case 'critical':
                    threatIndicator.style.borderColor = 'var(--accent-red)';
                    threatIndicator.style.background = 'rgba(255, 0, 0, 0.1)';
                    break;
            }
        }
    }
    
    /**
     * Update flights data
     */
    updateFlights(flights) {
        // Update internal flights map
        flights.forEach(flight => {
            this.flights.set(flight.icao24, flight);
        });
        
        // Update map markers
        if (this.components.mapController) {
            this.components.mapController.updateFlights(flights);
        }
        
        // Update 3D globe
        if (this.components.globe3D) {
            this.components.globe3D.updateFlights(flights);
        }
    }
    
    /**
     * Update UI for language change
     */
    updateUIForLanguage(language) {
        // Update all text elements based on language
        // This would be implemented based on the language manager
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
     * Cleanup and shutdown
     */
    shutdown() {
        console.log('🛑 Shutting down C4ISR System...');
        
        this.isRunning = false;
        
        // Stop all components
        Object.values(this.components).forEach(component => {
            if (component && typeof component.shutdown === 'function') {
                try {
                    component.shutdown();
                } catch (error) {
                    console.error('Error shutting down component:', error);
                }
            }
        });
        
        // Clear event listeners
        this.eventListeners.clear();
        
        console.log('✅ C4ISR System shutdown complete');
    }
}

// Initialize the application when the script loads
let c4isrApp;

document.addEventListener('DOMContentLoaded', () => {
    c4isrApp = new C4ISRApplication();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (c4isrApp) {
        c4isrApp.shutdown();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = C4ISRApplication;
} else {
    window.C4ISRApplication = C4ISRApplication;
}