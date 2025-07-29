# Stage 1: Build
FROM node:18-alpine AS builder
RUN apk add --no-cache libc6-compat

WORKDIR /app


COPY package*.json ./
COPY nx.json tsconfig*.json jest.preset.js ./
COPY apps/frontend/package*.json ./apps/frontend/
COPY packages ./packages

# Instalar dependências com cache otimizado
RUN npm install --legacy-peer-deps && npm cache clean --force


COPY apps/frontend ./apps/frontend


WORKDIR /app/apps/frontend
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS production
RUN apk add --no-cache libc6-compat curl

WORKDIR /app

COPY --from=builder /app/apps/frontend/package.json ./package.json
RUN npm install --only=production --legacy-peer-deps

COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/next.config.js ./

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=https://www.turistarturismo.shop/api/

EXPOSE 3000

CMD ["npx", "next", "start"]