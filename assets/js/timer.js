// ===== TIMER MODULE =====

class Timer {
    constructor() {
        this.focusTime = 25 * 60; // 25 minutes
        this.breakTime = 5 * 60;  // 5 minutes
        this.longBreakTime = 15 * 60; // 15 minutes
        this.currentTime = this.focusTime;
        this.isRunning = false;
        this.isBreak = false;
        this.sessionsUntilLongBreak = 4;
        this.currentSessionCount = 0;
        this.timer = null;
        
        this.initializeElements();
        this.setupProgressRing();
        this.updateDisplay();
        this.updateProgressRing();
    }

    initializeElements() {
        this.timerDisplay = document.getElementById('timerDisplay');
        this.sessionType = document.getElementById('sessionType');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.progressCircle = document.getElementById('progressCircle');
        
        // Event listeners
        this.startBtn.addEventListener('click', () => this.toggleTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
    }

    setupProgressRing() {
        const radius = 80;
        const circumference = 2 * Math.PI * radius;
        this.progressCircle.style.strokeDasharray = circumference;
        this.progressCircle.style.strokeDashoffset = circumference;
    }

    toggleTimer() {
        if (this.isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }

    startTimer() {
        this.isRunning = true;
        this.startBtn.textContent = 'Pause Quest';
        this.startBtn.classList.remove('btn-primary');
        this.startBtn.classList.add('btn-secondary');
        
        // Add timer running class for visual effects
        document.querySelector('.timer-section').classList.add('timer-running');
        
        this.timer = setInterval(() => {
            this.currentTime--;
            this.updateDisplay();
            this.updateProgressRing();
            
            if (this.currentTime <= 0) {
                this.completeSession();
            }
        }, 1000);
        
        // Trigger callback if set
        if (this.onTimerStart) {
            this.onTimerStart();
        }
    }

    pauseTimer() {
        this.isRunning = false;
        this.startBtn.textContent = 'Resume Quest';
        this.startBtn.classList.remove('btn-secondary');
        this.startBtn.classList.add('btn-primary');
        
        // Remove timer running class
        document.querySelector('.timer-section').classList.remove('timer-running');
        
        clearInterval(this.timer);
        
        // Trigger callback if set
        if (this.onTimerPause) {
            this.onTimerPause();
        }
    }

    resetTimer() {
        this.isRunning = false;
        this.currentTime = this.isBreak ? this.getBreakTime() : this.focusTime;
        this.startBtn.textContent = 'Start Quest';
        this.startBtn.classList.remove('btn-secondary');
        this.startBtn.classList.add('btn-primary');
        
        // Remove timer running class
        document.querySelector('.timer-section').classList.remove('timer-running');
        
        clearInterval(this.timer);
        this.updateDisplay();
        this.updateProgressRing();
        
        // Trigger callback if set
        if (this.onTimerReset) {
            this.onTimerReset();
        }
    }

    completeSession() {
        clearInterval(this.timer);
        this.isRunning = false;
        
        // Remove timer running class
        document.querySelector('.timer-section').classList.remove('timer-running');
        
        if (!this.isBreak) {
            // Completed a focus session
            this.currentSessionCount++;
            
            // Switch to break
            this.isBreak = true;
            this.currentTime = this.getBreakTime();
            this.sessionType.textContent = this.currentSessionCount % this.sessionsUntilLongBreak === 0 ? 
                '🌟 Long Rest' : '☕ Short Rest';
            
            // Trigger focus session complete callback
            if (this.onFocusComplete) {
                this.onFocusComplete();
            }
        } else {
            // Completed a break
            this.isBreak = false;
            this.currentTime = this.focusTime;
            this.sessionType.textContent = '🎯 Focus Quest';
            
            // Trigger break complete callback
            if (this.onBreakComplete) {
                this.onBreakComplete();
            }
        }
        
        this.startBtn.textContent = 'Start Quest';
        this.startBtn.classList.remove('btn-secondary');
        this.startBtn.classList.add('btn-primary');
        
        this.updateDisplay();
        this.updateProgressRing();
        
        // Trigger general session complete callback
        if (this.onSessionComplete) {
            this.onSessionComplete(this.isBreak);
        }
    }

    getBreakTime() {
        return this.currentSessionCount % this.sessionsUntilLongBreak === 0 ? 
            this.longBreakTime : this.breakTime;
    }

    updateDisplay() {
        this.timerDisplay.textContent = formatTime(this.currentTime);
    }

    updateProgressRing() {
        const totalTime = this.isBreak ? this.getBreakTime() : this.focusTime;
        const progress = (totalTime - this.currentTime) / totalTime;
        const radius = 80;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (progress * circumference);
        this.progressCircle.style.strokeDashoffset = offset;
    }

    // Fast forward timer (for debug mode)
    fastForward(minutes = 5) {
        this.currentTime = Math.max(0, this.currentTime - (minutes * 60));
        this.updateDisplay();
        this.updateProgressRing();
        
        if (this.currentTime <= 0) {
            this.completeSession();
        }
    }

    // Complete session instantly (for debug mode)
    forceComplete() {
        const wasBreak = this.isBreak;
        const sessionCount = this.currentSessionCount;
        
        this.currentTime = 0;
        this.updateDisplay();
        this.updateProgressRing();
        
        // Always trigger complete session logic (CORRECTION)
        this.completeSession();
        
        // Debug feedback
        if (wasBreak) {
            console.log('🔄 Debug: Break completed, switched to focus session');
        } else {
            const nextIsLongBreak = sessionCount % this.sessionsUntilLongBreak === 0;
            const breakType = nextIsLongBreak ? 'Long Break (15min)' : 'Short Break (5min)';
            console.log(`✅ Debug: Focus session completed, switched to ${breakType}`);
        }
    }

    // Set callback functions
    setCallbacks({
        onTimerStart = null,
        onTimerPause = null,
        onTimerReset = null,
        onFocusComplete = null,
        onBreakComplete = null,
        onSessionComplete = null
    } = {}) {
        this.onTimerStart = onTimerStart;
        this.onTimerPause = onTimerPause;
        this.onTimerReset = onTimerReset;
        this.onFocusComplete = onFocusComplete;
        this.onBreakComplete = onBreakComplete;
        this.onSessionComplete = onSessionComplete;
    }

    // Get current session info
    getSessionInfo() {
        return {
            isRunning: this.isRunning,
            isBreak: this.isBreak,
            currentTime: this.currentTime,
            sessionCount: this.currentSessionCount,
            totalTime: this.isBreak ? this.getBreakTime() : this.focusTime,
            progress: (this.isBreak ? this.getBreakTime() : this.focusTime - this.currentTime) / (this.isBreak ? this.getBreakTime() : this.focusTime)
        };
    }
}