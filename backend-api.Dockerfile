# Stage 1: Build
FROM node:18-alpine AS builder

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY jest.preset.js ./
COPY apps/backend-api/package*.json ./apps/backend-api/
COPY packages ./packages/
COPY prisma ./prisma/
RUN npm ci --legacy-peer-deps
RUN npx prisma generate
COPY apps/backend-api ./apps/backend-api/
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS production

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=builder /app/apps/backend-api/package.json ./

RUN npm install --legacy-peer-deps

# Copiar build correto
COPY --from=builder /app/apps/backend-api/dist/ ./dist

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8000
EXPOSE 8000

CMD ["node", "dist/main.js"]
