#!/bin/bash

echo "🧪 Testando build e deploy localmente..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para imprimir com cores
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Parar containers existentes
print_status "Parando containers existentes..."
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
docker-compose -f docker-compose.local.yml down 2>/dev/null || true

# Limpar imagens antigas
print_status "Limpando imagens antigas..."
docker system prune -f

# Testar build do backend
print_status "Testando build do backend..."
cd apps/backend-api

# Limpar builds anteriores
rm -rf out-tsc dist

# Verificar se as dependências estão instaladas
print_status "Verificando dependências..."
if [ ! -d "node_modules" ]; then
    print_warning "node_modules não encontrado, instalando dependências..."
    npm install --legacy-peer-deps
fi

# Verificar se TypeScript está instalado
print_status "Verificando TypeScript..."
if [ ! -f "node_modules/.bin/tsc" ]; then
    print_warning "TypeScript não encontrado em node_modules, instalando..."
    npm install typescript --save-dev
fi

# Fazer o build
print_status "Fazendo build do backend..."
echo "📋 Verificando versão do Node.js:"
node --version || echo "Node.js não encontrado"

echo "📋 Verificando versão do npm:"
npm --version || echo "npm não encontrado"

echo "📋 Verificando se o TypeScript foi instalado:"
npx tsc --version || echo "TypeScript não encontrado"

echo "📋 Executando build via npm:"
npm run build 2>&1 || echo "Erro no build via npm"

# Mostrar mais informações de debug
echo "📋 Verificando package.json do backend:"
cat package.json | grep -A 5 -B 5 "scripts"

echo "📋 Verificando tsconfig.app.json:"
cat tsconfig.app.json | grep -A 10 -B 5 "compilerOptions"

echo "📋 Verificando se existe o arquivo main.ts:"
ls -la src/main.ts || echo "main.ts não encontrado"

echo "📋 Verificando se existe tsconfig.base.json:"
ls -la ../../tsconfig.base.json || echo "tsconfig.base.json não encontrado"

echo "📋 Tentando compilar manualmente com npx:"
echo "📋 Executando TypeScript com output completo..."
npx tsc --listFiles --listEmittedFiles -p tsconfig.app.json > ts_output.txt 2>&1
echo "📋 Status do TypeScript: $?"
echo "📋 Primeiras 20 linhas do output:"
head -20 ts_output.txt
echo "📋 Últimas 20 linhas do output:"
tail -20 ts_output.txt

# Verificar se o arquivo foi gerado
echo "📋 Verificando se os arquivos foram gerados..."
if [ -f "out-tsc/backend-api/apps/backend-api/src/main.js" ]; then
    print_status "Backend build bem-sucedido!"
    echo "📁 Arquivo gerado: out-tsc/backend-api/apps/backend-api/src/main.js"
    echo "📁 Tamanho do arquivo:"
    ls -la out-tsc/backend-api/apps/backend-api/src/main.js
else
    print_error "Backend build falhou!"
    echo "📁 Conteúdo da pasta out-tsc:"
    find out-tsc -type f -name "*.js" 2>/dev/null || echo "Nenhum arquivo .js encontrado"
    echo "📁 Estrutura completa da pasta out-tsc:"
    ls -la out-tsc/ 2>/dev/null || echo "Pasta out-tsc não existe"
    echo "📁 Verificando se a pasta apps existe:"
    ls -la out-tsc/backend-api/ 2>/dev/null || echo "Pasta backend-api não existe"
    print_warning "Continuando com o teste mesmo com erro no backend..."
fi

cd ../..

# Testar build do frontend
print_status "Testando build do frontend..."
cd apps/frontend

# Limpar builds anteriores
rm -rf .next

# Instalar dependências
print_status "Instalando dependências do frontend..."
npm install --legacy-peer-deps

# Fazer o build
print_status "Fazendo build do frontend..."
npm run build

# Verificar se o build foi bem-sucedido
if [ -d ".next" ]; then
    print_status "Frontend build bem-sucedido!"
    echo "📁 Pasta .next criada com sucesso"
else
    print_error "Frontend build falhou!"
    print_warning "Continuando com o teste mesmo com erro no frontend..."
fi

cd ../..

# Build das imagens Docker
print_status "Fazendo build das imagens Docker..."
docker build -f backend-api.Dockerfile -t turistar-backend-api:local .
docker build -f frontend.Dockerfile -t turistar-frontend:local .

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    print_warning "Criando arquivo .env com valores de exemplo..."
    cat > .env << EOF
# Configurações do Banco de Dados
DATABASE_URL="postgresql://user:password@localhost:5432/turistar"

# Configurações JWT
ACCESS_TOKEN_SECRET="your-access-token-secret"
REFRESH_TOKEN_SECRET="your-refresh-token-secret"

# Configurações Cloudinary
CLOUDINARY_NAME="your-cloudinary-name"
CLOUDINARY_KEY="your-cloudinary-key"
CLOUDINARY_SECRET="your-cloudinary-secret"

# Configurações Stripe
STRIPE_SECRET_KEY="your-stripe-secret-key"

# Configurações MongoDB (serviço externo)
MONGO_ROOT_USERNAME=""
MONGO_ROOT_PASSWORD=""

# Configurações Redis (serviço externo)
REDIS_URL=""
REDIS_HOST=""
REDIS_PORT=""
REDIS_PASS=""

# Configurações SMTP
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SERVICE="gmail"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Configurações para EC2/AWS
EC2_PUBLIC_IP="localhost"
FRONTEND_URL="http://localhost:3000"
DOMAIN_NAME="localhost"

# Configurações do Frontend
NEXT_PUBLIC_API_URL="http://localhost:8000"

# Configurações do Servidor
HOST=0.0.0.0
PORT=8000
NODE_ENV=production
EOF
fi

# Criar docker-compose local
print_status "Criando docker-compose local..."
cat > docker-compose.local.yml << EOF
version: '3.8'

services:
  # Backend API
  backend-api:
    image: turistar-backend-api:local
    container_name: turistar-backend-api-local
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=\${DATABASE_URL}
      - ACCESS_TOKEN_SECRET=\${ACCESS_TOKEN_SECRET}
      - REFRESH_TOKEN_SECRET=\${REFRESH_TOKEN_SECRET}
      - CLOUDINARY_NAME=\${CLOUDINARY_NAME}
      - CLOUDINARY_KEY=\${CLOUDINARY_KEY}
      - CLOUDINARY_SECRET=\${CLOUDINARY_SECRET}
      - STRIPE_SECRET_KEY=\${STRIPE_SECRET_KEY}
      - REDIS_URL=\${REDIS_URL}
      - REDIS_HOST=\${REDIS_HOST}
      - REDIS_PORT=\${REDIS_PORT}
      - REDIS_PASS=\${REDIS_PASS}
      - SMTP_HOST=\${SMTP_HOST}
      - SMTP_PORT=\${SMTP_PORT}
      - SMTP_SERVICE=\${SMTP_SERVICE}
      - SMTP_USER=\${SMTP_USER}
      - SMTP_PASS=\${SMTP_PASS}
      - FRONTEND_URL=\${FRONTEND_URL}
      - EC2_PUBLIC_IP=\${EC2_PUBLIC_IP}
      - DOMAIN_NAME=\${DOMAIN_NAME}
      - HOST=0.0.0.0
      - PORT=8000
    restart: unless-stopped
    networks:
      - turistar-network
    
  # Frontend Next.js
  frontend:
    image: turistar-frontend:local
    container_name: turistar-frontend-local
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=\${NEXT_PUBLIC_API_URL}
    depends_on:
      - backend-api
    restart: unless-stopped
    networks:
      - turistar-network

networks:
  turistar-network:
    driver: bridge
EOF

# Iniciar containers
print_status "Iniciando containers..."
docker-compose -f docker-compose.local.yml up -d

# Aguardar serviços ficarem prontos
print_status "Aguardando serviços ficarem prontos..."
sleep 30

# Verificar status
print_status "Verificando status dos containers..."
docker-compose -f docker-compose.local.yml ps

# Mostrar logs
print_status "Logs do Backend:"
docker logs turistar-backend-api-local --tail 20 || true

print_status "Logs do Frontend:"
docker logs turistar-frontend-local --tail 20 || true

# Health checks
print_status "Fazendo health checks..."
for i in {1..5}; do
    echo "Tentativa $i de 5"
    if curl -f http://localhost:8000/ && curl -f http://localhost:3000/; then
        print_status "Health checks passaram!"
        break
    else
        print_warning "Health checks falharam, aguardando 10 segundos..."
        sleep 10
    fi
done

# Verificar estrutura dos arquivos no container
print_status "Verificando estrutura dos arquivos no container backend..."
docker exec turistar-backend-api-local ls -la /app/out-tsc/backend-api/ || true

print_status "Verificando estrutura dos arquivos no container frontend..."
docker exec turistar-frontend-local ls -la /app/.next/ || true

echo ""
print_status "🎉 Teste local concluído!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Para parar os containers:"
echo "docker-compose -f docker-compose.local.yml down" 