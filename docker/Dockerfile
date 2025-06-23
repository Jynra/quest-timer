# Utilise une image nginx légère pour servir les fichiers statiques
FROM nginx:alpine

# 🔥 CORRECTION: Ne copie QUE la config nginx, pas les fichiers sources !
# Les fichiers sources sont montés via volumes Docker

# Copie SEULEMENT la configuration nginx
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Crée les répertoires pour les volumes (optionnel mais propre)
RUN mkdir -p /usr/share/nginx/html/assets

# Expose le port 80 (sera mappé vers 3046)
EXPOSE 80

# Démarre nginx
CMD ["nginx", "-g", "daemon off;"]