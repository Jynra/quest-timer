// ===== SOUND SYSTEM MODULE =====

class SoundSystem {
    constructor() {
        this.isEnabled = loadFromStorage('soundEnabled', true);
        this.volume = loadFromStorage('soundVolume', 0.7);
        this.soundType = loadFromStorage('soundType', 'chime');
        
        this.initializeSounds();
    }

    initializeSounds() {
        // Web Audio API pour sons générés
        this.audioContext = null;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    // ===== SONS GÉNÉRÉS AVEC WEB AUDIO API =====

    playBeep(frequency = 800, duration = 300, type = 'sine') {
        if (!this.isEnabled || !this.audioContext) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = type;

            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration / 1000);
        } catch (error) {
            console.warn('Error playing beep:', error);
        }
    }

    playChime() {
        if (!this.isEnabled) return;
        
        // Chime harmonique (Do, Mi, Sol)
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((freq, index) => {
            setTimeout(() => {
                this.playBeep(freq, 400, 'sine');
            }, index * 150);
        });
    }

    playBell() {
        if (!this.isEnabled) return;
        
        // Son de cloche (fréquence descendante)
        this.playBeep(1000, 100, 'sine');
        setTimeout(() => this.playBeep(800, 200, 'sine'), 100);
        setTimeout(() => this.playBeep(600, 400, 'sine'), 200);
    }

    playSuccess() {
        if (!this.isEnabled) return;
        
        // Mélodie de succès montante
        const melody = [261.63, 329.63, 392.00, 523.25]; // Do, Mi, Sol, Do
        melody.forEach((freq, index) => {
            setTimeout(() => {
                this.playBeep(freq, 200, 'triangle');
            }, index * 100);
        });
    }

    playLevelUp() {
        if (!this.isEnabled) return;
        
        // Fanfare de level up
        const fanfare = [392, 523, 659, 784, 1047]; // Sol, Do, Mi, Sol, Do
        fanfare.forEach((freq, index) => {
            setTimeout(() => {
                this.playBeep(freq, 300, 'sawtooth');
            }, index * 150);
        });
    }

    // ===== SONS SPÉCIFIQUES QUEST TIMER =====

    playFocusComplete() {
        console.log('🔔 Playing focus complete sound');
        
        switch (this.soundType) {
            case 'chime':
                this.playChime();
                break;
            case 'bell':
                this.playBell();
                break;
            case 'success':
                this.playSuccess();
                break;
            case 'beep':
                this.playBeep(800, 500);
                break;
            default:
                this.playChime();
        }
    }

    playBreakComplete() {
        console.log('🔔 Playing break complete sound');
        
        // Son plus doux pour la fin de pause
        this.playBeep(600, 300, 'sine');
        setTimeout(() => this.playBeep(400, 200, 'sine'), 300);
    }

    playLevelUpSound() {
        console.log('🔔 Playing level up sound');
        this.playLevelUp();
    }

    playSessionStart() {
        if (!this.isEnabled) return;
        
        // Son court pour le début de session (optionnel)
        this.playBeep(500, 100, 'square');
    }

    // ===== MÉTHODES DE CONTRÔLE =====

    toggle() {
        this.isEnabled = !this.isEnabled;
        saveToStorage('soundEnabled', this.isEnabled);
        
        if (this.isEnabled) {
            this.requestAudioPermission().then(() => {
                this.playBeep(600, 200);
            });
            showNotification('🔔 Sons activés');
        } else {
            showNotification('🔇 Sons désactivés');
        }
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        saveToStorage('soundVolume', this.volume);
        
        // Son de test pour le volume
        if (this.isEnabled) {
            this.playBeep(600, 200);
        }
    }

    setSoundType(type) {
        this.soundType = type;
        saveToStorage('soundType', type);
        
        // Test du nouveau son
        if (this.isEnabled) {
            this.playFocusComplete();
        }
    }

    // ===== MÉTHODES D'INITIALISATION =====

    async requestAudioPermission() {
        // Certains navigateurs requirent une interaction utilisateur
        if (this.audioContext && this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
                console.log('🔔 Audio context resumed');
            } catch (error) {
                console.warn('Could not resume audio context:', error);
            }
        }
    }

    // ===== GETTERS =====

    getSettings() {
        return {
            enabled: this.isEnabled,
            volume: this.volume,
            soundType: this.soundType,
            availableTypes: ['beep', 'chime', 'bell', 'success']
        };
    }

    // ===== MÉTHODES DE TEST =====

    testAllSounds() {
        console.log('🔔 Testing all sounds...');
        
        setTimeout(() => {
            console.log('Testing Beep...');
            this.playBeep(800, 300);
        }, 0);
        
        setTimeout(() => {
            console.log('Testing Chime...');
            this.playChime();
        }, 1000);
        
        setTimeout(() => {
            console.log('Testing Bell...');
            this.playBell();
        }, 2500);
        
        setTimeout(() => {
            console.log('Testing Success...');
            this.playSuccess();
        }, 4000);
        
        setTimeout(() => {
            console.log('Testing Level Up...');
            this.playLevelUp();
        }, 5000);
    }
}