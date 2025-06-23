// ===== MAIN APPLICATION =====

class QuestTimerApp {
    constructor() {
        // Initialize core systems
        this.timer = new Timer();
        this.rpgSystem = new RPGSystem();
        this.soundSystem = new SoundSystem(); // NOUVEAU: Système sonore
        this.debugMode = new DebugMode(this.timer, this.rpgSystem);
        
        // Make sound system globally available
        window.soundSystem = this.soundSystem; // NOUVEAU: Accès global
        
        this.initializeApp();
        this.setupEventListeners();
        this.requestNotificationPermission();
        
        // 🔥 HOT RELOAD: Simple initialization (no UI, integrated in debug)
        this.initializeHotReload();
    }

    initializeApp() {
        console.log('⚔️ Quest Timer initialized');
        
        // Set up timer callbacks to integrate with RPG system
        this.timer.setCallbacks({
            onTimerStart: () => this.handleTimerStart(),
            onTimerPause: () => this.handleTimerPause(),
            onTimerReset: () => this.handleTimerReset(),
            onFocusComplete: () => this.handleFocusComplete(),
            onBreakComplete: () => this.handleBreakComplete(),
            onSessionComplete: (isBreak) => this.handleSessionComplete(isBreak)
        });

        // Update displays
        this.updateAllDisplays();
        
        // Check if it's a new day for streak management
        this.rpgSystem.checkStreakReset();
        
        // Initialize PWA features if available
        this.initializePWA();
        
        // NOUVEAU: Request audio permission on first user interaction
        this.setupAudioPermissionRequest();
    }

    setupEventListeners() {
        // Handle visibility change (tab switching)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.handleAppHidden();
            } else {
                this.handleAppVisible();
            }
        });

        // Handle window beforeunload
        window.addEventListener('beforeunload', () => {
            this.handleAppUnload();
        });

        // Handle keyboard shortcuts (global)
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Handle window resize
        window.addEventListener('resize', debounce(() => {
            this.handleWindowResize();
        }, 250));
    }

    // NOUVEAU: Setup audio permission request
    setupAudioPermissionRequest() {
        // Request audio permission on first user interaction
        const requestPermission = () => {
            this.soundSystem.requestAudioPermission();
            document.removeEventListener('click', requestPermission);
            document.removeEventListener('keydown', requestPermission);
            document.removeEventListener('touchstart', requestPermission);
        };

        document.addEventListener('click', requestPermission, { once: true });
        document.addEventListener('keydown', requestPermission, { once: true });
        document.addEventListener('touchstart', requestPermission, { once: true });
    }

    // 🔥 HOT RELOAD: Simple initialization (no UI, managed by debug mode)
    initializeHotReload() {
        this.isDevelopment = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
        
        if (this.isDevelopment) {
            console.log('🔥 Hot Reload: Development mode detected (managed by debug panel)');
            
            // Listen for Service Worker messages only
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.addEventListener('message', (event) => {
                    if (event.data.type === 'SW_UPDATED') {
                        console.log(`🔥 Hot Reload: Service Worker updated to v${event.data.version}`);
                    }
                });
            }
            
            // Make hot reload functions available globally for console use
            window.hotReload = {
                clearCache: () => this.debugMode.clearCacheAndReload(),
                reload: () => this.debugMode.hardReload(),
                getVersion: () => this.debugMode.getServiceWorkerVersion()
            };
            
            console.log('🔥 Hot Reload: Functions available at window.hotReload and in debug panel');
        }
    }

    // ===== TIMER EVENT HANDLERS =====

    handleTimerStart() {
        console.log('🎯 Timer started');
        
        // PAS DE SON au démarrage du timer
    }

    handleTimerPause() {
        console.log('⏸️ Timer paused');
        this.rpgSystem.saveProgress();
    }

    handleTimerReset() {
        console.log('🔄 Timer reset');
    }

    handleFocusComplete() {
        console.log('✅ Focus session completed');
        
        // Award XP and handle RPG progression
        const xpGained = this.rpgSystem.completeSession();
        
        // Show completion notification
        showNotification(`🎉 Focus Quest Complete! +${xpGained} XP`);
        showBrowserNotification('Quest Timer', `Focus Quest Complete! +${xpGained} XP`);
        
        // Update displays
        this.updateAllDisplays();
    }

    handleBreakComplete() {
        console.log('☕ Break completed');
        showNotification('Break over! Ready for the next quest? 🎯');
        showBrowserNotification('Quest Timer', 'Break over! Ready for the next quest?');
    }

    handleSessionComplete(isBreak) {
        // Save progress after any session completion
        this.rpgSystem.saveProgress();
        
        // Play completion sound if available (sounds are handled in timer.js)
        
        // Update last active date
        this.rpgSystem.lastActiveDate = new Date().toDateString();
        this.rpgSystem.saveProgress();
    }

    // ===== APP EVENT HANDLERS =====

    handleAppHidden() {
        this.rpgSystem.saveProgress();
        console.log('📱 App hidden - progress saved');
    }

    handleAppVisible() {
        this.checkForTimeJump();
        console.log('📱 App visible');
    }

    handleAppUnload() {
        this.rpgSystem.saveProgress();
        console.log('💾 App unload - progress saved');
    }

    handleKeyboardShortcuts(e) {
        // Only handle shortcuts when not in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        // Space bar: Start/pause timer
        if (e.code === 'Space') {
            e.preventDefault();
            this.timer.toggleTimer();
        }
        
        // R key: Reset timer
        if (e.key === 'r' || e.key === 'R') {
            e.preventDefault();
            this.timer.resetTimer();
        }
        
        // NOUVEAU: S key: Toggle sound (PAS DE SON lors du toggle)
        if (e.key === 's' || e.key === 'S') {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                this.soundSystem.toggle();
            }
        }
        
        // Escape key: Close debug panel if open
        if (e.key === 'Escape') {
            if (this.debugMode.isEnabled) {
                this.debugMode.togglePanel();
            }
        }
    }

    handleWindowResize() {
        console.log('📐 Window resized');
    }

    // ===== UTILITY METHODS =====

    updateAllDisplays() {
        this.timer.updateDisplay();
        this.timer.updateProgressRing();
        this.rpgSystem.updateDisplay();
    }

    requestNotificationPermission() {
        requestNotificationPermission();
    }

    checkForTimeJump() {
        const lastUpdate = loadFromStorage('lastUpdateTime', Date.now());
        const now = Date.now();
        const timeDiff = now - lastUpdate;
        
        if (timeDiff > 120000 && this.timer.isRunning) {
            this.timer.pauseTimer();
            showNotification('⏰ Timer paused due to inactivity');
        }
        
        saveToStorage('lastUpdateTime', now);
    }

    // ===== PWA METHODS =====

    initializePWA() {
        // Register service worker if available
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(registration => {
                    console.log('✅ Service Worker registered:', registration);
                    
                    // 🔥 HOT RELOAD: Listen for updates in development
                    if (this.isDevelopment) {
                        registration.addEventListener('updatefound', () => {
                            console.log('🔥 Hot Reload: Service Worker update found');
                        });
                    }
                })
                .catch(error => {
                    console.log('❌ Service Worker registration failed:', error);
                });
        }

        // Handle PWA install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallPrompt();
        });

        // Handle PWA install completion
        window.addEventListener('appinstalled', () => {
            console.log('📱 PWA installed');
            showNotification('📱 Quest Timer installed as app!');
            this.deferredPrompt = null;
        });
    }

    showInstallPrompt() {
        console.log('📱 PWA install prompt available');
    }

    installPWA() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            this.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('📱 User accepted PWA install');
                } else {
                    console.log('📱 User dismissed PWA install');
                }
                this.deferredPrompt = null;
            });
        }
    }

    // ===== ANALYTICS & TRACKING =====

    trackEvent(eventName, properties = {}) {
        console.log('📊 Event:', eventName, properties);
        
        if (this.isDevelopment) {
            properties.hotReload = true;
            properties.environment = 'development';
        }
    }

    // ===== ERROR HANDLING =====

    handleError(error, context = 'Unknown') {
        console.error(`❌ Error in ${context}:`, error);
        
        showNotification('⚠️ Something went wrong. Progress has been saved.');
        
        this.rpgSystem.saveProgress();
        
        this.trackEvent('error', {
            context,
            message: error.message,
            stack: error.stack
        });
    }

    // ===== PUBLIC API =====

    getAppState() {
        return {
            timer: this.timer.getSessionInfo(),
            rpg: this.rpgSystem.getStats(),
            sound: this.soundSystem.getSettings(), // NOUVEAU
            isDebugMode: this.debugMode.isEnabled,
            isDevelopment: this.isDevelopment
        };
    }

    exportAppData() {
        return this.debugMode.exportProgress();
    }

    importAppData() {
        return this.debugMode.importProgress();
    }
}

// ===== INITIALIZATION =====

// Global error handler
window.addEventListener('error', (e) => {
    console.error('💥 Global error:', e.error);
    try {
        if (window.questTimer) {
            window.questTimer.rpgSystem.saveProgress();
        }
    } catch (saveError) {
        console.error('💾 Failed to save progress on error:', saveError);
    }
});

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Create global app instance
        window.questTimer = new QuestTimerApp();
        
        // Make debug functions globally available in development
        if (loadFromStorage('debugModeEnabled', false)) {
            window.debug = {
                app: window.questTimer,
                timer: window.questTimer.timer,
                rpg: window.questTimer.rpgSystem,
                sound: window.questTimer.soundSystem, // NOUVEAU
                debug: window.questTimer.debugMode,
                exportData: () => window.questTimer.exportAppData(),
                importData: () => window.questTimer.importAppData(),
                getState: () => window.questTimer.getAppState(),
                generateReport: () => window.questTimer.debugMode.generateReport()
            };
            console.log('🔧 Debug utilities available at window.debug');
        }
        
    } catch (error) {
        console.error('💥 Failed to initialize Quest Timer:', error);
        document.body.innerHTML = `
            <div style="text-align: center; padding: 50px; color: #e5e7eb;">
                <h1>⚠️ Initialization Error</h1>
                <p>Failed to start Quest Timer. Please refresh the page.</p>
                <button onclick="location.reload()" style="padding: 10px 20px; margin-top: 20px; border: none; border-radius: 5px; background: #6366f1; color: white; cursor: pointer;">
                    Refresh Page
                </button>
            </div>
        `;
    }
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QuestTimerApp, Timer, RPGSystem, SoundSystem, DebugMode };
}