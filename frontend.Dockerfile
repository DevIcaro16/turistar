# Stage 1: Build
FROM node:18-alpine AS builder
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar arquivos de dependências primeiro (melhor cache)
COPY package*.json ./
COPY nx.json tsconfig*.json jest.preset.js ./
COPY apps/frontend/package*.json ./apps/frontend/
COPY packages ./packages

# Instalar dependências com cache otimizado
RUN npm ci --legacy-peer-deps && npm cache clean --force

# Copiar código fonte
COPY apps/frontend ./apps/frontend

# Build da aplicação
WORKDIR /app/apps/frontend
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS production
RUN apk add --no-cache libc6-compat curl


WORKDIR /app

# Copiar package.json e instalar apenas dependências de produção
COPY --from=builder /app/apps/frontend/package.json ./package.json
RUN npm install --only=production --legacy-peer-deps

# Copiar a aplicação built
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/next.config.js ./


# Configurar variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=https://www.turistarturismo.shop/api/

EXPOSE 3000

CMD ["npx", "next", "start"]