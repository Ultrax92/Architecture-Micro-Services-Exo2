# ---- Front bookstore-web-app ----
# Image demandee par l'exercice : node:16
FROM node:16

# Repertoire de travail dans le container
WORKDIR /app

# Copie des manifestes puis installation des dependances (cache Docker)
COPY package*.json ./
RUN npm install

# Copie du code source de l'application Express
COPY . .

# Port d'ecoute du front (bin/www lit process.env.PORT)
ENV PORT=8082
# Le front ne communique qu'avec l'API Gateway (nom de container, reseau commun)
ENV GATEWAY_URL=http://api-gateway:9001

EXPOSE 8082

CMD ["npm", "start"]
