/**
 * C4ISR Military Tracking System v2.0.0 - Main Application
 * Enhanced military-grade flight tracking and analysis application
 * with improved error handling, performance optimization, and security features
 */

class C4ISRApplication {
    constructor() {
        this.isInitialized = false;
        this.isRunning = false;
        this.components = {};
        this.eventListeners = new Map();
        this.systemLog = [];
        this.performanceMetrics = {
            startTime: Date.now(),
            memoryUsage: 0,
            cpuUsage: 0,
            frameRate: 0
        };
        
        // Initialize the application
        this.initialize();
    }
    
    /**
     * Initialize the C4ISR application with enhanced error handling
     */
    async initialize() {
        try {
            this.log('Initializing C4ISR Military Tracking System v2.0.0...', 'info');
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }
            
            // Initialize core components with error handling
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
            this.log('C4ISR System initialized successfully', 'success');
            
            // Emit system ready event
            this.emit('systemReady');
            
        } catch (error) {
            this.log(`Failed to initialize C4ISR System: ${error.message}`, 'error');
            this.showError('System initialization failed', error.message);
            throw error;
        }
    }
    
    /**
     * Initialize all system components with enhanced error handling
     */
    async initializeComponents() {
        const componentInitializers = [
            { name: 'languageManager', init: () => this.initLanguageManager() },
            { name: 'dataSourceManager', init: () => this.initDataSourceManager() },
            { name: 'notifications', init: () => this.initNotificationManager() },
            { name: 'threatDetection', init: () => this.initThreatDetection() },
            { name: 'gpsJamming', init: () => this.initGPSJamming() },
            { name: 'mapController', init: () => this.initMapController() },
            { name: 'globe3D', init: () => this.initGlobe3D() },
            { name: 'flightTracker', init: () => this.initFlightTracker() }
        ];
        
        for (const component of componentInitializers) {
            try {
                this.log(`Initializing ${component.name}...`, 'info');
                await component.init();
                this.log(`${component.name} initialized successfully`, 'success');
            } catch (error) {
                this.log(`Failed to initialize ${component.name}: ${error.message}`, 'error');
                // Continue with other components even if one fails
            }
        }
    }
    
    /**
     * Initialize Language Manager
     */
    async initLanguageManager() {
        if (window.languageManager) {
            this.components.languageManager = window.languageManager;
        } else {
            this.components.languageManager = new LanguageManager();
            await this.components.languageManager.initialize();
        }
    }
    
    /**
     * Initialize Data Source Manager
     */
    async initDataSourceManager() {
        if (window.dataSourceManager) {
            this.components.dataSourceManager = window.dataSourceManager;
        } else {
            this.components.dataSourceManager = new DataSourceManager();
            await this.components.dataSourceManager.initialize();
        }
    }
    
    /**
     * Initialize Notification Manager
     */
    async initNotificationManager() {
        this.components.notifications = new NotificationManager();
        await this.components.notifications.initialize();
    }
    
    /**
     * Initialize Threat Detection System
     */
    async initThreatDetection() {
        this.components.threatDetection = new ThreatDetectionSystem();
        await this.components.threatDetection.initialize();
    }
    
    /**
     * Initialize GPS Jamming System
     */
    async initGPSJamming() {
        this.components.gpsJamming = new GPSJammingSystem();
        await this.components.gpsJamming.initialize();
    }
    
    /**
     * Initialize Map Controller
     */
    async initMapController() {
        this.components.mapController = new MapController();
        await this.components.mapController.initialize();
    }
    
    /**
     * Initialize 3D Globe
     */
    async initGlobe3D() {
        this.components.globe3D = new Globe3D();
        await this.components.globe3D.initialize();
    }
    
    /**
     * Initialize Flight Tracker
     */
    async initFlightTracker() {
        if (window.flightTracker) {
            this.components.flightTracker = window.flightTracker;
        } else {
            this.components.flightTracker = new FlightTracker();
            await this.components.flightTracker.initialize();
        }
    }
    
    /**
     * Initialize Map System
     */
    async initializeMapSystem() {
        try {
            // Initialize 2D map
            await this.components.mapController.initializeMap();
            
            // Initialize 3D globe
            await this.components.globe3D.initializeGlobe();
            
            this.log('Map system initialized successfully', 'success');
        } catch (error) {
            this.log(`Failed to initialize map system: ${error.message}`, 'error');
            throw error;
        }
    }
    
    /**
     * Setup event system for inter-component communication
     */
    setupEventSystem() {
        // System events
        this.on('systemReady', () => {
            this.log('System ready event triggered', 'info');
            this.updateUI();
        });
        
        this.on('threatDetected', (threat) => {
            this.handleThreatDetected(threat);
        });
        
        this.on('dataUpdated', (data) => {
            this.handleDataUpdated(data);
        });
        
        this.on('languageChanged', (language) => {
            this.handleLanguageChanged(language);
        });
        
        this.on('gpsJammingActivated', (mode) => {
            this.handleGPSJammingActivated(mode);
        });
        
        this.on('stealthModeActivated', (active) => {
            this.handleStealthModeActivated(active);
        });
    }
    
    /**
     * Setup UI event listeners
     */
    setupUIEventListeners() {
        // Sidebar toggle
        const toggleSidebarBtn = document.getElementById('toggleSidebar');
        if (toggleSidebarBtn) {
            toggleSidebarBtn.addEventListener('click', () => this.toggleSidebar());
        }
        
        // View toggle (2D/3D)
        const toggleViewBtn = document.getElementById('toggleView');
        if (toggleViewBtn) {
            toggleViewBtn.addEventListener('click', () => this.toggleView());
        }
        
        // GPS Jamming
        const gpsJammingBtn = document.getElementById('gpsJamming');
        if (gpsJammingBtn) {
            gpsJammingBtn.addEventListener('click', () => this.toggleGPSJamming());
        }
        
        // Stealth Mode
        const stealthModeBtn = document.getElementById('stealthMode');
        if (stealthModeBtn) {
            stealthModeBtn.addEventListener('click', () => this.toggleStealthMode());
        }
        
        // Emergency Override
        const emergencyBtn = document.getElementById('emergencyOverride');
        if (emergencyBtn) {
            emergencyBtn.addEventListener('click', () => this.activateEmergencyOverride());
        }
        
        // Language selector
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => this.changeLanguage(e.target.value));
        }
        
        // Data source toggles
        document.querySelectorAll('.data-source[data-source]').forEach(element => {
            element.addEventListener('click', (e) => {
                const source = e.currentTarget.dataset.source;
                this.toggleDataSource(source);
            });
        });
        
        // Map layer toggles
        document.querySelectorAll('.data-source[data-layer]').forEach(element => {
            element.addEventListener('click', (e) => {
                const layer = e.currentTarget.dataset.layer;
                this.toggleMapLayer(layer);
            });
        });
        
        // Filter controls
        const altitudeRange = document.getElementById('altitudeRange');
        if (altitudeRange) {
            altitudeRange.addEventListener('input', (e) => this.updateAltitudeFilter(e.target.value));
        }
        
        const speedRange = document.getElementById('speedRange');
        if (speedRange) {
            speedRange.addEventListener('input', (e) => this.updateSpeedFilter(e.target.value));
        }
        
        const aircraftType = document.getElementById('aircraftType');
        if (aircraftType) {
            aircraftType.addEventListener('change', (e) => this.updateAircraftTypeFilter(e.target.value));
        }
        
        const threatFilter = document.getElementById('threatFilter');
        if (threatFilter) {
            threatFilter.addEventListener('change', (e) => this.updateThreatFilter(e.target.value));
        }
    }
    
    /**
     * Start the application
     */
    start() {
        if (this.isRunning) {
            this.log('Application is already running', 'warning');
            return;
        }
        
        try {
            this.isRunning = true;
            this.log('Starting C4ISR application...', 'info');
            
            // Start data collection
            this.startDataCollection();
            
            // Start threat monitoring
            this.startThreatMonitoring();
            
            // Start performance monitoring
            this.startPerformanceMonitoring();
            
            this.log('C4ISR application started successfully', 'success');
            
        } catch (error) {
            this.log(`Failed to start application: ${error.message}`, 'error');
            this.isRunning = false;
            throw error;
        }
    }
    
    /**
     * Start data collection from all sources
     */
    startDataCollection() {
        if (this.components.dataSourceManager) {
            this.components.dataSourceManager.startAllSources();
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
     * Start performance monitoring
     */
    startPerformanceMonitoring() {
        setInterval(() => {
            this.updatePerformanceMetrics();
        }, 1000);
    }
    
    /**
     * Update performance metrics
     */
    updatePerformanceMetrics() {
        // Memory usage (simulated)
        this.performanceMetrics.memoryUsage = Math.random() * 100;
        
        // CPU usage (simulated)
        this.performanceMetrics.cpuUsage = Math.random() * 50;
        
        // Frame rate (simulated)
        this.performanceMetrics.frameRate = 55 + Math.random() * 10;
        
        // Log if performance is poor
        if (this.performanceMetrics.memoryUsage > 80) {
            this.log('High memory usage detected', 'warning');
        }
        
        if (this.performanceMetrics.cpuUsage > 40) {
            this.log('High CPU usage detected', 'warning');
        }
        
        if (this.performanceMetrics.frameRate < 30) {
            this.log('Low frame rate detected', 'warning');
        }
    }
    
    /**
     * Toggle sidebar visibility
     */
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        const statsPanel = document.getElementById('statsPanel');
        
        if (sidebar && mainContent && statsPanel) {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
            statsPanel.classList.toggle('expanded');
        }
    }
    
    /**
     * Toggle between 2D map and 3D globe view
     */
    toggleView() {
        const mapContainer = document.getElementById('map');
        const globeContainer = document.getElementById('globeContainer');
        const toggleBtn = document.getElementById('toggleView');
        
        if (mapContainer && globeContainer && toggleBtn) {
            const is3D = globeContainer.classList.contains('active');
            
            if (is3D) {
                // Switch to 2D
                globeContainer.classList.remove('active');
                mapContainer.style.display = 'block';
                toggleBtn.innerHTML = '<i class="fas fa-globe"></i><span>3D View</span>';
            } else {
                // Switch to 3D
                globeContainer.classList.add('active');
                mapContainer.style.display = 'none';
                toggleBtn.innerHTML = '<i class="fas fa-map"></i><span>2D View</span>';
            }
        }
    }
    
    /**
     * Toggle GPS jamming
     */
    toggleGPSJamming() {
        if (this.components.gpsJamming) {
            const isActive = this.components.gpsJamming.isActive();
            
            if (isActive) {
                this.components.gpsJamming.deactivate();
            } else {
                this.components.gpsJamming.activate('jam');
            }
        }
    }
    
    /**
     * Toggle stealth mode
     */
    toggleStealthMode() {
        if (this.components.gpsJamming) {
            const stealthActive = this.components.gpsJamming.isStealthActive();
            
            if (stealthActive) {
                this.components.gpsJamming.deactivateStealth();
            } else {
                this.components.gpsJamming.activateStealth();
            }
        }
    }
    
    /**
     * Activate emergency override
     */
    activateEmergencyOverride() {
        this.log('Emergency override activated', 'warning');
        
        // Deactivate all security features
        if (this.components.gpsJamming) {
            this.components.gpsJamming.emergencyOverride();
        }
        
        // Show emergency notification
        if (this.components.notifications) {
            this.components.notifications.show('Emergency override activated - All security features disabled', 'warning');
        }
        
        // Update UI
        this.updateEmergencyStatus();
    }
    
    /**
     * Change application language
     */
    changeLanguage(languageCode) {
        if (this.components.languageManager) {
            this.components.languageManager.setLanguage(languageCode);
        }
    }
    
    /**
     * Toggle data source
     */
    toggleDataSource(sourceName) {
        if (this.components.dataSourceManager) {
            const isActive = this.components.dataSourceManager.isSourceActive(sourceName);
            
            if (isActive) {
                this.components.dataSourceManager.deactivateSource(sourceName);
            } else {
                this.components.dataSourceManager.activateSource(sourceName);
            }
            
            this.updateDataSourceUI(sourceName, !isActive);
        }
    }
    
    /**
     * Toggle map layer
     */
    toggleMapLayer(layerName) {
        if (this.components.mapController) {
            this.components.mapController.toggleLayer(layerName);
            this.updateMapLayerUI(layerName);
        }
    }
    
    /**
     * Update altitude filter
     */
    updateAltitudeFilter(value) {
        const altitudeValue = document.getElementById('altitudeValue');
        if (altitudeValue) {
            altitudeValue.textContent = parseInt(value).toLocaleString();
        }
        
        if (this.components.flightTracker) {
            this.components.flightTracker.setAltitudeFilter(parseInt(value));
        }
    }
    
    /**
     * Update speed filter
     */
    updateSpeedFilter(value) {
        const speedValue = document.getElementById('speedValue');
        if (speedValue) {
            speedValue.textContent = parseInt(value).toLocaleString();
        }
        
        if (this.components.flightTracker) {
            this.components.flightTracker.setSpeedFilter(parseInt(value));
        }
    }
    
    /**
     * Update aircraft type filter
     */
    updateAircraftTypeFilter(type) {
        if (this.components.flightTracker) {
            this.components.flightTracker.setAircraftTypeFilter(type);
        }
    }
    
    /**
     * Update threat filter
     */
    updateThreatFilter(level) {
        if (this.components.flightTracker) {
            this.components.flightTracker.setThreatFilter(level);
        }
    }
    
    /**
     * Handle threat detected event
     */
    handleThreatDetected(threat) {
        this.log(`Threat detected: ${threat.level} - ${threat.description}`, 'warning');
        
        // Update threat level display
        this.updateThreatLevel(threat.level);
        
        // Show notification
        if (this.components.notifications) {
            this.components.notifications.show(`Threat detected: ${threat.description}`, 'danger');
        }
        
        // Play alert sound for high/critical threats
        if (threat.level === 'high' || threat.level === 'critical') {
            this.playAlertSound();
        }
    }
    
    /**
     * Handle data updated event
     */
    handleDataUpdated(data) {
        // Update statistics
        this.updateStatistics(data);
        
        // Update flight display
        if (this.components.flightTracker) {
            this.components.flightTracker.updateFlights(data.flights);
        }
    }
    
    /**
     * Handle language changed event
     */
    handleLanguageChanged(language) {
        this.log(`Language changed to: ${language}`, 'info');
        this.updateUILanguage(language);
    }
    
    /**
     * Handle GPS jamming activated event
     */
    handleGPSJammingActivated(mode) {
        this.log(`GPS jamming activated: ${mode}`, 'info');
        this.updateGPSStatus(true, mode);
    }
    
    /**
     * Handle stealth mode activated event
     */
    handleStealthModeActivated(active) {
        this.log(`Stealth mode ${active ? 'activated' : 'deactivated'}`, 'info');
        this.updateStealthStatus(active);
    }
    
    /**
     * Update threat level display
     */
    updateThreatLevel(level) {
        const threatIndicator = document.getElementById('threatIndicator');
        const threatLevel = document.getElementById('threatLevel');
        
        if (threatIndicator && threatLevel) {
            // Remove existing classes
            threatIndicator.className = 'threat-indicator';
            
            // Add appropriate class and text
            switch (level) {
                case 'low':
                    threatIndicator.classList.add('low');
                    threatLevel.textContent = 'LOW THREAT';
                    break;
                case 'medium':
                    threatIndicator.classList.add('medium');
                    threatLevel.textContent = 'MEDIUM THREAT';
                    break;
                case 'high':
                    threatIndicator.classList.add('high');
                    threatLevel.textContent = 'HIGH THREAT';
                    break;
                case 'critical':
                    threatIndicator.classList.add('critical');
                    threatLevel.textContent = 'CRITICAL THREAT';
                    break;
            }
        }
    }
    
    /**
     * Update statistics display
     */
    updateStatistics(data) {
        const totalFlights = document.getElementById('totalFlights');
        const militaryFlights = document.getElementById('militaryFlights');
        const threats = document.getElementById('threats');
        
        if (totalFlights) totalFlights.textContent = data.totalFlights || 0;
        if (militaryFlights) militaryFlights.textContent = data.militaryFlights || 0;
        if (threats) threats.textContent = data.threats || 0;
    }
    
    /**
     * Update GPS status display
     */
    updateGPSStatus(active, mode = '') {
        const gpsStatus = document.getElementById('gpsStatus');
        if (gpsStatus) {
            gpsStatus.textContent = active ? `Active (${mode})` : 'Inactive';
            gpsStatus.style.color = active ? 'var(--accent-green)' : 'var(--accent-red)';
        }
    }
    
    /**
     * Update stealth status display
     */
    updateStealthStatus(active) {
        const stealthStatus = document.getElementById('stealthStatus');
        if (stealthStatus) {
            stealthStatus.textContent = active ? 'Active' : 'Inactive';
            stealthStatus.style.color = active ? 'var(--accent-green)' : 'var(--accent-orange)';
        }
    }
    
    /**
     * Update data source UI
     */
    updateDataSourceUI(sourceName, isActive) {
        const sourceElement = document.querySelector(`[data-source="${sourceName}"]`);
        if (sourceElement) {
            const status = sourceElement.querySelector('.data-source-status');
            const toggle = sourceElement.querySelector('.toggle-switch');
            
            if (status) {
                status.classList.toggle('offline', !isActive);
            }
            
            if (toggle) {
                toggle.classList.toggle('active', isActive);
            }
            
            sourceElement.classList.toggle('active', isActive);
        }
    }
    
    /**
     * Update map layer UI
     */
    updateMapLayerUI(layerName) {
        const layerElement = document.querySelector(`[data-layer="${layerName}"]`);
        if (layerElement) {
            const toggle = layerElement.querySelector('.toggle-switch');
            if (toggle) {
                toggle.classList.toggle('active');
            }
        }
    }
    
    /**
     * Update emergency status
     */
    updateEmergencyStatus() {
        const emergencyBtn = document.getElementById('emergencyOverride');
        if (emergencyBtn) {
            emergencyBtn.classList.add('active');
            emergencyBtn.style.background = 'rgba(255, 0, 0, 0.2)';
        }
    }
    
    /**
     * Update UI language
     */
    updateUILanguage(language) {
        // This would update all UI text based on the selected language
        // Implementation depends on the language manager
    }
    
    /**
     * Play alert sound
     */
    playAlertSound() {
        // Create audio context for alert sound
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            this.log('Failed to play alert sound', 'warning');
        }
    }
    
    /**
     * Update UI elements
     */
    updateUI() {
        // Update all UI elements based on current state
        this.updateStatistics({
            totalFlights: 0,
            militaryFlights: 0,
            threats: 0
        });
        
        this.updateThreatLevel('low');
        this.updateGPSStatus(false);
        this.updateStealthStatus(false);
    }
    
    /**
     * Show error message
     */
    showError(title, message) {
        if (this.components.notifications) {
            this.components.notifications.show(`${title}: ${message}`, 'danger');
        } else {
            console.error(`${title}: ${message}`);
        }
    }
    
    /**
     * Log system message
     */
    log(message, level = 'info') {
        const timestamp = new Date().toISOString();
        const logEntry = { timestamp, message, level };
        
        this.systemLog.push(logEntry);
        
        // Keep log size manageable
        if (this.systemLog.length > 1000) {
            this.systemLog = this.systemLog.slice(-500);
        }
        
        // Console output
        switch (level) {
            case 'error':
                console.error(`[C4ISR] ${message}`);
                break;
            case 'warning':
                console.warn(`[C4ISR] ${message}`);
                break;
            case 'success':
                console.log(`[C4ISR] ✅ ${message}`);
                break;
            default:
                console.log(`[C4ISR] ${message}`);
        }
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
                    this.log(`Error in event handler for ${event}: ${error.message}`, 'error');
                }
            });
        }
    }
    
    /**
     * Get system status
     */
    getSystemStatus() {
        return {
            isInitialized: this.isInitialized,
            isRunning: this.isRunning,
            uptime: Date.now() - this.performanceMetrics.startTime,
            performance: this.performanceMetrics,
            logEntries: this.systemLog.length
        };
    }
    
    /**
     * Export system log
     */
    exportLog(format = 'json') {
        switch (format) {
            case 'json':
                return JSON.stringify(this.systemLog, null, 2);
            case 'csv':
                const csv = this.systemLog.map(entry => 
                    `${entry.timestamp},${entry.level},${entry.message}`
                ).join('\n');
                return `timestamp,level,message\n${csv}`;
            default:
                return this.systemLog.map(entry => 
                    `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`
                ).join('\n');
        }
    }
    
    /**
     * Shutdown the application
     */
    async shutdown() {
        this.log('Shutting down C4ISR application...', 'info');
        
        try {
            // Stop all components
            if (this.components.dataSourceManager) {
                this.components.dataSourceManager.stopAllSources();
            }
            
            if (this.components.threatDetection) {
                this.components.threatDetection.stopMonitoring();
            }
            
            this.isRunning = false;
            this.log('C4ISR application shutdown complete', 'success');
            
        } catch (error) {
            this.log(`Error during shutdown: ${error.message}`, 'error');
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = C4ISRApplication;
} else {
    window.C4ISRApplication = C4ISRApplication;
}