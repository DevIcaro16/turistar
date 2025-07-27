#!/bin/bash

echo "🔄 Atualizando host no swagger-output.json..."

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

# Navegar para o diretório do backend
cd apps/backend-api

# Verificar se o arquivo existe
if [ ! -f "src/swagger-output.json" ]; then
    print_error "Arquivo swagger-output.json não encontrado!"
    exit 1
fi

# Verificar variáveis de ambiente
print_status "Verificando variáveis de ambiente..."
echo "EC2_PUBLIC_IP: ${EC2_PUBLIC_IP:-'não definido'}"
echo "DOMAIN_NAME: ${DOMAIN_NAME:-'não definido'}"
echo "PORT: ${PORT:-'8000 (padrão)'}"

# Definir host baseado nas variáveis de ambiente
if [ -n "$EC2_PUBLIC_IP" ]; then
    HOST="$EC2_PUBLIC_IP"
elif [ -n "$DOMAIN_NAME" ]; then
    HOST="$DOMAIN_NAME"
else
    HOST="localhost"
fi

PORT="${PORT:-8000}"
FULL_HOST="${HOST}:${PORT}"

print_status "Host configurado: $FULL_HOST"

# Fazer backup do arquivo atual
print_status "Fazendo backup do swagger-output.json atual..."
cp src/swagger-output.json src/swagger-output.json.backup

# Atualizar o host no arquivo JSON
print_status "Atualizando host no arquivo JSON..."
if command -v jq &> /dev/null; then
    # Usar jq se disponível
    jq --arg host "$FULL_HOST" '.host = $host' src/swagger-output.json > src/swagger-output.json.tmp
    mv src/swagger-output.json.tmp src/swagger-output.json
    print_status "Host atualizado usando jq"
else
    # Fallback usando sed
    sed -i "s/\"host\": \"[^\"]*\"/\"host\": \"$FULL_HOST\"/" src/swagger-output.json
    print_status "Host atualizado usando sed"
fi

# Verificar se a atualização foi bem-sucedida
if [ -f "src/swagger-output.json" ]; then
    print_status "Swagger atualizado com sucesso!"
    
    # Mostrar informações do arquivo atualizado
    echo "📋 Informações do arquivo atualizado:"
    if command -v jq &> /dev/null; then
        echo "Host: $(jq -r '.host' src/swagger-output.json)"
        echo "BasePath: $(jq -r '.basePath' src/swagger-output.json)"
        echo "Schemes: $(jq -r '.schemes[]' src/swagger-output.json)"
    else
        echo "Host: $(grep -o '"host": "[^"]*"' src/swagger-output.json | cut -d'"' -f4)"
        echo "BasePath: $(grep -o '"basePath": "[^"]*"' src/swagger-output.json | cut -d'"' -f4)"
    fi
    
    # Verificar se o host está correto
    if command -v jq &> /dev/null; then
        GENERATED_HOST=$(jq -r '.host' src/swagger-output.json)
    else
        GENERATED_HOST=$(grep -o '"host": "[^"]*"' src/swagger-output.json | cut -d'"' -f4)
    fi
    
    if [ "$GENERATED_HOST" = "$FULL_HOST" ]; then
        print_status "Host configurado corretamente!"
    else
        print_warning "Host atualizado ($GENERATED_HOST) diferente do esperado ($FULL_HOST)"
    fi
    
else
    print_error "Erro ao atualizar swagger-output.json"
    exit 1
fi

print_status "🎉 Swagger atualizado com sucesso!"
echo ""
echo "📝 URLs para testar:"
echo "Swagger UI: http://$FULL_HOST/api-docs"
echo "Swagger JSON: http://$FULL_HOST/docs-json"
echo ""
echo "📝 Para aplicar as mudanças:"
echo "1. Faça commit das alterações"
echo "2. Faça push para o GitHub"
echo "3. O deploy automático irá usar o novo host" 