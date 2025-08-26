/**
 * C4ISR Notification Management System
 * Handles system notifications, alerts, and user communications
 */

class NotificationManager {
    constructor() {
        this.notifications = [];
        this.maxNotifications = 10;
        this.autoHideDelay = 5000; // 5 seconds
        this.isInitialized = true;
        
        this.initialize();
    }
    
    /**
     * Initialize the notification system
     */
    initialize() {
        this.createNotificationContainer();
        this.setupAudio();
        this.setupEventListeners();
    }
    
    /**
     * Create notification container if it doesn't exist
     */
    createNotificationContainer() {
        let container = document.getElementById('notifications');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notifications';
            container.className = 'notifications-container';
            document.body.appendChild(container);
        }
    }
    
    /**
     * Setup audio elements for notifications
     */
    setupAudio() {
        this.audioElements = {
            threat: document.getElementById('threat-alert'),
            system: document.getElementById('system-alert'),
            notification: document.getElementById('notification')
        };
        
        // Create audio elements if they don't exist
        Object.entries(this.audioElements).forEach(([type, element]) => {
            if (!element) {
                const audio = document.createElement('audio');
                audio.id = `${type}-alert`;
                audio.preload = 'auto';
                audio.volume = C4ISR_CONFIG.NOTIFICATIONS.AUDIO.VOLUME || 0.7;
                
                // Add source based on type
                if (type === 'threat') {
                    audio.src = C4ISR_CONFIG.NOTIFICATIONS.AUDIO.FILES.THREAT_ALERT;
                } else if (type === 'system') {
                    audio.src = C4ISR_CONFIG.NOTIFICATIONS.AUDIO.FILES.SYSTEM_ALERT;
                } else {
                    audio.src = C4ISR_CONFIG.NOTIFICATIONS.AUDIO.FILES.NOTIFICATION;
                }
                
                document.body.appendChild(audio);
                this.audioElements[type] = audio;
            }
        });
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for language changes
        window.addEventListener('languageChanged', () => {
            this.updateNotificationLanguage();
        });
        
        // Listen for system events
        window.addEventListener('threatDetected', (e) => {
            this.showThreatAlert(e.detail);
        });
        
        window.addEventListener('systemAlert', (e) => {
            this.showSystemAlert(e.detail);
        });
    }
    
    /**
     * Show a notification
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     * @param {string} type - Notification type (info, success, warning, danger)
     * @param {Object} options - Additional options
     */
    show(title, message, type = 'info', options = {}) {
        const notification = this.createNotification(title, message, type, options);
        
        // Add to notifications array
        this.notifications.push(notification);
        
        // Limit number of notifications
        if (this.notifications.length > this.maxNotifications) {
            const oldNotification = this.notifications.shift();
            this.removeNotification(oldNotification);
        }
        
        // Show notification
        this.displayNotification(notification);
        
        // Play audio if enabled
        if (C4ISR_CONFIG.NOTIFICATIONS.AUDIO.ENABLED && options.sound !== false) {
            this.playNotificationAudio(type);
        }
        
        // Auto-hide if specified
        if (options.autoHide !== false) {
            this.scheduleAutoHide(notification);
        }
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('notificationShown', {
            detail: { notification, type, title, message }
        }));
        
        return notification;
    }
    
    /**
     * Show info notification
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     * @param {Object} options - Additional options
     */
    showInfo(title, message, options = {}) {
        return this.show(title, message, 'info', options);
    }
    
    /**
     * Show success notification
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     * @param {Object} options - Additional options
     */
    showSuccess(title, message, options = {}) {
        return this.show(title, message, 'success', options);
    }
    
    /**
     * Show warning notification
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     * @param {Object} options - Additional options
     */
    showWarning(title, message, options = {}) {
        return this.show(title, message, 'warning', options);
    }
    
    /**
     * Show danger/error notification
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     * @param {Object} options - Additional options
     */
    showDanger(title, message, options = {}) {
        return this.show(title, message, 'danger', options);
    }
    
    /**
     * Show threat alert notification
     * @param {Object} threatData - Threat information
     */
    showThreatAlert(threatData) {
        const title = languageManager.translate('Threat Detected');
        const message = threatData.description || languageManager.translate('Unknown threat detected');
        
        const notification = this.show(title, message, 'danger', {
            sound: true,
            autoHide: false, // Don't auto-hide threat alerts
            priority: 'high'
        });
        
        // Add threat-specific styling
        notification.classList.add('threat-alert');
        
        // Add threat level indicator
        this.addThreatLevelIndicator(notification, threatData.level);
        
        return notification;
    }
    
    /**
     * Show system alert notification
     * @param {Object} alertData - Alert information
     */
    showSystemAlert(alertData) {
        const title = languageManager.translate('System Alert');
        const message = alertData.message || 'System alert';
        
        return this.show(title, message, 'warning', {
            sound: true,
            autoHide: true,
            priority: 'medium'
        });
    }
    
    /**
     * Create notification element
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     * @param {string} type - Notification type
     * @param {Object} options - Additional options
     * @returns {HTMLElement} Notification element
     */
    createNotification(title, message, type, options) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.dataset.type = type;
        notification.dataset.priority = options.priority || 'normal';
        
        // Add icon based on type
        const icon = this.getNotificationIcon(type);
        
        // Create notification content
        notification.innerHTML = `
            <i class="${icon}"></i>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" title="Close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        // Add click functionality for expandable notifications
        if (options.expandable) {
            notification.addEventListener('click', () => {
                this.toggleNotificationExpansion(notification);
            });
        }
        
        // Add data attributes
        notification.dataset.timestamp = Date.now();
        notification.dataset.title = title;
        notification.dataset.message = message;
        
        return notification;
    }
    
    /**
     * Get notification icon based on type
     * @param {string} type - Notification type
     * @returns {string} Icon class
     */
    getNotificationIcon(type) {
        const icons = {
            info: 'fas fa-info-circle',
            success: 'fas fa-check-circle',
            warning: 'fas fa-exclamation-triangle',
            danger: 'fas fa-times-circle'
        };
        
        return icons[type] || icons.info;
    }
    
    /**
     * Display notification in the container
     * @param {HTMLElement} notification - Notification element
     */
    displayNotification(notification) {
        const container = document.getElementById('notifications');
        if (!container) return;
        
        // Add to container
        container.appendChild(notification);
        
        // Trigger animation
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });
        
        // Add to notifications list
        this.notifications.push(notification);
    }
    
    /**
     * Remove notification
     * @param {HTMLElement} notification - Notification element
     */
    removeNotification(notification) {
        if (!notification || !notification.parentNode) return;
        
        // Animate out
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        
        // Remove after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            
            // Remove from notifications array
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        }, 300);
    }
    
    /**
     * Schedule auto-hide for notification
     * @param {HTMLElement} notification - Notification element
     */
    scheduleAutoHide(notification) {
        setTimeout(() => {
            if (notification.parentNode) {
                this.removeNotification(notification);
            }
        }, this.autoHideDelay);
    }
    
    /**
     * Play notification audio
     * @param {string} type - Notification type
     */
    playNotificationAudio(type) {
        let audioElement = null;
        
        switch (type) {
            case 'danger':
            case 'warning':
                audioElement = this.audioElements.threat;
                break;
            case 'info':
            case 'success':
                audioElement = this.audioElements.notification;
                break;
            default:
                audioElement = this.audioElements.system;
        }
        
        if (audioElement && audioElement.readyState >= 2) {
            try {
                audioElement.currentTime = 0;
                audioElement.play().catch(error => {
                    console.warn('Failed to play notification audio:', error);
                });
            } catch (error) {
                console.warn('Error playing notification audio:', error);
            }
        }
    }
    
    /**
     * Add threat level indicator to notification
     * @param {HTMLElement} notification - Notification element
     * @param {string} level - Threat level
     */
    addThreatLevelIndicator(notification, level) {
        const indicator = document.createElement('div');
        indicator.className = 'threat-level-indicator';
        indicator.textContent = level || 'HIGH';
        
        const content = notification.querySelector('.notification-content');
        if (content) {
            content.appendChild(indicator);
        }
    }
    
    /**
     * Toggle notification expansion
     * @param {HTMLElement} notification - Notification element
     */
    toggleNotificationExpansion(notification) {
        const isExpanded = notification.classList.contains('expanded');
        
        if (isExpanded) {
            notification.classList.remove('expanded');
        } else {
            notification.classList.add('expanded');
        }
    }
    
    /**
     * Update notification language
     */
    updateNotificationLanguage() {
        // Update existing notifications with new language
        this.notifications.forEach(notification => {
            const title = notification.dataset.title;
            const message = notification.dataset.message;
            
            if (title) {
                const titleElement = notification.querySelector('.notification-title');
                if (titleElement) {
                    titleElement.textContent = languageManager.translate(title, title);
                }
            }
            
            if (message) {
                const messageElement = notification.querySelector('.notification-message');
                if (messageElement) {
                    messageElement.textContent = languageManager.translate(message, message);
                }
            }
        });
    }
    
    /**
     * Clear all notifications
     */
    clearAll() {
        this.notifications.forEach(notification => {
            this.removeNotification(notification);
        });
        
        this.notifications = [];
    }
    
    /**
     * Clear notifications by type
     * @param {string} type - Notification type to clear
     */
    clearByType(type) {
        const notificationsToRemove = this.notifications.filter(n => n.dataset.type === type);
        notificationsToRemove.forEach(notification => {
            this.removeNotification(notification);
        });
    }
    
    /**
     * Get notification count
     * @param {string} type - Optional type filter
     * @returns {number} Number of notifications
     */
    getCount(type = null) {
        if (type) {
            return this.notifications.filter(n => n.dataset.type === type).length;
        }
        return this.notifications.length;
    }
    
    /**
     * Get notifications by type
     * @param {string} type - Notification type
     * @returns {Array} Array of notification elements
     */
    getByType(type) {
        return this.notifications.filter(n => n.dataset.type === type);
    }
    
    /**
     * Update notification settings
     * @param {Object} settings - New settings
     */
    updateSettings(settings) {
        if (settings.autoHideDelay !== undefined) {
            this.autoHideDelay = settings.autoHideDelay;
        }
        
        if (settings.maxNotifications !== undefined) {
            this.maxNotifications = settings.maxNotifications;
        }
        
        if (settings.audioVolume !== undefined) {
            Object.values(this.audioElements).forEach(audio => {
                if (audio) {
                    audio.volume = settings.audioVolume;
                }
            });
        }
    }
    
    /**
     * Export notifications data
     * @param {string} format - Export format (json, csv)
     * @returns {string} Exported data
     */
    exportData(format = 'json') {
        const data = this.notifications.map(notification => ({
            type: notification.dataset.type,
            title: notification.dataset.title,
            message: notification.dataset.message,
            timestamp: notification.dataset.timestamp,
            priority: notification.dataset.priority
        }));
        
        if (format === 'csv') {
            return this.convertToCSV(data);
        }
        
        return JSON.stringify(data, null, 2);
    }
    
    /**
     * Convert data to CSV format
     * @param {Array} data - Data array
     * @returns {string} CSV string
     */
    convertToCSV(data) {
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];
        
        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header] || '';
                return `"${value.toString().replace(/"/g, '""')}"`;
            });
            csvRows.push(values.join(','));
        });
        
        return csvRows.join('\n');
    }
    
    /**
     * Check if system is healthy
     * @returns {boolean} Health status
     */
    isHealthy() {
        return this.isInitialized && this.notifications.length < this.maxNotifications * 2;
    }
    
    /**
     * Shutdown notification system
     */
    shutdown() {
        this.clearAll();
        this.isInitialized = false;
    }
}

// Create global instance
window.notificationManager = new NotificationManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationManager;
}