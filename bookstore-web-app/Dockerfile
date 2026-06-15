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
ENV PORT=8080
# URL du microservice back via le nom du container sur le reseau commun
ENV BACKEND_URL=http://loopback-bookstore:3000

EXPOSE 8080

CMD ["npm", "start"]
