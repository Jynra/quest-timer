// ===== DEBUG MODE MODULE - PWA STANDALONE COMPATIBLE =====

class DebugMode {
    constructor(timer, rpgSystem) {
        this.timer = timer;
        this.rpgSystem = rpgSystem;
        this.isEnabled = false;
        
        this.initializeDebugPanel();
        this.setupEventListeners();
    }

    initializeDebugPanel() {
        this.debugToggle = document.getElementById('debugToggle');
        this.debugPanel = document.getElementById('debugPanel');
        
        // Check if debug mode was previously enabled
        this.isEnabled = loadFromStorage('debugModeEnabled', false);
        if (this.isEnabled) {
            this.showPanel();
        }
    }

    setupEventListeners() {
        // Toggle debug panel
        this.debugToggle.addEventListener('click', () => {
            this.togglePanel();
        });

        // Debug controls
        this.setupDebugControls();
        
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
                }
            }
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
        
        showNotification('🐛 Debug Mode Enabled');
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
        console.groupEnd();
    }

    // ===== DEBUG ACTIONS =====

    fastForward(minutes = 5) {
        this.timer.fastForward(minutes);
        showNotification(`⏩ Skipped ${minutes} minutes`);
        console.log(`⏩ Fast forwarded ${minutes} minutes`);
    }

    // CORRECTION PRINCIPALE : Complete Session pour PWA Standalone
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
            }, 100); // Délai pour PWA standalone
        }, 50); // Délai initial pour PWA standalone
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
        const wasReset = this.rpgSystem.resetAllProgress();
        if (wasReset) {
            // Also reset timer if needed
            this.timer.resetTimer();
            console.log('💀 All progress reset');
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
            pwaModeStandalone: this.isPWAStandalone()
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
            pwaModeStandalone: this.isPWAStandalone()
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