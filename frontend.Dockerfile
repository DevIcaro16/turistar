# Stage 1: Build
FROM node:18-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./ 
COPY nx.json tsconfig*.json jest.preset.js ./
COPY apps/frontend/package*.json ./apps/frontend/
COPY packages ./packages

RUN npm install --legacy-peer-deps
COPY apps/frontend ./apps/frontend

WORKDIR /app/apps/frontend
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS production
RUN apk add --no-cache libc6-compat

WORKDIR /app/apps/frontend

COPY --from=builder /app/apps/frontend ./

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000
CMD ["npx", "next", "start"]
