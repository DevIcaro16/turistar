# Multi-stage build para otimizar tamanho da imagem
# Stage 1: Build stage
FROM node:18-alpine AS builder

# Instalar dependências do sistema necessárias para build
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar arquivos de configuração primeiro
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY jest.preset.js ./
COPY apps/backend-api/package*.json ./apps/backend-api/
COPY packages ./packages/
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci --legacy-peer-deps

# Gerar cliente Prisma
RUN npx prisma generate

# Copiar código fonte do backend
COPY apps/backend-api ./apps/backend-api/

# Build da aplicação diretamente
WORKDIR /app/apps/backend-api
RUN npm run build

# Stage 2: Production stage
FROM node:18-alpine AS production

# Instalar apenas dependências necessárias para runtime
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar package.json para instalar apenas dependências de produção
COPY --from=builder /app/apps/backend-api/package.json ./

# Instalar apenas dependências de produção
RUN npm install --only=production --omit=dev --silent

# Copiar apenas arquivos necessários do builder
COPY --from=builder /app/apps/backend-api/out-tsc/backend-api ./out-tsc/backend-api
COPY --from=builder /app/apps/backend-api/package.json ./package.json

# Expor porta
EXPOSE 8000

# Variáveis de ambiente
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8000

# Comando para iniciar a aplicação
CMD ["node", "out-tsc/backend-api/apps/backend-api/src/main.js"] 