# ---- Backend microservice loopback-bookstore ----
# Image demandee par l'exercice : node:16-slim
FROM node:16-slim

# Repertoire de travail dans le container
WORKDIR /app

# Copie des manifestes puis installation des dependances (cache Docker)
COPY package*.json ./
RUN npm install

# Copie du code source puis compilation TypeScript -> dist/
COPY . .
RUN npm run build

# Configuration reseau : on ecoute sur toutes les interfaces du container
ENV HOST=0.0.0.0
ENV PORT=3000

# Port expose par le microservice LoopBack 4
EXPOSE 3000

# Demarrage du microservice deja compile
CMD ["node", "."]
