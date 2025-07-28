#!/bin/bash

echo "🔍 Teste do Frontend Local"

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

print_info "1. Verificando estrutura do frontend..."
cd apps/frontend

# Limpar build anterior
print_info "Limpando build anterior..."
rm -rf .next

# Build do projeto
print_info "Executando build..."
npm run build

print_info "2. Verificando arquivos estáticos..."
echo "📁 .next/static/chunks:"
ls -la .next/static/chunks/ | head -10

echo ""
echo "📁 .next/static/css:"
ls -la .next/static/css/

print_info "3. Verificando se os arquivos específicos existem..."
if [ -f ".next/static/chunks/webpack-7a175f5f1fde1447.js" ]; then
    print_status "webpack-7a175f5f1fde1447.js encontrado"
else
    print_error "webpack-7a175f5f1fde1447.js não encontrado"
fi

if [ -f ".next/static/css/e03ebb4e1841ec44.css" ]; then
    print_status "e03ebb4e1841ec44.css encontrado"
else
    print_error "e03ebb4e1841ec44.css não encontrado"
fi

if [ -f ".next/static/chunks/main-app-3554fade52fb1f3e.js" ]; then
    print_status "main-app-3554fade52fb1f3e.js encontrado"
else
    print_error "main-app-3554fade52fb1f3e.js não encontrado"
fi

if [ -f ".next/static/chunks/50-47178695b069dcf8.js" ]; then
    print_status "50-47178695b069dcf8.js encontrado"
else
    print_error "50-47178695b069dcf8.js não encontrado"
fi

print_info "4. Iniciando servidor local..."
echo "🚀 Iniciando servidor em http://localhost:3000"
echo "Pressione Ctrl+C para parar"

# Iniciar servidor
npm start

print_info "🎯 Se funcionar localmente:"
echo "1. O problema é no Docker/EC2"
echo "2. Verificar configuração do container"
echo "3. Verificar logs do container" 