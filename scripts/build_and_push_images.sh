#!/bin/bash

# Script para build e push das imagens Docker para Docker Hub
# Data: $(date)

# Configurações
DOCKER_HUB_USERNAME="devicaro18"  # Substitua pelo seu username do Docker Hub
REPOSITORY_NAME="turistar"
VERSION="latest"
BACKEND_IMAGE_NAME="backend-api"
FRONTEND_IMAGE_NAME="frontend"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
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

# Função para verificar se o comando foi executado com sucesso
check_status() {
    if [ $? -eq 0 ]; then
        print_message "$1"
    else
        print_error "$2"
        exit 1
    fi
}

# Função para login no Docker Hub
docker_login() {
    print_step "Fazendo login no Docker Hub..."
    
    # Verificar se as credenciais estão definidas
    if [ -z "$DOCKER_HUB_USERNAME" ] || [ "$DOCKER_HUB_USERNAME" = "seu-username" ]; then
        print_error "Por favor, configure seu username do Docker Hub no script"
        exit 1
    fi
    
    # Solicitar senha do Docker Hub
    echo -n "Digite sua senha do Docker Hub: "
    read -s DOCKER_HUB_PASSWORD
    echo
    
    # Fazer login
    echo "$DOCKER_HUB_PASSWORD" | docker login -u "$DOCKER_HUB_USERNAME" --password-stdin
    check_status "Login no Docker Hub realizado com sucesso" "Falha no login do Docker Hub"
}

# Função para build da imagem backend
build_backend() {
    print_step "Fazendo build da imagem backend-api..."
    
    docker build -f backend-api.Dockerfile -t "$DOCKER_HUB_USERNAME/$REPOSITORY_NAME-$BACKEND_IMAGE_NAME:$VERSION" .
    check_status "Build da imagem backend-api concluído" "Falha no build da imagem backend-api"
    
    # Tag adicional com timestamp
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    docker tag "$DOCKER_HUB_USERNAME/$REPOSITORY_NAME-$BACKEND_IMAGE_NAME:$VERSION" "$DOCKER_HUB_USERNAME/$REPOSITORY_NAME-$BACKEND_IMAGE_NAME:$TIMESTAMP"
    check_status "Tag com timestamp criada para backend-api" "Falha ao criar tag com timestamp"
}

# Função para build da imagem frontend
build_frontend() {
    print_step "Fazendo build da imagem frontend..."
    
    docker build -f frontend.Dockerfile -t "$DOCKER_HUB_USERNAME/$REPOSITORY_NAME-$FRONTEND_IMAGE_NAME:$VERSION" .
    check_status "Build da imagem frontend concluído" "Falha no build da imagem frontend"
    
    # Tag adicional com timestamp
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    docker tag "$DOCKER_HUB_USERNAME/$REPOSITORY_NAME-$FRONTEND_IMAGE_NAME:$VERSION" "$DOCKER_HUB_USERNAME/$REPOSITORY_NAME-$FRONTEND_IMAGE_NAME:$TIMESTAMP"
    check_status "Tag com timestamp criada para frontend" "Falha ao criar tag com timestamp"
}

# Função para push das imagens
push_images() {
    print_step "Fazendo push das imagens para o Docker Hub..."
    
    # Push da imagem backend
    print_message "Fazendo push da imagem backend-api..."
    docker push "$DOCKER_HUB_USERNAME/$REPOSITORY_NAME-$BACKEND_IMAGE_NAME:$VERSION"
    check_status "Push da imagem backend-api concluído" "Falha no push da imagem backend-api"
    
    # Push da imagem frontend
    print_message "Fazendo push da imagem frontend..."
    docker push "$DOCKER_HUB_USERNAME/$REPOSITORY_NAME-$FRONTEND_IMAGE_NAME:$VERSION"
    check_status "Push da imagem frontend concluído" "Falha no push da imagem frontend"
    
    # Push das tags com timestamp
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    
    print_message "Fazendo push das tags com timestamp..."
    docker push "$DOCKER_HUB_USERNAME/$REPOSITORY_NAME-$BACKEND_IMAGE_NAME:$TIMESTAMP"
    docker push "$DOCKER_HUB_USERNAME/$REPOSITORY_NAME-$FRONTEND_IMAGE_NAME:$TIMESTAMP"
    check_status "Push das tags com timestamp concluído" "Falha no push das tags com timestamp"
}

# Função para limpar imagens locais (opcional)
cleanup_images() {
    print_step "Limpando imagens locais..."
    
    # Remover imagens locais
    docker rmi "$DOCKER_HUB_USERNAME/$REPOSITORY_NAME-$BACKEND_IMAGE_NAME:$VERSION" 2>/dev/null || true
    docker rmi "$DOCKER_HUB_USERNAME/$REPOSITORY_NAME-$FRONTEND_IMAGE_NAME:$VERSION" 2>/dev/null || true
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    docker rmi "$DOCKER_HUB_USERNAME/$REPOSITORY_NAME-$BACKEND_IMAGE_NAME:$TIMESTAMP" 2>/dev/null || true
    docker rmi "$DOCKER_HUB_USERNAME/$REPOSITORY_NAME-$FRONTEND_IMAGE_NAME:$TIMESTAMP" 2>/dev/null || true
    
    print_message "Limpeza concluída"
}

# Função para mostrar ajuda
show_help() {
    echo "Uso: $0 [OPÇÕES]"
    echo ""
    echo "OPÇÕES:"
    echo "  -h, --help          Mostra esta ajuda"
    echo "  -u, --username USER Define o username do Docker Hub"
    echo "  -v, --version VER   Define a versão das imagens (padrão: latest)"
    echo "  -r, --repository REP Define o nome do repositório (padrão: turistar)"
    echo "  -c, --cleanup       Remove imagens locais após o push"
    echo "  --no-login          Pula o login no Docker Hub"
    echo "  --backend-only      Faz build e push apenas do backend"
    echo "  --frontend-only     Faz build e push apenas do frontend"
    echo ""
    echo "EXEMPLOS:"
    echo "  $0                           # Build e push de todas as imagens"
    echo "  $0 -u meuusername            # Define username personalizado"
    echo "  $0 -v v1.0.0                 # Define versão específica"
    echo "  $0 --backend-only            # Apenas backend"
    echo "  $0 -c                        # Com limpeza automática"
}

# Variáveis para controlar o comportamento
SKIP_LOGIN=false
BACKEND_ONLY=false
FRONTEND_ONLY=false
CLEANUP=false

# Processar argumentos da linha de comando
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -u|--username)
            DOCKER_HUB_USERNAME="$2"
            shift 2
            ;;
        -v|--version)
            VERSION="$2"
            shift 2
            ;;
        -r|--repository)
            REPOSITORY_NAME="$2"
            shift 2
            ;;
        -c|--cleanup)
            CLEANUP=true
            shift
            ;;
        --no-login)
            SKIP_LOGIN=true
            shift
            ;;
        --backend-only)
            BACKEND_ONLY=true
            shift
            ;;
        --frontend-only)
            FRONTEND_ONLY=true
            shift
            ;;
        *)
            print_error "Opção desconhecida: $1"
            show_help
            exit 1
            ;;
    esac
done

# Verificar se estamos no diretório correto
if [ ! -f "backend-api.Dockerfile" ] || [ ! -f "frontend.Dockerfile" ]; then
    print_error "Dockerfiles não encontrados. Execute este script no diretório raiz do projeto."
    exit 1
fi

# Verificar se o Docker está rodando
if ! docker info >/dev/null 2>&1; then
    print_error "Docker não está rodando. Por favor, inicie o Docker e tente novamente."
    exit 1
fi

# Mostrar informações do build
print_message "=== CONFIGURAÇÃO DO BUILD ==="
print_message "Username: $DOCKER_HUB_USERNAME"
print_message "Repositório: $REPOSITORY_NAME"
print_message "Versão: $VERSION"
print_message "Backend Image: $DOCKER_HUB_USERNAME/$REPOSITORY_NAME-$BACKEND_IMAGE_NAME:$VERSION"
print_message "Frontend Image: $DOCKER_HUB_USERNAME/$REPOSITORY_NAME-$FRONTEND_IMAGE_NAME:$VERSION"
echo ""

# Login no Docker Hub (se não for pulado)
if [ "$SKIP_LOGIN" = false ]; then
    docker_login
fi

# Build e push das imagens
if [ "$BACKEND_ONLY" = true ]; then
    build_backend
    push_images
elif [ "$FRONTEND_ONLY" = true ]; then
    build_frontend
    push_images
else
    build_backend
    build_frontend
    push_images
fi

# Limpeza (se solicitada)
if [ "$CLEANUP" = true ]; then
    cleanup_images
fi

# Mostrar resumo final
print_message "=== BUILD E PUSH CONCLUÍDO ==="
print_message "Imagens disponíveis no Docker Hub:"
print_message "  - $DOCKER_HUB_USERNAME/$REPOSITORY_NAME-$BACKEND_IMAGE_NAME:$VERSION"
print_message "  - $DOCKER_HUB_USERNAME/$REPOSITORY_NAME-$FRONTEND_IMAGE_NAME:$VERSION"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
print_message "Tags com timestamp:"
print_message "  - $DOCKER_HUB_USERNAME/$REPOSITORY_NAME-$BACKEND_IMAGE_NAME:$TIMESTAMP"
print_message "  - $DOCKER_HUB_USERNAME/$REPOSITORY_NAME-$FRONTEND_IMAGE_NAME:$TIMESTAMP"

print_message "Para usar as imagens:"
print_message "  docker pull $DOCKER_HUB_USERNAME/$REPOSITORY_NAME-$BACKEND_IMAGE_NAME:$VERSION"
print_message "  docker pull $DOCKER_HUB_USERNAME/$REPOSITORY_NAME-$FRONTEND_IMAGE_NAME:$VERSION"

print_message "Script executado com sucesso! 🎉" 