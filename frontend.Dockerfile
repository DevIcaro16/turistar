# Multi-stage build para otimizar tamanho da imagem frontend
# Stage 1: Build stage
FROM node:18-alpine AS builder

# Instalar dependências do sistema necessárias para build
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY apps/frontend/package*.json ./apps/frontend/
COPY nx.json ./
COPY tsconfig*.json ./
COPY jest.preset.js ./

# Instalar dependências da raiz incluindo Nx
RUN npm install --only=production=false --legacy-peer-deps

# Copiar código fonte
COPY apps/frontend ./apps/frontend/
COPY packages ./packages/

# Build da aplicação Next.js diretamente
WORKDIR /app/apps/frontend
RUN npm run build

# Verificar se o build foi bem-sucedido
RUN ls -la .next/
RUN echo "Build completed successfully"

# Stage 2: Production stage
FROM node:18-alpine AS production

# Instalar apenas dependências necessárias para runtime
RUN apk add --no-cache libc6-compat

WORKDIR /app/apps/frontend

# Copiar package.json para instalar dependências
COPY --from=builder /app/apps/frontend/package.json ./package.json

# Instalar todas as dependências (incluindo devDependencies necessárias para Next.js)
RUN npm install --legacy-peer-deps

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Limpar arquivos desnecessários
RUN rm -rf /tmp/* /var/tmp/*

# Expor porta
EXPOSE 3000

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

# Comando para Next.js normal
CMD ["npm", "start"]