# ⚔️ Quest Timer - RPG Pomodoro PWA

## 🎯 Description

Quest Timer transforme la technique Pomodoro traditionnelle en une expérience RPG engageante. Complétez des sessions de concentration pour gagner de l'XP, faire évoluer votre personnage, débloquer des succès et construire des séries de productivité - tout en maintenant une concentration maximale et une efficacité de travail.

**✨ Nouveauté : PWA Standalone disponible !** L'application peut maintenant être installée comme une vraie app native sur mobile et desktop.

## 📁 Structure du projet

```
quest-timer/
├── index.html                 # Page principale (HTML minimal)
├── manifest.json             # Manifeste PWA (optimisé standalone)
├── sw.js                     # Service Worker (cache adaptatif + versioning)
├── README.md                 # Cette documentation
├── assets/
│   ├── css/
│   │   ├── main.css          # Styles de base et layout
│   │   ├── components.css    # Styles des composants UI
│   │   └── animations.css    # Animations et effets visuels
│   ├── js/
│   │   ├── utils.js          # Fonctions utilitaires
│   │   ├── timer.js          # Logique du timer Pomodoro + reset complet
│   │   ├── rpg.js           # Système RPG (XP, niveaux, succès)
│   │   ├── debug.js         # Mode debug + Hot Reload intégré
│   │   └── app.js           # Application principale et initialisation
│   └── icons/               # Icônes PWA (192x192, 512x512 requis)
│       ├── icon-72.png
│       ├── icon-96.png
│       ├── icon-128.png
│       ├── icon-144.png
│       ├── icon-152.png
│       ├── icon-192.png     # ⭐ Critique pour PWA
│       ├── icon-384.png
│       ├── icon-512.png     # ⭐ Critique pour PWA
│       └── hourglass.png    # Favicon
├── docker/
│   ├── Dockerfile           # Image Docker pour déploiement
│   ├── nginx.conf          # Configuration Nginx optimisée PWA
│   ├── docker-compose.yml # Hot Reload + Stack nommée
│   ├── .dockerignore      # Fichiers à exclure du build
│   └── deploy.sh          # Script de déploiement automatisé
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
- **Transitions automatiques** entre Focus et Break

### 🎮 Mécaniques RPG
- **Système de niveaux de personnage** avec exigences XP progressives
- **Récompenses XP** pour les sessions terminées (50 + 5 par niveau)
- **Système de succès** avec badges débloquables
- **Suivi des séries** pour la cohérence quotidienne
- **XP flottant animé** pour un retour immédiat
- **Tableau de bord des statistiques** montrant le progrès total

### 📱 Fonctionnalités PWA (Nouveauté !)
- **Progressive Web App** - fonctionne hors ligne et peut être installée
- **Mode Standalone** - S'ouvre comme une vraie app (sans barre d'adresse)
- **Installation native** - "Ajouter à l'écran d'accueil" sur mobile/desktop
- **Design responsive** - optimisé pour mobile et desktop
- **Stockage local** - tout le progrès sauvegardé localement
- **Multiplateforme** - fonctionne sur tout appareil avec navigateur web
- **Service Worker** - Cache intelligent pour usage hors ligne
- **HTTPS requis** - Sécurité maximale pour mode standalone

### 🛠️ Mode Debug + Hot Reload (Amélioré)
- **Outils de développement** pour tester rapidement les fonctionnalités
- **Avance rapide du timer** (5 minutes par défaut)
- **Achèvement instantané de session** (compatible PWA standalone)
- **Manipulation manuelle XP/niveau**
- **Outils de test des succès**
- **Reset complet** - Remet l'app à l'état initial (nouveau !)
- **Hot Reload intégré** - Modifications instantanées en développement
- **Clear Cache** - Outils de gestion du cache PWA
- **Service Worker versioning** - Information et contrôle SW
- **Raccourcis clavier** - Ctrl+Shift+[touches]
- **Diagnostic PWA** - Vérification des critères standalone

### 🔥 Hot Reload & Développement
- **Volumes Docker** - Modifications instantanées sans rebuild
- **Cache adaptatif** - Network First en dev, Cache First en prod
- **Outils intégrés** dans le panel debug (pas d'interface séparée)
- **Versioning automatique** du Service Worker
- **Console utilities** - `window.hotReload` pour debug avancé

## 🚀 Installation et utilisation

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- **HTTPS requis** pour le mode PWA standalone
- Docker et Docker Compose (pour le déploiement containerisé)

### 🐳 Déploiement Docker avec Hot Reload (Recommandé)

**1. Clonez le repository :**
```bash
git clone <repository-url>
cd quest-timer
```

**2. Déployez avec Docker Stack + Hot Reload :**
```bash
cd docker
chmod +x deploy.sh
./deploy.sh full
```

**3. Accédez à l'application :**
- **URL Locale :** http://localhost:3046
- **URL Publique :** https://votre-domaine.com (pour PWA standalone)
- **PWA :** Installable comme application native
- **Hot Reload :** Modifications instantanées en développement

**4. Gestion de la stack :**
```bash
# Voir les logs de la stack
./deploy.sh logs

# Vérifier la santé de la stack
./deploy.sh health

# Redémarrer la stack
./deploy.sh restart

# Arrêter la stack
./deploy.sh stop

# Informations de la stack
./deploy.sh info

# Nettoyage complet de la stack
./deploy.sh cleanup
```

### 🔥 Workflow de développement avec Hot Reload

**1. Modifiez vos fichiers :**
```bash
# Éditez assets/css/main.css, assets/js/*.js, index.html, etc.
# Les changements sont instantanés !
```

**2. Voir les changements :**
```bash
# Actualisez le navigateur (F5)
# Pour PWA : Ctrl+Shift+R (hard refresh)
```

**3. Outils Hot Reload dans le debug :**
- **🐛 Debug Panel** → Section "🔥 HOT RELOAD"
- **🔄 Hard Reload** - Rechargement complet
- **🧹 Clear Cache** - Vider cache PWA + reload
- **📦 SW Version** - Info Service Worker

### 🔒 Configuration HTTPS pour PWA Standalone

**Option 1 : Reverse Proxy (Recommandé)**
```bash
# Utilisez Nginx Proxy Manager ou Traefik
# Exemple avec domaine : https://pomodoro.votre-domaine.com
# Certificat SSL automatique avec Let's Encrypt
```

**Option 2 : Certificat auto-signé (Dev)**
```bash
# Modifiez nginx.conf pour inclure SSL
# Générez un certificat auto-signé
# Acceptez l'avertissement de sécurité du navigateur
```

### 💻 Installation basique (sans Docker)

**1. Téléchargez les fichiers :**
```bash
git clone <repository-url>
cd quest-timer
```

**2. Générez les icônes PWA :**
- Utilisez le générateur d'icônes fourni
- Placez toutes les icônes dans `assets/icons/`
- Vérifiez que icon-192.png et icon-512.png sont présents

**3. Pour déploiement PWA :**
- Hébergez les fichiers sur un serveur HTTPS
- Les utilisateurs peuvent "Ajouter à l'écran d'accueil"

### 🔧 Développement local
```bash
# Serveur local simple
python -m http.server 8000
# ou
npx serve .

# Ouvrez http://localhost:8000
# Note: PWA standalone nécessite HTTPS
# Note: Hot reload nécessite Docker
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
- **Nouveau :** `resetToInitialState()` pour reset complet

#### `rpg.js` - Système RPG
- Gestion XP et niveaux
- Système de succès
- Suivi des statistiques
- Persistance des données

#### `debug.js` - Mode debug + Hot Reload
- Panel de debug
- **Nouveau :** Hot Reload intégré (pas d'interface séparée)
- **Nouveau :** Outils de cache PWA
- **Nouveau :** Service Worker versioning
- Raccourcis clavier
- Outils de test
- **Nouveau :** Compatible PWA standalone
- **Nouveau :** Reset complet de l'application
- **Nouveau :** Diagnostic PWA intégré

#### `app.js` - Application principale
- Initialisation de l'app
- Coordination des modules
- Gestion des événements
- Fonctionnalités PWA
- **Nouveau :** Hot Reload simplifié (géré par debug)

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

### 🐳 Infrastructure Docker

#### `Dockerfile`
- Image Nginx Alpine optimisée
- Configuration PWA intégrée
- Build multi-étapes efficace

#### `nginx.conf`
- Configuration PWA optimisée
- Headers de sécurité
- Compression gzip
- Cache stratégique
- Support HTTPS

#### `docker-compose.yml`
- **Nouveau :** Volumes Hot Reload montés
- Orchestration des services avec stack nommée
- Health checks automatiques
- Port mapping configuré
- Labels pour identification de la stack

#### `deploy.sh`
- Script de déploiement automatisé avec support stack
- Gestion du cycle de vie
- Monitoring intégré
- Commandes utilitaires

#### `sw.js` - Service Worker
- **Nouveau :** Cache adaptatif (Network First en dev, Cache First en prod)
- **Nouveau :** Versioning automatique pour Hot Reload
- **Nouveau :** Messages et contrôles Hot Reload
- Cache intelligent
- Support hors ligne

## 🌟 Stack technologique

- **Frontend** : HTML5, CSS3, JavaScript (ES6+) pur
- **Stockage** : API localStorage du navigateur
- **Notifications** : API Web Notifications
- **PWA** : Service Workers, Manifeste d'application web
- **Styling** : CSS Grid, Flexbox, Animations CSS
- **Icônes** : Emojis Unicode + icônes PNG PWA
- **Infrastructure** : Docker + Nginx Alpine
- **Déploiement** : Docker Compose + Scripts automatisés
- **Développement** : Hot Reload avec volumes Docker
- **Sécurité** : HTTPS, CSP, Headers sécurisés

## 📊 Support navigateur

- ✅ Chrome 60+ (PWA standalone excellent)
- ✅ Firefox 55+ (PWA standalone bon)
- ✅ Safari 11+ (PWA standalone limité)
- ✅ Edge 79+ (PWA standalone excellent)
- ✅ Navigateurs mobiles (iOS Safari, Chrome Mobile)

## 🐳 Configuration Docker

### Variables d'environnement
```bash
# Port de l'application (modifiable dans docker-compose.yml)
PORT=3046

# Configuration Nginx
NGINX_HOST=localhost
NGINX_PORT=80

# Stack Docker
STACK_NAME=quest-timer

# Hot Reload
HOT_RELOAD=true  # Activé automatiquement en développement
```

### Health Checks
- **Intervalle** : 30 secondes
- **Timeout** : 10 secondes
- **Retries** : 3 tentatives
- **Start period** : 40 secondes

### Sécurité
- Headers de sécurité configurés
- CSP (Content Security Policy)
- Protection XSS et CSRF
- HTTPS ready

## 🚨 Dépannage

### Problèmes PWA Standalone

**PWA s'ouvre dans le navigateur au lieu de standalone :**
```bash
# 1. Vérifiez HTTPS
# La PWA DOIT être servie en HTTPS pour le mode standalone

# 2. Vérifiez les icônes
# Les icônes 192x192 et 512x512 sont OBLIGATOIRES

# 3. Diagnostic PWA
# F12 → Console → Tapez : diagnosePWA()

# 4. Vider le cache
# F12 → Application → Storage → Clear storage
# Ou: Debug panel → 🧹 Clear Cache
```

**Générer les icônes PWA :**
```bash
# Utilisez le générateur d'icônes fourni
# Ou créez manuellement :
mkdir -p assets/icons
# Placez icon-72.png, icon-96.png, ..., icon-512.png, hourglass.png
```

### Problèmes Hot Reload

**Les modifications ne sont pas visibles :**
```bash
# 1. Vérifiez que vous êtes en localhost
# Hot Reload ne fonctionne qu'en développement (localhost)

# 2. Hard refresh
# Ctrl+Shift+R dans le navigateur

# 3. Utilisez les outils debug
# 🐛 → 🔥 HOT RELOAD → 🧹 Clear Cache

# 4. Vérifiez les volumes Docker
# docker-compose.yml doit avoir les volumes montés
```

### Problèmes Docker courants

**Port déjà utilisé :**
```bash
# Modifier le port dans docker-compose.yml
ports:
  - "NOUVEAU_PORT:80"
```

**Stack ne démarre pas :**
```bash
# Vérifier les logs de la stack
./deploy.sh logs

# Vérifier l'état de la stack
./deploy.sh info

# Rebuild complet de la stack
./deploy.sh cleanup
./deploy.sh full
```

### Debugging de l'application

**Mode Debug + Hot Reload :**
- Cliquez sur l'icône 🐛 en haut à gauche
- Section "🔥 HOT RELOAD" visible en développement
- Utilisez les raccourcis clavier (Ctrl+Shift+...)
- Consultez la console du navigateur

**Raccourcis clavier :**
- **Espace** : Start/Pause timer
- **R** : Reset timer
- **Échap** : Fermer le panel debug
- **Ctrl+Shift+C** : Complete session (debug)
- **Ctrl+Shift+F** : Fast forward (debug)
- **Ctrl+Shift+X** : Add XP (debug)
- **Ctrl+Shift+R** : Clear cache + reload (hot reload)
- **Ctrl+Shift+H** : Toggle debug panel (hot reload)

**Outils Hot Reload :**
```javascript
// Dans la console (F12)
diagnosePWA()           // Diagnostic PWA
hotReload.clearCache()  // Vider le cache
hotReload.reload()      // Rechargement dur
hotReload.getVersion()  // Version Service Worker
```

## 🤝 Contribution

1. Forkez le repository
2. Créez une branche de fonctionnalité
3. Effectuez vos modifications avec Hot Reload actif
4. Testez minutieusement (incluant les tests Docker et PWA)
5. Soumettez une pull request

### Standards de développement
- Code JavaScript ES6+
- CSS avec préfixes vendor si nécessaire
- Tests de compatibilité navigateur
- **Tests PWA** sur mobile et desktop
- **Tests Hot Reload** en développement
- Documentation des nouvelles fonctionnalités
- Tests Docker avant commit

## 📝 Licence

Licence MIT - voir le fichier LICENSE pour les détails

## 🙏 Remerciements

- **Technique Pomodoro** par Francesco Cirillo
- **Mécaniques RPG** inspirées des systèmes de progression classiques
- **Design Glassmorphism** tendance pour l'esthétique UI moderne
- **Docker & Nginx** pour l'infrastructure robuste
- **PWA Standards** pour l'expérience native
- **Hot Reload** pour l'efficacité de développement

## 🐛 Rapports de bugs et demandes de fonctionnalités

Veuillez ouvrir une issue sur GitHub avec :
- **Navigateur et version**
- **Environnement** (Docker/Local/PWA Standalone/PWA Browser)
- **Mode d'accès** (HTTP/HTTPS)
- **Hot Reload** (Actif/Inactif)
- **Étapes pour reproduire**
- **Comportement attendu vs réel**
- **Captures d'écran si applicable**
- **Logs Docker si pertinents**
- **Résultat du diagnostic PWA** (`diagnosePWA()`)

### Logs utiles pour debug
```bash
# Logs de la stack
./deploy.sh logs

# État de la stack
./deploy.sh info

# Santé de la stack
./deploy.sh health

# Diagnostic PWA (dans la console navigateur)
diagnosePWA()

# Info Hot Reload (dans la console navigateur)
hotReload.getVersion()
```

---

**🎮 Transformez votre productivité en aventure épique !**  
**⚔️ Que votre concentration soit légendaire ! ✨**

## 🔗 Liens rapides

- 🚀 **Déploiement rapide** : `cd docker && ./deploy.sh full`
- 🌐 **Application locale** : http://localhost:3046
- 📱 **PWA Standalone** : Servir en HTTPS puis "Ajouter à l'écran d'accueil"
- 🛠️ **Debug + Hot Reload** : Cliquez sur 🐛 dans l'app
- 🔧 **Logs Stack** : `./deploy.sh logs`
- 📊 **Diagnostic PWA** : Console → `diagnosePWA()`
- 🔥 **Hot Reload Tools** : Console → `hotReload.*`

## 🎯 Changelog récent

### v1.2.0 - Hot Reload & Développement Amélioré
- ✅ **Hot Reload intégré** - Modifications instantanées sans rebuild
- ✅ **Cache adaptatif** - Network First en dev, Cache First en prod
- ✅ **Service Worker versioning** - Gestion automatique des versions
- ✅ **Debug panel amélioré** - Hot Reload intégré (pas d'interface séparée)
- ✅ **Volumes Docker** - Montage des fichiers sources
- ✅ **Outils console** - `window.hotReload` pour debug avancé

### v1.1.0 - PWA Standalone & Améliorations Debug
- ✅ **PWA Standalone** - Vraie app native
- ✅ **Reset complet** - Mode debug amélioré
- ✅ **Docker Stack** - Gestion organisée des containers
- ✅ **HTTPS Support** - Requis pour PWA standalone
- ✅ **Diagnostic intégré** - Vérification PWA automatique
- ✅ **Compatible mobile** - Optimisé pour smartphone/tablet