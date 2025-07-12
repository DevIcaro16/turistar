FROM docker.io/node:lts-alpine

ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

RUN addgroup --system backend-api && \
    adduser --system -G backend-api backend-api

COPY apps/backend-api/dist backend-api/
RUN chown -R backend-api:backend-api .

RUN npm --prefix backend-api --omit=dev -f install

CMD [ "node", "backend-api" ]
