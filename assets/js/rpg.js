// ===== RPG SYSTEM MODULE =====

class RPGSystem {
    constructor() {
        // Load saved data
        this.level = parseInt(localStorage.getItem('level') || '1');
        this.xp = parseInt(localStorage.getItem('xp') || '0');
        this.completedSessions = parseInt(localStorage.getItem('completedSessions') || '0');
        this.totalMinutes = parseInt(localStorage.getItem('totalMinutes') || '0');
        this.currentStreak = parseInt(localStorage.getItem('currentStreak') || '0');
        this.bestStreak = parseInt(localStorage.getItem('bestStreak') || '0');
        this.achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
        this.lastActiveDate = localStorage.getItem('lastActiveDate') || '';
        
        this.initializeElements();
        this.updateDisplay();
        this.checkStreakReset();
    }

    initializeElements() {
        this.levelEl = document.getElementById('level');
        this.xpBar = document.getElementById('xpBar');
        this.xpText = document.getElementById('xpText');
        this.completedSessionsEl = document.getElementById('completedSessions');
        this.totalTimeEl = document.getElementById('totalTime');
        this.streakEl = document.getElementById('streak');
        this.bestStreakEl = document.getElementById('bestStreak');
        this.achievementsList = document.getElementById('achievementsList');
    }

    // ===== XP & LEVELING =====
    
    gainXP(amount) {
        this.xp += amount;
        this.showFloatingXP(amount);
        
        // Check for level up - CORRECTION ICI
        const xpForCurrentLevel = this.getXPForLevel(this.level);
        if (this.xp >= xpForCurrentLevel) {
            this.levelUp();
        }
        
        this.saveProgress();
        this.updateDisplay();
    }

    getXPForLevel(level) {
        // Progression selon la documentation README:
        // Niveau 1: 100 XP, Niveau 2: 250 XP, Niveau 3: 450 XP
        // Pattern: 100 -> +150 -> +200 -> +250 -> +300...
        if (level === 1) return 100;
        if (level === 2) return 250;
        if (level === 3) return 450;
        
        // Pour les niveaux supérieurs, progression croissante
        let total = 450; // XP pour niveau 3
        for (let i = 4; i <= level; i++) {
            // Increment: 250 pour niveau 4, 300 pour niveau 5, etc.
            let increment = 200 + 50 * (i - 3);
            total += increment;
        }
        return total;
    }

    levelUp() {
        const currentLevel = this.level;
        
        this.level++;
        showNotification(`🎊 Level Up! You are now level ${this.level}!`);
        this.addAchievement('Level Up!', `Reached level ${this.level}`, '⭐');
        
        // Add visual effects
        const characterCard = document.querySelector('.character-card');
        addTemporaryClass(characterCard, 'level-up-celebration', 2000);
        addTemporaryClass(characterCard, 'pulse', 2000);
        
        // Play level up sound effect (if available)
        this.playLevelUpEffect();
        
        // Check for another level up (in case of multiple level ups from debug)
        const xpForCurrentLevel = this.getXPForLevel(this.level);
        if (this.xp >= xpForCurrentLevel) {
            setTimeout(() => this.levelUp(), 100); // Slight delay for visual effect
        }
        
        this.saveProgress();
        this.updateDisplay();
    }

    playLevelUpEffect() {
        // Could add audio here if desired
        // const audio = new Audio('assets/sounds/levelup.mp3');
        // audio.play().catch(() => {}); // Ignore if audio fails
    }

    showFloatingXP(amount) {
        const floating = document.createElement('div');
        floating.className = 'floating-xp';
        floating.textContent = `+${amount} XP`;
        floating.style.left = Math.random() * (window.innerWidth - 100) + 'px';
        floating.style.top = window.innerHeight / 2 + 'px';
        document.body.appendChild(floating);
        
        setTimeout(() => {
            if (document.body.contains(floating)) {
                document.body.removeChild(floating);
            }
        }, 2000);
    }

    // ===== SESSION TRACKING =====
    
    completeSession() {
        this.completedSessions++;
        this.totalMinutes += 25; // Standard pomodoro length
        this.updateStreak();
        
        // Calculate XP reward
        const xpGained = 50 + (this.level * 5);
        this.gainXP(xpGained);
        
        this.checkAchievements();
        this.saveProgress();
        this.updateDisplay();
        
        showNotification(`🎉 Quest Complete! +${xpGained} XP`);
        showBrowserNotification('Quest Timer', `Quest Complete! +${xpGained} XP`);
        
        return xpGained;
    }

    updateStreak() {
        const today = new Date().toDateString();
        const lastActive = new Date(this.lastActiveDate || today).toDateString();
        
        if (lastActive === today) {
            // Same day, streak continues
            return;
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastActive === yesterday.toDateString()) {
            // Consecutive day
            this.currentStreak++;
        } else {
            // Streak broken
            this.currentStreak = 1;
        }
        
        this.bestStreak = Math.max(this.bestStreak, this.currentStreak);
        this.lastActiveDate = today;
    }

    checkStreakReset() {
        const today = new Date().toDateString();
        const lastActive = new Date(this.lastActiveDate || today).toDateString();
        
        if (lastActive !== today) {
            const lastActiveDate = new Date(this.lastActiveDate);
            const daysDiff = Math.floor((new Date() - lastActiveDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff > 1) {
                // More than 1 day gap, reset streak
                this.currentStreak = 0;
                this.saveProgress();
                this.updateDisplay();
            }
        }
    }

    // ===== ACHIEVEMENTS =====
    
    checkAchievements() {
        const achievementDefs = [
            { 
                id: 'first_quest', 
                title: 'First Quest', 
                desc: 'Complete your first Pomodoro', 
                icon: '🎯', 
                condition: () => this.completedSessions === 1 
            },
            { 
                id: 'dedicated', 
                title: 'Dedicated', 
                desc: 'Complete 10 Pomodoros', 
                icon: '💪', 
                condition: () => this.completedSessions === 10 
            },
            { 
                id: 'focused_master', 
                title: 'Focused Master', 
                desc: 'Complete 25 Pomodoros', 
                icon: '🧠', 
                condition: () => this.completedSessions === 25 
            },
            { 
                id: 'century_club', 
                title: 'Century Club', 
                desc: 'Complete 100 Pomodoros', 
                icon: '💯', 
                condition: () => this.completedSessions === 100 
            },
            { 
                id: 'streak_5', 
                title: 'Streak Warrior', 
                desc: 'Maintain a 5-day streak', 
                icon: '🔥', 
                condition: () => this.currentStreak === 5 
            },
            { 
                id: 'streak_30', 
                title: 'Streak Master', 
                desc: 'Maintain a 30-day streak', 
                icon: '🌟', 
                condition: () => this.currentStreak === 30 
            },
            { 
                id: 'time_master', 
                title: 'Time Master', 
                desc: 'Focus for 10 hours total', 
                icon: '⏰', 
                condition: () => this.totalMinutes >= 600 
            },
            { 
                id: 'marathon_runner', 
                title: 'Marathon Runner', 
                desc: 'Focus for 50 hours total', 
                icon: '🏃', 
                condition: () => this.totalMinutes >= 3000 
            },
            { 
                id: 'level_5', 
                title: 'Experienced', 
                desc: 'Reach level 5', 
                icon: '🎖️', 
                condition: () => this.level === 5 
            },
            { 
                id: 'level_10', 
                title: 'Expert', 
                desc: 'Reach level 10', 
                icon: '🏆', 
                condition: () => this.level === 10 
            },
            { 
                id: 'productivity_guru', 
                title: 'Productivity Guru', 
                desc: 'Reach level 20', 
                icon: '👑', 
                condition: () => this.level === 20 
            }
        ];

        achievementDefs.forEach(achievement => {
            if (achievement.condition() && !this.achievements.find(a => a.id === achievement.id)) {
                this.addAchievement(achievement.title, achievement.desc, achievement.icon, achievement.id);
            }
        });
    }

    addAchievement(title, desc, icon, id = null) {
        const achievement = { 
            id: id || Date.now(), 
            title, 
            desc, 
            icon, 
            timestamp: Date.now() 
        };
        
        this.achievements.unshift(achievement);
        this.achievements = this.achievements.slice(0, 5); // Keep only recent 5
        
        showNotification(`🏆 Achievement Unlocked: ${title}`);
        showBrowserNotification('Achievement Unlocked!', title);
        
        this.updateAchievements();
        this.saveProgress();
    }

    updateAchievements() {
        this.achievementsList.innerHTML = '';
        
        if (this.achievements.length === 0) {
            this.achievementsList.innerHTML = `
                <div style="text-align: center; color: #9ca3af; padding: 20px;">
                    Complete quests to unlock achievements! 🎯
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
                <div class="achievement-text">
                    <div class="achievement-title">${achievement.title}</div>
                    <div class="achievement-desc">${achievement.desc}</div>
                </div>
            `;
            this.achievementsList.appendChild(item);
        });
    }

    // ===== DISPLAY UPDATES =====
    
    updateDisplay() {
        // Level display
        this.levelEl.textContent = this.level;
        
        // XP bar - CORRECTION ICI
        const currentLevelXP = this.level === 1 ? 0 : this.getXPForLevel(this.level - 1);
        const nextLevelXP = this.getXPForLevel(this.level);
        const progressXP = this.xp - currentLevelXP;
        const requiredXP = nextLevelXP - currentLevelXP;
        
        const xpProgress = (progressXP / requiredXP) * 100;
        this.xpBar.style.width = `${Math.min(xpProgress, 100)}%`;
        this.xpText.textContent = `${progressXP} / ${requiredXP} XP`;
        
        // Stats
        animateNumber(this.completedSessionsEl, 
            parseInt(this.completedSessionsEl.textContent) || 0, 
            this.completedSessions, 500);
        
        this.totalTimeEl.textContent = formatTotalTime(this.totalMinutes);
        
        animateNumber(this.streakEl, 
            parseInt(this.streakEl.textContent) || 0, 
            this.currentStreak, 500);
            
        animateNumber(this.bestStreakEl, 
            parseInt(this.bestStreakEl.textContent) || 0, 
            this.bestStreak, 500);
        
        this.updateAchievements();
    }

    // ===== DATA PERSISTENCE =====
    
    saveProgress() {
        const data = {
            level: this.level,
            xp: this.xp,
            completedSessions: this.completedSessions,
            totalMinutes: this.totalMinutes,
            currentStreak: this.currentStreak,
            bestStreak: this.bestStreak,
            achievements: this.achievements,
            lastActiveDate: this.lastActiveDate
        };

        Object.entries(data).forEach(([key, value]) => {
            saveToStorage(key, value);
        });
    }

    forceStreak() {
        this.currentStreak++;
        this.bestStreak = Math.max(this.bestStreak, this.currentStreak);
        this.saveProgress();
        this.updateDisplay();
    }

    unlockRandomAchievement() {
        const randomAchievements = [
            { title: 'Debug Master', desc: 'Used debug mode like a pro', icon: '🐛' },
            { title: 'Time Traveler', desc: 'Manipulated the space-time continuum', icon: '⏰' },
            { title: 'Cheater!', desc: 'Used debug shortcuts', icon: '😈' },
            { title: 'Testing Legend', desc: 'Thoroughly tested all features', icon: '🧪' },
            { title: 'Speed Runner', desc: 'Completed tasks in record time', icon: '💨' }
        ];
        
        const random = randomAchievements[Math.floor(Math.random() * randomAchievements.length)];
        this.addAchievement(random.title, random.desc, random.icon);
    }

    resetAllProgress() {
        if (confirm('⚠️ This will reset ALL your progress! Are you sure?')) {
            // Clear storage
            clearStorage();
            
            // Reset all properties to initial values
            this.level = 1;
            this.xp = 0;
            this.completedSessions = 0;
            this.totalMinutes = 0;
            this.currentStreak = 0;
            this.bestStreak = 0;
            this.achievements = [];
            this.lastActiveDate = '';
            
            // Update display immediately
            this.updateDisplay();
            
            // Show confirmation
            showNotification('🔄 All progress reset!');
            
            return true;
        }
        return false;
    }

    // ===== GETTERS =====
    
    getStats() {
        return {
            level: this.level,
            xp: this.xp,
            completedSessions: this.completedSessions,
            totalMinutes: this.totalMinutes,
            currentStreak: this.currentStreak,
            bestStreak: this.bestStreak,
            achievements: this.achievements.length,
            nextLevelXP: this.getXPForLevel(this.level + 1) - this.xp
        };
    }
}