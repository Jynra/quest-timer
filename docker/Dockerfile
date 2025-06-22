# Utilise une image nginx légère pour servir les fichiers statiques
FROM nginx:alpine

# Installer OpenSSL pour générer le certificat
RUN apk add --no-cache openssl

# Créer le dossier SSL
RUN mkdir -p /etc/nginx/ssl

# Générer un certificat auto-signé
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/key.pem \
    -out /etc/nginx/ssl/cert.pem \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

# Copie tous les fichiers de l'application dans le répertoire web de nginx
COPY . /usr/share/nginx/html/

# Copie la configuration nginx personnalisée pour les PWA
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Supprime les fichiers docker du répertoire web (pas nécessaires)
RUN rm -rf /usr/share/nginx/html/docker/

# Expose les ports 80 et 443
EXPOSE 80 443

# Démarre nginx
CMD ["nginx", "-g", "daemon off;"]