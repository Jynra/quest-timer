// ===== DEBUG MODE MODULE WITH HOT RELOAD =====

class DebugMode {
    constructor(timer, rpgSystem) {
        this.timer = timer;
        this.rpgSystem = rpgSystem;
        this.isEnabled = false;
        
        // 🔥 CORRECTION: Détection d'environnement FLEXIBLE
        this.isDevelopment = this.detectDevelopmentMode();
        
        this.initializeDebugPanel();
        this.setupEventListeners();
    }

    // 🔥 NOUVELLE MÉTHODE: Détection flexible
    detectDevelopmentMode() {
        // 1. Hostname localhost
        const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
        
        // 2. Port de développement
        const isDevPort = location.port === '3046';
        
        // 3. Override localStorage
        const forceHotReload = localStorage.getItem('forceHotReload') === 'true';
        
        // 4. Query parameter ?dev=true
        const devParam = new URLSearchParams(location.search).get('dev') === 'true';
        
        const result = true;
        
        console.log(`🔥 Hot Reload Detection: ${result}`, {
            hostname: location.hostname,
            port: location.port,
            isLocalhost,
            isDevPort,
            forceHotReload,
            devParam
        });
        
        return result;
    }

    // 🔥 NOUVELLE MÉTHODE: Activer Hot Reload manuellement
    enableHotReload() {
        localStorage.setItem('forceHotReload', 'true');
        this.isDevelopment = true;
        
        // Ajouter les contrôles Hot Reload si pas déjà fait
        if (!document.getElementById('hardReload')) {
            this.addHotReloadControls();
            this.setupHotReloadControls();
        }
        
        showNotification('🔥 Hot Reload ENABLED!');
        console.log('🔥 Hot Reload manually enabled');
        
        return this;
    }

    initializeDebugPanel() {
        this.debugToggle = document.getElementById('debugToggle');
        this.debugPanel = document.getElementById('debugPanel');
        
        // Check if debug mode was previously enabled
        this.isEnabled = loadFromStorage('debugModeEnabled', false);
        if (this.isEnabled) {
            this.showPanel();
        }
        
        // 🔥 HOT RELOAD: Add hot reload buttons to existing debug panel
        if (this.isDevelopment) {
            this.addHotReloadControls();
        }
    }

    setupEventListeners() {
        // Toggle debug panel
        this.debugToggle.addEventListener('click', () => {
            this.togglePanel();
        });

        // Debug controls
        this.setupDebugControls();
        
        // 🔥 HOT RELOAD: Setup hot reload controls
        if (this.isDevelopment) {
            this.setupHotReloadControls();
        }
        
        // Keyboard shortcuts (only when debug mode is enabled)
        document.addEventListener('keydown', (e) => {
            if (!this.isEnabled) return;
            
            // Ctrl + Shift + [key] combinations
            if (e.ctrlKey && e.shiftKey) {
                switch(e.key) {
                    case 'F':
                        e.preventDefault();
                        this.fastForward();
                        break;
                    case 'C':
                        e.preventDefault();
                        this.completeSession();
                        break;
                    case 'X':
                        e.preventDefault();
                        this.addXP();
                        break;
                    case 'L':
                        e.preventDefault();
                        this.levelUp();
                        break;
                    case 'S':
                        e.preventDefault();
                        this.addStreak();
                        break;
                    case 'A':
                        e.preventDefault();
                        this.unlockAchievement();
                        break;
                    // 🔥 HOT RELOAD: Hot reload shortcuts
                    case 'R':
                        if (this.isDevelopment) {
                            e.preventDefault();
                            this.clearCacheAndReload();
                        }
                        break;
                    case 'H':
                        if (this.isDevelopment) {
                            e.preventDefault();
                            this.togglePanel(); // Show debug panel with hot reload tools
                        }
                        break;
                }
            }
        });
    }

    // 🔥 HOT RELOAD: Add hot reload controls to existing debug panel
    addHotReloadControls() {
        const debugControls = document.querySelector('.debug-controls');
        
        // Add separator
        const separator = document.createElement('div');
        separator.style.cssText = 'border-top: 1px solid #4b5563; margin: 10px 0; padding-top: 10px;';
        separator.innerHTML = '<div style="color: #10b981; font-size: 0.8rem; font-weight: bold; margin-bottom: 8px;">🔥 HOT RELOAD</div>';
        debugControls.appendChild(separator);
        
        // Hard reload button
        const hardReloadBtn = document.createElement('button');
        hardReloadBtn.className = 'debug-btn';
        hardReloadBtn.id = 'hardReload';
        hardReloadBtn.innerHTML = '🔄 Hard Reload';
        hardReloadBtn.style.background = '#059669';
        debugControls.appendChild(hardReloadBtn);
        
        // Clear cache button
        const clearCacheBtn = document.createElement('button');
        clearCacheBtn.className = 'debug-btn';
        clearCacheBtn.id = 'clearCache';
        clearCacheBtn.innerHTML = '🧹 Clear Cache';
        clearCacheBtn.style.background = '#0d9488';
        debugControls.appendChild(clearCacheBtn);
        
        // SW version button
        const swVersionBtn = document.createElement('button');
        swVersionBtn.className = 'debug-btn';
        swVersionBtn.id = 'swVersion';
        swVersionBtn.innerHTML = '📦 SW Version';
        swVersionBtn.style.background = '#0891b2';
        debugControls.appendChild(swVersionBtn);
        
        // Hot reload status
        const statusDiv = document.createElement('div');
        statusDiv.style.cssText = 'font-size: 0.75rem; color: #10b981; margin-top: 5px; text-align: center;';
        statusDiv.innerHTML = '✅ Hot Reload Active';
        debugControls.appendChild(statusDiv);
    }

    // 🔥 HOT RELOAD: Setup hot reload event listeners
    setupHotReloadControls() {
        // Hard reload
        document.getElementById('hardReload')?.addEventListener('click', () => {
            this.hardReload();
        });

        // Clear cache
        document.getElementById('clearCache')?.addEventListener('click', () => {
            this.clearCacheAndReload();
        });

        // SW version
        document.getElementById('swVersion')?.addEventListener('click', () => {
            this.getServiceWorkerVersion();
        });
    }

    setupDebugControls() {
        // Fast forward timer
        document.getElementById('fastForward').addEventListener('click', () => {
            this.fastForward();
        });

        // Complete session instantly
        document.getElementById('completeSession').addEventListener('click', () => {
            this.completeSession();
        });

        // Add XP
        document.getElementById('addXP').addEventListener('click', () => {
            this.addXP();
        });

        // Force level up
        document.getElementById('levelUp').addEventListener('click', () => {
            this.levelUp();
        });

        // Add streak
        document.getElementById('addStreak').addEventListener('click', () => {
            this.addStreak();
        });

        // Unlock random achievement
        document.getElementById('unlockAchievement').addEventListener('click', () => {
            this.unlockAchievement();
        });

        // Reset all progress
        document.getElementById('resetProgress').addEventListener('click', () => {
            this.resetProgress();
        });
    }

    togglePanel() {
        this.isEnabled = !this.isEnabled;
        
        if (this.isEnabled) {
            this.showPanel();
        } else {
            this.hidePanel();
        }
        
        saveToStorage('debugModeEnabled', this.isEnabled);
    }

    showPanel() {
        this.debugPanel.classList.add('show');
        this.debugToggle.style.background = '#8b5cf6';
        this.debugToggle.textContent = '🛠️';
        
        // 🔥 HOT RELOAD: Show different message based on hot reload availability
        const message = this.isDevelopment ? 
            '🐛 Debug Mode + Hot Reload Enabled' : 
            '🐛 Debug Mode Enabled';
        showNotification(message);
        
        this.logDebugInfo();
    }

    hidePanel() {
        this.debugPanel.classList.remove('show');
        this.debugToggle.style.background = '#6366f1';
        this.debugToggle.textContent = '🐛';
        
        showNotification('Debug Mode Disabled');
    }

    logDebugInfo() {
        console.group('🐛 Quest Timer Debug Info');
        console.log('Timer State:', this.timer.getSessionInfo());
        console.log('RPG Stats:', this.rpgSystem.getStats());
        console.log('PWA Mode:', window.matchMedia('(display-mode: standalone)').matches ? 'Standalone' : 'Browser');
        
        // 🔥 HOT RELOAD: Add hot reload info
        if (this.isDevelopment) {
            console.log('🔥 Hot Reload: ACTIVE');
            console.log('🔥 Environment: Development');
        }
        
        console.log('Storage Data:', {
            level: loadFromStorage('level'),
            xp: loadFromStorage('xp'),
            completedSessions: loadFromStorage('completedSessions'),
            achievements: loadFromStorage('achievements')
        });
        console.log('Keyboard Shortcuts:');
        console.log('  Ctrl+Shift+F: Fast Forward');
        console.log('  Ctrl+Shift+C: Complete Session');
        console.log('  Ctrl+Shift+X: Add XP');
        console.log('  Ctrl+Shift+L: Level Up');
        console.log('  Ctrl+Shift+S: Add Streak');
        console.log('  Ctrl+Shift+A: Random Achievement');
        
        // 🔥 HOT RELOAD: Add hot reload shortcuts
        if (this.isDevelopment) {
            console.log('🔥 Hot Reload Shortcuts:');
            console.log('  Ctrl+Shift+R: Clear Cache + Reload');
            console.log('  Ctrl+Shift+H: Toggle Debug Panel');
        }
        
        console.groupEnd();
    }

    // ===== DEBUG ACTIONS =====

    fastForward(minutes = 5) {
        this.timer.fastForward(minutes);
        showNotification(`⏩ Skipped ${minutes} minutes`);
        console.log(`⏩ Fast forwarded ${minutes} minutes`);
    }

    completeSession() {
        const wasBreak = this.timer.isBreak;
        const sessionCount = this.timer.currentSessionCount;
        
        console.log('🔧 Debug: Starting force complete session...');
        console.log('🔧 Initial state:', { wasBreak, sessionCount, isRunning: this.timer.isRunning });
        
        // Force arrêter le timer si il tourne
        if (this.timer.isRunning) {
            this.timer.pauseTimer();
        }
        
        // Force compléter la session avec délai pour PWA standalone
        this.timer.currentTime = 0;
        this.timer.updateDisplay();
        this.timer.updateProgressRing();
        
        // Utiliser setTimeout pour assurer l'exécution en mode standalone
        setTimeout(() => {
            console.log('🔧 Debug: Triggering complete session...');
            this.timer.completeSession();
            
            // Double vérification après un autre délai
            setTimeout(() => {
                console.log('🔧 Debug: Verifying session state...');
                const newState = this.timer.getSessionInfo();
                console.log('🔧 New state:', newState);
                
                // Force mise à jour de l'affichage
                this.timer.updateDisplay();
                this.timer.updateProgressRing();
                
                // Messages informatifs améliorés
                if (wasBreak) {
                    showNotification(`🔄 Debug: Break completed → Focus session ready`);
                    console.log('🔄 Debug: Break completed, switched to focus session');
                } else {
                    const nextIsLongBreak = (sessionCount + 1) % 4 === 0;
                    const breakType = nextIsLongBreak ? 'Long Break (15min)' : 'Short Break (5min)';
                    showNotification(`✅ Debug: Focus completed → ${breakType} ready`);
                    console.log(`✅ Debug: Focus session completed, switched to ${breakType}`);
                }
            }, 100);
        }, 50);
    }

    addXP(amount = 100) {
        this.rpgSystem.addDebugXP(amount);
        showNotification(`⭐ Added ${amount} XP`);
        console.log(`⭐ Added ${amount} XP`);
    }

    levelUp() {
        const currentLevel = this.rpgSystem.level;
        const xpNeeded = this.rpgSystem.getXPForLevel(currentLevel + 1) - this.rpgSystem.xp;
        this.rpgSystem.gainXP(xpNeeded);
        showNotification(`🚀 Forced level up to ${this.rpgSystem.level}`);
        console.log(`🚀 Forced level up from ${currentLevel} to ${this.rpgSystem.level}`);
    }

    addStreak() {
        this.rpgSystem.forceStreak();
        showNotification(`🔥 Streak increased to ${this.rpgSystem.currentStreak}`);
        console.log(`🔥 Streak increased to ${this.rpgSystem.currentStreak}`);
    }

    unlockAchievement() {
        this.rpgSystem.unlockRandomAchievement();
        console.log('🏆 Random achievement unlocked');
    }

    resetProgress() {
        if (confirm('⚠️ This will reset ALL your progress AND return to initial state! Are you sure?')) {
            console.log('💀 Starting complete reset...');
            
            // 1. Reset RPG System
            const wasReset = this.rpgSystem.resetAllProgress();
            
            if (wasReset) {
                // 2. Reset Timer to initial state
                console.log('🔄 Resetting timer to initial state...');
                this.timer.resetToInitialState();
                
                // 3. Clear any debug state
                console.log('🧹 Clearing debug state...');
                
                // 4. Confirmation and logging
                console.log('💀 Complete reset finished:');
                console.log('  - RPG progress: RESET');
                console.log('  - Timer state: RESET to Focus Quest');
                console.log('  - Session count: RESET to 0');
                console.log('  - All displays: UPDATED');
                
                showNotification('🔄 Complete reset successful! Ready for a new quest!');
                
                // 5. Visual feedback
                const characterCard = document.querySelector('.character-card');
                const timerSection = document.querySelector('.timer-section');
                
                addTemporaryClass(characterCard, 'pulse', 2000);
                addTemporaryClass(timerSection, 'pulse', 2000);
                
                return true;
            }
            return false;
        }
        return false;
    }

    // ===== HOT RELOAD ACTIONS =====

    // 🔥 HOT RELOAD: Hard reload
    hardReload() {
        showNotification('🔄 Hard reloading...');
        console.log('🔥 Hot Reload: Hard reload initiated');
        setTimeout(() => {
            location.reload(true);
        }, 500);
    }

    // 🔥 CORRECTION: Clear cache amélioré
    clearCacheAndReload() {
        showNotification('🧹 Clearing cache...');
        console.log('🔥 Hot Reload: Clearing cache and reloading');
        
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                const messageChannel = new MessageChannel();
                messageChannel.port1.onmessage = (event) => {
                    if (event.data.success) {
                        console.log('🧹 Cache cleared successfully');
                        setTimeout(() => location.reload(true), 1000);
                    }
                };
                
                registration.active.postMessage({
                    type: 'CLEAR_CACHE',
                    force: true  // 🔥 NOUVEAU: Force clear même en production
                }, [messageChannel.port2]);
            });
        } else {
            // Fallback: clear browser cache
            if ('caches' in window) {
                caches.keys().then(names => {
                    names.forEach(name => {
                        if (name.startsWith('quest-timer')) {
                            caches.delete(name);
                        }
                    });
                }).then(() => {
                    setTimeout(() => location.reload(true), 1000);
                });
            }
        }
    }

    // 🔥 HOT RELOAD: Get Service Worker version
    getServiceWorkerVersion() {
        console.log('🔥 Hot Reload: Getting Service Worker version...');
        
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                const messageChannel = new MessageChannel();
                messageChannel.port1.onmessage = (event) => {
                    const { version, cacheName, isDevelopment } = event.data;
                    const message = `SW v${version} (${isDevelopment ? 'Dev' : 'Prod'})`;
                    showNotification(`📦 ${message}`);
                    console.log('🔥 Hot Reload Info:', {
                        version,
                        cacheName,
                        isDevelopment,
                        timestamp: new Date(event.data.timestamp)
                    });
                };
                
                registration.active.postMessage({
                    type: 'GET_VERSION'
                }, [messageChannel.port2]);
            });
        } else {
            showNotification('❌ Service Worker not available');
        }
    }

    // ===== PWA STANDALONE UTILITIES =====
    
    isPWAStandalone() {
        return window.matchMedia('(display-mode: standalone)').matches || 
               window.navigator.standalone === true;
    }
    
    logPWAMode() {
        const isStandalone = this.isPWAStandalone();
        console.log(`📱 PWA Mode: ${isStandalone ? 'Standalone' : 'Browser'}`);
        if (isStandalone) {
            console.log('🔧 Using PWA-specific timing adjustments');
        }
    }

    // ===== TESTING UTILITIES =====

    runStressTest() {
        console.log('🧪 Running stress test...');
        
        // Simulate multiple sessions
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this.rpgSystem.completeSession();
                console.log(`Session ${i + 1} completed`);
            }, i * 100);
        }
        
        showNotification('🧪 Stress test completed');
    }

    simulateProgressionPath() {
        console.log('📈 Simulating progression path...');
        
        const sessions = [1, 5, 10, 25, 50, 100];
        let currentIndex = 0;
        
        const simulate = () => {
            if (currentIndex < sessions.length) {
                const targetSessions = sessions[currentIndex];
                const sessionsToAdd = targetSessions - this.rpgSystem.completedSessions;
                
                for (let i = 0; i < sessionsToAdd; i++) {
                    this.rpgSystem.completeSession();
                }
                
                console.log(`Simulated ${targetSessions} total sessions`);
                currentIndex++;
                
                setTimeout(simulate, 1000);
            } else {
                console.log('📈 Progression simulation complete');
                showNotification('📈 Progression simulation complete');
            }
        };
        
        simulate();
    }

    exportProgress() {
        const data = {
            exportDate: new Date().toISOString(),
            level: this.rpgSystem.level,
            xp: this.rpgSystem.xp,
            completedSessions: this.rpgSystem.completedSessions,
            totalMinutes: this.rpgSystem.totalMinutes,
            currentStreak: this.rpgSystem.currentStreak,
            bestStreak: this.rpgSystem.bestStreak,
            achievements: this.rpgSystem.achievements,
            lastActiveDate: this.rpgSystem.lastActiveDate,
            pwaModeStandalone: this.isPWAStandalone(),
            hotReloadEnabled: this.isDevelopment
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quest-timer-progress-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        showNotification('📤 Progress exported');
        console.log('📤 Progress exported:', data);
    }

    importProgress() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        
                        // Validate data structure
                        if (this.validateImportData(data)) {
                            this.applyImportData(data);
                            showNotification('📥 Progress imported successfully');
                            console.log('📥 Progress imported:', data);
                        } else {
                            throw new Error('Invalid data structure');
                        }
                    } catch (error) {
                        showNotification('❌ Import failed: Invalid file');
                        console.error('Import error:', error);
                    }
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    }

    validateImportData(data) {
        const requiredFields = ['level', 'xp', 'completedSessions', 'totalMinutes'];
        return requiredFields.every(field => typeof data[field] === 'number');
    }

    applyImportData(data) {
        // Update RPG system with imported data
        this.rpgSystem.level = data.level || 1;
        this.rpgSystem.xp = data.xp || 0;
        this.rpgSystem.completedSessions = data.completedSessions || 0;
        this.rpgSystem.totalMinutes = data.totalMinutes || 0;
        this.rpgSystem.currentStreak = data.currentStreak || 0;
        this.rpgSystem.bestStreak = data.bestStreak || 0;
        this.rpgSystem.achievements = data.achievements || [];
        this.rpgSystem.lastActiveDate = data.lastActiveDate || '';
        
        // Save and update display
        this.rpgSystem.saveProgress();
        this.rpgSystem.updateDisplay();
    }

    // ===== PERFORMANCE MONITORING =====

    startPerformanceMonitoring() {
        console.log('📊 Starting performance monitoring...');
        this.logPWAMode();
        
        this.performanceData = {
            startTime: performance.now(),
            memoryUsage: [],
            frameRates: [],
            timerAccuracy: [],
            pwaModeStandalone: this.isPWAStandalone(),
            hotReloadEnabled: this.isDevelopment
        };
        
        // Monitor memory usage (if available)
        if (performance.memory) {
            this.memoryMonitor = setInterval(() => {
                this.performanceData.memoryUsage.push({
                    timestamp: Date.now(),
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize
                });
            }, 5000);
        }
        
        // Monitor timer accuracy
        this.timerAccuracyMonitor = setInterval(() => {
            const sessionInfo = this.timer.getSessionInfo();
            if (sessionInfo.isRunning) {
                this.performanceData.timerAccuracy.push({
                    timestamp: Date.now(),
                    currentTime: sessionInfo.currentTime,
                    progress: sessionInfo.progress
                });
            }
        }, 1000);
        
        showNotification('📊 Performance monitoring started');
    }

    stopPerformanceMonitoring() {
        if (this.memoryMonitor) {
            clearInterval(this.memoryMonitor);
        }
        if (this.timerAccuracyMonitor) {
            clearInterval(this.timerAccuracyMonitor);
        }
        
        const duration = performance.now() - this.performanceData.startTime;
        
        console.group('📊 Performance Report');
        console.log('Monitoring Duration:', `${Math.round(duration)}ms`);
        console.log('PWA Mode:', this.performanceData.pwaModeStandalone ? 'Standalone' : 'Browser');
        console.log('Hot Reload:', this.performanceData.hotReloadEnabled ? 'Enabled' : 'Disabled');
        console.log('Memory Samples:', this.performanceData.memoryUsage.length);
        console.log('Timer Accuracy Samples:', this.performanceData.timerAccuracy.length);
        
        if (this.performanceData.memoryUsage.length > 0) {
            const memoryStats = this.calculateMemoryStats();
            console.log('Memory Usage:', memoryStats);
        }
        
        console.groupEnd();
        
        showNotification('📊 Performance monitoring stopped');
        
        return this.performanceData;
    }

    calculateMemoryStats() {
        const usage = this.performanceData.memoryUsage;
        const usedHeap = usage.map(u => u.used);
        
        return {
            min: Math.min(...usedHeap),
            max: Math.max(...usedHeap),
            avg: usedHeap.reduce((a, b) => a + b, 0) / usedHeap.length,
            samples: usage.length
        };
    }

    // ===== DEVELOPER UTILITIES =====

    injectTestData() {
        console.log('🧪 Injecting test data...');
        
        // Create realistic test progression
        this.rpgSystem.completedSessions = 47;
        this.rpgSystem.totalMinutes = 47 * 25; // Realistic time
        this.rpgSystem.currentStreak = 8;
        this.rpgSystem.bestStreak = 15;
        this.rpgSystem.xp = 2400; // Should put user around level 5-6
        
        // Calculate appropriate level for XP
        let level = 1;
        while (this.rpgSystem.getXPForLevel(level + 1) <= this.rpgSystem.xp) {
            level++;
        }
        this.rpgSystem.level = level;
        
        // Add some test achievements
        const testAchievements = [
            { id: 'first_quest', title: 'First Quest', desc: 'Complete your first Pomodoro', icon: '🎯', timestamp: Date.now() - 86400000 },
            { id: 'dedicated', title: 'Dedicated', desc: 'Complete 10 Pomodoros', icon: '💪', timestamp: Date.now() - 3600000 },
            { id: 'streak_5', title: 'Streak Warrior', desc: 'Maintain a 5-day streak', icon: '🔥', timestamp: Date.now() - 1800000 }
        ];
        
        this.rpgSystem.achievements = testAchievements;
        this.rpgSystem.lastActiveDate = new Date().toDateString();
        
        this.rpgSystem.saveProgress();
        this.rpgSystem.updateDisplay();
        
        showNotification('🧪 Test data injected');
    }

    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            pwaModeStandalone: this.isPWAStandalone(),
            hotReloadEnabled: this.isDevelopment,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            timer: this.timer.getSessionInfo(),
            rpg: this.rpgSystem.getStats(),
            storage: {
                available: 'localStorage' in window,
                usage: this.calculateStorageUsage()
            },
            performance: performance.memory ? {
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            } : null
        };
        
        console.group('📋 Quest Timer Report');
        console.log(report);
        console.groupEnd();
        
        return report;
    }

    calculateStorageUsage() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length;
            }
        }
        return `${total} characters`;
    }
}