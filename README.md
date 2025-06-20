# ⚔️ Quest Timer - RPG Pomodoro PWA

## 🎯 Description

Quest Timer transforme la technique Pomodoro traditionnelle en une expérience RPG engageante. Complétez des sessions de concentration pour gagner de l'XP, faire évoluer votre personnage, débloquer des succès et construire des séries de productivité - tout en maintenant une concentration maximale et une efficacité de travail.

## 📁 Structure du projet

```
quest-timer/
├── index.html                 # Page principale (HTML minimal)
├── manifest.json             # Manifeste PWA
├── sw.js                     # Service Worker
├── README.md                 # Cette documentation
├── assets/
│   ├── css/
│   │   ├── main.css          # Styles de base et layout
│   │   ├── components.css    # Styles des composants UI
│   │   └── animations.css    # Animations et effets visuels
│   ├── js/
│   │   ├── utils.js          # Fonctions utilitaires
│   │   ├── timer.js          # Logique du timer Pomodoro
│   │   ├── rpg.js           # Système RPG (XP, niveaux, succès)
│   │   ├── debug.js         # Mode debug et outils de développement
│   │   └── app.js           # Application principale et initialisation
│   └── icons/
│       └── (icônes PWA - à créer)
└── docs/
    └── README_expand.md     # Documentation des fonctionnalités futures
```

## ✨ Fonctionnalités

### 🍅 Fonctionnalité Pomodoro de base
- **Sessions de concentration de 25 minutes** avec timer personnalisable
- **Pauses courtes de 5 minutes** et **pauses longues de 15 minutes**
- **Anneau de progression visuel** montrant l'achèvement de la session
- **Notifications audio/visuelles** pour les transitions de session
- **Fonctionnalité pause/reprise** pour la flexibilité

### 🎮 Mécaniques RPG
- **Système de niveaux de personnage** avec exigences XP progressives
- **Récompenses XP** pour les sessions terminées (50 + 5 par niveau)
- **Système de succès** avec badges débloquables
- **Suivi des séries** pour la cohérence quotidienne
- **XP flottant animé** pour un retour immédiat
- **Tableau de bord des statistiques** montrant le progrès total

### 📱 Fonctionnalités PWA
- **Progressive Web App** - fonctionne hors ligne et peut être installée
- **Design responsive** - optimisé pour mobile et desktop
- **Stockage local** - tout le progrès sauvegardé localement
- **Multiplateforme** - fonctionne sur tout appareil avec navigateur web
- **Aucune installation requise** - fonctionne directement dans le navigateur

### 🛠️ Mode Debug
- **Outils de développement** pour tester rapidement les fonctionnalités
- **Avance rapide du timer**
- **Achèvement instantané de session**
- **Manipulation manuelle XP/niveau**
- **Outils de test des succès**

## 🚀 Installation et utilisation

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Aucune dépendance supplémentaire requise

### Installation de base

1. **Téléchargez les fichiers :**
   ```bash
   git clone <repository-url>
   cd quest-timer
   ```

2. **Pour utilisation basique :**
   - Ouvrez `index.html` dans votre navigateur web
   - Commencez à utiliser immédiatement !

3. **Pour déploiement PWA :**
   - Hébergez les fichiers sur un serveur HTTPS
   - Les utilisateurs peuvent "Ajouter à l'écran d'accueil"

### Développement local
```bash
# Serveur local simple
python -m http.server 8000
# ou
npx serve .

# Ouvrez http://localhost:8000
```

## 🎮 Comment jouer

### Démarrage
1. **Commencez votre première quête** en cliquant sur "Start Quest"
2. **Concentrez-vous pendant 25 minutes** - résistez aux distractions !
3. **Terminez la session** pour gagner de l'XP et monter de niveau
4. **Prenez votre pause méritée** (5 ou 15 minutes)
5. **Répétez et construisez des séries** pour des récompenses maximales

### Système de niveaux
- **Niveau 1** : 100 XP requis
- **Niveau 2** : 250 XP requis
- **Niveau 3** : 450 XP requis
- **Formule** : `niveau * 100 + (niveau - 1) * 50`

### Exemples de succès
- 🎯 **Première Quête** : Terminez votre premier Pomodoro
- 💪 **Dévoué** : Terminez 10 Pomodoros
- 🧠 **Maître Concentré** : Terminez 25 Pomodoros
- 🔥 **Guerrier des Séries** : Maintenez une série de 5 jours
- ⏰ **Maître du Temps** : Concentrez-vous pendant 10 heures au total

## 🔧 Architecture technique

### Modules JavaScript

#### `utils.js` - Fonctions utilitaires
- Formatage du temps
- Gestion des notifications
- Stockage localStorage
- Animations et utilitaires

#### `timer.js` - Logique du timer
- Classe Timer principale
- Gestion des sessions (focus/pause)
- Anneau de progression
- Callbacks pour intégration RPG

#### `rpg.js` - Système RPG
- Gestion XP et niveaux
- Système de succès
- Suivi des statistiques
- Persistance des données

#### `debug.js` - Mode debug
- Panel de debug
- Raccourcis clavier
- Outils de test
- Monitoring des performances

#### `app.js` - Application principale
- Initialisation de l'app
- Coordination des modules
- Gestion des événements
- Fonctionnalités PWA

### Styles CSS

#### `main.css` - Styles de base
- Reset et styles de base
- Layout et grille
- Boutons et contrôles
- Design responsive

#### `components.css` - Composants UI
- Carte de personnage
- Section timer
- Panneau de succès
- Panel de debug

#### `animations.css` - Animations
- Effets de niveau
- XP flottant
- Transitions
- Effets de hover

## 🌟 Stack technologique

- **Frontend** : HTML5, CSS3, JavaScript (ES6+) pur
- **Stockage** : API localStorage du navigateur
- **Notifications** : API Web Notifications
- **PWA** : Service Workers, Manifeste d'application web
- **Styling** : CSS Grid, Flexbox, Animations CSS
- **Icônes** : Emojis Unicode (compatibilité universelle)

## 📊 Support navigateur

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Navigateurs mobiles (iOS Safari, Chrome Mobile)

## 🤝 Contribution

1. Forkez le repository
2. Créez une branche de fonctionnalité
3. Effectuez vos modifications
4. Testez minutieusement
5. Soumettez une pull request

## 📝 Licence

Licence MIT - voir le fichier LICENSE pour les détails

## 🙏 Remerciements

- **Technique Pomodoro** par Francesco Cirillo
- **Mécaniques RPG** inspirées des systèmes de progression classiques
- **Design Glassmorphism** tendance pour l'esthétique UI moderne

## 🐛 Rapports de bugs et demandes de fonctionnalités

Veuillez ouvrir une issue sur GitHub avec :
- **Navigateur et version**
- **Étapes pour reproduire**
- **Comportement attendu vs réel**
- **Captures d'écran si applicable**

---

**Bonne concentration ! Que votre productivité soit légendaire ! ⚔️✨**