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
RUN ls -la .next/standalone/ 2>/dev/null || echo "Standalone não encontrado"
RUN ls -la .next/static/ 2>/dev/null || echo "Diretório static não encontrado"
RUN ls -la .next/static/css/ 2>/dev/null || echo "CSS não encontrado"
RUN ls -la .next/static/chunks/ 2>/dev/null || echo "Chunks não encontrados"
RUN find .next -name "*.css" -type f
RUN find .next -name "*.js" -type f | head -10

# Verificar se o build foi bem-sucedido
RUN ls -la .next/
RUN echo "Build completed successfully"

# Stage 2: Production stage
FROM node:18-alpine AS production

# Instalar apenas dependências necessárias para runtime
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar package.json para instalar dependências
COPY --from=builder /app/apps/frontend/package.json ./package.json

# Instalar todas as dependências (incluindo devDependencies necessárias para Next.js)
RUN npm install --legacy-peer-deps

# Copiar arquivos do standalone build
COPY --from=builder /app/apps/frontend/public ./public
COPY --from=builder /app/apps/frontend/.next/standalone/.next ./.next
COPY --from=builder /app/apps/frontend/.next/static ./.next/static
COPY --from=builder /app/apps/frontend/.next/standalone/server.js ./server.js
COPY --from=builder /app/apps/frontend/src ./src
COPY --from=builder /app/apps/frontend/next.config.js ./
COPY --from=builder /app/apps/frontend/tailwind.config.js ./
COPY --from=builder /app/apps/frontend/postcss.config.js ./
COPY --from=builder /app/apps/frontend/tsconfig.json ./
COPY --from=builder /app/apps/frontend/next-env.d.ts ./
COPY --from=builder /app/apps/frontend/package.json ./

# Verificar se os arquivos foram copiados corretamente
RUN ls -la .next/
RUN ls -la src/app/
RUN ls -la .next/static/css/ 2>/dev/null || echo "CSS não encontrado"
RUN ls -la .next/static/chunks/ 2>/dev/null || echo "Chunks não encontrados"
RUN ls -la .next/static/webpack/ 2>/dev/null || echo "Webpack não encontrado"
RUN echo "Files copied successfully"

# Limpar arquivos desnecessários
RUN rm -rf /tmp/* /var/tmp/*

# Expor porta
EXPOSE 3000

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Comando para Next.js standalone
CMD ["node", "server.js"]