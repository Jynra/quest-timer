#!/bin/bash

# Script de déploiement pour Quest Timer PWA
# Usage: ./deploy.sh [start|stop|restart|logs|build]
# À exécuter depuis le répertoire quest-timer/docker/

set -e

PROJECT_NAME="quest-timer"
PORT=3046

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonctions utilitaires
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifications préalables
check_requirements() {
    log_info "Vérification des prérequis..."
    
    # Vérifier qu'on est dans le bon répertoire
    if [[ ! -f "docker-compose.yml" ]] || [[ ! -f "Dockerfile" ]]; then
        log_error "Fichiers Docker non trouvés. Assurez-vous d'être dans le répertoire quest-timer/docker/"
        exit 1
    fi
    
    # Vérifier que les fichiers de l'app existent
    if [[ ! -f "../index.html" ]]; then
        log_error "Fichiers de l'application non trouvés. Vérifiez la structure du projet."
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker n'est pas installé"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose n'est pas installé"
        exit 1
    fi
    
    log_success "Prérequis validés"
}

# Construction de l'image
build_image() {
    log_info "Construction de l'image Docker..."
    docker-compose build --no-cache
    log_success "Image construite avec succès"
}

# Démarrage des services
start_services() {
    log_info "Démarrage des services..."
    docker-compose up -d
    
    # Attendre que le service soit prêt
    log_info "Vérification de la disponibilité du service..."
    max_attempts=30
    attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:$PORT > /dev/null 2>&1; then
            log_success "Quest Timer est disponible sur http://localhost:$PORT"
            log_info "📱 PWA prête à être installée !"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            log_error "Le service n'est pas accessible après $max_attempts tentatives"
            docker-compose logs
            exit 1
        fi
        
        log_info "Tentative $attempt/$max_attempts - En attente..."
        sleep 2
        ((attempt++))
    done
}

# Arrêt des services
stop_services() {
    log_info "Arrêt des services..."
    docker-compose down
    log_success "Services arrêtés"
}

# Redémarrage des services
restart_services() {
    log_info "Redémarrage des services..."
    docker-compose restart
    log_success "Services redémarrés"
}

# Affichage des logs
show_logs() {
    docker-compose logs -f
}

# Nettoyage
cleanup() {
    log_info "Nettoyage des ressources Docker..."
    docker-compose down -v
    docker system prune -f
    log_success "Nettoyage terminé"
}

# Surveillance de la santé
health_check() {
    log_info "Vérification de la santé du service..."
    
    container_status=$(docker-compose ps -q quest-timer | xargs docker inspect -f '{{.State.Health.Status}}' 2>/dev/null || echo "unknown")
    
    case $container_status in
        "healthy")
            log_success "Le service est en bonne santé"
            ;;
        "unhealthy")
            log_error "Le service est en mauvaise santé"
            docker-compose logs quest-timer
            ;;
        "starting")
            log_warning "Le service est en cours de démarrage"
            ;;
        *)
            log_warning "État de santé inconnu"
            ;;
    esac
}

# Affichage des informations
show_info() {
    log_info "=== Quest Timer Docker Info ==="
    echo "📍 URL: http://localhost:$PORT"
    echo "🐳 Container: quest-timer-app"
    echo "📂 Répertoire: $(pwd)"
    echo "🎮 PWA: Prête à être installée"
    echo ""
    echo "Commandes utiles:"
    echo "  🔧 Logs:    ./deploy.sh logs"
    echo "  ❤️  Santé:   ./deploy.sh health"
    echo "  🔄 Restart: ./deploy.sh restart"
    echo "  🛑 Stop:    ./deploy.sh stop"
}

# Menu principal
case "${1:-start}" in
    "build")
        check_requirements
        build_image
        ;;
    "start")
        check_requirements
        start_services
        show_info
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        restart_services
        ;;
    "logs")
        show_logs
        ;;
    "health")
        health_check
        ;;
    "cleanup")
        cleanup
        ;;
    "info")
        show_info
        ;;
    "full")
        check_requirements
        build_image
        start_services
        health_check
        show_info
        ;;
    *)
        echo "Usage: $0 {build|start|stop|restart|logs|health|cleanup|info|full}"
        echo ""
        echo "⚔️ Quest Timer Docker Manager"
        echo ""
        echo "Commandes disponibles:"
        echo "  build    - Construire l'image Docker"
        echo "  start    - Démarrer les services"
        echo "  stop     - Arrêter les services"
        echo "  restart  - Redémarrer les services"
        echo "  logs     - Afficher les logs en temps réel"
        echo "  health   - Vérifier la santé du service"
        echo "  cleanup  - Nettoyer les ressources Docker"
        echo "  info     - Afficher les informations"
        echo "  full     - Build + Start + Health check + Info"
        echo ""
        echo "💡 Exécutez depuis le répertoire quest-timer/docker/"
        exit 1
        ;;
esac