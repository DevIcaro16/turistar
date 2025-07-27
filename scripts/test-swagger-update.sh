#!/bin/bash

echo "🧪 Testando atualização do Swagger..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Verificar se estamos no diretório raiz
if [ ! -f "package.json" ]; then
    print_error "Execute este script no diretório raiz do projeto!"
    exit 1
fi

# Tornar o script executável
chmod +x scripts/update-swagger-host.sh

# Teste 1: Com IP da EC2
print_status "Teste 1: Com IP da EC2"
export EC2_PUBLIC_IP="18.231.123.456"
export DOMAIN_NAME=""
export PORT="8000"
./scripts/update-swagger-host.sh

echo ""
echo "---"
echo ""

# Teste 2: Com domínio
print_status "Teste 2: Com domínio"
export EC2_PUBLIC_IP=""
export DOMAIN_NAME="api.turistar.com"
export PORT="8000"
./scripts/update-swagger-host.sh

echo ""
echo "---"
echo ""

# Teste 3: Com localhost (fallback)
print_status "Teste 3: Com localhost (fallback)"
export EC2_PUBLIC_IP=""
export DOMAIN_NAME=""
export PORT="8000"
./scripts/update-swagger-host.sh

print_status "🎉 Testes concluídos!"
echo ""
echo "📝 Para usar em produção:"
echo "1. Configure as variáveis de ambiente corretas"
echo "2. Execute: ./scripts/update-swagger-host.sh"
echo "3. Faça commit das alterações" 