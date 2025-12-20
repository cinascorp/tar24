/**
 * C4ISR Military Tracking System v2.0.0 - Map Controller
 * Enhanced 2D map visualization with military-grade features
 * 
 * Features:
 * - High-performance flight tracking
 * - Multiple map layers and styles
 * - Military aircraft identification
 * - Threat visualization
 * - Real-time updates
 * - Performance optimization
 */

class MapController {
    constructor() {
        this.isInitialized = false;
        this.map = null;
        this.flightMarkers = new Map();
        this.threatMarkers = new Map();
        this.layers = new Map();
        this.currentView = '2d';
        this.isVisible = true;
        
        // Performance optimization
        this.markerCluster = null;
        this.updateQueue = [];
        this.isUpdating = false;
        this.lastUpdate = 0;
        this.updateInterval = 100; // ms
        
        // Flight tracking
        this.flightPaths = new Map();
        this.pathHistory = new Map();
        this.maxPathPoints = 100;
        
        // Event listeners
        this.eventListeners = new Map();
        
        // Configuration
        this.config = {
            maxMarkers: 50000,
            clusterDistance: 50,
            pathLength: 20,
            threatColors: {
                low: '#00ff41',
                medium: '#ffaa00',
                high: '#ff0000',
                critical: '#8b0000'
            }
        };
    }
    
    /**
     * Initialize the map controller
     */
    async initialize() {
        try {
            console.log('🔧 Initializing Map Controller...');
            
            // Wait for DOM to be ready
            if (!document.getElementById('map')) {
                throw new Error('Map container not found');
            }
            
            // Initialize the map
            await this.initializeMap();
            
            // Setup map layers
            this.setupMapLayers();
            
            // Setup marker clustering
            this.setupMarkerClustering();
            
            // Setup event listeners
            this.setupEventListeners();
            
            this.isInitialized = true;
            console.log('✅ Map Controller initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize Map Controller:', error);
            throw error;
        }
    }
    
    /**
     * Initialize the Leaflet map
     */
    async initializeMap() {
        const mapContainer = document.getElementById('map');
        
        // Create map with military-optimized settings
        this.map = L.map('map', {
            center: C4ISR_CONFIG.MAP.DEFAULT_CENTER,
            zoom: C4ISR_CONFIG.MAP.DEFAULT_ZOOM,
            minZoom: C4ISR_CONFIG.MAP.MIN_ZOOM,
            maxZoom: C4ISR_CONFIG.MAP.MAX_ZOOM,
            zoomControl: true,
            attributionControl: true,
            fadeAnimation: true,
            zoomAnimation: true,
            markerZoomAnimation: true,
            preferCanvas: true, // Better performance for many markers
            renderer: L.canvas({ padding: 0.5 })
        });
        
        // Add default tile layer
        const defaultLayer = L.tileLayer(
            C4ISR_CONFIG.MAP.TILE_LAYERS.OPENSTREETMAP.url,
            {
                attribution: C4ISR_CONFIG.MAP.TILE_LAYERS.OPENSTREETMAP.attribution,
                maxZoom: C4ISR_CONFIG.MAP.MAX_ZOOM,
                updateWhenIdle: true,
                updateWhenZooming: false
            }
        );
        
        defaultLayer.addTo(this.map);
        this.layers.set('base', defaultLayer);
        
        // Setup map events
        this.map.on('click', this.onMapClick.bind(this));
        this.map.on('zoomend', this.onZoomEnd.bind(this));
        this.map.on('moveend', this.onMoveEnd.bind(this));
        
        console.log('✅ Map initialized');
    }
    
    /**
     * Setup map layers
     */
    setupMapLayers() {
        // Satellite layer
        const satelliteLayer = L.tileLayer(
            C4ISR_CONFIG.MAP.TILE_LAYERS.SATELLITE.url,
            {
                attribution: C4ISR_CONFIG.MAP.TILE_LAYERS.SATELLITE.attribution,
                maxZoom: C4ISR_CONFIG.MAP.MAX_ZOOM
            }
        );
        this.layers.set('satellite', satelliteLayer);
        
        // Terrain layer
        const terrainLayer = L.tileLayer(
            C4ISR_CONFIG.MAP.TILE_LAYERS.TERRAIN.url,
            {
                attribution: C4ISR_CONFIG.MAP.TILE_LAYERS.TERRAIN.attribution,
                maxZoom: C4ISR_CONFIG.MAP.MAX_ZOOM
            }
        );
        this.layers.set('terrain', terrainLayer);
        
        // High contrast layer
        const highContrastLayer = L.tileLayer(
            C4ISR_CONFIG.MAP.TILE_LAYERS.HIGH_CONTRAST.url,
            {
                attribution: C4ISR_CONFIG.MAP.TILE_LAYERS.HIGH_CONTRAST.attribution,
                maxZoom: C4ISR_CONFIG.MAP.MAX_ZOOM
            }
        );
        this.layers.set('high-contrast', highContrastLayer);
        
        console.log('✅ Map layers setup complete');
    }
    
    /**
     * Setup marker clustering for performance
     */
    setupMarkerClustering() {
        // Create marker cluster group
        this.markerCluster = L.markerClusterGroup({
            chunkedLoading: true,
            chunkInterval: 200,
            chunkDelay: 50,
            maxClusterRadius: this.config.clusterDistance,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            disableClusteringAtZoom: 15,
            removeOutsideVisibleBounds: true,
            animate: false // Disable animations for better performance
        });
        
        this.map.addLayer(this.markerCluster);
        console.log('✅ Marker clustering setup complete');
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for data updates
        this.addEventListener('dataUpdated', this.onDataUpdated.bind(this));
        this.addEventListener('threatDetected', this.onThreatDetected.bind(this));
        
        console.log('✅ Event listeners setup complete');
    }
    
    /**
     * Show the map
     */
    show() {
        if (this.map) {
            this.map.invalidateSize();
            this.isVisible = true;
        }
    }
    
    /**
     * Hide the map
     */
    hide() {
        this.isVisible = false;
    }
    
    /**
     * Update flights on the map
     */
    updateFlights(flights) {
        if (!this.isInitialized || !this.isVisible) {
            return;
        }
        
        // Add to update queue for performance
        this.updateQueue.push({
            type: 'flights',
            data: flights,
            timestamp: Date.now()
        });
        
        // Process queue if not already updating
        if (!this.isUpdating) {
            this.processUpdateQueue();
        }
    }
    
    /**
     * Process the update queue
     */
    async processUpdateQueue() {
        if (this.isUpdating || this.updateQueue.length === 0) {
            return;
        }
        
        this.isUpdating = true;
        
        while (this.updateQueue.length > 0) {
            const update = this.updateQueue.shift();
            
            try {
                switch (update.type) {
                    case 'flights':
                        await this.processFlightUpdate(update.data);
                        break;
                    case 'threats':
                        await this.processThreatUpdate(update.data);
                        break;
                }
            } catch (error) {
                console.error('❌ Error processing update:', error);
            }
        }
        
        this.isUpdating = false;
        
        // Schedule next update
        setTimeout(() => {
            if (this.updateQueue.length > 0) {
                this.processUpdateQueue();
            }
        }, this.updateInterval);
    }
    
    /**
     * Process flight updates
     */
    async processFlightUpdate(flights) {
        const currentTime = Date.now();
        
        // Update existing markers and add new ones
        flights.forEach(flight => {
            if (!flight.icao24) return;
            
            const marker = this.flightMarkers.get(flight.icao24);
            
            if (marker) {
                // Update existing marker
                this.updateFlightMarker(marker, flight);
            } else {
                // Create new marker
                this.createFlightMarker(flight);
            }
            
            // Update flight path
            this.updateFlightPath(flight);
        });
        
        // Remove old markers (flights no longer in data)
        this.cleanupOldMarkers(flights);
        
        this.lastUpdate = currentTime;
    }
    
    /**
     * Create a new flight marker
     */
    createFlightMarker(flight) {
        if (!flight.lat || !flight.lon) return;
        
        // Create custom icon based on aircraft type
        const icon = this.createFlightIcon(flight);
        
        // Create marker
        const marker = L.marker([flight.lat, flight.lon], {
            icon: icon,
            title: flight.callsign || flight.icao24,
            zIndexOffset: this.getMarkerZIndex(flight)
        });
        
        // Add popup with flight information
        const popup = this.createFlightPopup(flight);
        marker.bindPopup(popup);
        
        // Add click event
        marker.on('click', () => {
            this.onFlightClick(flight);
        });
        
        // Store marker
        this.flightMarkers.set(flight.icao24, marker);
        
        // Add to cluster group
        this.markerCluster.addLayer(marker);
    }
    
    /**
     * Update an existing flight marker
     */
    updateFlightMarker(marker, flight) {
        if (!flight.lat || !flight.lon) return;
        
        // Update position
        marker.setLatLng([flight.lat, flight.lon]);
        
        // Update icon if needed
        const newIcon = this.createFlightIcon(flight);
        marker.setIcon(newIcon);
        
        // Update popup
        const popup = this.createFlightPopup(flight);
        marker.getPopup().setContent(popup);
        
        // Update z-index
        marker.setZIndexOffset(this.getMarkerZIndex(flight));
    }
    
    /**
     * Create flight icon based on aircraft type and threat level
     */
    createFlightIcon(flight) {
        const size = this.getIconSize(flight);
        const color = this.getIconColor(flight);
        
        // Create SVG icon
        const svg = `
            <svg width="${size[0]}" height="${size[1]}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="${color}" stroke="#000" stroke-width="1"/>
                <circle cx="12" cy="12" r="2" fill="${color}"/>
                ${flight.military ? '<rect x="10" y="10" width="4" height="4" fill="#ff0000" opacity="0.8"/>' : ''}
            </svg>
        `;
        
        return L.divIcon({
            html: svg,
            className: 'flight-marker',
            iconSize: size,
            iconAnchor: [size[0] / 2, size[1] / 2]
        });
    }
    
    /**
     * Get icon size based on aircraft type
     */
    getIconSize(flight) {
        if (flight.military) return [32, 32];
        if (flight.type === 'uav') return [28, 28];
        if (flight.type === 'commercial') return [24, 24];
        return [20, 20];
    }
    
    /**
     * Get icon color based on threat level
     */
    getIconColor(flight) {
        return this.config.threatColors[flight.threat_level] || '#888888';
    }
    
    /**
     * Get marker z-index based on threat level
     */
    getMarkerZIndex(flight) {
        const zIndexMap = {
            critical: 1000,
            high: 800,
            medium: 600,
            low: 400
        };
        return zIndexMap[flight.threat_level] || 200;
    }
    
    /**
     * Create flight popup content
     */
    createFlightPopup(flight) {
        return `
            <div class="flight-popup">
                <h3>${flight.callsign || 'Unknown'}</h3>
                <p><strong>ICAO24:</strong> ${flight.icao24 || 'N/A'}</p>
                <p><strong>Type:</strong> ${flight.type || 'Unknown'}</p>
                <p><strong>Altitude:</strong> ${flight.altitude ? `${flight.altitude} ft` : 'N/A'}</p>
                <p><strong>Speed:</strong> ${flight.speed ? `${flight.speed} kts` : 'N/A'}</p>
                <p><strong>Heading:</strong> ${flight.heading ? `${flight.heading}°` : 'N/A'}</p>
                <p><strong>Threat Level:</strong> <span style="color: ${this.getIconColor(flight)}">${flight.threat_level.toUpperCase()}</span></p>
                ${flight.military ? '<p><strong>Military Aircraft</strong></p>' : ''}
            </div>
        `;
    }
    
    /**
     * Update flight path
     */
    updateFlightPath(flight) {
        if (!flight.icao24 || !flight.lat || !flight.lon) return;
        
        let path = this.flightPaths.get(flight.icao24);
        
        if (!path) {
            // Create new path
            path = L.polyline([], {
                color: this.getIconColor(flight),
                weight: 2,
                opacity: 0.7,
                dashArray: flight.military ? '5,5' : '1,0'
            });
            
            this.flightPaths.set(flight.icao24, path);
            this.map.addLayer(path);
        }
        
        // Add new point
        const point = [flight.lat, flight.lon];
        path.addLatLng(point);
        
        // Limit path length
        const latlngs = path.getLatLngs();
        if (latlngs.length > this.config.pathLength) {
            path.setLatLngs(latlngs.slice(-this.config.pathLength));
        }
    }
    
    /**
     * Cleanup old markers
     */
    cleanupOldMarkers(activeFlights) {
        const activeIds = new Set(activeFlights.map(f => f.icao24));
        const currentTime = Date.now();
        const maxAge = 60000; // 1 minute
        
        for (const [icao24, marker] of this.flightMarkers.entries()) {
            if (!activeIds.has(icao24)) {
                // Remove marker
                this.markerCluster.removeLayer(marker);
                this.flightMarkers.delete(icao24);
                
                // Remove path
                const path = this.flightPaths.get(icao24);
                if (path) {
                    this.map.removeLayer(path);
                    this.flightPaths.delete(icao24);
                }
            }
        }
    }
    
    /**
     * Toggle map layer
     */
    toggleLayer(layerName, enabled) {
        const layer = this.layers.get(layerName);
        if (!layer) return;
        
        if (enabled) {
            if (!this.map.hasLayer(layer)) {
                layer.addTo(this.map);
            }
        } else {
            if (this.map.hasLayer(layer)) {
                this.map.removeLayer(layer);
            }
        }
    }
    
    /**
     * Handle map click events
     */
    onMapClick(event) {
        // Emit map click event
        this.emit('mapClick', {
            latlng: event.latlng,
            originalEvent: event.originalEvent
        });
    }
    
    /**
     * Handle zoom end events
     */
    onZoomEnd(event) {
        const zoom = this.map.getZoom();
        
        // Adjust clustering based on zoom level
        if (zoom >= 15) {
            this.markerCluster.options.disableClusteringAtZoom = zoom;
        }
        
        // Emit zoom event
        this.emit('zoomChanged', { zoom });
    }
    
    /**
     * Handle move end events
     */
    onMoveEnd(event) {
        const bounds = this.map.getBounds();
        
        // Emit move event
        this.emit('mapMoved', { bounds });
    }
    
    /**
     * Handle flight click events
     */
    onFlightClick(flight) {
        // Emit flight click event
        this.emit('flightClick', { flight });
    }
    
    /**
     * Handle data updates
     */
    onDataUpdated(data) {
        if (data.flights) {
            this.updateFlights(data.flights);
        }
    }
    
    /**
     * Handle threat detection
     */
    onThreatDetected(threat) {
        // Add threat marker
        this.addThreatMarker(threat);
    }
    
    /**
     * Add threat marker
     */
    addThreatMarker(threat) {
        if (!threat.location || !threat.location.lat || !threat.location.lon) return;
        
        const icon = L.divIcon({
            html: `
                <div style="
                    width: 20px; 
                    height: 20px; 
                    background: ${this.config.threatColors[threat.level]}; 
                    border: 2px solid #fff; 
                    border-radius: 50%; 
                    animation: pulse 1s infinite;
                "></div>
            `,
            className: 'threat-marker',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        
        const marker = L.marker([threat.location.lat, threat.location.lon], {
            icon: icon,
            title: `Threat: ${threat.reason}`
        });
        
        const popup = `
            <div class="threat-popup">
                <h3>Threat Detected</h3>
                <p><strong>Level:</strong> ${threat.level.toUpperCase()}</p>
                <p><strong>Reason:</strong> ${threat.reason}</p>
                <p><strong>Aircraft:</strong> ${threat.callsign || threat.icao24 || 'Unknown'}</p>
                <p><strong>Time:</strong> ${new Date(threat.timestamp).toLocaleTimeString()}</p>
            </div>
        `;
        
        marker.bindPopup(popup);
        this.map.addLayer(marker);
        
        // Store threat marker
        this.threatMarkers.set(threat.icao24, marker);
        
        // Remove after 30 seconds
        setTimeout(() => {
            if (this.threatMarkers.has(threat.icao24)) {
                this.map.removeLayer(marker);
                this.threatMarkers.delete(threat.icao24);
            }
        }, 30000);
    }
    
    /**
     * Get map bounds
     */
    getBounds() {
        return this.map ? this.map.getBounds() : null;
    }
    
    /**
     * Get map center
     */
    getCenter() {
        return this.map ? this.map.getCenter() : null;
    }
    
    /**
     * Get map zoom level
     */
    getZoom() {
        return this.map ? this.map.getZoom() : null;
    }
    
    /**
     * Set map view
     */
    setView(latlng, zoom) {
        if (this.map) {
            this.map.setView(latlng, zoom);
        }
    }
    
    /**
     * Fit map to bounds
     */
    fitBounds(bounds, options = {}) {
        if (this.map) {
            this.map.fitBounds(bounds, options);
        }
    }
    
    /**
     * Clear all markers
     */
    clearMarkers() {
        // Clear flight markers
        this.flightMarkers.forEach(marker => {
            this.markerCluster.removeLayer(marker);
        });
        this.flightMarkers.clear();
        
        // Clear threat markers
        this.threatMarkers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.threatMarkers.clear();
        
        // Clear flight paths
        this.flightPaths.forEach(path => {
            this.map.removeLayer(path);
        });
        this.flightPaths.clear();
    }
    
    /**
     * Get performance statistics
     */
    getPerformanceStats() {
        return {
            markers: this.flightMarkers.size,
            threats: this.threatMarkers.size,
            paths: this.flightPaths.size,
            queueSize: this.updateQueue.length,
            lastUpdate: this.lastUpdate
        };
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
     * Shutdown the map controller
     */
    shutdown() {
        console.log('🛑 Shutting down Map Controller...');
        
        // Clear all markers and layers
        this.clearMarkers();
        
        // Remove map
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
        
        // Clear data structures
        this.flightMarkers.clear();
        this.threatMarkers.clear();
        this.flightPaths.clear();
        this.layers.clear();
        this.updateQueue = [];
        
        // Clear event listeners
        this.eventListeners.clear();
        
        console.log('✅ Map Controller shutdown complete');
    }
}

// Add CSS for marker animations
const style = document.createElement('style');
style.textContent = `
    .flight-marker {
        transition: all 0.3s ease;
    }
    
    .threat-marker {
        z-index: 1000 !important;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.7; }
        100% { transform: scale(1); opacity: 1; }
    }
    
    .flight-popup, .threat-popup {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 14px;
        line-height: 1.4;
    }
    
    .flight-popup h3, .threat-popup h3 {
        margin: 0 0 10px 0;
        color: #00ff41;
        font-size: 16px;
    }
    
    .flight-popup p, .threat-popup p {
        margin: 5px 0;
    }
`;
document.head.appendChild(style);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MapController;
} else {
    window.MapController = MapController;
}