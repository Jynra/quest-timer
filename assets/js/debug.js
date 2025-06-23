// ===== DEBUG MODE MODULE =====

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
        // CORRECTION: Utiliser directement gainXP au lieu de addDebugXP
        const beforeXP = this.rpgSystem.xp;
        const beforeLevel = this.rpgSystem.level;
        
        this.rpgSystem.xp += amount; // Ajouter XP directement
        this.rpgSystem.showFloatingXP(amount); // Afficher l'animation XP
        
        // Vérifier level up manuellement
        const xpForCurrentLevel = this.rpgSystem.getXPForLevel(this.rpgSystem.level);
        if (this.rpgSystem.xp >= xpForCurrentLevel) {
            this.rpgSystem.levelUp();
        }
        
        // Sauvegarder et mettre à jour
        this.rpgSystem.saveProgress();
        this.rpgSystem.updateDisplay();
        
        showNotification(`⭐ Added ${amount} XP (${beforeXP} → ${this.rpgSystem.xp})`);
        console.log(`⭐ Added ${amount} XP - Level ${beforeLevel} → ${this.rpgSystem.level}`);
    }

    levelUp() {
        const currentLevel = this.rpgSystem.level;
        const currentXP = this.rpgSystem.xp;
        
        // CORRECTION: Calculer l'XP exact nécessaire pour le niveau actuel
        const xpForCurrentLevel = this.rpgSystem.getXPForLevel(currentLevel);
        const xpNeeded = xpForCurrentLevel - currentXP;
        
        console.log(`🚀 Debug Level Up:`);
        console.log(`   Current Level: ${currentLevel}`);
        console.log(`   Current XP: ${currentXP}`);
        console.log(`   XP needed for level ${currentLevel}: ${xpForCurrentLevel}`);
        console.log(`   XP to add: ${xpNeeded}`);
        
        if (xpNeeded > 0) {
            // Ajouter exactement l'XP nécessaire
            this.rpgSystem.xp += xpNeeded;
            this.rpgSystem.showFloatingXP(xpNeeded);
        }
        
        // Forcer le level up
        this.rpgSystem.levelUp();
        
        showNotification(`🚀 Debug Level Up: ${currentLevel} → ${this.rpgSystem.level}`);
        console.log(`🚀 Debug Level Up completed: ${currentLevel} → ${this.rpgSystem.level}`);
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