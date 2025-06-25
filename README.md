# ⚔️ Quest Timer - RPG Pomodoro PWA

## 🎯 Description

Quest Timer transforme la technique Pomodoro traditionnelle en une expérience RPG engageante. Complétez des sessions de concentration pour gagner de l'XP, faire évoluer votre personnage, débloquer des succès et construire des séries de productivité - tout en maintenant une concentration maximale et une efficacité de travail.

**✨ PWA Standalone disponible !** L'application peut être installée comme une vraie app native sur mobile et desktop.

**🎮 Nouveau Design Bottom Nav !** Interface optimisée mobile-first avec contrôles en bas d'écran.

**📱 Installation PWA améliorée !** Icônes natives, prompt d'installation automatique et mode standalone parfait.

## ✨ Fonctionnalités principales

### 🍅 Timer Pomodoro intelligent
- **Sessions de 25 minutes** avec pauses de 5/15 minutes
- **Cercle de progression visuel** et affichage temps restant optimisé mobile
- **Alarmes sonores personnalisables** - 4 types de sons (Chime, Bell, Success, Beep)
- **Contrôle volume** et activation/désactivation des sons
- **Fonctionnalité pause/reprise** et transitions automatiques

### 🎮 Système RPG complet
- **Progression XP équilibrée** : Plus on monte en niveau, plus on gagne d'XP
- **Récompenses croissantes** : 55 XP → 60 XP → 65 XP par session (selon niveau)
- **Système de niveaux progressif** : 100 → 250 → 450 → 700 → 1000+ XP total
- **11 succès débloquables** : Première quête, Streak warrior, Time master...
- **Statistiques en temps réel** : Sessions, temps total, streaks
- **Effets visuels** : XP flottant, animations de level up (sans son)

### 📱 Design Bottom Nav Mobile-First
- **Interface compacte** - Tout visible sans scroll sur mobile
- **Contrôles fixes en bas** - Toujours accessibles au pouce
- **Stats mini intégrées** - 3 métriques essentielles en un coup d'œil
- **Barre XP responsive** - Progression visuelle optimisée
- **Touch feedback** - Vibrations et animations tactiles

### 📱 Application PWA native
- **Installation sur mobile/desktop** - Fonctionne comme une vraie app
- **Mode Standalone** - S'ouvre sans barre d'adresse ni interface navigateur
- **Icônes natives PNG** - Toutes les tailles (72x72 à 512x512) pour tous les appareils
- **Prompt d'installation automatique** - Banner d'installation intelligent après 5 secondes
- **Support iOS complet** - Apple Touch Icons et métadonnées spécifiques
- **Notifications push natives** - Pour les achievements et complétion de sessions
- **Fonctionne hors ligne** - Cache intelligent avec mise à jour automatique
- **Design responsive** - 320px → desktop, optimisé tous écrans

### 🛠️ Mode Debug avancé
- **Skip 1/5 minutes** - Test rapide du timer
- **Complete Session** - Simulation de fin de session
- **Add XP/Level Up** - Manipulation précise de la progression  
- **Test des sons** - Vérification du système audio complet
- **Reset complet** - Remise à zéro totale sans rechargement
- **Panel slide-in** - Interface debug moderne
- **PWA diagnostics** - Test installation et mode standalone

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
2. **Attendez le prompt automatique** (5 secondes) ou utilisez le menu navigateur
3. **"Ajouter à l'écran d'accueil"** sur mobile
4. **"Installer l'application"** sur desktop
5. **L'app s'ouvre en mode standalone** sans barre d'adresse 🎉
6. **Icône native** apparaît sur l'écran d'accueil avec le design Quest Timer

## 🎮 Guide de jeu

### Démarrage
1. **Start Quest** → Démarrer une session focus de 25min
2. **Restez concentré** jusqu'à l'alarme sonore
3. **Gagnez 55+ XP** et montez de niveau (XP croissant par niveau)
4. **Prenez votre pause** de 5 ou 15min
5. **Construisez des streaks** quotidiens

### Progression XP (Corrigée)
| Niveau | XP Total | XP Requis | XP/Session | Sessions |
|--------|----------|-----------|------------|----------|
| 1 → 2  | 100      | 100       | 55         | ~2       |
| 2 → 3  | 250      | +150      | 60         | ~3       |
| 3 → 4  | 450      | +200      | 65         | ~3       |
| 4 → 5  | 700      | +250      | 70         | ~4       |
| 5 → 6  | 1000     | +300      | 75         | ~4       |
| 6 → 7  | 1350     | +350      | 80         | ~4       |
| 7+     | +400...  | +50/niv   | +5/niv     | ~4-5     |

*Progression parfaitement équilibrée - croissance continue !*

### Succès emblématiques
- 🎯 **Première Quête** - Terminez votre premier Pomodoro
- 🔥 **Streak Warrior** - 5 jours consécutifs  
- ⏰ **Time Master** - 10 heures de focus total
- 🏆 **Expert** - Atteignez le niveau 10
- 👑 **Productivity Guru** - Atteignez le niveau 20

## ⚙️ Contrôles et raccourcis

### Interface Bottom Nav
- **🔔 Sound** - Active/désactive les alarmes (bottom nav)
- **🎵 Type** - Choisit le son (Chime/Bell/Success/Beep)
- **🔊 Volume** - Ajuste le volume des alarmes (slider)
- **🏆 Achievements** - Ouvre la modal des succès (top-left)
- **📱 Install** - Banner d'installation PWA (automatique après 5s)

### Raccourcis clavier
- **Espace** - Start/Pause timer
- **R** - Reset timer  
- **A** - Ouvrir/fermer achievements
- **Ctrl+S** - Toggle son
- **Échap** - Fermer modals/debug

### Mode Debug (🐛)
- **Cliquer 🐛** - Ouvre/ferme le panel debug
- **Skip 5/1 min** - Test rapide du timer
- **Complete Session** - Termine la session instantanément
- **Add XP** - Ajoute 100 XP
- **Level Up** - Force le passage au niveau suivant
- **Test Sounds** - Teste tous les types de sons (séquence complète)
- **Reset All** - Remise à zéro complète

## 🔧 Architecture technique

### Structure du projet
```
quest-timer/
├── index.html              # Interface Bottom Nav + PWA optimisée
├── manifest.json           # Configuration PWA avec icônes natives
├── sw.js                   # Service Worker optimisé PWA
├── assets/
│   ├── css/
│   │   ├── main.css        # 🎨 Styles de base Bottom Nav
│   │   ├── components.css  # 🧩 Composants Bottom Nav
│   │   └── animations.css  # ✨ Animations et effets
│   ├── js/
│   │   ├── app.js          # 🚀 Application principale + PWA manager
│   │   ├── timer.js        # ⏱️ Logique timer + alarmes
│   │   ├── rpg.js          # 🎮 Système XP/niveaux (corrigé)
│   │   ├── sound.js        # 🔔 Système sonore
│   │   ├── debug.js        # 🛠️ Mode debug + contrôles
│   │   └── utils.js        # 🔧 Fonctions utilitaires
│   └── icons/              # 📱 Icônes PWA natives (72x72 → 512x512)
│       ├── icon-72.png     # Favicon et petites tailles
│       ├── icon-96.png     # Android standard
│       ├── icon-128.png    # Windows tiles
│       ├── icon-144.png    # Android high-res
│       ├── icon-152.png    # iOS touch icon
│       ├── icon-192.png    # 🔥 PWA minimum requis
│       ├── icon-384.png    # Android splash
│       └── icon-512.png    # 🔥 PWA maskable requis
└── docker/                 # Infrastructure Docker
```

### Stack technologique
- **Frontend** : HTML5, CSS3, JavaScript ES6+ pur (modulaire)
- **Design** : Mobile-first, Bottom Navigation, Glassmorphism
- **Audio** : Web Audio API (sons générés, pas de fichiers)
- **PWA** : Service Workers optimisés, Manifeste complet, Installation native
- **Icônes** : PNG natives (toutes tailles), Apple Touch Icons, Maskable
- **Notifications** : Browser notifications + PWA push (préparé)
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
- **HTTPS** : Requis pour PWA standalone et notifications

## 🚨 Dépannage

### Interface Bottom Nav
- **Scroll bloqué** : Normal, tout doit être visible sans scroll
- **Boutons petits** : Optimisé pour les pouces, 44px minimum
- **Stats pas à jour** : F5 ou redémarrer l'app

### PWA ne s'installe pas
```bash
# 1. Vérifiez HTTPS (obligatoire)
# 2. Vérifiez les icônes 192x192 et 512x512 dans assets/icons/
# 3. F12 → Application → Manifest → Vérifiez "Installable"
# 4. F12 → Application → Clear storage
# 5. Redémarrez l'app et attendez 5 secondes pour le prompt
```

### Icône PWA incorrecte
```bash
# 1. Vérifiez que assets/icons/ contient tous les PNG
# 2. Testez l'URL directe: http://localhost:3046/assets/icons/icon-192.png
# 3. Videz le cache: F12 → Application → Storage → Clear
# 4. Désinstallez et réinstallez la PWA
```

### Sons ne fonctionnent pas
- **Vérifiez** que les sons sont activés (🔔 en bottom nav)
- **Testez** différents types de sons via le sélecteur
- **Interaction requise** : Cliquez dans l'app avant le premier son
- **Volume** : Ajustez via le slider dans bottom nav
- **Mode debug** : Utilisez "Test Sounds" pour diagnostic complet

### XP/Level bugs
- **XP négatifs** : Fixed! Reset All remet vraiment à zéro
- **Progression bloquée** : XP croît maintenant indéfiniment
- **Reset incomplet** : Nouveau système sans rechargement

### Modifications non visibles
```bash
# 1. Hard refresh : Ctrl+Shift+R
# 2. Redémarrer Docker : ./deploy.sh restart
# 3. Clear storage : F12 → Application → Storage
# 4. Désinstaller/réinstaller PWA si nécessaire
```

## 🎯 Changelog

### v2.1.0 - PWA Installation Parfaite 📱
- ✅ **Icônes natives PNG** - Toutes les tailles (72x72 à 512x512)
- ✅ **Prompt d'installation automatique** - Banner intelligent après 5 secondes
- ✅ **Apple Touch Icons** - Support iOS complet avec métadonnées
- ✅ **Mode standalone perfectionné** - Sans barre d'adresse
- ✅ **Notifications push natives** - Achievements et complétion de sessions
- ✅ **Service Worker optimisé** - Cache intelligent et mise à jour automatique
- ✅ **Diagnostic PWA** - Outils debug pour installation et standalone
- ✅ **Favicon natif** - PNG au lieu de SVG pour meilleure compatibilité

### v2.0.0 - Bottom Nav Design 📱
- ✅ **Interface Bottom Nav** - Contrôles fixes en bas optimisés mobile
- ✅ **Design compact** - Pas de scroll, tout visible sur mobile
- ✅ **Stats mini intégrées** - 3 métriques essentielles
- ✅ **Touch feedback** - Vibrations et animations tactiles
- ✅ **Responsive 320px+** - Support écrans ultra-petits
- ✅ **Progression XP corrigée** - Croissance continue sans limite
- ✅ **Reset sans rechargement** - Mise à jour instantanée
- ✅ **Architecture modulaire** - CSS/JS séparés proprement

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
- 📱 **PWA** : Installation automatique (prompt après 5s en HTTPS)
- 🐛 **Debug** : Cliquez sur 🐛 dans l'app (top-right)
- 🏆 **Achievements** : Cliquez sur 🏆 (top-left)
- 📋 **Logs** : `./deploy.sh logs`

## 📱 Optimisations Mobile

### Interface Bottom Nav
- **Timer hero** - Cercle de progression centré, taille adaptative
- **Stats mini** - 3 colonnes compactes (Quests, Focus Time, Streak)
- **XP bar** - Barre de progression avec indicateur visuel
- **Bottom nav fixe** - Contrôles sons + boutons toujours accessibles

### Touch Experience
- **44px minimum** - Tous les éléments tactiles respectent les standards
- **Vibration feedback** - Retour haptique sur actions importantes
- **Swipe prevention** - Pas d'interférence avec la navigation bottom nav
- **Viewport adaptatif** - Gestion correcte des height mobile

### Performance Mobile
- **No scroll design** - Interface complète visible sans défilement
- **Debounced resize** - Gestion optimisée des changements d'orientation
- **Lazy components** - Éléments non-critiques chargés à la demande
- **PWA optimized** - Installation et mode standalone parfaits

### Installation PWA
- **Prompt automatique** - Banner d'installation après 5 secondes (désactivable)
- **Icônes natives** - PNG 72x72 à 512x512 pour tous les appareils
- **Mode standalone** - Lance sans interface navigateur
- **Support offline** - Fonctionne sans connexion internet
- **Notifications** - Achievements et rappels natifs

**🎮 Transformez votre productivité en aventure épique !**  
**📱 Installation PWA native avec icônes parfaites !**  
**⚔️ Que votre concentration soit légendaire ! 🔔✨**