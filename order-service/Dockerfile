# ---- Microservice order-service (image node:16-slim) ----
FROM node:16-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=3001

EXPOSE 3001

CMD ["node", "."]
