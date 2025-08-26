/**
 * C4ISR Military Tracking System - Main Application
 * Coordinates all system components and manages the application lifecycle
 */

class C4ISRApplication {
    constructor() {
        this.isInitialized = false;
        this.isRunning = false;
        this.components = {};
        this.eventListeners = new Map();
        
        this.initialize();
    }
    
    /**
     * Initialize the C4ISR application
     */
    async initialize() {
        try {
            console.log('Initializing C4ISR Military Tracking System...');
            
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
            
            // Start the application
            this.start();
            
            this.isInitialized = true;
            console.log('C4ISR System initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize C4ISR System:', error);
            this.showError('System initialization failed', error.message);
        }
    }
    
    /**
     * Initialize all system components
     */
    async initializeComponents() {
        // Language Manager (already initialized)
        this.components.languageManager = window.languageManager;
        
        // Data Source Manager (already initialized)
        this.components.dataSourceManager = window.dataSourceManager;
        
        // Initialize other components
        this.components.notifications = new NotificationManager();
        this.components.threatDetection = new ThreatDetectionSystem();
        this.components.gpsJamming = new GPSJammingSystem();
        this.components.mapController = new MapController();
        this.components.globe3D = new Globe3D();
        this.components.flightTracker = window.flightTracker;
        
        // Wait for all components to be ready
        await this.waitForComponents();
    }
    
    /**
     * Wait for all components to be ready
     */
    async waitForComponents() {
        const componentChecks = [
            () => this.components.languageManager && this.components.languageManager.isInitialized !== false,
            () => this.components.dataSourceManager && this.components.dataSourceManager.isInitialized !== false,
            () => this.components.notifications && this.components.notifications.isInitialized !== false,
            () => this.components.threatDetection && this.components.threatDetection.isInitialized !== false,
            () => this.components.gpsJamming && this.components.gpsJamming.isInitialized !== false,
            () => this.components.mapController && this.components.mapController.isInitialized !== false,
            () => this.components.globe3D && this.components.globe3D.isInitialized !== false,
            () => this.components.flightTracker && this.components.flightTracker.isInitialized !== false
        ];
        
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max wait
        
        while (attempts < maxAttempts) {
            const allReady = componentChecks.every(check => check());
            if (allReady) break;
            
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (attempts >= maxAttempts) {
            throw new Error('Component initialization timeout');
        }
    }
    
    /**
     * Setup the event system for inter-component communication
     */
    setupEventSystem() {
        // System events
        this.registerEvent('systemReady', this.onSystemReady.bind(this));
        this.registerEvent('systemError', this.onSystemError.bind(this));
        this.registerEvent('threatDetected', this.onThreatDetected.bind(this));
        this.registerEvent('dataUpdated', this.onDataUpdated.bind(this));
        this.registerEvent('sourceActivated', this.onSourceActivated.bind(this));
        this.registerEvent('sourceDeactivated', this.onSourceDeactivated.bind(this));
        this.registerEvent('languageChanged', this.onLanguageChanged.bind(this));
        this.registerEvent('viewModeChanged', this.onViewModeChanged.bind(this));
        this.registerEvent('filterApplied', this.onFilterApplied.bind(this));
        this.registerEvent('layerActivated', this.onLayerActivated.bind(this));
        
        // GPS Jamming events
        this.registerEvent('gpsJammingActivated', this.onGPSJammingActivated.bind(this));
        this.registerEvent('gpsJammingDeactivated', this.onGPSJammingDeactivated.bind(this));
        this.registerEvent('stealthModeActivated', this.onStealthModeActivated.bind(this));
        this.registerEvent('stealthModeDeactivated', this.onStealthModeDeactivated.bind(this));
        
        // Map events
        this.registerEvent('flightSelected', this.onFlightSelected.bind(this));
        this.registerEvent('mapViewChanged', this.onMapViewChanged.bind(this));
        this.registerEvent('zoomChanged', this.onZoomChanged.bind(this));
    }
    
    /**
     * Setup UI event listeners
     */
    setupUIEventListeners() {
        // Language selector
        const languageSelector = document.getElementById('language-selector');
        if (languageSelector) {
            languageSelector.addEventListener('change', (e) => {
                this.components.languageManager.changeLanguage(e.target.value);
            });
        }
        
        // View mode buttons
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const viewMode = e.currentTarget.id.replace('-view-btn', '');
                this.changeViewMode(viewMode);
            });
        });
        
        // GPS Jamming button
        const gpsJamBtn = document.getElementById('gps-jam-btn');
        if (gpsJamBtn) {
            gpsJamBtn.addEventListener('click', () => {
                this.toggleGPSJamming();
            });
        }
        
        // Stealth mode button
        const stealthBtn = document.getElementById('stealth-mode-btn');
        if (stealthBtn) {
            stealthBtn.addEventListener('click', () => {
                this.toggleStealthMode();
            });
        }
        
        // Features button
        const featuresBtn = document.getElementById('features-btn');
        if (featuresBtn) {
            featuresBtn.addEventListener('click', () => {
                this.openFeatures();
            });
        }
        
        // Map controls
        const zoomInBtn = document.getElementById('zoom-in');
        const zoomOutBtn = document.getElementById('zoom-out');
        const resetViewBtn = document.getElementById('reset-view');
        
        if (zoomInBtn) zoomInBtn.addEventListener('click', () => this.zoomIn());
        if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => this.zoomOut());
        if (resetViewBtn) resetViewBtn.addEventListener('click', () => this.resetView());
        
        // Layer controls
        const layerCheckboxes = document.querySelectorAll('.layer-checkbox input');
        layerCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const layerName = e.target.id.replace('-layer', '');
                this.toggleMapLayer(layerName, e.target.checked);
            });
        });
        
        // Filter controls
        this.setupFilterEventListeners();
        
        // Close details button
        const closeDetailsBtn = document.getElementById('close-details');
        if (closeDetailsBtn) {
            closeDetailsBtn.addEventListener('click', () => {
                this.hideFlightDetails();
            });
        }
    }
    
    /**
     * Setup filter event listeners
     */
    setupFilterEventListeners() {
        // Altitude range inputs
        const altMin = document.getElementById('alt-min');
        const altMax = document.getElementById('alt-max');
        
        if (altMin && altMax) {
            [altMin, altMax].forEach(input => {
                input.addEventListener('change', () => {
                    this.applyAltitudeFilter(altMin.value, altMax.value);
                });
            });
        }
        
        // Speed range inputs
        const speedMin = document.getElementById('speed-min');
        const speedMax = document.getElementById('speed-max');
        
        if (speedMin && speedMax) {
            [speedMin, speedMax].forEach(input => {
                input.addEventListener('change', () => {
                    this.applySpeedFilter(speedMin.value, speedMax.value);
                });
            });
        }
        
        // Aircraft type filter
        const aircraftTypeFilter = document.getElementById('aircraft-type-filter');
        if (aircraftTypeFilter) {
            aircraftTypeFilter.addEventListener('change', (e) => {
                this.applyAircraftTypeFilter(e.target.value);
            });
        }
        
        // Threat level filter
        const threatFilter = document.getElementById('threat-filter');
        if (threatFilter) {
            threatFilter.addEventListener('change', (e) => {
                this.applyThreatFilter(e.target.value);
            });
        }
    }
    
    /**
     * Initialize the map system
     */
    async initializeMapSystem() {
        try {
            // Initialize 2D map
            await this.components.mapController.initialize();
            
            // Initialize 3D globe
            await this.components.globe3D.initialize();
            
            // Set default view
            this.changeViewMode('2d');
            
        } catch (error) {
            console.error('Failed to initialize map system:', error);
            throw error;
        }
    }
    
    /**
     * Start the application
     */
    start() {
        if (this.isRunning) return;
        
        try {
            // Hide loading screen
            this.hideLoadingScreen();
            
            // Show main application
            this.showMainApplication();
            
            // Start data updates
            this.startDataUpdates();
            
            // Start threat monitoring
            this.startThreatMonitoring();
            
            // Start flight tracking
            if (this.components.flightTracker) {
                this.components.flightTracker.startTracking();
            }
            
            // Update status
            this.updateSystemStatus();
            
            this.isRunning = true;
            
            // Dispatch system ready event
            this.dispatchEvent('systemReady', { timestamp: new Date() });
            
            console.log('C4ISR System started successfully');
            
        } catch (error) {
            console.error('Failed to start C4ISR System:', error);
            this.showError('System startup failed', error.message);
        }
    }
    
    /**
     * Hide loading screen
     */
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }
    
    /**
     * Show main application
     */
    showMainApplication() {
        const app = document.getElementById('app');
        if (app) {
            app.style.display = 'flex';
        }
    }
    
    /**
     * Start data updates
     */
    startDataUpdates() {
        // Data updates are handled by the DataSourceManager
        // This method can be used for additional application-level updates
        
        setInterval(() => {
            this.updateSystemStatus();
        }, 5000); // Update every 5 seconds
    }
    
    /**
     * Start threat monitoring
     */
    startThreatMonitoring() {
        // Threat monitoring is handled by the ThreatDetectionSystem
        // This method can be used for additional application-level monitoring
        
        setInterval(() => {
            this.checkSystemHealth();
        }, 10000); // Check every 10 seconds
    }
    
    /**
     * Update system status
     */
    updateSystemStatus() {
        // Update connection status
        const connectionStatus = document.getElementById('connection-status');
        if (connectionStatus) {
            const activeSources = this.components.dataSourceManager.getActiveSources();
            connectionStatus.textContent = activeSources.size > 0 ? 'Connected' : 'Disconnected';
        }
        
        // Update last update time
        const lastUpdate = document.getElementById('last-update');
        if (lastUpdate) {
            const now = new Date();
            lastUpdate.textContent = `Last Update: ${now.toLocaleTimeString()}`;
        }
        
        // Update total flights
        const totalFlights = document.getElementById('total-flights');
        if (totalFlights) {
            const combinedData = this.components.dataSourceManager.getCombinedData();
            totalFlights.textContent = `Total Flights: ${combinedData.totalFlights}`;
        }
        
        // Update threats detected
        const threatsDetected = document.getElementById('threats-detected');
        if (threatsDetected) {
            const threatCount = this.components.threatDetection.getThreatCount();
            threatsDetected.textContent = `Threats: ${threatCount}`;
        }
        
        // Update system mode
        const systemMode = document.getElementById('system-mode');
        if (systemMode) {
            const mode = this.getSystemMode();
            systemMode.textContent = `Mode: ${mode}`;
        }
    }
    
    /**
     * Check system health
     */
    checkSystemHealth() {
        // Check component health
        const componentHealth = this.checkComponentHealth();
        
        // Check memory usage
        const memoryUsage = this.checkMemoryUsage();
        
        // Check performance
        const performance = this.checkPerformance();
        
        // Take action if issues detected
        if (!componentHealth.healthy || memoryUsage.high || performance.slow) {
            this.handleSystemIssues(componentHealth, memoryUsage, performance);
        }
    }
    
    /**
     * Check component health
     */
    checkComponentHealth() {
        const health = { healthy: true, issues: [] };
        
        Object.entries(this.components).forEach(([name, component]) => {
            if (component && typeof component.isHealthy === 'function') {
                if (!component.isHealthy()) {
                    health.healthy = false;
                    health.issues.push(`${name} component unhealthy`);
                }
            }
        });
        
        return health;
    }
    
    /**
     * Check memory usage
     */
    checkMemoryUsage() {
        if ('memory' in performance) {
            const memory = performance.memory;
            const usedMB = memory.usedJSHeapSize / 1024 / 1024;
            const limitMB = C4ISR_CONFIG.PERFORMANCE.MEMORY_LIMIT;
            
            return {
                used: usedMB,
                limit: limitMB,
                high: usedMB > limitMB * 0.8
            };
        }
        
        return { used: 0, limit: 0, high: false };
    }
    
    /**
     * Check performance
     */
    checkPerformance() {
        // Simple performance check based on frame rate
        const now = performance.now();
        const frameTime = now - (this.lastFrameTime || now);
        this.lastFrameTime = now;
        
        const fps = 1000 / frameTime;
        const slow = fps < 30;
        
        return { fps, slow };
    }
    
    /**
     * Handle system issues
     */
    handleSystemIssues(componentHealth, memoryUsage, performance) {
        if (!componentHealth.healthy) {
            this.showWarning('System Health Issue', componentHealth.issues.join(', '));
        }
        
        if (memoryUsage.high) {
            this.showWarning('High Memory Usage', `Memory usage: ${memoryUsage.used.toFixed(1)}MB`);
        }
        
        if (performance.slow) {
            this.showWarning('Performance Issue', `Frame rate: ${performance.fps.toFixed(1)} FPS`);
        }
    }
    
    /**
     * Change view mode (2D/3D)
     */
    changeViewMode(mode) {
        if (mode === '2d') {
            this.show2DMap();
        } else if (mode === '3d') {
            this.show3DGlobe();
        }
        
        // Update UI
        this.updateViewModeUI(mode);
        
        // Dispatch event
        this.dispatchEvent('viewModeChanged', { mode });
    }
    
    /**
     * Show 2D map view
     */
    show2DMap() {
        const map2d = document.getElementById('2d-map');
        const map3d = document.getElementById('3d-globe');
        
        if (map2d && map3d) {
            map2d.classList.add('active');
            map3d.classList.remove('active');
        }
        
        // Activate map controller
        if (this.components.mapController) {
            this.components.mapController.activate();
        }
        
        // Deactivate 3D globe
        if (this.components.globe3D) {
            this.components.globe3D.deactivate();
        }
    }
    
    /**
     * Show 3D globe view
     */
    show3DGlobe() {
        const map2d = document.getElementById('2d-map');
        const map3d = document.getElementById('3d-globe');
        
        if (map2d && map3d) {
            map2d.classList.remove('active');
            map3d.classList.add('active');
        }
        
        // Deactivate map controller
        if (this.components.mapController) {
            this.components.mapController.deactivate();
        }
        
        // Activate 3D globe
        if (this.components.globe3D) {
            this.components.globe3D.activate();
        }
    }
    
    /**
     * Update view mode UI
     */
    updateViewModeUI(mode) {
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.getElementById(`${mode}-view-btn`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }
    
    /**
     * Toggle GPS jamming
     */
    toggleGPSJamming() {
        if (this.components.gpsJamming) {
            this.components.gpsJamming.toggle();
        }
    }
    
    /**
     * Toggle stealth mode
     */
    toggleStealthMode() {
        if (this.components.gpsJamming) {
            this.components.gpsJamming.toggleStealthMode();
        }
    }
    
    /**
     * Open features page
     */
    openFeatures() {
        const featuresUrl = 'dist/features.html';
        window.open(featuresUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    }
    
    /**
     * Toggle map layer
     */
    toggleMapLayer(layerName, enabled) {
        if (this.components.mapController) {
            this.components.mapController.toggleLayer(layerName, enabled);
        }
        
        // Dispatch event
        this.dispatchEvent('layerActivated', { layer: layerName, enabled });
    }
    
    /**
     * Apply altitude filter
     */
    applyAltitudeFilter(min, max) {
        if (this.components.mapController) {
            this.components.mapController.applyAltitudeFilter(min, max);
        }
        
        // Dispatch event
        this.dispatchEvent('filterApplied', { type: 'altitude', min, max });
    }
    
    /**
     * Apply speed filter
     */
    applySpeedFilter(min, max) {
        if (this.components.mapController) {
            this.components.mapController.applySpeedFilter(min, max);
        }
        
        // Dispatch event
        this.dispatchEvent('filterApplied', { type: 'speed', min, max });
    }
    
    /**
     * Apply aircraft type filter
     */
    applyAircraftTypeFilter(type) {
        if (this.components.mapController) {
            this.components.mapController.applyAircraftTypeFilter(type);
        }
        
        // Dispatch event
        this.dispatchEvent('filterApplied', { type: 'aircraft', value: type });
    }
    
    /**
     * Apply threat filter
     */
    applyThreatFilter(level) {
        if (this.components.mapController) {
            this.components.mapController.applyThreatFilter(level);
        }
        
        // Dispatch event
        this.dispatchEvent('filterApplied', { type: 'threat', level });
    }
    
    /**
     * Show flight details
     */
    showFlightDetails(flightData) {
        const detailsContainer = document.getElementById('flight-details');
        if (!detailsContainer) return;
        
        // Create flight details HTML
        const detailsHTML = this.createFlightDetailsHTML(flightData);
        detailsContainer.innerHTML = detailsHTML;
        
        // Show details sidebar
        const detailsSidebar = document.querySelector('.details-sidebar');
        if (detailsSidebar) {
            detailsSidebar.style.display = 'block';
        }
    }
    
    /**
     * Hide flight details
     */
    hideFlightDetails() {
        const detailsSidebar = document.querySelector('.details-sidebar');
        if (detailsSidebar) {
            detailsSidebar.style.display = 'none';
        }
    }
    
    /**
     * Create flight details HTML
     */
    createFlightDetailsHTML(flightData) {
        // This would create detailed HTML for flight information
        // Implementation depends on flight data structure
        return `
            <div class="flight-info">
                <h4>Flight Information</h4>
                <p><strong>ID:</strong> ${flightData.id || 'N/A'}</p>
                <p><strong>Type:</strong> ${flightData.type || 'N/A'}</p>
                <p><strong>Altitude:</strong> ${flightData.altitude || 'N/A'} ft</p>
                <p><strong>Speed:</strong> ${flightData.speed || 'N/A'} kts</p>
                <p><strong>Heading:</strong> ${flightData.heading || 'N/A'}°</p>
            </div>
        `;
    }
    
    /**
     * Map controls
     */
    zoomIn() {
        if (this.components.mapController) {
            this.components.mapController.zoomIn();
        }
    }
    
    zoomOut() {
        if (this.components.mapController) {
            this.components.mapController.zoomOut();
        }
    }
    
    resetView() {
        if (this.components.mapController) {
            this.components.mapController.resetView();
        }
    }
    
    /**
     * Get current system mode
     */
    getSystemMode() {
        if (this.components.gpsJamming) {
            if (this.components.gpsJamming.isStealthModeActive()) {
                return 'Stealth';
            } else if (this.components.gpsJamming.isJammingActive()) {
                return 'GPS Jamming';
            }
        }
        return 'Normal';
    }
    
    /**
     * Event system methods
     */
    registerEvent(eventName, handler) {
        if (!this.eventListeners.has(eventName)) {
            this.eventListeners.set(eventName, []);
        }
        this.eventListeners.get(eventName).push(handler);
    }
    
    dispatchEvent(eventName, data) {
        const handlers = this.eventListeners.get(eventName);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error(`Error in event handler for ${eventName}:`, error);
                }
            });
        }
    }
    
    /**
     * Event handlers
     */
    onSystemReady(data) {
        console.log('System ready event received:', data);
        this.showNotification('System Ready', 'C4ISR System is now operational', 'success');
    }
    
    onSystemError(data) {
        console.error('System error event received:', data);
        this.showError('System Error', data.message || 'Unknown error occurred');
    }
    
    onThreatDetected(data) {
        console.warn('Threat detected event received:', data);
        this.showNotification('Threat Detected', data.description || 'Unknown threat detected', 'danger');
    }
    
    onDataUpdated(data) {
        // Update flight count
        const flightCount = document.getElementById('flight-count');
        if (flightCount) {
            const combinedData = this.components.dataSourceManager.getCombinedData();
            flightCount.textContent = `${combinedData.totalFlights} Flights`;
            flightCount.setAttribute('data-count', combinedData.totalFlights);
        }
        
        // Update flight tracker with new data
        if (this.components.flightTracker && data.data && data.data.flights) {
            data.data.flights.forEach(flight => {
                this.components.flightTracker.addFlight(flight);
            });
        }
        
        // Update map with new data
        if (this.components.mapController && this.components.mapController.isActive) {
            this.components.mapController.updateFlightData();
        }
    }
    
    onSourceActivated(data) {
        console.log('Source activated:', data.source);
        this.showNotification('Data Source Connected', `${data.source} is now active`, 'success');
    }
    
    onSourceDeactivated(data) {
        console.log('Source deactivated:', data.source);
        this.showNotification('Data Source Disconnected', `${data.source} is now inactive`, 'warning');
    }
    
    onLanguageChanged(data) {
        console.log('Language changed to:', data.language);
        // Language changes are handled automatically by the LanguageManager
    }
    
    onViewModeChanged(data) {
        console.log('View mode changed to:', data.mode);
        // View mode changes are handled by the changeViewMode method
    }
    
    onFilterApplied(data) {
        console.log('Filter applied:', data);
        // Filters are handled by the respective filter methods
    }
    
    onLayerActivated(data) {
        console.log('Layer activated:', data);
        // Layer changes are handled by the toggleMapLayer method
    }
    
    onGPSJammingActivated(data) {
        console.log('GPS Jamming activated');
        this.showNotification('GPS Jamming Active', 'GPS jamming mode is now active', 'warning');
    }
    
    onGPSJammingDeactivated(data) {
        console.log('GPS Jamming deactivated');
        this.showNotification('GPS Jamming Deactivated', 'GPS jamming mode is now inactive', 'info');
    }
    
    onStealthModeActivated(data) {
        console.log('Stealth mode activated');
        this.showNotification('Stealth Mode Active', 'Stealth mode is now active', 'warning');
    }
    
    onStealthModeDeactivated(data) {
        console.log('Stealth mode deactivated');
        this.showNotification('Stealth Mode Deactivated', 'Stealth mode is now inactive', 'info');
    }
    
    onFlightSelected(data) {
        console.log('Flight selected:', data);
        this.showFlightDetails(data.flight);
    }
    
    onMapViewChanged(data) {
        console.log('Map view changed:', data);
        // Map view changes are handled by the map controller
    }
    
    onZoomChanged(data) {
        console.log('Zoom changed:', data);
        const zoomElement = document.getElementById('current-zoom');
        if (zoomElement) {
            zoomElement.textContent = `Zoom: ${data.zoom}`;
        }
    }
    
    /**
     * Notification methods
     */
    showNotification(title, message, type = 'info') {
        if (this.components.notifications) {
            this.components.notifications.show(title, message, type);
        }
    }
    
    showError(title, message) {
        this.showNotification(title, message, 'danger');
    }
    
    showWarning(title, message) {
        this.showNotification(title, message, 'warning');
    }
    
    /**
     * Cleanup and shutdown
     */
    shutdown() {
        if (!this.isRunning) return;
        
        try {
            // Stop all components
            Object.values(this.components).forEach(component => {
                if (component && typeof component.shutdown === 'function') {
                    component.shutdown();
                }
            });
            
            // Clear intervals
            this.clearAllIntervals();
            
            this.isRunning = false;
            console.log('C4ISR System shutdown complete');
            
        } catch (error) {
            console.error('Error during system shutdown:', error);
        }
    }
    
    /**
     * Clear all intervals
     */
    clearAllIntervals() {
        // Clear any application-level intervals
        // Component intervals are cleared by their shutdown methods
    }
}

// Create and initialize the application when the page loads
let c4isrApp = null;

document.addEventListener('DOMContentLoaded', () => {
    c4isrApp = new C4ISRApplication();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (c4isrApp) {
        c4isrApp.shutdown();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = C4ISRApplication;
}

// Global function for HTML onclick
function openFeatures() {
    if (c4isrApp) {
        c4isrApp.openFeatures();
    } else {
        // Fallback if app not initialized
        const featuresUrl = 'dist/features.html';
        window.open(featuresUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    }
}