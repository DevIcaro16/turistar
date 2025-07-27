#!/bin/bash

# Script para deploy na EC2
# Este script é executado pelo GitHub Actions Runner na EC2

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Verificar se o Docker está rodando
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker não está rodando. Iniciando Docker..."
        sudo systemctl start docker
        sleep 5
    fi
}

# Parar containers existentes
stop_containers() {
    print_step "Parando containers existentes..."
    docker-compose -f docker-compose.prod.yml down || true
    docker system prune -f
}

# Fazer pull das imagens mais recentes
pull_images() {
    print_step "Fazendo pull das imagens mais recentes..."
    docker pull $BACKEND_IMAGE
    docker pull $FRONTEND_IMAGE
}

# Deploy da aplicação
deploy_application() {
    print_step "Deployando aplicação..."
    docker-compose -f docker-compose.prod.yml up -d
    
    print_message "Aguardando serviços ficarem prontos..."
    sleep 30
}

# Verificar saúde dos serviços
health_check() {
    print_step "Verificando saúde dos serviços..."
    
    # Verificar se os containers estão rodando
    docker-compose -f docker-compose.prod.yml ps
    
    # Health check do backend
    if curl -f http://localhost:8000/ >/dev/null 2>&1; then
        print_message "✅ Backend está funcionando"
    else
        print_error "❌ Backend não está respondendo"
        exit 1
    fi
    
    # Health check do frontend
    if curl -f http://localhost:3000/ >/dev/null 2>&1; then
        print_message "✅ Frontend está funcionando"
    else
        print_error "❌ Frontend não está respondendo"
        exit 1
    fi
}

# Limpar imagens antigas
cleanup_old_images() {
    print_step "Limpando imagens antigas..."
    docker image prune -a -f --filter "until=168h"
}

# Função principal
main() {
    print_message "🚀 Iniciando deploy na EC2..."
    
    check_docker
    stop_containers
    pull_images
    deploy_application
    health_check
    cleanup_old_images
    
    print_message "🎉 Deploy concluído com sucesso!"
    print_message "Backend: http://localhost:8000"
    print_message "Frontend: http://localhost:3000"
    print_message "API Docs: http://localhost:8000/api-docs"
}

# Executar função principal
main "$@" 