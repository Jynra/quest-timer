# ⚔️ Quest Timer - RPG Pomodoro PWA

## 🎯 Description

Quest Timer transforme la technique Pomodoro traditionnelle en une expérience RPG engageante. Complétez des sessions de concentration pour gagner de l'XP, faire évoluer votre personnage, débloquer des succès et construire des séries de productivité - tout en maintenant une concentration maximale et une efficacité de travail.

**✨ PWA Standalone disponible !** L'application peut être installée comme une vraie app native sur mobile et desktop.

## ✨ Fonctionnalités principales

### 🍅 Timer Pomodoro intelligent
- **Sessions de 25 minutes** avec pauses de 5/15 minutes
- **Anneau de progression visuel** et affichage temps restant
- **Alarmes sonores personnalisables** - 4 types de sons (Chime, Bell, Success, Beep)
- **Contrôle volume** et activation/désactivation des sons
- **Fonctionnalité pause/reprise** et transitions automatiques

### 🎮 Système RPG complet
- **Progression XP équilibrée** : Plus on monte en niveau, plus on gagne d'XP
- **Récompenses croissantes** : 55 XP → 60 XP → 65 XP par session
- **Système de niveaux** : 100 → 250 → 450 → 700 XP total
- **11 succès débloquables** : Première quête, Streak warrior, Time master...
- **Statistiques détaillées** : Sessions, temps total, streaks
- **Effets visuels** : XP flottant, animations de level up

### 📱 Application PWA native
- **Installation sur mobile/desktop** - Fonctionne comme une vraie app
- **Mode Standalone** - S'ouvre sans barre d'adresse
- **Fonctionne hors ligne** - Tout sauvé localement
- **Design responsive** - Optimisé tous écrans

### 🛠️ Mode Debug avancé
- **Skip 1/5 minutes** - Test rapide du timer
- **Complete Session** - Simulation de fin de session
- **Add XP/Level Up** - Manipulation précise de la progression  
- **Test des sons** - Vérification du système audio
- **Reset complet** - Remise à zéro totale
- **10 raccourcis clavier** - Contrôle rapide

## 🚀 Installation rapide

### 🐳 Docker (Recommandé)
```bash
git clone <repository-url>
cd quest-timer/docker
chmod +x deploy.sh
./deploy.sh full
```
➜ **App disponible sur** http://localhost:3046

### 💻 Installation locale
```bash
git clone <repository-url>
cd quest-timer
python -m http.server 8000
# ou: npx serve .
```
➜ **App disponible sur** http://localhost:8000

### 📱 Installation PWA
1. **Ouvrez l'app en HTTPS** (requis pour PWA)
2. **"Ajouter à l'écran d'accueil"** sur mobile
3. **"Installer l'application"** sur desktop
4. **L'app s'ouvre en mode standalone** 🎉

## 🎮 Guide de jeu

### Démarrage
1. **Start Quest** → Démarrer une session focus de 25min
2. **Restez concentré** jusqu'à l'alarme sonore
3. **Gagnez 55+ XP** et montez de niveau
4. **Prenez votre pause** de 5 ou 15min
5. **Construisez des streaks** quotidiens

### Progression XP
| Niveau | XP Total | XP Requis | XP/Session | Sessions |
|--------|----------|-----------|------------|----------|
| 1 → 2  | 100      | 100       | 55         | ~2       |
| 2 → 3  | 250      | +150      | 60         | ~3       |
| 3 → 4  | 450      | +200      | 65         | ~4       |
| 4 → 5  | 700      | +250      | 70         | ~4       |

*Progression parfaitement équilibrée - pas de grind !*

### Succès emblématiques
- 🎯 **Première Quête** - Terminez votre premier Pomodoro
- 🔥 **Streak Warrior** - 5 jours consécutifs  
- ⏰ **Time Master** - 10 heures de focus total
- 👑 **Productivity Guru** - Atteignez le niveau 20

## ⚙️ Contrôles et raccourcis

### Interface principale
- **🔔 Sound** - Active/désactive les alarmes
- **🎵 Type** - Choisit le son (Chime/Bell/Success/Beep)
- **🔊 Volume** - Ajuste le volume des alarmes

### Raccourcis clavier
- **Espace** - Start/Pause timer
- **R** - Reset timer  
- **Ctrl+S** - Toggle son
- **Échap** - Fermer debug

### Mode Debug (🐛)
- **Ctrl+Shift+F** - Skip 5 minutes
- **Ctrl+Shift+M** - Skip 1 minute
- **Ctrl+Shift+C** - Complete session
- **Ctrl+Shift+L** - Level up
- **Ctrl+Shift+T** - Test sons

## 🔧 Architecture technique

### Structure du projet
```
quest-timer/
├── index.html              # Interface utilisateur
├── manifest.json           # Configuration PWA
├── sw.js                   # Service Worker
├── assets/
│   ├── css/                # Styles (main, components, animations)
│   ├── js/
│   │   ├── sound.js        # 🔔 Système sonore (NOUVEAU)
│   │   ├── timer.js        # ⏱️ Logique timer + alarmes
│   │   ├── rpg.js          # 🎮 Système XP/niveaux
│   │   ├── debug.js        # 🛠️ Mode debug + contrôles sons
│   │   ├── app.js          # 🚀 Application principale
│   │   └── utils.js        # 🔧 Fonctions utilitaires
│   └── icons/              # Icônes PWA (192x192, 512x512)
└── docker/                 # Infrastructure Docker
```

### Stack technologique
- **Frontend** : HTML5, CSS3, JavaScript ES6+ pur
- **Audio** : Web Audio API (sons générés, pas de fichiers)
- **PWA** : Service Workers, Manifeste
- **Stockage** : localStorage (tout sauvé localement)
- **Infra** : Docker + Nginx Alpine
- **Développement** : Modifications instantanées (pas de cache)

## 🐳 Gestion Docker

### Commandes essentielles
```bash
cd docker
./deploy.sh full      # 🚀 Déploiement complet
./deploy.sh logs      # 📋 Voir les logs  
./deploy.sh restart   # 🔄 Redémarrer
./deploy.sh stop      # 🛑 Arrêter
./deploy.sh cleanup   # 🧹 Nettoyage complet
```

### Configuration
- **Port** : 3046 (modifiable dans docker-compose.yml)
- **Volumes** : Sources montées → modifications instantanées
- **Cache** : Désactivé → Git pull + F5 = changements visibles
- **HTTPS** : Requis pour PWA standalone

## 🚨 Dépannage

### PWA ne s'installe pas
```bash
# 1. Vérifiez HTTPS (obligatoire)
# 2. Vérifiez les icônes 192x192 et 512x512
# 3. F12 → Application → Clear storage
```

### Sons ne fonctionnent pas
- **Vérifiez** que les sons sont activés (🔔)
- **Testez** différents types de sons
- **Interaction requise** : Cliquez dans l'app avant le premier son

### Modifications non visibles
```bash
# 1. Hard refresh : Ctrl+Shift+R
# 2. Redémarrer Docker : ./deploy.sh restart
# 3. Clear storage : F12 → Application → Storage
```

## 🎯 Changelog

### v1.5.0 - Système Sonore Complet 🔔
- ✅ **Alarmes personnalisables** - 4 types de sons
- ✅ **Contrôle volume** et activation/désactivation
- ✅ **Sons intelligents** - Uniquement fin de timer et tests
- ✅ **Mode debug sonore** - Test et contrôle avancés
- ✅ **Web Audio API** - Sons générés, pas de fichiers

### v1.4.0 - Système XP Équilibré 🎮
- ✅ **Progression corrigée** - 100 → 250 → 450 XP
- ✅ **Récompenses croissantes** - 55 → 60 → 65 XP/session
- ✅ **Debug intelligent** - Level up et XP précis
- ✅ **Skip 1 minute** - Contrôle précis du timer

### v1.3.0 - PWA Standalone 📱
- ✅ **App native** - Installation mobile/desktop
- ✅ **Mode standalone** - Sans barre d'adresse
- ✅ **Développement instantané** - Git pull + F5

---

## 🔗 Liens rapides

- 🚀 **Déploiement** : `cd docker && ./deploy.sh full`
- 🌐 **URL locale** : http://localhost:3046  
- 📱 **PWA** : Ajouter à l'écran d'accueil (HTTPS requis)
- 🐛 **Debug** : Cliquez sur 🐛 dans l'app
- 📋 **Logs** : `./deploy.sh logs`

**🎮 Transformez votre productivité en aventure épique !**  
**⚔️ Que votre concentration soit légendaire ! 🔔✨**