# Stage 1: Build
FROM node:18-alpine AS builder

RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar arquivos de configuração
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY jest.preset.js ./
COPY apps/backend-api/package*.json ./apps/backend-api/
COPY apps/backend-api/project.json ./apps/backend-api/
COPY packages ./packages/
COPY prisma ./prisma/

# Instalar dependências
RUN npm install --legacy-peer-deps
RUN npx prisma generate

# Copiar backend-api e fazer build
COPY apps/backend-api ./apps/backend-api/
RUN npx nx build backend-api

# Stage 2: Production
FROM node:18-alpine AS production

RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar arquivos necessários
COPY --from=builder /app/apps/backend-api/package.json ./
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma/

# Instalar dependências de produção
RUN npm install --legacy-peer-deps
RUN npx prisma generate

# Copiar build e templates
COPY --from=builder /app/dist/apps/backend-api/ ./dist
COPY --from=builder /app/apps/backend-api/src/utils/email-templates/ ./src/utils/email-templates/

# Configuração de produção
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8000
EXPOSE 8000

CMD ["node", "dist/main.js"]
