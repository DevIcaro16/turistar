#!/bin/bash

echo "🔍 Teste do Frontend no Docker"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    print_error "Execute este script no diretório raiz do projeto!"
    exit 1
fi

print_info "1. Parando containers existentes..."
docker stop turistar-frontend 2>/dev/null || echo "Container não estava rodando"
docker rm turistar-frontend 2>/dev/null || echo "Container não existia"

print_info "2. Removendo imagem anterior..."
docker rmi turistar-frontend 2>/dev/null || echo "Imagem não existia"

print_info "3. Build da imagem Docker..."
docker build -f frontend.Dockerfile -t turistar-frontend .

if [ $? -ne 0 ]; then
    print_error "Build da imagem falhou!"
    exit 1
fi

print_info "4. Iniciando container..."
docker run -d --name turistar-frontend -p 3000:3000 turistar-frontend

if [ $? -ne 0 ]; then
    print_error "Falha ao iniciar container!"
    exit 1
fi

print_info "5. Aguardando container inicializar..."
sleep 10

print_info "6. Verificando logs do container..."
docker logs turistar-frontend --tail 20

print_info "7. Verificando se o container está rodando..."
if docker ps | grep -q turistar-frontend; then
    print_status "Container está rodando!"
else
    print_error "Container não está rodando!"
    docker logs turistar-frontend
    exit 1
fi

print_info "8. Testando acesso ao frontend..."
echo "Testando http://localhost:3000..."

# Aguardar um pouco mais para garantir que o servidor está pronto
sleep 5

# Testar com curl
if curl -s http://localhost:3000 > /dev/null; then
    print_status "Frontend está respondendo!"
    echo "✅ Acesse: http://localhost:3000"
else
    print_error "Frontend não está respondendo!"
    echo "📋 Logs do container:"
    docker logs turistar-frontend --tail 30
fi

print_info "9. Verificando arquivos estáticos..."
echo "Testando arquivos estáticos..."

# Testar alguns arquivos estáticos específicos
STATIC_FILES=(
    "http://localhost:3000/_next/static/css/e03ebb4e1841ec44.css"
    "http://localhost:3000/_next/static/chunks/webpack-7a175f5f1fde1447.js"
    "http://localhost:3000/_next/static/chunks/main-app-3554fade52fb1f3e.js"
)

for file in "${STATIC_FILES[@]}"; do
    if curl -s -I "$file" | grep -q "200 OK"; then
        print_status "✅ $file está acessível"
    else
        print_error "❌ $file não está acessível"
    fi
done

print_info "🎯 Resultado:"
echo "1. Se tudo funcionar: O problema era o WORKDIR/estrutura"
echo "2. Faça deploy: git add . && git commit -m 'fix: corrige WORKDIR do frontend Dockerfile' && git push"
echo "3. Para parar: docker stop turistar-frontend" 