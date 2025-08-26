/**
 * C4ISR Flight Tracker
 * Manages flight data tracking and analysis
 */

class FlightTracker {
    constructor() {
        this.isInitialized = true;
        this.flights = new Map();
        this.isTracking = false;
        this.flightHistory = new Map();
        this.threatFlights = new Set();
        this.updateInterval = null;
        this.maxHistoryLength = 1000;
    }
    
    /**
     * Start flight tracking
     */
    startTracking() {
        if (this.isTracking) return;
        
        this.isTracking = true;
        this.updateInterval = setInterval(() => {
            this.updateFlightPositions();
            this.analyzeFlightPatterns();
            this.detectThreats();
        }, 2000); // Update every 2 seconds
        
        console.log('Flight tracking started');
    }
    
    /**
     * Stop flight tracking
     */
    stopTracking() {
        if (!this.isTracking) return;
        
        this.isTracking = false;
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        
        console.log('Flight tracking stopped');
    }
    
    /**
     * Add or update flight data
     */
    addFlight(flightData) {
        if (!flightData || !flightData.id) return;
        
        const existingFlight = this.flights.get(flightData.id);
        
        if (existingFlight) {
            // Update existing flight
            this.updateFlightData(flightData.id, flightData);
        } else {
            // Add new flight
            this.flights.set(flightData.id, {
                ...flightData,
                firstSeen: new Date(),
                lastUpdate: new Date(),
                positionHistory: []
            });
            
            // Initialize history
            this.flightHistory.set(flightData.id, []);
        }
        
        // Add to position history
        this.addToHistory(flightData.id, flightData);
    }
    
    /**
     * Update flight data
     */
    updateFlightData(flightId, newData) {
        const flight = this.flights.get(flightId);
        if (!flight) return;
        
        // Update flight data
        Object.assign(flight, newData);
        flight.lastUpdate = new Date();
        
        // Check if flight is still active (within last 5 minutes)
        const timeSinceUpdate = Date.now() - flight.lastUpdate.getTime();
        if (timeSinceUpdate > 300000) { // 5 minutes
            this.removeFlight(flightId);
        }
    }
    
    /**
     * Add position to flight history
     */
    addToHistory(flightId, flightData) {
        const history = this.flightHistory.get(flightId);
        if (!history) return;
        
        const position = {
            latitude: flightData.latitude,
            longitude: flightData.longitude,
            altitude: flightData.altitude,
            speed: flightData.speed,
            heading: flightData.heading,
            timestamp: new Date()
        };
        
        history.push(position);
        
        // Limit history length
        if (history.length > this.maxHistoryLength) {
            history.shift();
        }
    }
    
    /**
     * Remove flight from tracking
     */
    removeFlight(flightId) {
        this.flights.delete(flightId);
        this.flightHistory.delete(flightId);
        this.threatFlights.delete(flightId);
        
        console.log(`Flight ${flightId} removed from tracking`);
    }
    
    /**
     * Get all tracked flights
     */
    getFlights() {
        return Array.from(this.flights.values());
    }
    
    /**
     * Get flight by ID
     */
    getFlightById(flightId) {
        return this.flights.get(flightId);
    }
    
    /**
     * Get flight history
     */
    getFlightHistory(flightId) {
        return this.flightHistory.get(flightId) || [];
    }
    
    /**
     * Get threat flights
     */
    getThreatFlights() {
        return Array.from(this.threatFlights).map(id => this.flights.get(id)).filter(Boolean);
    }
    
    /**
     * Update flight positions
     */
    updateFlightPositions() {
        const now = Date.now();
        const staleFlights = [];
        
        this.flights.forEach((flight, flightId) => {
            const timeSinceUpdate = now - flight.lastUpdate.getTime();
            
            // Mark flights as stale if no update in 5 minutes
            if (timeSinceUpdate > 300000) {
                staleFlights.push(flightId);
            }
        });
        
        // Remove stale flights
        staleFlights.forEach(flightId => {
            this.removeFlight(flightId);
        });
    }
    
    /**
     * Analyze flight patterns
     */
    analyzeFlightPatterns() {
        this.flights.forEach((flight, flightId) => {
            const history = this.getFlightHistory(flightId);
            if (history.length < 3) return;
            
            // Analyze for suspicious patterns
            const patterns = this.detectSuspiciousPatterns(flight, history);
            
            if (patterns.length > 0) {
                console.warn(`Suspicious patterns detected for flight ${flightId}:`, patterns);
                this.threatFlights.add(flightId);
            }
        });
    }
    
    /**
     * Detect suspicious flight patterns
     */
    detectSuspiciousPatterns(flight, history) {
        const patterns = [];
        
        // Check for rapid altitude changes
        if (history.length >= 3) {
            const recent = history.slice(-3);
            const altitudeChanges = recent.map((pos, i) => 
                i > 0 ? Math.abs(pos.altitude - recent[i-1].altitude) : 0
            );
            
            const maxAltitudeChange = Math.max(...altitudeChanges);
            if (maxAltitudeChange > 5000) { // 5000 ft change in 6 seconds
                patterns.push('rapid_altitude_change');
            }
        }
        
        // Check for erratic heading changes
        if (history.length >= 5) {
            const recent = history.slice(-5);
            const headingChanges = recent.map((pos, i) => 
                i > 0 ? Math.abs(pos.heading - recent[i-1].heading) : 0
            );
            
            const maxHeadingChange = Math.max(...headingChanges);
            if (maxHeadingChange > 45) { // 45 degree change
                patterns.push('erratic_heading');
            }
        }
        
        // Check for unusual speed patterns
        if (history.length >= 3) {
            const recent = history.slice(-3);
            const speeds = recent.map(pos => pos.speed);
            const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
            
            if (avgSpeed > 800) { // Very high speed
                patterns.push('unusual_speed');
            }
        }
        
        return patterns;
    }
    
    /**
     * Detect threats
     */
    detectThreats() {
        this.flights.forEach((flight, flightId) => {
            // Check for high threat levels
            if (flight.threatLevel === 'high' || flight.threatLevel === 'critical') {
                this.threatFlights.add(flightId);
            }
            
            // Check for military aircraft in restricted areas
            if (flight.type === 'military') {
                const isInRestrictedArea = this.isInRestrictedArea(flight.latitude, flight.longitude);
                if (isInRestrictedArea) {
                    this.threatFlights.add(flightId);
                    console.warn(`Military aircraft ${flightId} detected in restricted area`);
                }
            }
        });
    }
    
    /**
     * Check if coordinates are in restricted area
     */
    isInRestrictedArea(lat, lon) {
        // Define restricted areas (example: around Tehran)
        const restrictedAreas = [
            {
                center: [35.6892, 51.3890], // Tehran
                radius: 50 // km
            }
        ];
        
        return restrictedAreas.some(area => {
            const distance = this.calculateDistance(lat, lon, area.center[0], area.center[1]);
            return distance <= area.radius;
        });
    }
    
    /**
     * Calculate distance between two points
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
    
    /**
     * Get flight statistics
     */
    getStatistics() {
        const flights = this.getFlights();
        const threatFlights = this.getThreatFlights();
        
        return {
            totalFlights: flights.length,
            threatFlights: threatFlights.length,
            militaryFlights: flights.filter(f => f.type === 'military').length,
            commercialFlights: flights.filter(f => f.type === 'commercial').length,
            privateFlights: flights.filter(f => f.type === 'private').length,
            uavFlights: flights.filter(f => f.type === 'uav').length,
            averageAltitude: flights.length > 0 ? 
                flights.reduce((sum, f) => sum + f.altitude, 0) / flights.length : 0,
            averageSpeed: flights.length > 0 ? 
                flights.reduce((sum, f) => sum + f.speed, 0) / flights.length : 0
        };
    }
    
    /**
     * Health check
     */
    isHealthy() {
        return this.isInitialized && this.isTracking;
    }
    
    /**
     * Shutdown
     */
    shutdown() {
        this.stopTracking();
        this.flights.clear();
        this.flightHistory.clear();
        this.threatFlights.clear();
        this.isInitialized = false;
    }
}

// Create global instance
window.flightTracker = new FlightTracker();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlightTracker;
}