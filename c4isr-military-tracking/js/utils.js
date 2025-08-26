/**
 * C4ISR Military Tracking System - Utilities
 * 
 * Comprehensive utility functions for various system operations
 * Version: 2.0.0
 */

const Utils = {
    /**
     * Math and Calculation Utilities
     */
    Math: {
        /**
         * Calculate distance between two points using Haversine formula
         */
        calculateDistance(lat1, lon1, lat2, lon2) {
            const R = 6371; // Earth's radius in kilometers
            const dLat = this.toRadians(lat2 - lat1);
            const dLon = this.toRadians(lon2 - lon1);
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        },

        /**
         * Convert degrees to radians
         */
        toRadians(degrees) {
            return degrees * (Math.PI / 180);
        },

        /**
         * Convert radians to degrees
         */
        toDegrees(radians) {
            return radians * (180 / Math.PI);
        },

        /**
         * Calculate bearing between two points
         */
        calculateBearing(lat1, lon1, lat2, lon2) {
            const dLon = this.toRadians(lon2 - lon1);
            const lat1Rad = this.toRadians(lat1);
            const lat2Rad = this.toRadians(lat2);
            
            const y = Math.sin(dLon) * Math.cos(lat2Rad);
            const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
                Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
            
            let bearing = this.toDegrees(Math.atan2(y, x));
            return (bearing + 360) % 360;
        },

        /**
         * Interpolate between two values
         */
        lerp(start, end, factor) {
            return start + (end - start) * factor;
        },

        /**
         * Clamp value between min and max
         */
        clamp(value, min, max) {
            return Math.min(Math.max(value, min), max);
        },

        /**
         * Generate random number between min and max
         */
        random(min, max) {
            return Math.random() * (max - min) + min;
        },

        /**
         * Round to specified decimal places
         */
        round(value, decimals = 2) {
            const factor = Math.pow(10, decimals);
            return Math.round(value * factor) / factor;
        }
    },

    /**
     * Time and Date Utilities
     */
    Time: {
        /**
         * Format timestamp to readable string
         */
        formatTimestamp(timestamp, format = 'ISO') {
            const date = new Date(timestamp);
            switch (format) {
                case 'ISO':
                    return date.toISOString();
                case 'LOCAL':
                    return date.toLocaleString();
                case 'UTC':
                    return date.toUTCString();
                case 'TIME_ONLY':
                    return date.toLocaleTimeString();
                case 'DATE_ONLY':
                    return date.toLocaleDateString();
                case 'MILITARY':
                    return this.toMilitaryTime(date);
                default:
                    return date.toString();
            }
        },

        /**
         * Convert to military time format
         */
        toMilitaryTime(date) {
            const hours = date.getUTCHours().toString().padStart(2, '0');
            const minutes = date.getUTCMinutes().toString().padStart(2, '0');
            const seconds = date.getUTCSeconds().toString().padStart(2, '0');
            return `${hours}:${minutes}:${seconds}Z`;
        },

        /**
         * Get current timestamp
         */
        now() {
            return Date.now();
        },

        /**
         * Add time to timestamp
         */
        addTime(timestamp, amount, unit = 'ms') {
            const multipliers = {
                ms: 1,
                s: 1000,
                m: 60000,
                h: 3600000,
                d: 86400000
            };
            return timestamp + (amount * (multipliers[unit] || 1));
        },

        /**
         * Calculate time difference
         */
        diff(timestamp1, timestamp2, unit = 'ms') {
            const diff = Math.abs(timestamp1 - timestamp2);
            const multipliers = {
                ms: 1,
                s: 1000,
                m: 60000,
                h: 3600000,
                d: 86400000
            };
            return diff / (multipliers[unit] || 1);
        },

        /**
         * Check if timestamp is within range
         */
        isWithinRange(timestamp, start, end) {
            return timestamp >= start && timestamp <= end;
        }
    },

    /**
     * String Utilities
     */
    String: {
        /**
         * Generate unique ID
         */
        generateId(prefix = '', length = 8) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = prefix;
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        },

        /**
         * Capitalize first letter
         */
        capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        },

        /**
         * Convert to title case
         */
        toTitleCase(str) {
            return str.replace(/\w\S*/g, (txt) => 
                txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            );
        },

        /**
         * Sanitize string for HTML
         */
        sanitize(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        },

        /**
         * Truncate string
         */
        truncate(str, length, suffix = '...') {
            if (str.length <= length) return str;
            return str.substring(0, length) + suffix;
        },

        /**
         * Remove extra whitespace
         */
        cleanWhitespace(str) {
            return str.replace(/\s+/g, ' ').trim();
        },

        /**
         * Convert to slug
         */
        toSlug(str) {
            return str
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');
        }
    },

    /**
     * Array Utilities
     */
    Array: {
        /**
         * Remove duplicates from array
         */
        unique(arr, key = null) {
            if (key) {
                const seen = new Set();
                return arr.filter(item => {
                    const value = item[key];
                    if (seen.has(value)) return false;
                    seen.add(value);
                    return true;
                });
            }
            return [...new Set(arr)];
        },

        /**
         * Group array by key
         */
        groupBy(arr, key) {
            return arr.reduce((groups, item) => {
                const value = item[key];
                groups[value] = groups[value] || [];
                groups[value].push(item);
                return groups;
            }, {});
        },

        /**
         * Sort array by key
         */
        sortBy(arr, key, direction = 'asc') {
            return arr.sort((a, b) => {
                const aVal = a[key];
                const bVal = b[key];
                if (direction === 'desc') {
                    return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
                }
                return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
            });
        },

        /**
         * Filter array by multiple criteria
         */
        filterBy(arr, filters) {
            return arr.filter(item => {
                return Object.keys(filters).every(key => {
                    const filter = filters[key];
                    const value = item[key];
                    
                    if (typeof filter === 'function') {
                        return filter(value);
                    }
                    
                    if (Array.isArray(filter)) {
                        return filter.includes(value);
                    }
                    
                    return value === filter;
                });
            });
        },

        /**
         * Chunk array into smaller arrays
         */
        chunk(arr, size) {
            const chunks = [];
            for (let i = 0; i < arr.length; i += size) {
                chunks.push(arr.slice(i, i + size));
            }
            return chunks;
        },

        /**
         * Flatten nested array
         */
        flatten(arr) {
            return arr.reduce((flat, item) => {
                return flat.concat(Array.isArray(item) ? this.flatten(item) : item);
            }, []);
        }
    },

    /**
     * Object Utilities
     */
    Object: {
        /**
         * Deep clone object
         */
        deepClone(obj) {
            if (obj === null || typeof obj !== 'object') return obj;
            if (obj instanceof Date) return new Date(obj.getTime());
            if (obj instanceof Array) return obj.map(item => this.deepClone(item));
            if (typeof obj === 'object') {
                const copy = {};
                Object.keys(obj).forEach(key => {
                    copy[key] = this.deepClone(obj[key]);
                });
                return copy;
            }
        },

        /**
         * Deep merge objects
         */
        deepMerge(target, source) {
            const result = this.deepClone(target);
            
            if (source && typeof source === 'object') {
                Object.keys(source).forEach(key => {
                    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                        result[key] = this.deepMerge(result[key] || {}, source[key]);
                    } else {
                        result[key] = source[key];
                    }
                });
            }
            
            return result;
        },

        /**
         * Get nested property value
         */
        get(obj, path, defaultValue = null) {
            const keys = path.split('.');
            let current = obj;
            
            for (const key of keys) {
                if (current && typeof current === 'object' && key in current) {
                    current = current[key];
                } else {
                    return defaultValue;
                }
            }
            
            return current;
        },

        /**
         * Set nested property value
         */
        set(obj, path, value) {
            const keys = path.split('.');
            const lastKey = keys.pop();
            let current = obj;
            
            for (const key of keys) {
                if (!(key in current) || typeof current[key] !== 'object') {
                    current[key] = {};
                }
                current = current[key];
            }
            
            current[lastKey] = value;
            return obj;
        },

        /**
         * Check if object is empty
         */
        isEmpty(obj) {
            return Object.keys(obj).length === 0;
        },

        /**
         * Pick specific properties
         */
        pick(obj, keys) {
            const result = {};
            keys.forEach(key => {
                if (key in obj) {
                    result[key] = obj[key];
                }
            });
            return result;
        },

        /**
         * Omit specific properties
         */
        omit(obj, keys) {
            const result = this.deepClone(obj);
            keys.forEach(key => {
                delete result[key];
            });
            return result;
        }
    },

    /**
     * DOM Utilities
     */
    DOM: {
        /**
         * Query selector with error handling
         */
        $(selector, context = document) {
            try {
                return context.querySelector(selector);
            } catch (error) {
                console.error(`Invalid selector: ${selector}`, error);
                return null;
            }
        },

        /**
         * Query all with error handling
         */
        $$(selector, context = document) {
            try {
                return Array.from(context.querySelectorAll(selector));
            } catch (error) {
                console.error(`Invalid selector: ${selector}`, error);
                return [];
            }
        },

        /**
         * Create element with attributes
         */
        createElement(tag, attributes = {}, children = []) {
            const element = document.createElement(tag);
            
            Object.keys(attributes).forEach(key => {
                if (key === 'className') {
                    element.className = attributes[key];
                } else if (key === 'innerHTML') {
                    element.innerHTML = attributes[key];
                } else if (key === 'textContent') {
                    element.textContent = attributes[key];
                } else {
                    element.setAttribute(key, attributes[key]);
                }
            });
            
            children.forEach(child => {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                } else if (child instanceof Element) {
                    element.appendChild(child);
                }
            });
            
            return element;
        },

        /**
         * Add event listener with cleanup
         */
        addEventListener(element, event, handler, options = {}) {
            element.addEventListener(event, handler, options);
            return () => element.removeEventListener(event, handler, options);
        },

        /**
         * Get element position
         */
        getPosition(element) {
            const rect = element.getBoundingClientRect();
            return {
                x: rect.left + window.scrollX,
                y: rect.top + window.scrollY,
                width: rect.width,
                height: rect.height
            };
        },

        /**
         * Check if element is visible
         */
        isVisible(element) {
            const rect = element.getBoundingClientRect();
            return rect.top >= 0 && rect.left >= 0 &&
                rect.bottom <= window.innerHeight &&
                rect.right <= window.innerWidth;
        },

        /**
         * Smooth scroll to element
         */
        scrollTo(element, options = {}) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
                ...options
            });
        }
    },

    /**
     * Network Utilities
     */
    Network: {
        /**
         * Enhanced fetch with retry and timeout
         */
        async fetch(url, options = {}) {
            const defaultOptions = {
                timeout: 30000,
                retries: 3,
                retryDelay: 1000,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            
            const config = { ...defaultOptions, ...options };
            const { timeout, retries, retryDelay, ...fetchOptions } = config;
            
            for (let attempt = 0; attempt <= retries; attempt++) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), timeout);
                    
                    const response = await fetch(url, {
                        ...fetchOptions,
                        signal: controller.signal
                    });
                    
                    clearTimeout(timeoutId);
                    
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    
                    return response;
                } catch (error) {
                    if (attempt === retries) {
                        throw error;
                    }
                    
                    console.warn(`Fetch attempt ${attempt + 1} failed:`, error.message);
                    await this.delay(retryDelay * Math.pow(2, attempt));
                }
            }
        },

        /**
         * Check network connectivity
         */
        async checkConnectivity() {
            try {
                const response = await fetch('data:,', { method: 'HEAD' });
                return navigator.onLine;
            } catch {
                return false;
            }
        },

        /**
         * Get connection quality
         */
        getConnectionQuality() {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            if (!connection) return 'unknown';
            
            const effectiveType = connection.effectiveType;
            const rtt = connection.rtt || 0;
            const downlink = connection.downlink || 0;
            
            return {
                type: effectiveType,
                rtt: rtt,
                downlink: downlink,
                quality: this.qualifyConnection(effectiveType, rtt, downlink)
            };
        },

        /**
         * Qualify connection based on metrics
         */
        qualifyConnection(type, rtt, downlink) {
            if (type === '4g' && rtt < 100 && downlink > 10) return 'excellent';
            if (type === '3g' && rtt < 200 && downlink > 1) return 'good';
            if (type === '2g' || rtt > 500) return 'poor';
            return 'fair';
        },

        /**
         * Delay utility
         */
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    },

    /**
     * Storage Utilities
     */
    Storage: {
        /**
         * Set item in localStorage with expiration
         */
        setLocal(key, value, expirationMs = null) {
            const item = {
                value: value,
                timestamp: Date.now(),
                expiration: expirationMs ? Date.now() + expirationMs : null
            };
            
            try {
                localStorage.setItem(key, JSON.stringify(item));
                return true;
            } catch (error) {
                console.error('Failed to set localStorage item:', error);
                return false;
            }
        },

        /**
         * Get item from localStorage with expiration check
         */
        getLocal(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                if (!item) return defaultValue;
                
                const parsed = JSON.parse(item);
                
                if (parsed.expiration && Date.now() > parsed.expiration) {
                    localStorage.removeItem(key);
                    return defaultValue;
                }
                
                return parsed.value;
            } catch (error) {
                console.error('Failed to get localStorage item:', error);
                return defaultValue;
            }
        },

        /**
         * Remove item from localStorage
         */
        removeLocal(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('Failed to remove localStorage item:', error);
                return false;
            }
        },

        /**
         * Clear all localStorage items with prefix
         */
        clearLocal(prefix = '') {
            try {
                const keys = Object.keys(localStorage);
                keys.forEach(key => {
                    if (key.startsWith(prefix)) {
                        localStorage.removeItem(key);
                    }
                });
                return true;
            } catch (error) {
                console.error('Failed to clear localStorage:', error);
                return false;
            }
        },

        /**
         * Get localStorage usage
         */
        getLocalUsage() {
            let totalSize = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    totalSize += localStorage[key].length + key.length;
                }
            }
            return {
                used: totalSize,
                usedMB: Utils.Math.round(totalSize / (1024 * 1024), 2)
            };
        }
    },

    /**
     * Performance Utilities
     */
    Performance: {
        /**
         * Debounce function execution
         */
        debounce(func, delay) {
            let timeoutId;
            return function (...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
            };
        },

        /**
         * Throttle function execution
         */
        throttle(func, limit) {
            let inThrottle;
            return function (...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        /**
         * Measure execution time
         */
        measureTime(func, label = 'Execution') {
            const start = performance.now();
            const result = func();
            const end = performance.now();
            console.log(`${label} took ${Utils.Math.round(end - start, 2)}ms`);
            return result;
        },

        /**
         * Get memory usage (if available)
         */
        getMemoryUsage() {
            if (performance.memory) {
                return {
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize,
                    limit: performance.memory.jsHeapSizeLimit,
                    usedMB: Utils.Math.round(performance.memory.usedJSHeapSize / (1024 * 1024), 2),
                    totalMB: Utils.Math.round(performance.memory.totalJSHeapSize / (1024 * 1024), 2)
                };
            }
            return null;
        },

        /**
         * Request animation frame with fallback
         */
        requestFrame(callback) {
            if (window.requestAnimationFrame) {
                return window.requestAnimationFrame(callback);
            } else {
                return setTimeout(callback, 16);
            }
        },

        /**
         * Cancel animation frame with fallback
         */
        cancelFrame(id) {
            if (window.cancelAnimationFrame) {
                window.cancelAnimationFrame(id);
            } else {
                clearTimeout(id);
            }
        }
    },

    /**
     * Color Utilities
     */
    Color: {
        /**
         * Convert hex to RGB
         */
        hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },

        /**
         * Convert RGB to hex
         */
        rgbToHex(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        },

        /**
         * Interpolate between colors
         */
        interpolate(color1, color2, factor) {
            const rgb1 = this.hexToRgb(color1);
            const rgb2 = this.hexToRgb(color2);
            
            if (!rgb1 || !rgb2) return color1;
            
            const r = Math.round(Utils.Math.lerp(rgb1.r, rgb2.r, factor));
            const g = Math.round(Utils.Math.lerp(rgb1.g, rgb2.g, factor));
            const b = Math.round(Utils.Math.lerp(rgb1.b, rgb2.b, factor));
            
            return this.rgbToHex(r, g, b);
        },

        /**
         * Get contrasting color
         */
        getContrast(hex) {
            const rgb = this.hexToRgb(hex);
            if (!rgb) return '#ffffff';
            
            const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
            return brightness > 128 ? '#000000' : '#ffffff';
        }
    },

    /**
     * Validation Utilities
     */
    Validation: {
        /**
         * Validate email
         */
        isEmail(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        },

        /**
         * Validate URL
         */
        isUrl(url) {
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        },

        /**
         * Validate coordinates
         */
        isValidCoordinate(lat, lon) {
            return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
        },

        /**
         * Validate ICAO code
         */
        isValidICAO(icao) {
            return /^[A-F0-9]{6}$/i.test(icao);
        },

        /**
         * Validate callsign
         */
        isValidCallsign(callsign) {
            return /^[A-Z0-9]{2,8}$/i.test(callsign);
        },

        /**
         * Validate altitude
         */
        isValidAltitude(altitude) {
            return typeof altitude === 'number' && altitude >= -2000 && altitude <= 100000;
        },

        /**
         * Validate speed
         */
        isValidSpeed(speed) {
            return typeof speed === 'number' && speed >= 0 && speed <= 2000;
        }
    },

    /**
     * Formatting Utilities
     */
    Format: {
        /**
         * Format number with commas
         */
        number(num, decimals = 0) {
            return num.toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            });
        },

        /**
         * Format file size
         */
        fileSize(bytes) {
            const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
            if (bytes === 0) return '0 B';
            const i = Math.floor(Math.log(bytes) / Math.log(1024));
            return Utils.Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
        },

        /**
         * Format altitude
         */
        altitude(feet) {
            if (feet === null || feet === undefined) return 'N/A';
            return `${this.number(feet)} ft`;
        },

        /**
         * Format speed
         */
        speed(knots) {
            if (knots === null || knots === undefined) return 'N/A';
            return `${this.number(knots)} kts`;
        },

        /**
         * Format heading
         */
        heading(degrees) {
            if (degrees === null || degrees === undefined) return 'N/A';
            return `${this.number(degrees, 0)}°`;
        },

        /**
         * Format coordinates
         */
        coordinates(lat, lon, decimals = 4) {
            if (lat === null || lat === undefined || lon === null || lon === undefined) {
                return 'N/A';
            }
            return `${lat.toFixed(decimals)}, ${lon.toFixed(decimals)}`;
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}