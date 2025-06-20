# quest-timer
A pomodoro method app with rpg mecanics
# ⚔️ Quest Timer - RPG Pomodoro PWA

## 🎯 Description

Quest Timer transforms the traditional Pomodoro Technique into an engaging RPG experience. Complete focus sessions to gain XP, level up your character, unlock achievements, and build productivity streaks - all while maintaining peak concentration and work efficiency.

## ✨ Features

### 🍅 Core Pomodoro Functionality
- **25-minute focus sessions** with customizable timer
- **5-minute short breaks** and **15-minute long breaks**
- **Visual progress ring** showing session completion
- **Audio/visual notifications** for session transitions
- **Pause/resume functionality** for flexibility

### 🎮 RPG Mechanics
- **Character leveling system** with progressive XP requirements
- **XP rewards** for completed sessions (50 + 5 per level)
- **Achievement system** with unlockable badges
- **Streak tracking** for daily consistency
- **Animated floating XP** gains for immediate feedback
- **Stats dashboard** showing total progress

### 📱 PWA Features
- **Progressive Web App** - works offline and can be installed
- **Responsive design** - optimized for mobile and desktop
- **Local storage** - all progress saved locally
- **Cross-platform** - works on any device with a web browser
- **No installation required** - runs directly in browser

### 🛠️ Debug Mode
- **Development tools** for testing features quickly
- **Fast-forward timer** functionality
- **Instant session completion**
- **Manual XP/level manipulation**
- **Achievement testing** tools

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required

### Installation

1. **Download the files:**
   ```bash
   git clone <repository-url>
   cd quest-timer
   ```

2. **For basic usage:**
   - Open `index.html` in your web browser
   - Start using immediately!

3. **For PWA deployment:**
   - Host files on HTTPS server
   - Add proper `manifest.json` and `service-worker.js`
   - Users can "Add to Home Screen"

### File Structure
```
quest-timer/
├── index.html          # Main application file
├── manifest.json       # PWA manifest (for production)
├── sw.js              # Service worker (for production)
├── README.md          # This file
└── README_expand.md   # Future features documentation
```

## 🎮 How to Play

### Getting Started
1. **Start your first quest** by clicking "Start Quest"
2. **Focus for 25 minutes** - resist distractions!
3. **Complete the session** to gain XP and level up
4. **Take your earned break** (5 or 15 minutes)
5. **Repeat and build streaks** for maximum rewards

### Leveling System
- **Level 1**: 100 XP required
- **Level 2**: 250 XP required
- **Level 3**: 450 XP required
- **Formula**: `level * 100 + (level - 1) * 50`

### Achievement Examples
- 🎯 **First Quest**: Complete your first Pomodoro
- 💪 **Dedicated**: Complete 10 Pomodoros
- 🧠 **Focused Master**: Complete 25 Pomodoros
- 🔥 **Streak Warrior**: Maintain a 5-day streak
- ⏰ **Time Master**: Focus for 10 hours total

### Debug Mode
Access debug tools by clicking the 🐛 button:
- ⏩ **Skip 5 minutes**: Fast-forward timer
- ✅ **Complete Session**: Instantly finish current session
- ⭐ **Add 100 XP**: Manual XP boost
- 🚀 **Force Level Up**: Instant level advancement

## 🔧 Customization

### Timer Settings
Modify these variables in the JavaScript:
```javascript
this.focusTime = 25 * 60;      // 25 minutes
this.breakTime = 5 * 60;       // 5 minutes  
this.longBreakTime = 15 * 60;  // 15 minutes
```

### XP System
Adjust XP rewards and requirements:
```javascript
const xpGained = 50 + (this.level * 5);  // XP per session
getXPForLevel(level) {
    return level * 100 + (level - 1) * 50;  // XP needed for level
}
```

### Styling
- Edit CSS variables for colors and themes
- Modify glassmorphism effects in `.character-card` and `.timer-section`
- Customize animations in `@keyframes` sections

## 🌟 Technology Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Storage**: Browser LocalStorage API
- **Notifications**: Web Notifications API
- **PWA**: Service Workers, Web App Manifest
- **Styling**: CSS Grid, Flexbox, CSS Animations
- **Icons**: Unicode Emojis (universal compatibility)

## 📊 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Setup
```bash
# Clone repository
git clone <repository-url>
cd quest-timer

# For development, use a local server
python -m http.server 8000
# or
npx serve .

# Open http://localhost:8000
```

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Pomodoro Technique** by Francesco Cirillo
- **RPG mechanics** inspired by classic progression systems
- **Glassmorphism design** trend for modern UI aesthetics

## 🐛 Bug Reports & Feature Requests

Please open an issue on GitHub with:
- **Browser and version**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots if applicable**

## 📈 Roadmap

See `README_expand.md` for detailed future feature plans including:
- Character classes and specializations
- Equipment and inventory system
- Daily quests and challenges
- Social features and leaderboards
- Advanced statistics and analytics

---

**Happy focusing! May your productivity be legendary! ⚔️✨**