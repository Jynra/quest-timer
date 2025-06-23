// ===== MAIN APPLICATION - BOTTOM NAV =====

class QuestTimerApp {
    constructor() {
        // Initialize core systems
        this.timer = new Timer();
        this.rpgSystem = new RPGSystem();
        this.soundSystem = new SoundSystem();
        this.debugMode = new DebugMode(this.timer, this.rpgSystem);
        
        // Make sound system globally available
        window.soundSystem = this.soundSystem;
        
        this.initializeApp();
        this.setupEventListeners();
        this.requestNotificationPermission();
        this.initializeBottomNav();
    }

    initializeApp() {
        console.log('⚔️ Quest Timer - Bottom Nav initialized');
        
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
        
        // Setup audio permission request
        this.setupAudioPermissionRequest();
    }

    // ===== BOTTOM NAV SPECIFIC INITIALIZATION =====
    initializeBottomNav() {
        this.setupSoundControls();
        this.setupAchievementsModal();
        this.setupBottomNavigation();
        this.optimizeForMobile();
    }

    setupSoundControls() {
        const soundToggle = document.getElementById('soundToggle');
        const soundType = document.getElementById('soundType');
        const volumeSlider = document.getElementById('volumeSlider');
        
        if (!soundToggle || !soundType || !volumeSlider) return;

        // Initialize sound controls state
        const settings = this.soundSystem.getSettings();
        soundToggle.textContent = settings.enabled ? '🔔 Sound' : '🔇 Muted';
        soundType.value = settings.soundType;
        volumeSlider.value = settings.volume * 100;

        // Sound toggle
        soundToggle.addEventListener('click', () => {
            this.soundSystem.toggle();
            const newSettings = this.soundSystem.getSettings();
            soundToggle.textContent = newSettings.enabled ? '🔔 Sound' : '🔇 Muted';
        });

        // Sound type selection
        soundType.addEventListener('change', (e) => {
            this.soundSystem.setSoundType(e.target.value);
        });

        // Volume control
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            this.soundSystem.setVolume(volume);
        });
    }

    setupAchievementsModal() {
        const achievementsBtn = document.getElementById('achievementsBtn');
        const achievementsModal = document.getElementById('achievementsModal');
        const closeAchievements = document.getElementById('closeAchievements');

        if (!achievementsBtn || !achievementsModal || !closeAchievements) return;

        // Open achievements modal
        achievementsBtn.addEventListener('click', () => {
            achievementsModal.classList.add('show');
            this.trackEvent('achievements_opened');
        });

        // Close achievements modal
        closeAchievements.addEventListener('click', () => {
            achievementsModal.classList.remove('show');
        });

        // Close modal on outside click
        achievementsModal.addEventListener('click', (e) => {
            if (e.target === achievementsModal) {
                achievementsModal.classList.remove('show');
            }
        });
    }

    setupBottomNavigation() {
        const bottomNav = document.querySelector('.bottom-nav');
        if (!bottomNav) return;

        // Add touch feedback to all buttons in bottom nav
        const buttons = bottomNav.querySelectorAll('.btn, .sound-toggle');
        buttons.forEach(btn => {
            btn.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
                if ('vibrate' in navigator) {
                    navigator.vibrate(10);
                }
            });
            
            btn.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            });
        });

        // Prevent bounce scrolling when bottom nav is reached
        let startY = 0;
        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchmove', (e) => {
            const currentY = e.touches[0].clientY;
            const bottomNavRect = bottomNav.getBoundingClientRect();
            
            if (currentY > bottomNavRect.top && startY > bottomNavRect.top) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    optimizeForMobile() {
        // Add viewport height calculation for mobile browsers
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setViewportHeight();
        window.addEventListener('resize', debounce(setViewportHeight, 100));
        window.addEventListener('orientationchange', debounce(setViewportHeight, 100));

        // Optimize timer display for mobile
        const timerDisplay = document.getElementById('timerDisplay');
        if (timerDisplay && window.innerWidth <= 375) {
            timerDisplay.style.fontSize = '2.4rem';
        }

        // Handle PWA status bar
        if (window.matchMedia('(display-mode: standalone)').matches) {
            document.body.classList.add('pwa-standalone');
            console.log('📱 Running in PWA standalone mode');
        }
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

        // Handle window resize for responsive adjustments
        window.addEventListener('resize', debounce(() => {
            this.handleWindowResize();
        }, 250));

        // Handle online/offline status
        window.addEventListener('online', () => {
            this.handleOnlineStatus(true);
        });

        window.addEventListener('offline', () => {
            this.handleOnlineStatus(false);
        });
    }

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

    // ===== TIMER EVENT HANDLERS =====

    handleTimerStart() {
        console.log('🎯 Timer started');
        const statusIndicator = document.getElementById('statusIndicator');
        if (statusIndicator) {
            statusIndicator.textContent = 'Quest in progress...';
        }
        
        // Add visual feedback
        const timerHero = document.getElementById('timerHero');
        if (timerHero) {
            timerHero.classList.add('timer-running');
        }
    }

    handleTimerPause() {
        console.log('⏸️ Timer paused');
        this.rpgSystem.saveProgress();
        
        const statusIndicator = document.getElementById('statusIndicator');
        if (statusIndicator) {
            statusIndicator.textContent = 'Quest paused';
        }
    }

    handleTimerReset() {
        console.log('🔄 Timer reset');
        const statusIndicator = document.getElementById('statusIndicator');
        if (statusIndicator) {
            statusIndicator.textContent = 'Ready for your next quest';
        }
        
        // Remove visual effects
        const timerHero = document.getElementById('timerHero');
        if (timerHero) {
            timerHero.classList.remove('timer-running');
        }
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
        
        // Track analytics
        this.trackEvent('focus_session_completed', {
            xp_gained: xpGained,
            level: this.rpgSystem.level
        });
        
        // Update status
        const statusIndicator = document.getElementById('statusIndicator');
        if (statusIndicator) {
            statusIndicator.textContent = 'Break time! You earned it.';
        }
    }

    handleBreakComplete() {
        console.log('☕ Break completed');
        showNotification('Break over! Ready for the next quest? 🎯');
        showBrowserNotification('Quest Timer', 'Break over! Ready for the next quest?');
        
        // Update status
        const statusIndicator = document.getElementById('statusIndicator');
        if (statusIndicator) {
            statusIndicator.textContent = 'Ready for the next quest';
        }
    }

    handleSessionComplete(isBreak) {
        // Save progress after any session completion
        this.rpgSystem.saveProgress();
        
        // Update last active date
        this.rpgSystem.lastActiveDate = new Date().toDateString();
        this.rpgSystem.saveProgress();
        
        // Remove timer running effects
        const timerHero = document.getElementById('timerHero');
        if (timerHero) {
            timerHero.classList.remove('timer-running');
        }
    }

    // ===== APP EVENT HANDLERS =====

    handleAppHidden() {
        this.rpgSystem.saveProgress();
        console.log('📱 App hidden - progress saved');
    }

    handleAppVisible() {
        this.checkForTimeJump();
        console.log('📱 App visible');
        
        // Refresh displays in case data changed
        this.updateAllDisplays();
    }

    handleAppUnload() {
        this.rpgSystem.saveProgress();
        console.log('💾 App unload - progress saved');
    }

    handleKeyboardShortcuts(e) {
        // Only handle shortcuts when not in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
            return;
        }

        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.timer.toggleTimer();
                break;
            case 'KeyR':
                e.preventDefault();
                this.timer.resetTimer();
                break;
            case 'KeyS':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.soundSystem.toggle();
                }
                break;
            case 'KeyA':
                const achievementsModal = document.getElementById('achievementsModal');
                if (achievementsModal) {
                    achievementsModal.classList.toggle('show');
                }
                break;
            case 'Escape':
                // Close any open modals
                document.querySelectorAll('.modal.show, .achievements-modal.show').forEach(modal => {
                    modal.classList.remove('show');
                });
                if (this.debugMode.isEnabled) {
                    this.debugMode.togglePanel();
                }
                break;
        }
    }

    handleWindowResize() {
        console.log('📐 Window resized:', window.innerWidth, 'x', window.innerHeight);
        
        // Adjust timer display size based on screen width
        const timerDisplay = document.getElementById('timerDisplay');
        if (timerDisplay) {
            if (window.innerWidth <= 320) {
                timerDisplay.style.fontSize = '2.2rem';
            } else if (window.innerWidth <= 375) {
                timerDisplay.style.fontSize = '2.4rem';
            } else {
                timerDisplay.style.fontSize = '2.8rem';
            }
        }
        
        // Adjust progress circle size
        const progressCircle = document.querySelector('.progress-circle');
        if (progressCircle) {
            if (window.innerWidth <= 320) {
                progressCircle.style.width = '140px';
                progressCircle.style.height = '140px';
            } else if (window.innerWidth <= 375) {
                progressCircle.style.width = '160px';
                progressCircle.style.height = '160px';
            } else {
                progressCircle.style.width = '180px';
                progressCircle.style.height = '180px';
            }
        }
    }

    handleOnlineStatus(isOnline) {
        if (isOnline) {
            console.log('🌐 App back online');
            showNotification('📶 Connection restored');
        } else {
            console.log('📴 App offline');
            showNotification('📴 Working offline');
        }
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
        
        // If more than 2 minutes have passed and timer is running, pause it
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
            this.trackEvent('pwa_installed');
        });

        // Handle PWA display mode
        const mediaQuery = window.matchMedia('(display-mode: standalone)');
        mediaQuery.addListener((e) => {
            if (e.matches) {
                console.log('📱 Switched to standalone mode');
                document.body.classList.add('pwa-standalone');
            } else {
                console.log('🌐 Switched to browser mode');
                document.body.classList.remove('pwa-standalone');
            }
        });
    }

    showInstallPrompt() {
        console.log('📱 PWA install prompt available');
        // Show a subtle hint about installation
        setTimeout(() => {
            showNotification('📱 Install Quest Timer as an app for the best experience!', 5000);
        }, 30000); // Show after 30 seconds
    }

    installPWA() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            this.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('📱 User accepted PWA install');
                    this.trackEvent('pwa_install_accepted');
                } else {
                    console.log('📱 User dismissed PWA install');
                    this.trackEvent('pwa_install_dismissed');
                }
                this.deferredPrompt = null;
            });
        }
    }

    // ===== ANALYTICS & TRACKING =====

    trackEvent(eventName, properties = {}) {
        console.log('📊 Event:', eventName, properties);
        
        // Add common properties
        const eventData = {
            ...properties,
            timestamp: Date.now(),
            level: this.rpgSystem.level,
            completedSessions: this.rpgSystem.completedSessions,
            isPWA: window.matchMedia('(display-mode: standalone)').matches,
            screenWidth: window.innerWidth,
            userAgent: navigator.userAgent.substring(0, 100) // Truncated for privacy
        };
        
        // Store event for later analytics (could be sent to server)
        const events = loadFromStorage('analytics_events', []);
        events.push({ event: eventName, data: eventData });
        
        // Keep only last 100 events
        if (events.length > 100) {
            events.splice(0, events.length - 100);
        }
        
        saveToStorage('analytics_events', events);
    }

    // ===== ERROR HANDLING =====

    handleError(error, context = 'Unknown') {
        console.error(`❌ Error in ${context}:`, error);
        
        showNotification('⚠️ Something went wrong. Progress has been saved.');
        
        // Save progress to prevent data loss
        this.rpgSystem.saveProgress();
        
        // Track error for debugging
        this.trackEvent('error', {
            context,
            message: error.message,
            stack: error.stack?.substring(0, 500) // Truncated stack trace
        });
    }

    // ===== PUBLIC API =====

    getAppState() {
        return {
            timer: this.timer.getSessionInfo(),
            rpg: this.rpgSystem.getStats(),
            sound: this.soundSystem.getSettings(),
            isDebugMode: this.debugMode.isEnabled,
            isPWA: window.matchMedia('(display-mode: standalone)').matches,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
    }

    exportAppData() {
        const data = {
            exportDate: new Date().toISOString(),
            version: '2.0.0-bottom-nav',
            ...this.rpgSystem.getStats(),
            soundSettings: this.soundSystem.getSettings(),
            timerSettings: this.timer.getSessionInfo()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quest-timer-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.trackEvent('data_exported');
        return data;
    }

    // ===== PERFORMANCE MONITORING =====

    measurePerformance() {
        if ('performance' in window) {
            const perfData = {
                navigation: performance.getEntriesByType('navigation')[0],
                memory: performance.memory,
                timing: {
                    domLoad: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
                    windowLoad: performance.timing.loadEventEnd - performance.timing.navigationStart
                }
            };
            
            console.log('📈 Performance metrics:', perfData);
            this.trackEvent('performance_measured', perfData);
            
            return perfData;
        }
    }
}

// ===== INITIALIZATION =====

// Global error handler
window.addEventListener('error', (e) => {
    console.error('💥 Global error:', e.error);
    try {
        if (window.questTimer) {
            window.questTimer.handleError(e.error, 'global');
        }
    } catch (saveError) {
        console.error('💾 Failed to save progress on error:', saveError);
    }
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
    console.error('💥 Unhandled promise rejection:', e.reason);
    try {
        if (window.questTimer) {
            window.questTimer.handleError(e.reason, 'promise');
        }
    } catch (saveError) {
        console.error('💾 Failed to save progress on promise error:', saveError);
    }
});

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Create global app instance
        window.questTimer = new QuestTimerApp();
        
        // Make debug functions globally available in development
        if (loadFromStorage('debugModeEnabled', false) || location.hostname === 'localhost') {
            window.debug = {
                app: window.questTimer,
                timer: window.questTimer.timer,
                rpg: window.questTimer.rpgSystem,
                sound: window.questTimer.soundSystem,
                debug: window.questTimer.debugMode,
                exportData: () => window.questTimer.exportAppData(),
                getState: () => window.questTimer.getAppState(),
                performance: () => window.questTimer.measurePerformance()
            };
            console.log('🔧 Debug utilities available at window.debug');
        }
        
        // Measure initial performance
        setTimeout(() => {
            window.questTimer.measurePerformance();
        }, 1000);
        
        console.log('⚔️ Quest Timer Bottom Nav - Ready!');
        console.log('🎮 Keyboard shortcuts: Space (start/pause), R (reset), A (achievements), Escape (close)');
        
    } catch (error) {
        console.error('💥 Failed to initialize Quest Timer:', error);
        document.body.innerHTML = `
            <div style="text-align: center; padding: 50px; color: #e5e7eb; max-width: 400px; margin: 0 auto;">
                <h1 style="color: #ef4444;">⚠️ Initialization Error</h1>
                <p style="margin: 1rem 0;">Failed to start Quest Timer. Please refresh the page.</p>
                <button onclick="location.reload()" style="padding: 1rem 2rem; border: none; border-radius: 8px; background: #6366f1; color: white; cursor: pointer; font-size: 1rem;">
                    🔄 Refresh Page
                </button>
                <details style="margin-top: 2rem; text-align: left;">
                    <summary style="cursor: pointer; color: #9ca3af;">Error Details</summary>
                    <pre style="background: rgba(0,0,0,0.5); padding: 1rem; border-radius: 8px; margin-top: 1rem; overflow: auto; font-size: 0.8rem;">${error.stack}</pre>
                </details>
            </div>
        `;
    }
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QuestTimerApp };
}