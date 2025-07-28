# Stage 1: Build
FROM node:18-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY nx.json tsconfig*.json jest.preset.js ./
COPY apps/frontend/package*.json ./apps/frontend/
COPY packages ./packages

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY apps/frontend ./apps/frontend

# Build the application
WORKDIR /app/apps/frontend
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS production
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package.json and install only production dependencies
COPY --from=builder /app/apps/frontend/package.json ./package.json
RUN npm install --only=production --legacy-peer-deps

# Copy the built application
COPY --from=builder /app/apps/frontend/.next ./.next
COPY --from=builder /app/apps/frontend/public ./public
COPY --from=builder /app/apps/frontend/next.config.js ./

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

CMD ["npx", "next", "start"]
