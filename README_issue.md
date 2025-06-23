# 🚨 ISSUE - Hot Reload ne fonctionne pas via domaine

## 🔍 Description du problème

Le Hot Reload fonctionne correctement en accès local (`localhost:3046`) mais **ne fonctionne pas** lors de l'accès via le domaine public (`domain.com`).

## 📊 Symptômes observés

### ✅ Fonctionne (localhost) :
- **URL** : `localhost:3046` ou `192.168.x.x:3046`
- **Hot Reload** : ✅ Visible dans le debug panel
- **Modifications** : ✅ Instantanées
- **Version** : ✅ Dernière version

### ❌ Ne fonctionne pas (domaine) :
- **URL** : `domain.com` (via reverse proxy)
- **Hot Reload** : ❌ Absent du debug panel  
- **Modifications** : ❌ Anciennes versions
- **Version** : ❌ Version cachée/obsolète

## 🧪 Tests effectués

### Test réseau local :
```bash
# Depuis un autre PC du réseau local
curl http://192.168.112.2:3046  # ✅ Version récente
curl http://localhost:3046      # ✅ Version récente
```

### Test domaine public :
```bash
# Via le domaine
curl https://domain.com         # ❌ Ancienne version
```

## 🔧 Configuration actuelle

### Docker container :
- **IP Container** : `192.168.112.2` (réseau Docker interne)
- **Port mapping** : `3046:80`
- **Hot Reload** : Activé avec volumes montés

### Reverse Proxy (Nginx Proxy Manager) :
- **Domain** : `domain.com` → `192.168.112.2:3046`
- **SSL** : Let's Encrypt (actif)
- **Cache** : Possiblement activé (problème ?)

## 🎯 Cause probable

### 1. **Cache du Reverse Proxy**
Le reverse proxy (NPM) cache l'ancienne version et ne voit pas les modifications Hot Reload.

### 2. **Service Worker PWA**
Le Service Worker en production utilise un cache différent du mode développement.

### 3. **Détection environnement**
```javascript
// Dans debug.js
this.isDevelopment = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
```
**Problème** : `domain.com` n'est pas détecté comme "développement"

## 🛠️ Solutions proposées

### Solution 1 : Désactiver le cache NPM
```nginx
# Dans Nginx Proxy Manager - Custom locations
location / {
    proxy_pass http://192.168.112.2:3046;
    proxy_cache off;
    proxy_no_cache 1;
    proxy_cache_bypass 1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
}
```

### Solution 2 : Forcer le mode développement
```javascript
// Dans debug.js - Modifier la détection
this.isDevelopment = location.hostname === 'localhost' || 
                     location.hostname === '127.0.0.1' ||
                     location.hostname === 'domain.com';  // Ajouter votre domaine
```

### Solution 3 : Variable d'environnement
```javascript
// Dans debug.js
this.isDevelopment = location.hostname === 'localhost' || 
                     location.hostname === '127.0.0.1' ||
                     localStorage.getItem('forceHotReload') === 'true';

// Pour activer via console :
// localStorage.setItem('forceHotReload', 'true')
```

### Solution 4 : Service Worker en mode dev
```javascript
// Dans sw.js - Modifier la détection
const isDevelopment = location.hostname === 'localhost' || 
                      location.hostname === '127.0.0.1' ||
                      location.hostname.includes('domain.com');
```

## 🚀 Solution recommandée (Étapes)

### Étape 1 : Test de cache NPM
```bash
# Ajouter headers no-cache dans NPM
# Custom location : /*
# Configuration :
proxy_cache off;
add_header Cache-Control "no-cache";
```

### Étape 2 : Force Hot Reload via console
```javascript
// Dans la console du navigateur sur domain.com
localStorage.setItem('forceHotReload', 'true');
location.reload();
```

### Étape 3 : Vérification
```javascript
// Vérifier si Hot Reload est actif
console.log('Hot Reload:', !!window.hotReload);
console.log('Debug Mode:', window.questTimer?.debugMode?.isDevelopment);
```

## 🔍 Tests de diagnostic

### Test 1 : Cache NPM
```bash
# Tester avec curl
curl -H "Cache-Control: no-cache" https://domain.com
curl -I https://domain.com | grep -i cache
```

### Test 2 : Service Worker
```javascript
// Dans la console F12
navigator.serviceWorker.getRegistrations().then(regs => 
    regs.forEach(reg => reg.unregister())
).then(() => location.reload());
```

### Test 3 : Forcer la détection développement
```javascript
// Dans la console F12
localStorage.setItem('forceHotReload', 'true');
window.questTimer.debugMode.isDevelopment = true;
window.questTimer.debugMode.addHotReloadControls();
```

## 🎯 Statut et prochaines étapes

### Statut actuel :
- ❌ **Hot Reload** : Non fonctionnel via domaine
- ✅ **PWA** : Fonctionne en mode standalone
- ✅ **Application** : Fonctionne mais version obsolète

### Actions prioritaires :
1. **Identifier** : Cache NPM vs détection environnement
2. **Tester** : Solutions proposées ci-dessus
3. **Implémenter** : Solution permanente
4. **Vérifier** : Hot Reload via domaine

## 🛡️ Impact sécurité

### Considérations :
- **Mode développement** sur domaine public = risque sécurité
- **Hot Reload** ne devrait être actif qu'en développement local
- **Solution** : Mode debug activable manuellement uniquement

### Recommandation :
```javascript
// Solution sécurisée - activation manuelle uniquement
if (location.hostname !== 'localhost' && 
    location.hostname !== '127.0.0.1' &&
    !localStorage.getItem('devModeEnabled')) {
    // Mode production - pas de Hot Reload
    this.isDevelopment = false;
} else {
    // Mode développement ou activé manuellement
    this.isDevelopment = true;
}
```

## 📝 Configuration de test temporaire

Pour tester immédiatement :

### NPM Custom Location :
```nginx
location / {
    proxy_pass http://192.168.112.2:3046;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # Anti-cache pour Hot Reload
    proxy_cache off;
    proxy_no_cache 1;
    proxy_cache_bypass 1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
}
```

### Console commands :
```javascript
// Forcer Hot Reload sur domain.com
localStorage.setItem('forceHotReload', 'true');
window.questTimer.debugMode.isDevelopment = true;
location.reload();
```

---

**🔥 Objectif** : Hot Reload fonctionnel via domaine pour développement  
**⚡ Priorité** : Haute - bloque le workflow de développement  
**🎯 Cible** : Solution permanente et sécurisée