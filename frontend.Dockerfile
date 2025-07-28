# Stage 1: Build
FROM node:18-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./ 
COPY apps/frontend/package*.json ./apps/frontend/
COPY nx.json tsconfig*.json jest.preset.js ./
COPY apps/frontend ./apps/frontend
COPY packages ./packages

RUN npm install --legacy-peer-deps
WORKDIR /app/apps/frontend
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS production
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/apps/frontend/next.config.* ./apps/frontend/
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public
COPY --from=builder /app/apps/frontend/.next ./.next
COPY --from=builder /app/apps/frontend/node_modules ./apps/frontend/node_modules
COPY --from=builder /app/apps/frontend/package.json ./apps/frontend/

WORKDIR /app/apps/frontend
EXPOSE 3000
CMD ["npx", "next", "start"]
