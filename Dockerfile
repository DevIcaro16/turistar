FROM node:lts-alpine

# Variáveis de ambiente
ENV HOST=0.0.0.0
ENV PORT=8000

WORKDIR /app

COPY package.json package-lock.json* prisma ./ 

RUN npm install --omit=dev

RUN npx prisma generate

COPY . .

RUN npx nx build backend-api

CMD ["node", "apps/backend-api/dist/main.js"]
