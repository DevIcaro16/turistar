FROM node:lts-alpine

# Variáveis de ambiente
ENV HOST=0.0.0.0
ENV PORT=8000

# Diretório de trabalho
WORKDIR /app

# Copia arquivos de dependência
COPY package.json package-lock.json* prisma ./ 

# Instala dependências de produção
RUN npm install --omit=dev

# Gera o Prisma Client com binário compatível com Alpine
RUN npx prisma generate

# Copia todo o código da aplicação (apps/, packages/, dist/, etc.)
COPY . .

# Compila o backend (ajuste o comando se necessário)
RUN npx nx build backend-api

# Comando para iniciar a aplicação
CMD ["node", "apps/backend-api/dist/main.js"]
