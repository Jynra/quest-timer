# Utilise une image nginx légère pour servir les fichiers statiques
FROM nginx:alpine

# Copie tous les fichiers de l'application dans le répertoire web de nginx
COPY . /usr/share/nginx/html/

# Copie la configuration nginx personnalisée pour les PWA
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Supprime les fichiers docker du répertoire web (pas nécessaires)
RUN rm -rf /usr/share/nginx/html/docker/

# Expose le port 80 (sera mappé vers 3046)
EXPOSE 80

# Démarre nginx
CMD ["nginx", "-g", "daemon off;"]

# Expose le port 80 (sera mappé vers 3046)
EXPOSE 80

# Démarre nginx
CMD ["nginx", "-g", "daemon off;"]