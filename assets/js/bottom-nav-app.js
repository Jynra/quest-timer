// ===== BOTTOM NAV QUEST TIMER APPLICATION =====

class BottomNavQuestTimer {
    constructor() {
        // Core timer properties
        this.focusTime = 25 * 60; // 25 minutes
        this.breakTime = 5 * 60;  // 5 minutes
        this.longBreakTime = 15 * 60; // 15 minutes
        this.currentTime = this.focusTime;
        this.isRunning = false;
        this.isBreak = false;
        this.sessionCount = 0;
        this.timer = null;
        
        // RPG Stats - Load from localStorage with defaults
        this.level = parseInt(localStorage.getItem('level') || '1');
        this.xp = parseInt(localStorage.getItem('xp') || '0');
        this.completedSessions = parseInt(localStorage.getItem('completedSessions') || '0');
        this.totalMinutes = parseInt(localStorage.getItem('totalMinutes') || '0');
        this.currentStreak = parseInt(localStorage.getItem('currentStreak') || '0');
        this.achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
        
        // Sound settings
        this.soundEnabled = JSON.parse(localStorage.getItem('soundEnabled') || 'true');
        this.soundType = localStorage.getItem('soundType') || 'chime';
        this.volume = parseFloat(localStorage.getItem('soundVolume') || '0.7');
        
        // PWA install prompt
        this.deferredPrompt = null;
        
        this.init();
    }

    init() {
        console.log('⚔️ Quest Timer - Bottom Nav Design initializing...');
        this.setupElements();
        this.setupEvents();
        this.setupPWA();
        this.setupProgressRing();
        this.updateAll();
        console.log('✅ Quest Timer ready!');
    }

    setupElements() {
        // Cache all DOM elements for better performance
        this.elements = {
            // Timer elements
            timerDisplay: document.getElementById('timerDisplay'),
            sessionType: document.getElementById('sessionType'),
            startBtn: document.getElementById('startBtn'),
            resetBtn: document.getElementById('resetBtn'),
            progressCircle: document.getElementById('progressCircle'),
            statusIndicator: document.getElementById('statusIndicator'),
            
            // Character/RPG elements
            levelBadge: document.getElementById('levelBadge'),
            completedSessions: document.getElementById('completedSessions'),
            totalTime: document.getElementById('totalTime'),
            streak: document.getElementById('streak'),
            characterName: document.getElementById('characterName'),
            xpText: document.getElementById('xpText'),
            xpBar: document.getElementById('xpBar'),
            
            // Sound controls
            soundToggle: document.getElementById('soundToggle'),
            soundType: document.getElementById('soundType'),
            volumeSlider: document.getElementById('volumeSlider'),
            
            // Achievements
            achievementsList: document.getElementById('achievementsList'),
            achievementsModal: document.getElementById('achievementsModal'),
            achievementsBtn: document.getElementById('achievementsBtn'),
            closeAchievements: document.getElementById('closeAchievements'),
            
            // PWA Install
            installBanner: document.getElementById('installBanner'),
            installBtn: document.getElementById('installBtn'),
            dismissBtn: document.getElementById('dismissBtn'),
            
            // Debug panel
            debugToggle: document.getElementById('debugToggle'),
            debugPanel: document.getElementById('debugPanel'),
            
            // Notification
            notification: document.getElementById('notification')
        };

        // Verify all critical elements exist
        const criticalElements = ['timerDisplay', 'startBtn', 'resetBtn', 'progressCircle'];
        criticalElements.forEach(id => {
            if (!this.elements[id]) {
                console.error(`❌ Critical element missing: ${id}`);
            }
        });
    }

    setupEvents() {
        // Timer controls
        this.elements.startBtn?.addEventListener('click', () => this.toggleTimer());
        this.elements.resetBtn?.addEventListener('click', () => this.resetTimer());
        
        // Achievements modal
        this.elements.achievementsBtn?.addEventListener('click', () => {
            this.elements.achievementsModal?.classList.add('show');
        });
        
        this.elements.closeAchievements?.addEventListener('click', () => {
            this.elements.achievementsModal?.classList.remove('show');
        });
        
        // Debug panel
        this.elements.debugToggle?.addEventListener('click', () => {
            this.elements.debugPanel?.classList.toggle('show');
        });
        
        // Sound controls
        this.elements.soundToggle?.addEventListener('click', () => {
            this.toggleSound();
        });
        
        this.elements.soundType?.addEventListener('change', (e) => {
            this.soundType = e.target.value;
            this.saveProgress();
            if (this.soundEnabled) this.playSound('test');
        });
        
        this.elements.volumeSlider?.addEventListener('input', (e) => {
            this.volume = e.target.value / 100;
            this.saveProgress();
        });

        // PWA Install Events
        this.elements.installBtn?.addEventListener('click', () => {
            this.installPWA();
        });

        this.elements.dismissBtn?.addEventListener('click', () => {
            this.elements.installBanner?.classList.remove('show');
            localStorage.setItem('installBannerDismissed', 'true');
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Close modals on click outside
        this.elements.achievementsModal?.addEventListener('click', (e) => {
            if (e.target === this.elements.achievementsModal) {
                this.elements.achievementsModal.classList.remove('show');
            }
        });
        
        // Prevent scrolling on mobile when touching timer
        document.addEventListener('touchmove', (e) => {
            if (e.target.closest('.timer-hero')) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    handleKeyboardShortcuts(e) {
        // Skip if user is typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.toggleTimer();
                break;
            case 'KeyR':
                e.preventDefault();
                this.resetTimer();
                break;
            case 'KeyA':
                e.preventDefault();
                this.elements.achievementsModal?.classList.toggle('show');
                break;
            case 'Escape':
                this.elements.achievementsModal?.classList.remove('show');
                this.elements.debugPanel?.classList.remove('show');
                break;
            case 'KeyS':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.toggleSound();
                }
                break;
        }
    }

    setupPWA() {
        // Register Service Worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js')
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
            this.showInstallBanner();
        });

        // Handle PWA install completion
        window.addEventListener('appinstalled', () => {
            console.log('📱 PWA installed');
            this.elements.installBanner?.classList.remove('show');
            this.showNotification('📱 Quest Timer installed as app!');
            this.deferredPrompt = null;
        });

        // Request notification permission
        this.requestNotificationPermission();
    }

    showInstallBanner() {
        const dismissed = localStorage.getItem('installBannerDismissed');
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        
        if (!dismissed && !isStandalone && this.deferredPrompt) {
            setTimeout(() => {
                this.elements.installBanner?.classList.add('show');
            }, 5000); // Show after 5 seconds
        }
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
                this.elements.installBanner?.classList.remove('show');
            });
        }
    }

    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                console.log('🔔 Notification permission:', permission);
            });
        }
    }

    setupProgressRing() {
        const radius = 80;
        const circumference = 2 * Math.PI * radius;
        if (this.elements.progressCircle) {
            this.elements.progressCircle.style.strokeDasharray = circumference;
            this.elements.progressCircle.style.strokeDashoffset = circumference;
        }
    }

    updateProgressRing() {
        if (!this.elements.progressCircle) return;
        
        const totalTime = this.isBreak ? this.getBreakTime() : this.focusTime;
        const progress = (totalTime - this.currentTime) / totalTime;
        const radius = 80;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (progress * circumference);
        this.elements.progressCircle.style.strokeDashoffset = offset;
    }

    // ===== TIMER METHODS =====

    toggleTimer() {
        if (this.isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }

    startTimer() {
        this.isRunning = true;
        if (this.elements.startBtn) {
            this.elements.startBtn.textContent = 'Pause Quest';
            this.elements.startBtn.className = 'btn btn-secondary';
        }
        if (this.elements.statusIndicator) {
            this.elements.statusIndicator.textContent = 'Quest in progress...';
        }
        
        this.timer = setInterval(() => {
            this.currentTime--;
            this.updateDisplay();
            this.updateProgressRing();
            
            if (this.currentTime <= 0) {
                this.completeSession();
            }
        }, 1000);
    }

    pauseTimer() {
        this.isRunning = false;
        if (this.elements.startBtn) {
            this.elements.startBtn.textContent = 'Resume Quest';
            this.elements.startBtn.className = 'btn btn-primary';
        }
        if (this.elements.statusIndicator) {
            this.elements.statusIndicator.textContent = 'Quest paused';
        }
        clearInterval(this.timer);
    }

    resetTimer() {
        this.isRunning = false;
        this.currentTime = this.isBreak ? this.getBreakTime() : this.focusTime;
        if (this.elements.startBtn) {
            this.elements.startBtn.textContent = 'Start Quest';
            this.elements.startBtn.className = 'btn btn-primary';
        }
        if (this.elements.statusIndicator) {
            this.elements.statusIndicator.textContent = 'Ready for your next quest';
        }
        clearInterval(this.timer);
        this.updateDisplay();
        this.updateProgressRing();
    }

    completeSession() {
        clearInterval(this.timer);
        this.isRunning = false;
        
        if (!this.isBreak) {
            // Focus session completed
            this.sessionCount++;
            this.completedSessions++;
            this.totalMinutes += 25;
            
            const xpGained = 55 + (this.level * 5);
            this.gainXP(xpGained);
            this.checkAchievements();
            this.playSound('focus');
            
            this.isBreak = true;
            this.currentTime = this.getBreakTime();
            if (this.elements.sessionType) {
                this.elements.sessionType.textContent = this.sessionCount % 4 === 0 ? '🌟 Long Rest' : '☕ Short Rest';
            }
            if (this.elements.statusIndicator) {
                this.elements.statusIndicator.textContent = 'Break time! You earned it.';
            }
            
            this.showNotification(`🎉 Quest Complete! +${xpGained} XP`);
            this.showBrowserNotification('Quest Timer', `Quest Complete! +${xpGained} XP`);
        } else {
            // Break completed
            this.playSound('break');
            this.isBreak = false;
            this.currentTime = this.focusTime;
            if (this.elements.sessionType) {
                this.elements.sessionType.textContent = '🎯 Focus Quest';
            }
            if (this.elements.statusIndicator) {
                this.elements.statusIndicator.textContent = 'Ready for the next quest';
            }
            this.showNotification('Break complete! Ready for your next quest? 🎯');
            this.showBrowserNotification('Quest Timer', 'Break complete! Ready for your next quest?');
        }
        
        if (this.elements.startBtn) {
            this.elements.startBtn.textContent = 'Start Quest';
            this.elements.startBtn.className = 'btn btn-primary';
        }
        this.updateAll();
    }

    getBreakTime() {
        return this.sessionCount % 4 === 0 ? this.longBreakTime : this.breakTime;
    }

    updateDisplay() {
        if (!this.elements.timerDisplay) return;
        
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        this.elements.timerDisplay.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // ===== RPG SYSTEM METHODS =====

    gainXP(amount) {
        this.xp += amount;
        this.showFloatingXP(amount);
        
        const xpForCurrentLevel = this.getXPForLevel(this.level);
        if (this.xp >= xpForCurrentLevel) {
            this.levelUp();
        }
        
        this.updateStats();
        this.saveProgress();
    }

    getXPForLevel(level) {
        // XP progression matching the original system
        if (level === 1) return 100;
        if (level === 2) return 250;
        if (level === 3) return 450;
        if (level === 4) return 700;
        if (level === 5) return 1000;
        
        let total = 1000;
        for (let i = 6; i <= level; i++) {
            let increment = 250 + 50 * (i - 4);
            total += increment;
        }
        return total;
    }

    levelUp() {
        this.level++;
        this.showNotification(`🎊 Level Up! You are now level ${this.level}!`);
        
        // Add visual effects
        if (this.elements.levelBadge) {
            this.elements.levelBadge.classList.add('level-up-celebration');
            this.elements.levelBadge.classList.add('pulse');
            
            setTimeout(() => {
                this.elements.levelBadge.classList.remove('level-up-celebration');
                this.elements.levelBadge.classList.remove('pulse');
            }, 2000);
        }
        
        this.updateStats();
        this.saveProgress();
        this.checkAchievements();
    }

    showFloatingXP(amount) {
        const floating = document.createElement('div');
        floating.className = 'floating-xp';
        floating.textContent = `+${amount} XP`;
        floating.style.left = (window.innerWidth / 2 - 50) + 'px';
        floating.style.top = (window.innerHeight / 2) + 'px';
        document.body.appendChild(floating);
        
        setTimeout(() => {
            if (document.body.contains(floating)) {
                document.body.removeChild(floating);
            }
        }, 2500);
    }

    updateStats() {
        if (this.elements.levelBadge) {
            this.elements.levelBadge.textContent = `Level ${this.level} • Productivity Warrior`;
        }
        if (this.elements.completedSessions) {
            this.elements.completedSessions.textContent = this.completedSessions;
        }
        if (this.elements.totalTime) {
            this.elements.totalTime.textContent = `${Math.floor(this.totalMinutes / 60)}h ${this.totalMinutes % 60}m`;
        }
        if (this.elements.streak) {
            this.elements.streak.textContent = this.currentStreak;
        }
        
        // Update XP bar
        const currentLevelXP = this.level === 1 ? 0 : this.getXPForLevel(this.level - 1);
        const nextLevelXP = this.getXPForLevel(this.level);
        const progressXP = this.xp - currentLevelXP;
        const requiredXP = nextLevelXP - currentLevelXP;
        
        const xpProgress = (progressXP / requiredXP) * 100;
        if (this.elements.xpBar) {
            this.elements.xpBar.style.width = `${Math.min(xpProgress, 100)}%`;
        }
        if (this.elements.xpText) {
            this.elements.xpText.textContent = `${progressXP} / ${requiredXP} XP`;
        }
    }

    // ===== SOUND SYSTEM =====

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        if (this.elements.soundToggle) {
            this.elements.soundToggle.textContent = this.soundEnabled ? '🔔 Sound' : '🔇 Muted';
        }
        this.saveProgress();
        this.showNotification(this.soundEnabled ? '🔔 Sound enabled' : '🔇 Sound disabled');
    }

    playSound(type) {
        if (!this.soundEnabled) return;
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            if (this.soundType === 'chime' && type === 'focus') {
                this.playChime(audioContext);
            } else if (this.soundType === 'bell' && type === 'focus') {
                this.playBell(audioContext);
            } else if (this.soundType === 'success' && type === 'focus') {
                this.playSuccess(audioContext);
            } else {
                this.playBeep(audioContext, type === 'break' ? 600 : 800);
            }
        } catch (error) {
            console.warn('Audio failed:', error);
        }
    }

    playBeep(audioContext, frequency = 800) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.volume, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }

    playChime(audioContext) {
        const notes = [523.25, 659.25, 783.99]; // C, E, G
        notes.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = freq;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(this.volume, audioContext.currentTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.4);
            }, index * 150);
        });
    }

    playBell(audioContext) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.6);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.volume, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.6);
    }

    playSuccess(audioContext) {
        const melody = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C
        melody.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = freq;
                oscillator.type = 'triangle';
                
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(this.volume, audioContext.currentTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
            }, index * 100);
        });
    }

    // ===== ACHIEVEMENTS SYSTEM =====

    checkAchievements() {
        const defs = [
            { id: 'first_quest', title: 'First Quest', desc: 'Complete your first Pomodoro', icon: '🎯', condition: () => this.completedSessions >= 1 },
            { id: 'dedicated', title: 'Dedicated', desc: 'Complete 10 Pomodoros', icon: '💪', condition: () => this.completedSessions >= 10 },
            { id: 'focused_master', title: 'Focused Master', desc: 'Complete 25 Pomodoros', icon: '🧠', condition: () => this.completedSessions >= 25 },
            { id: 'century_club', title: 'Century Club', desc: 'Complete 100 Pomodoros', icon: '💯', condition: () => this.completedSessions >= 100 },
            { id: 'streak_5', title: 'Streak Warrior', desc: 'Maintain a 5-day streak', icon: '🔥', condition: () => this.currentStreak >= 5 },
            { id: 'streak_30', title: 'Streak Master', desc: 'Maintain a 30-day streak', icon: '🌟', condition: () => this.currentStreak >= 30 },
            { id: 'time_master', title: 'Time Master', desc: 'Focus for 10 hours total', icon: '⏰', condition: () => this.totalMinutes >= 600 },
            { id: 'marathon_runner', title: 'Marathon Runner', desc: 'Focus for 50 hours total', icon: '🏃', condition: () => this.totalMinutes >= 3000 },
            { id: 'level_5', title: 'Experienced', desc: 'Reach level 5', icon: '🎖️', condition: () => this.level >= 5 },
            { id: 'level_10', title: 'Expert', desc: 'Reach level 10', icon: '🏆', condition: () => this.level >= 10 },
            { id: 'level_20', title: 'Productivity Guru', desc: 'Reach level 20', icon: '👑', condition: () => this.level >= 20 }
        ];

        defs.forEach(achievement => {
            if (achievement.condition() && !this.achievements.find(a => a.id === achievement.id)) {
                this.addAchievement(achievement.title, achievement.desc, achievement.icon, achievement.id);
            }
        });
    }

    addAchievement(title, desc, icon, id) {
        const achievement = { id, title, desc, icon, timestamp: Date.now() };
        this.achievements.unshift(achievement);
        this.achievements = this.achievements.slice(0, 10); // Keep only recent 10
        
        this.showNotification(`🏆 Achievement Unlocked: ${title}`);
        this.showBrowserNotification('Achievement Unlocked!', title);
        
        this.updateAchievements();
        this.saveProgress();
    }

    updateAchievements() {
        if (!this.elements.achievementsList) return;
        
        this.elements.achievementsList.innerHTML = '';
        
        if (this.achievements.length === 0) {
            this.elements.achievementsList.innerHTML = `
                <div style="text-align: center; color: #9ca3af; padding: 2rem; opacity: 0.7;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">🎯</div>
                    <div>Complete quests to unlock achievements!</div>
                </div>
            `;
            return;
        }

        this.achievements.forEach((achievement, index) => {
            const item = document.createElement('div');
            item.className = 'achievement-item';
            item.style.animationDelay = `${index * 0.1}s`;
            item.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div>
                    <div class="achievement-title">${achievement.title}</div>
                    <div class="achievement-desc">${achievement.desc}</div>
                </div>
            `;
            this.elements.achievementsList.appendChild(item);
        });
    }

    // ===== NOTIFICATION SYSTEM =====

    showNotification(message, duration = 3000) {
        if (!this.elements.notification) return;
        
        this.elements.notification.textContent = message;
        this.elements.notification.classList.add('show');
        
        setTimeout(() => {
            this.elements.notification.classList.remove('show');
        }, duration);
    }

    showBrowserNotification(title, message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: './assets/icons/icon-192.png',
                badge: './assets/icons/icon-72.png',
                vibrate: [200, 100, 200],
                tag: 'quest-timer'
            });
        }
    }

    // ===== DATA PERSISTENCE =====

    saveProgress() {
        const data = {
            level: this.level,
            xp: this.xp,
            completedSessions: this.completedSessions,
            totalMinutes: this.totalMinutes,
            currentStreak: this.currentStreak,
            achievements: this.achievements,
            soundEnabled: this.soundEnabled,
            soundType: this.soundType,
            soundVolume: this.volume
        };
        
        Object.entries(data).forEach(([key, value]) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                console.warn(`Failed to save ${key}:`, error);
            }
        });
    }

    // ===== UPDATE METHODS =====

    updateAll() {
        this.updateDisplay();
        this.updateProgressRing();
        this.updateStats();
        this.updateAchievements();
        this.updateSoundControls();
    }

    updateSoundControls() {
        if (this.elements.soundToggle) {
            this.elements.soundToggle.textContent = this.soundEnabled ? '🔔 Sound' : '🔇 Muted';
        }
        if (this.elements.soundType) {
            this.elements.soundType.value = this.soundType;
        }
        if (this.elements.volumeSlider) {
            this.elements.volumeSlider.value = this.volume * 100;
        }
    }

    // ===== DEBUG METHODS =====

    debugSkipMinutes(minutes) {
        this.currentTime = Math.max(0, this.currentTime - (minutes * 60));
        this.updateDisplay();
        this.updateProgressRing();
        if (this.currentTime <= 0) this.completeSession();
        this.showNotification(`⏩ Skipped ${minutes} minute${minutes > 1 ? 's' : ''}`);
    }

    debugCompleteSession() {
        this.currentTime = 0;
        this.completeSession();
        this.showNotification('✅ Debug: Session completed');
    }

    debugAddXP(amount = 100) {
        this.gainXP(amount);
        this.showNotification(`⭐ Debug: Added ${amount} XP`);
    }

    debugLevelUp() {
        const xpNeeded = this.getXPForLevel(this.level) - this.xp;
        if (xpNeeded > 0) this.gainXP(xpNeeded);
        else this.gainXP(1); // Force level up even if already at threshold
        this.showNotification('🚀 Debug: Level up triggered');
    }

    debugTestSounds() {
        this.showNotification('🎵 Testing sounds...');
        setTimeout(() => this.playSound('focus'), 0);
        setTimeout(() => this.playSound('break'), 1000);
        setTimeout(() => this.playSound('test'), 2000);
    }

    debugReset() {
        if (confirm('⚠️ This will reset ALL progress! Are you sure?')) {
            // Clear localStorage completely
            localStorage.clear();
            
            // Reset object properties to initial values
            this.level = 1;
            this.xp = 0;
            this.completedSessions = 0;
            this.totalMinutes = 0;
            this.currentStreak = 0;
            this.achievements = [];
            this.soundEnabled = true;
            this.soundType = 'chime';
            this.volume = 0.7;
            
            // Reset timer state
            this.isRunning = false;
            this.isBreak = false;
            this.currentTime = this.focusTime;
            this.sessionCount = 0;
            clearInterval(this.timer);
            
            // Reset UI elements
            if (this.elements.startBtn) {
                this.elements.startBtn.textContent = 'Start Quest';
                this.elements.startBtn.className = 'btn btn-primary';
            }
            if (this.elements.statusIndicator) {
                this.elements.statusIndicator.textContent = 'Ready for your next quest';
            }
            if (this.elements.sessionType) {
                this.elements.sessionType.textContent = '🎯 Focus Quest';
            }
            
            // Update all displays immediately
            this.updateAll();
            
            this.showNotification('🔄 All progress reset! Ready for a fresh start!');
        }
    }

    // ===== UTILITY METHODS =====

    getAppState() {
        return {
            timer: {
                isRunning: this.isRunning,
                isBreak: this.isBreak,
                currentTime: this.currentTime,
                sessionCount: this.sessionCount
            },
            rpg: {
                level: this.level,
                xp: this.xp,
                completedSessions: this.completedSessions,
                totalMinutes: this.totalMinutes,
                currentStreak: this.currentStreak,
                achievements: this.achievements.length
            },
            sound: {
                enabled: this.soundEnabled,
                type: this.soundType,
                volume: this.volume
            }
        };
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

// ===== GLOBAL FUNCTIONS FOR DEBUG =====

// Global debug functions (accessible from debug panel buttons)
window.questTimer = null;

window.debugSkipMinutes = (minutes) => {
    if (window.questTimer) {
        window.questTimer.debugSkipMinutes(minutes);
    }
};

window.debugCompleteSession = () => {
    if (window.questTimer) {
        window.questTimer.debugCompleteSession();
    }
};

window.debugAddXP = (amount) => {
    if (window.questTimer) {
        window.questTimer.debugAddXP(amount);
    }
};

window.debugLevelUp = () => {
    if (window.questTimer) {
        window.questTimer.debugLevelUp();
    }
};

window.debugTestSounds = () => {
    if (window.questTimer) {
        window.questTimer.debugTestSounds();
    }
};

window.debugReset = () => {
    if (window.questTimer) {
        window.questTimer.debugReset();
    }
};

// ===== INITIALIZATION =====

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Create global app instance
        window.questTimer = new BottomNavQuestTimer();
        
        // Development console helpers
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            window.debug = {
                app: window.questTimer,
                getState: () => window.questTimer.getAppState(),
                skipTime: (minutes) => window.questTimer.debugSkipMinutes(minutes),
                complete: () => window.questTimer.debugCompleteSession(),
                addXP: (amount) => window.questTimer.debugAddXP(amount),
                levelUp: () => window.questTimer.debugLevelUp(),
                reset: () => window.questTimer.debugReset(),
                testSounds: () => window.questTimer.debugTestSounds()
            };
            console.log('🔧 Debug utilities available at window.debug');
        }
        
        console.log('⚔️ Quest Timer - Bottom Nav Design ready!');
        console.log('🎮 Shortcuts: Space (start/pause), R (reset), A (achievements), Escape (close)');
        console.log('📱 PWA: Ready for installation');
        
    } catch (error) {
        console.error('💥 Failed to initialize Quest Timer:', error);
        
        // Fallback error display
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #ef4444; background: rgba(239, 68, 68, 0.1); border-radius: 1rem; margin: 2rem;">
                <h2>⚠️ Initialization Error</h2>
                <p>Failed to start Quest Timer. Please refresh the page.</p>
                <button onclick="location.reload()" style="padding: 1rem 2rem; margin-top: 1rem; border: none; border-radius: 0.5rem; background: #6366f1; color: white; cursor: pointer; font-size: 1rem;">
                    Refresh Page
                </button>
                <details style="margin-top: 1rem; text-align: left;">
                    <summary style="cursor: pointer; color: #9ca3af;">Error Details</summary>
                    <pre style="margin-top: 0.5rem; padding: 1rem; background: rgba(0,0,0,0.5); border-radius: 0.5rem; overflow: auto; font-size: 0.8rem;">${error.stack || error.message}</pre>
                </details>
            </div>
        `;
        
        const container = document.querySelector('.container') || document.body;
        container.appendChild(errorDiv);
    }
});

// Global error handler
window.addEventListener('error', (e) => {
    console.error('💥 Global error:', e.error);
    
    try {
        if (window.questTimer) {
            window.questTimer.saveProgress();
            console.log('💾 Progress saved after error');
        }
    } catch (saveError) {
        console.error('💾 Failed to save progress on error:', saveError);
    }
});

// Handle unload to save progress
window.addEventListener('beforeunload', () => {
    try {
        if (window.questTimer) {
            window.questTimer.saveProgress();
        }
    } catch (error) {
        console.warn('Failed to save on unload:', error);
    }
});

// Handle visibility change (tab switching)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // App hidden - save progress
        try {
            if (window.questTimer) {
                window.questTimer.saveProgress();
            }
        } catch (error) {
            console.warn('Failed to save on visibility change:', error);
        }
    } else {
        // App visible - could check for time jumps here
        console.log('📱 App visible');
    }
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BottomNavQuestTimer };
}