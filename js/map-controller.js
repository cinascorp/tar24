/**
 * C4ISR Map Controller
 * Handles 2D map visualization and flight tracking
 */

class MapController {
    constructor() {
        this.isInitialized = false;
        this.map = null;
        this.isActive = false;
        this.flightMarkers = new Map();
        this.flightPaths = new Map();
        this.currentFilters = {
            altitude: { min: 0, max: 60000 },
            speed: { min: 0, max: 2000 },
            aircraftType: 'all',
            threatLevel: 'all'
        };
        this.activeLayers = new Set();
        this.updateInterval = null;
    }
    
    async initialize() {
        try {
            // Initialize Leaflet map
            this.map = L.map('2d-map', {
                center: C4ISR_CONFIG.MAP.DEFAULT_CENTER,
                zoom: C4ISR_CONFIG.MAP.DEFAULT_ZOOM,
                minZoom: C4ISR_CONFIG.MAP.MIN_ZOOM,
                maxZoom: C4ISR_CONFIG.MAP.MAX_ZOOM,
                zoomControl: false
            });
            
            // Add default tile layer
            this.addTileLayer('OPENSTREETMAP');
            
            // Setup map events
            this.setupMapEvents();
            
            // Start data updates
            this.startDataUpdates();
            
            this.isInitialized = true;
            console.log('Map controller initialized successfully');
            return true;
            
        } catch (error) {
            console.error('Failed to initialize map controller:', error);
            throw error;
        }
    }
    
    /**
     * Add tile layer to map
     */
    addTileLayer(layerType) {
        const layerConfig = C4ISR_CONFIG.MAP.TILE_LAYERS[layerType];
        if (!layerConfig) return;
        
        const tileLayer = L.tileLayer(layerConfig.url, {
            attribution: layerConfig.attribution,
            maxZoom: C4ISR_CONFIG.MAP.MAX_ZOOM
        });
        
        tileLayer.addTo(this.map);
        this.activeLayers.add(layerType);
    }
    
    /**
     * Setup map event listeners
     */
    setupMapEvents() {
        // Zoom change event
        this.map.on('zoomend', () => {
            const zoom = this.map.getZoom();
            window.dispatchEvent(new CustomEvent('zoomChanged', { detail: { zoom } }));
        });
        
        // View change event
        this.map.on('moveend', () => {
            const center = this.map.getCenter();
            window.dispatchEvent(new CustomEvent('mapViewChanged', { 
                detail: { center: [center.lat, center.lng] } 
            }));
        });
    }
    
    /**
     * Start data updates
     */
    startDataUpdates() {
        this.updateInterval = setInterval(() => {
            this.updateFlightData();
        }, 5000); // Update every 5 seconds
    }
    
    /**
     * Update flight data on map
     */
    updateFlightData() {
        if (!this.isActive || !window.dataSourceManager) return;
        
        const combinedData = window.dataSourceManager.getCombinedData();
        if (!combinedData || !combinedData.flights) return;
        
        // Clear old markers
        this.clearFlightMarkers();
        
        // Add new flight markers
        combinedData.flights.forEach(flight => {
            if (this.shouldDisplayFlight(flight)) {
                this.addFlightMarker(flight);
            }
        });
        
        // Update flight count
        const flightCount = document.getElementById('flight-count');
        if (flightCount) {
            flightCount.textContent = `${combinedData.totalFlights} Flights`;
        }
    }
    
    /**
     * Check if flight should be displayed based on filters
     */
    shouldDisplayFlight(flight) {
        const filters = this.currentFilters;
        
        // Altitude filter
        if (flight.altitude < filters.altitude.min || flight.altitude > filters.altitude.max) {
            return false;
        }
        
        // Speed filter
        if (flight.speed < filters.speed.min || flight.speed > filters.speed.max) {
            return false;
        }
        
        // Aircraft type filter
        if (filters.aircraftType !== 'all' && flight.type !== filters.aircraftType) {
            return false;
        }
        
        // Threat level filter
        if (filters.threatLevel !== 'all' && flight.threatLevel !== filters.threatLevel) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Add flight marker to map
     */
    addFlightMarker(flight) {
        if (!flight.latitude || !flight.longitude) return;
        
        const icon = this.createFlightIcon(flight);
        const marker = L.marker([flight.latitude, flight.longitude], { icon })
            .bindPopup(this.createFlightPopup(flight))
            .on('click', () => {
                window.dispatchEvent(new CustomEvent('flightSelected', { 
                    detail: { flight } 
                }));
            });
        
        marker.addTo(this.map);
        this.flightMarkers.set(flight.id, marker);
    }
    
    /**
     * Create flight icon based on type
     */
    createFlightIcon(flight) {
        const iconConfig = C4ISR_CONFIG.MAP.FLIGHT_ICONS[flight.type.toUpperCase()] || 
                          C4ISR_CONFIG.MAP.FLIGHT_ICONS.UNKNOWN;
        
        return L.divIcon({
            className: `flight-marker flight-${flight.type}`,
            html: `<i class="fas fa-plane" style="color: ${iconConfig.color}; font-size: ${iconConfig.size[0]}px;"></i>`,
            iconSize: iconConfig.size,
            iconAnchor: [iconConfig.size[0] / 2, iconConfig.size[1] / 2]
        });
    }
    
    /**
     * Create flight popup content
     */
    createFlightPopup(flight) {
        return `
            <div class="flight-popup">
                <h4>${flight.callsign}</h4>
                <p><strong>Type:</strong> ${flight.type}</p>
                <p><strong>Altitude:</strong> ${flight.altitude} ft</p>
                <p><strong>Speed:</strong> ${flight.speed} kts</p>
                <p><strong>Heading:</strong> ${flight.heading}°</p>
                <p><strong>Threat:</strong> <span class="threat-${flight.threatLevel}">${flight.threatLevel}</span></p>
                <p><strong>Source:</strong> ${flight.source}</p>
            </div>
        `;
    }
    
    /**
     * Clear all flight markers
     */
    clearFlightMarkers() {
        this.flightMarkers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.flightMarkers.clear();
    }
    
    /**
     * Activate map controller
     */
    activate() {
        this.isActive = true;
        if (this.map) {
            this.map.invalidateSize();
        }
    }
    
    /**
     * Deactivate map controller
     */
    deactivate() {
        this.isActive = false;
    }
    
    /**
     * Toggle map layer
     */
    toggleLayer(layerName, enabled) {
        if (enabled) {
            this.addTileLayer(layerName.toUpperCase());
        } else {
            this.activeLayers.delete(layerName.toUpperCase());
        }
    }
    
    /**
     * Apply altitude filter
     */
    applyAltitudeFilter(min, max) {
        this.currentFilters.altitude = { min: parseInt(min) || 0, max: parseInt(max) || 60000 };
        this.updateFlightData();
    }
    
    /**
     * Apply speed filter
     */
    applySpeedFilter(min, max) {
        this.currentFilters.speed = { min: parseInt(min) || 0, max: parseInt(max) || 2000 };
        this.updateFlightData();
    }
    
    /**
     * Apply aircraft type filter
     */
    applyAircraftTypeFilter(type) {
        this.currentFilters.aircraftType = type;
        this.updateFlightData();
    }
    
    /**
     * Apply threat filter
     */
    applyThreatFilter(level) {
        this.currentFilters.threatLevel = level;
        this.updateFlightData();
    }
    
    /**
     * Map controls
     */
    zoomIn() {
        if (this.map) {
            this.map.zoomIn();
        }
    }
    
    zoomOut() {
        if (this.map) {
            this.map.zoomOut();
        }
    }
    
    resetView() {
        if (this.map) {
            this.map.setView(C4ISR_CONFIG.MAP.DEFAULT_CENTER, C4ISR_CONFIG.MAP.DEFAULT_ZOOM);
        }
    }
    
    /**
     * Health check
     */
    isHealthy() {
        return this.isInitialized && this.map !== null;
    }
    
    /**
     * Shutdown
     */
    shutdown() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
        
        this.isInitialized = false;
        this.isActive = false;
    }
}

// Create global instance
window.mapController = new MapController();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MapController;
}