/**
 * C4ISR Threat Detection System
 * AI-powered threat assessment and alerting system
 */

class ThreatDetectionSystem {
    constructor() {
        this.isInitialized = false;
        this.threats = [];
        this.threatLevel = 'LOW';
        this.analysisEngine = null;
        this.alertThresholds = {
            low: 0.3,
            medium: 0.6,
            high: 0.8,
            critical: 0.95
        };
        this.threatPatterns = new Map();
        this.isMonitoring = false;
        
        this.initialize();
    }
    
    async initialize() {
        try {
            console.log('Initializing Threat Detection System...');
            
            // Initialize AI analysis engine
            this.analysisEngine = new AIThreatAnalyzer();
            await this.analysisEngine.initialize();
            
            // Load threat patterns
            this.loadThreatPatterns();
            
            // Setup monitoring
            this.setupMonitoring();
            
            this.isInitialized = true;
            console.log('Threat Detection System initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize Threat Detection System:', error);
        }
    }
    
    /**
     * Load predefined threat patterns
     */
    loadThreatPatterns() {
        this.threatPatterns.set('military_aircraft', {
            name: 'Military Aircraft',
            risk: 0.7,
            indicators: ['military_callsign', 'military_icao', 'low_altitude', 'high_speed'],
            description: 'Military aircraft operating in civilian airspace'
        });
        
        this.threatPatterns.set('suspicious_behavior', {
            name: 'Suspicious Behavior',
            risk: 0.8,
            indicators: ['erratic_flight', 'unusual_altitude', 'speed_changes', 'heading_changes'],
            description: 'Aircraft displaying unusual or suspicious flight patterns'
        });
        
        this.threatPatterns.set('no_adsb', {
            name: 'No ADS-B Signal',
            risk: 0.6,
            indicators: ['no_transponder', 'no_adsb', 'stealth_mode'],
            description: 'Aircraft without ADS-B transponder signals'
        });
        
        this.threatPatterns.set('restricted_airspace', {
            name: 'Restricted Airspace Violation',
            risk: 0.9,
            indicators: ['restricted_zone', 'no_clearance', 'military_zone'],
            description: 'Aircraft entering restricted or military airspace'
        });
        
        this.threatPatterns.set('uav_threat', {
            name: 'UAV Threat',
            risk: 0.8,
            indicators: ['small_aircraft', 'low_altitude', 'slow_speed', 'hovering'],
            description: 'Unmanned aerial vehicle operating suspiciously'
        });
    }
    
    /**
     * Setup continuous monitoring
     */
    setupMonitoring() {
        this.isMonitoring = true;
        
        // Monitor for new threats every 5 seconds
        setInterval(() => {
            if (this.isMonitoring) {
                this.analyzeCurrentThreats();
            }
        }, 5000);
    }
    
    /**
     * Analyze flight data for threats
     */
    analyzeFlight(flightData) {
        if (!this.isInitialized || !this.analysisEngine) {
            return null;
        }
        
        try {
            const threatScore = this.analysisEngine.analyzeFlight(flightData);
            const threatLevel = this.calculateThreatLevel(threatScore);
            const detectedThreats = this.detectThreatPatterns(flightData);
            
            const threatAssessment = {
                flightId: flightData.id || flightData.callsign,
                threatScore: threatScore,
                threatLevel: threatLevel,
                detectedThreats: detectedThreats,
                timestamp: new Date().toISOString(),
                coordinates: flightData.coordinates,
                altitude: flightData.altitude,
                speed: flightData.speed
            };
            
            // Add to threats list
            this.threats.push(threatAssessment);
            
            // Update global threat level
            this.updateGlobalThreatLevel();
            
            // Trigger alerts if necessary
            this.triggerThreatAlerts(threatAssessment);
            
            return threatAssessment;
            
        } catch (error) {
            console.error('Error analyzing flight for threats:', error);
            return null;
        }
    }
    
    /**
     * Detect threat patterns in flight data
     */
    detectThreatPatterns(flightData) {
        const detectedThreats = [];
        
        for (const [patternId, pattern] of this.threatPatterns) {
            let matchScore = 0;
            let matchedIndicators = [];
            
            // Check each indicator
            for (const indicator of pattern.indicators) {
                if (this.checkIndicator(flightData, indicator)) {
                    matchScore += pattern.risk;
                    matchedIndicators.push(indicator);
                }
            }
            
            // If significant match, add to detected threats
            if (matchScore > 0.3) {
                detectedThreats.push({
                    pattern: patternId,
                    name: pattern.name,
                    risk: pattern.risk,
                    matchScore: matchScore,
                    indicators: matchedIndicators,
                    description: pattern.description
                });
            }
        }
        
        return detectedThreats;
    }
    
    /**
     * Check if flight data matches an indicator
     */
    checkIndicator(flightData, indicator) {
        switch (indicator) {
            case 'military_callsign':
                return flightData.callsign && /^[A-Z]{2,3}\d{3,4}$/.test(flightData.callsign);
            
            case 'military_icao':
                return flightData.icao24 && /^[0-9A-F]{6}$/.test(flightData.icao24);
            
            case 'low_altitude':
                return flightData.altitude && flightData.altitude < 1000;
            
            case 'high_speed':
                return flightData.speed && flightData.speed > 800;
            
            case 'no_transponder':
                return !flightData.icao24 || !flightData.callsign;
            
            case 'restricted_zone':
                return this.isInRestrictedZone(flightData.coordinates);
            
            case 'small_aircraft':
                return flightData.aircraft_type === 'UAV' || flightData.aircraft_type === 'DRONE';
            
            case 'hovering':
                return flightData.speed && flightData.speed < 50;
            
            default:
                return false;
        }
    }
    
    /**
     * Check if coordinates are in restricted zone
     */
    isInRestrictedZone(coordinates) {
        // Simplified restricted zone check
        // In a real system, this would check against a database of restricted areas
        if (!coordinates) return false;
        
        // Example: Check if near military bases or restricted areas
        const restrictedAreas = [
            { lat: 38.8977, lng: -77.0365, radius: 50 }, // Washington DC
            { lat: 40.7128, lng: -74.0060, radius: 30 }, // New York
            { lat: 51.5074, lng: -0.1278, radius: 40 }   // London
        ];
        
        for (const area of restrictedAreas) {
            const distance = this.calculateDistance(
                coordinates.lat, coordinates.lng,
                area.lat, area.lng
            );
            
            if (distance < area.radius) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Calculate distance between two coordinates
     */
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
    
    /**
     * Calculate threat level from score
     */
    calculateThreatLevel(threatScore) {
        if (threatScore >= this.alertThresholds.critical) return 'CRITICAL';
        if (threatScore >= this.alertThresholds.high) return 'HIGH';
        if (threatScore >= this.alertThresholds.medium) return 'MEDIUM';
        if (threatScore >= this.alertThresholds.low) return 'LOW';
        return 'NONE';
    }
    
    /**
     * Update global threat level
     */
    updateGlobalThreatLevel() {
        if (this.threats.length === 0) {
            this.threatLevel = 'LOW';
            return;
        }
        
        // Calculate average threat score
        const totalScore = this.threats.reduce((sum, threat) => sum + threat.threatScore, 0);
        const averageScore = totalScore / this.threats.length;
        
        // Update threat level
        this.threatLevel = this.calculateThreatLevel(averageScore);
        
        // Update UI
        this.updateThreatLevelUI();
    }
    
    /**
     * Update threat level in UI
     */
    updateThreatLevelUI() {
        const threatElement = document.getElementById('threat-level');
        if (threatElement) {
            threatElement.textContent = this.threatLevel;
            threatElement.className = `threat-value ${this.threatLevel.toLowerCase()}`;
        }
        
        // Update threats count
        const threatsElement = document.getElementById('threats-detected');
        if (threatsElement) {
            threatsElement.textContent = `Threats: ${this.threats.length}`;
        }
    }
    
    /**
     * Trigger threat alerts
     */
    triggerThreatAlerts(threatAssessment) {
        if (threatAssessment.threatLevel === 'CRITICAL' || threatAssessment.threatLevel === 'HIGH') {
            // Play alert sound
            this.playThreatAlert();
            
            // Show notification
            if (window.c4isrApp) {
                window.c4isrApp.showNotification(
                    'High Threat Detected',
                    `Threat level: ${threatAssessment.threatLevel} - ${threatAssessment.flightId}`,
                    'danger'
                );
            }
            
            // Dispatch threat event
            this.dispatchThreatEvent(threatAssessment);
        }
    }
    
    /**
     * Play threat alert sound
     */
    playThreatAlert() {
        const audio = document.getElementById('threat-alert');
        if (audio) {
            audio.play().catch(error => {
                console.log('Could not play threat alert audio:', error);
            });
        }
    }
    
    /**
     * Dispatch threat event
     */
    dispatchThreatEvent(threatAssessment) {
        const event = new CustomEvent('threatDetected', {
            detail: threatAssessment
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Analyze current threats
     */
    analyzeCurrentThreats() {
        // This would analyze all current flights for threats
        // For now, just update the UI
        this.updateThreatLevelUI();
    }
    
    /**
     * Get current threats
     */
    getCurrentThreats() {
        return this.threats.filter(threat => {
            const threatAge = Date.now() - new Date(threat.timestamp).getTime();
            return threatAge < 300000; // Threats from last 5 minutes
        });
    }
    
    /**
     * Get threat statistics
     */
    getThreatStats() {
        const currentThreats = this.getCurrentThreats();
        const stats = {
            total: currentThreats.length,
            critical: currentThreats.filter(t => t.threatLevel === 'CRITICAL').length,
            high: currentThreats.filter(t => t.threatLevel === 'HIGH').length,
            medium: currentThreats.filter(t => t.threatLevel === 'MEDIUM').length,
            low: currentThreats.filter(t => t.threatLevel === 'LOW').length,
            currentLevel: this.threatLevel
        };
        
        return stats;
    }
    
    /**
     * Check system health
     */
    isHealthy() {
        return this.isInitialized && this.analysisEngine && this.analysisEngine.isHealthy();
    }
    
    /**
     * Shutdown the system
     */
    shutdown() {
        this.isMonitoring = false;
        this.isInitialized = false;
        
        if (this.analysisEngine) {
            this.analysisEngine.shutdown();
        }
        
        console.log('Threat Detection System shutdown complete');
    }
}

/**
 * AI Threat Analyzer
 * Placeholder for AI-powered threat analysis
 */
class AIThreatAnalyzer {
    constructor() {
        this.isInitialized = false;
    }
    
    async initialize() {
        // Simulate AI model loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.isInitialized = true;
    }
    
    analyzeFlight(flightData) {
        // Simplified AI analysis - in reality this would use ML models
        let threatScore = 0;
        
        // Base score from aircraft type
        if (flightData.aircraft_type === 'MILITARY') threatScore += 0.3;
        if (flightData.aircraft_type === 'UAV') threatScore += 0.4;
        
        // Score from altitude
        if (flightData.altitude < 500) threatScore += 0.2;
        if (flightData.altitude > 40000) threatScore += 0.2;
        
        // Score from speed
        if (flightData.speed > 1000) threatScore += 0.2;
        if (flightData.speed < 100) threatScore += 0.3;
        
        // Score from location
        if (this.isInRestrictedZone(flightData.coordinates)) threatScore += 0.5;
        
        // Random factor for simulation
        threatScore += Math.random() * 0.1;
        
        return Math.min(threatScore, 1.0);
    }
    
    isInRestrictedZone(coordinates) {
        // Simplified check - same as main class
        if (!coordinates) return false;
        return false; // Simplified for demo
    }
    
    isHealthy() {
        return this.isInitialized;
    }
    
    shutdown() {
        this.isInitialized = false;
    }
}

// Create global instance
window.threatDetectionSystem = new ThreatDetectionSystem();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThreatDetectionSystem;
}