/**
 * C4ISR Language Management System
 * Supports English, Persian (Farsi), and Swedish
 */

class LanguageManager {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.rtlLanguages = ['fa', 'ar', 'he'];
        
        this.initializeTranslations();
        this.loadLanguageFromStorage();
        this.applyLanguage();
    }
    
    /**
     * Initialize all language translations
     */
    initializeTranslations() {
        this.translations = {
            en: {
                // Header
                'C4ISR Military Tracking': 'C4ISR Military Tracking',
                'SYSTEM ONLINE': 'SYSTEM ONLINE',
                'THREAT LEVEL:': 'THREAT LEVEL:',
                'LOW': 'LOW',
                'MEDIUM': 'MEDIUM',
                'HIGH': 'HIGH',
                'CRITICAL': 'CRITICAL',
                
                // Control Panel
                'Data Sources': 'Data Sources',
                'Filters': 'Filters',
                'Map Layers': 'Map Layers',
                'View Mode': 'View Mode',
                'Flight Details': 'Flight Details',
                
                // Data Sources
                'FlightRadar24': 'FlightRadar24',
                'OpenSky Network': 'OpenSky Network',
                'ADSB.lol': 'ADSB.lol',
                'KiwiSDR (0-30MHz)': 'KiwiSDR (0-30MHz)',
                
                // Filters
                'Altitude Range (ft)': 'Altitude Range (ft)',
                'Speed Range (kts)': 'Speed Range (kts)',
                'Aircraft Type': 'Aircraft Type',
                'Threat Level': 'Threat Level',
                'All Types': 'All Types',
                'Military': 'Military',
                'Commercial': 'Commercial',
                'Private': 'Private',
                'UAV/Drone': 'UAV/Drone',
                'All Levels': 'All Levels',
                
                // Map Layers
                'Satellite': 'Satellite',
                'High Contrast': 'High Contrast',
                'Terrain': 'Terrain',
                'Weather': 'Weather',
                
                // View Modes
                '2D Map': '2D Map',
                '3D Globe': '3D Globe',
                
                // Map Controls
                'Flights': 'Flights',
                'Zoom': 'Zoom',
                'Select a flight to view details': 'Select a flight to view details',
                
                // Status Bar
                'Connected': 'Connected',
                'Last Update': 'Last Update',
                'Total Flights': 'Total Flights',
                'Threats': 'Threats',
                'Mode': 'Mode',
                'Normal': 'Normal',
                'Stealth': 'Stealth',
                'GPS Jamming': 'GPS Jamming',
                
                // Notifications
                'System Alert': 'System Alert',
                'Threat Detected': 'Threat Detected',
                'GPS Signal Lost': 'GPS Signal Lost',
                'Military Aircraft Detected': 'Military Aircraft Detected',
                'Stealth Technology Detected': 'Stealth Technology Detected',
                
                // GPS Jamming
                'GPS Jamming Mode': 'GPS Jamming Mode',
                'Stealth Mode': 'Stealth Mode',
                'Emergency Override': 'Emergency Override',
                'Location Backup Enabled': 'Location Backup Enabled',
                'Path Recovery Active': 'Path Recovery Active',
                
                // Threat Detection
                'Threat Level Elevated': 'Threat Level Elevated',
                'Radar Evasion Detected': 'Radar Evasion Detected',
                'Unknown Aircraft Pattern': 'Unknown Aircraft Pattern',
                'Military Activity Detected': 'Military Activity Detected',
                
                // System Messages
                'Initializing Military Tracking System...': 'Initializing Military Tracking System...',
                'System Ready': 'System Ready',
                'Data Source Connected': 'Data Source Connected',
                'Data Source Disconnected': 'Data Source Disconnected',
                'Map Layer Activated': 'Map Layer Activated',
                'Filter Applied': 'Filter Applied',
                'View Mode Changed': 'View Mode Changed',
                
                // Errors
                'Connection Failed': 'Connection Failed',
                'Data Source Error': 'Data Source Error',
                'Map Loading Error': 'Map Loading Error',
                'GPS Signal Weak': 'GPS Signal Weak',
                'System Overload': 'System Overload'
            },
            
            fa: {
                // Header
                'C4ISR Military Tracking': 'سامانه ردیابی نظامی C4ISR',
                'SYSTEM ONLINE': 'سیستم فعال',
                'THREAT LEVEL:': 'سطح تهدید:',
                'LOW': 'کم',
                'MEDIUM': 'متوسط',
                'HIGH': 'زیاد',
                'CRITICAL': 'بحرانی',
                
                // Control Panel
                'Data Sources': 'منابع داده',
                'Filters': 'فیلترها',
                'Map Layers': 'لایه های نقشه',
                'View Mode': 'حالت نمایش',
                'Flight Details': 'جزئیات پرواز',
                
                // Data Sources
                'FlightRadar24': 'فلایت رادار ۲۴',
                'OpenSky Network': 'شبکه اپن اسکای',
                'ADSB.lol': 'ای دی اس بی',
                'KiwiSDR (0-30MHz)': 'کیوی اس دی آر (۰-۳۰ مگاهرتز)',
                
                // Filters
                'Altitude Range (ft)': 'محدوده ارتفاع (فوت)',
                'Speed Range (kts)': 'محدوده سرعت (گره)',
                'Aircraft Type': 'نوع هواپیما',
                'Threat Level': 'سطح تهدید',
                'All Types': 'همه انواع',
                'Military': 'نظامی',
                'Commercial': 'تجاری',
                'Private': 'شخصی',
                'UAV/Drone': 'پهپاد/بدون سرنشین',
                'All Levels': 'همه سطوح',
                
                // Map Layers
                'Satellite': 'ماهواره',
                'High Contrast': 'کنتراست بالا',
                'Terrain': 'زمین',
                'Weather': 'آب و هوا',
                
                // View Modes
                '2D Map': 'نقشه دو بعدی',
                '3D Globe': 'کره سه بعدی',
                
                // Map Controls
                'Flights': 'پروازها',
                'Zoom': 'بزرگنمایی',
                'Select a flight to view details': 'پروازی را برای مشاهده جزئیات انتخاب کنید',
                
                // Status Bar
                'Connected': 'متصل',
                'Last Update': 'آخرین بروزرسانی',
                'Total Flights': 'کل پروازها',
                'Threats': 'تهدیدات',
                'Mode': 'حالت',
                'Normal': 'عادی',
                'Stealth': 'مخفی',
                'GPS Jamming': 'اخلال جی پی اس',
                
                // Notifications
                'System Alert': 'هشدار سیستم',
                'Threat Detected': 'تهدید شناسایی شد',
                'GPS Signal Lost': 'سیگنال جی پی اس قطع شد',
                'Military Aircraft Detected': 'هواپیمای نظامی شناسایی شد',
                'Stealth Technology Detected': 'فناوری مخفی شناسایی شد',
                
                // GPS Jamming
                'GPS Jamming Mode': 'حالت اخلال جی پی اس',
                'Stealth Mode': 'حالت مخفی',
                'Emergency Override': 'لغو اضطراری',
                'Location Backup Enabled': 'پشتیبان گیری موقعیت فعال',
                'Path Recovery Active': 'بازیابی مسیر فعال',
                
                // Threat Detection
                'Threat Level Elevated': 'سطح تهدید افزایش یافت',
                'Radar Evasion Detected': 'فرار از رادار شناسایی شد',
                'Unknown Aircraft Pattern': 'الگوی هواپیمای ناشناس',
                'Military Activity Detected': 'فعالیت نظامی شناسایی شد',
                
                // System Messages
                'Initializing Military Tracking System...': 'در حال راه اندازی سامانه ردیابی نظامی...',
                'System Ready': 'سیستم آماده',
                'Data Source Connected': 'منبع داده متصل شد',
                'Data Source Disconnected': 'منبع داده قطع شد',
                'Map Layer Activated': 'لایه نقشه فعال شد',
                'Filter Applied': 'فیلتر اعمال شد',
                'View Mode Changed': 'حالت نمایش تغییر کرد',
                
                // Errors
                'Connection Failed': 'اتصال ناموفق',
                'Data Source Error': 'خطای منبع داده',
                'Map Loading Error': 'خطای بارگذاری نقشه',
                'GPS Signal Weak': 'سیگنال جی پی اس ضعیف',
                'System Overload': 'اضافه بار سیستم'
            },
            
            sv: {
                // Header
                'C4ISR Military Tracking': 'C4ISR Militär Spårningssystem',
                'SYSTEM ONLINE': 'SYSTEM ONLINE',
                'THREAT LEVEL:': 'HOTNIVÅ:',
                'LOW': 'LÅG',
                'MEDIUM': 'MEDEL',
                'HIGH': 'HÖG',
                'CRITICAL': 'KRITISK',
                
                // Control Panel
                'Data Sources': 'Datakällor',
                'Filters': 'Filter',
                'Map Layers': 'Kartlager',
                'View Mode': 'Visningsläge',
                'Flight Details': 'Flygdetaljer',
                
                // Data Sources
                'FlightRadar24': 'FlightRadar24',
                'OpenSky Network': 'OpenSky Nätverk',
                'ADSB.lol': 'ADSB.lol',
                'KiwiSDR (0-30MHz)': 'KiwiSDR (0-30MHz)',
                
                // Filters
                'Altitude Range (ft)': 'Höjdområde (ft)',
                'Speed Range (kts)': 'Hastighetsområde (knop)',
                'Aircraft Type': 'Flygplanstyp',
                'Threat Level': 'Hotnivå',
                'All Types': 'Alla Typer',
                'Military': 'Militär',
                'Commercial': 'Kommersiell',
                'Private': 'Privat',
                'UAV/Drone': 'UAV/Drönare',
                'All Levels': 'Alla Nivåer',
                
                // Map Layers
                'Satellite': 'Satellit',
                'High Contrast': 'Hög Kontrast',
                'Terrain': 'Terräng',
                'Weather': 'Väder',
                
                // View Modes
                '2D Map': '2D Karta',
                '3D Globe': '3D Glob',
                
                // Map Controls
                'Flights': 'Flyg',
                'Zoom': 'Zoom',
                'Select a flight to view details': 'Välj ett flyg för att se detaljer',
                
                // Status Bar
                'Connected': 'Ansluten',
                'Last Update': 'Senaste Uppdatering',
                'Total Flights': 'Totalt Antal Flyg',
                'Threats': 'Hot',
                'Mode': 'Läge',
                'Normal': 'Normalt',
                'Stealth': 'Dold',
                'GPS Jamming': 'GPS Störning',
                
                // Notifications
                'System Alert': 'Systemvarning',
                'Threat Detected': 'Hot Upptäckt',
                'GPS Signal Lost': 'GPS Signal Förlorat',
                'Military Aircraft Detected': 'Militärt Flygplan Upptäckt',
                'Stealth Technology Detected': 'Dold Teknologi Upptäckt',
                
                // GPS Jamming
                'GPS Jamming Mode': 'GPS Störningsläge',
                'Stealth Mode': 'Dolt Läge',
                'Emergency Override': 'Nödupphävande',
                'Location Backup Enabled': 'Platsbackup Aktiverad',
                'Path Recovery Active': 'Sökvägsåterställning Aktiv',
                
                // Threat Detection
                'Threat Level Elevated': 'Hotnivå Höjd',
                'Radar Evasion Detected': 'Radarundvikande Upptäckt',
                'Unknown Aircraft Pattern': 'Okänt Flygplanmönster',
                'Military Activity Detected': 'Militär Aktivitet Upptäckt',
                
                // System Messages
                'Initializing Military Tracking System...': 'Initierar Militärt Spårningssystem...',
                'System Ready': 'System Redo',
                'Data Source Connected': 'Datakälla Ansluten',
                'Data Source Disconnected': 'Datakälla Frånkopplad',
                'Map Layer Activated': 'Kartlager Aktiverat',
                'Filter Applied': 'Filter Applicerat',
                'View Mode Changed': 'Visningsläge Ändrat',
                
                // Errors
                'Connection Failed': 'Anslutning Misslyckades',
                'Data Source Error': 'Datakällfel',
                'Map Loading Error': 'Kartladdningsfel',
                'GPS Signal Weak': 'GPS Signal Svagt',
                'System Overload': 'Systemöverbelastning'
            }
        };
    }
    
    /**
     * Load language preference from localStorage
     */
    loadLanguageFromStorage() {
        const savedLanguage = localStorage.getItem('c4isr_language');
        if (savedLanguage && this.translations[savedLanguage]) {
            this.currentLanguage = savedLanguage;
        }
    }
    
    /**
     * Save language preference to localStorage
     */
    saveLanguageToStorage() {
        localStorage.setItem('c4isr_language', this.currentLanguage);
    }
    
    /**
     * Change the current language
     * @param {string} languageCode - Language code (en, fa, sv)
     */
    changeLanguage(languageCode) {
        if (!this.translations[languageCode]) {
            console.warn(`Language ${languageCode} not supported`);
            return false;
        }
        
        this.currentLanguage = languageCode;
        this.saveLanguageToStorage();
        this.applyLanguage();
        
        // Dispatch custom event for language change
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: languageCode }
        }));
        
        return true;
    }
    
    /**
     * Get current language code
     * @returns {string} Current language code
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    /**
     * Get current language direction
     * @returns {string} 'ltr' or 'rtl'
     */
    getCurrentDirection() {
        return this.rtlLanguages.includes(this.currentLanguage) ? 'rtl' : 'ltr';
    }
    
    /**
     * Get translation for a key
     * @param {string} key - Translation key
     * @param {string} fallback - Fallback text if translation not found
     * @returns {string} Translated text
     */
    translate(key, fallback = key) {
        const translation = this.translations[this.currentLanguage];
        if (translation && translation[key]) {
            return translation[key];
        }
        
        // Fallback to English if translation not found
        if (this.currentLanguage !== 'en' && this.translations.en[key]) {
            return this.translations.en[key];
        }
        
        return fallback;
    }
    
    /**
     * Apply current language to the DOM
     */
    applyLanguage() {
        // Set document direction
        document.documentElement.dir = this.getCurrentDirection();
        document.documentElement.lang = this.currentLanguage;
        
        // Update all elements with data attributes
        this.updateDataAttributes();
        
        // Update language selector
        this.updateLanguageSelector();
        
        // Update dynamic content
        this.updateDynamicContent();
    }
    
    /**
     * Update elements with data attributes
     */
    updateDataAttributes() {
        const elements = document.querySelectorAll('[data-en], [data-fa], [data-sv]');
        
        elements.forEach(element => {
            const key = element.getAttribute(`data-${this.currentLanguage}`);
            if (key) {
                element.textContent = this.translate(key, key);
            }
        });
    }
    
    /**
     * Update language selector
     */
    updateLanguageSelector() {
        const selector = document.getElementById('language-selector');
        if (selector) {
            selector.value = this.currentLanguage;
        }
    }
    
    /**
     * Update dynamic content that needs translation
     */
    updateDynamicContent() {
        // Update status indicators
        this.updateStatusText();
        
        // Update notifications
        this.updateNotifications();
        
        // Update map controls
        this.updateMapControls();
    }
    
    /**
     * Update status text
     */
    updateStatusText() {
        const statusElements = {
            'connection-status': 'Connected',
            'system-mode': 'Mode: Normal',
            'threat-level': 'LOW'
        };
        
        Object.entries(statusElements).forEach(([id, key]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = this.translate(key);
            }
        });
    }
    
    /**
     * Update notifications
     */
    updateNotifications() {
        // This will be called when notifications are created
        // Language will be applied automatically
    }
    
    /**
     * Update map controls
     */
    updateMapControls() {
        const flightCount = document.getElementById('flight-count');
        if (flightCount) {
            const count = flightCount.getAttribute('data-count') || '0';
            flightCount.textContent = `${count} ${this.translate('Flights')}`;
        }
    }
    
    /**
     * Get supported languages
     * @returns {Array} Array of supported language objects
     */
    getSupportedLanguages() {
        return Object.entries(this.translations).map(([code, data]) => ({
            code,
            name: this.getLanguageName(code),
            flag: this.getLanguageFlag(code),
            direction: this.rtlLanguages.includes(code) ? 'rtl' : 'ltr'
        }));
    }
    
    /**
     * Get language name
     * @param {string} code - Language code
     * @returns {string} Language name
     */
    getLanguageName(code) {
        const names = {
            'en': 'English',
            'fa': 'فارسی',
            'sv': 'Svenska'
        };
        return names[code] || code;
    }
    
    /**
     * Get language flag emoji
     * @param {string} code - Language code
     * @returns {string} Flag emoji
     */
    getLanguageFlag(code) {
        const flags = {
            'en': '🇺🇸',
            'fa': '🇮🇷',
            'sv': '🇸🇪'
        };
        return flags[code] || '🌐';
    }
    
    /**
     * Format number according to current language
     * @param {number} number - Number to format
     * @returns {string} Formatted number
     */
    formatNumber(number) {
        if (this.currentLanguage === 'fa') {
            // Convert to Persian numerals
            return number.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
        }
        return number.toString();
    }
    
    /**
     * Format date according to current language
     * @param {Date} date - Date to format
     * @returns {string} Formatted date
     */
    formatDate(date) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        if (this.currentLanguage === 'fa') {
            // Persian calendar formatting would go here
            return date.toLocaleDateString('fa-IR', options);
        } else if (this.currentLanguage === 'sv') {
            return date.toLocaleDateString('sv-SE', options);
        } else {
            return date.toLocaleDateString('en-US', options);
        }
    }
}

// Create global instance
window.languageManager = new LanguageManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManager;
}