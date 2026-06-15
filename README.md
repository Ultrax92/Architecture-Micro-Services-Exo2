# Exercice : Route et conteneurisation

Mini stack microservices conteneurisée avec Docker.

## Architecture

| Service              | Rôle                                    | Image de base   | Port host |
| -------------------- | --------------------------------------- | --------------- | --------- |
| `mongo`              | Base de données                         | `mongo:latest`  | 27017     |
| `loopback-bookstore` | Microservice back (API REST LoopBack 4) | `node:16-slim`  | 3000      |
| `bookstore-web-app`  | Front Express (consomme l'API)          | `node:16`       | 8080      |

Les trois containers sont sur le même réseau Docker (`bookstore-net`), ce qui
permet de se joindre par **nom de container** plutôt que par adresse IP :

- le front appelle le back via `http://loopback-bookstore:3000` (`BACKEND_URL`)
- le back se connecte à Mongo via l'hôte `mongo` (`MONGO_HOST`)

Le nom du projet/stack Docker est `archi-micro-services-exo2`.

## Lancer la stack

```bash
docker compose up --build
```

## URLs

- Front (inventaire des livres) : http://localhost:8080
- API back (explorer Swagger)   : http://localhost:3000/explorer
- API back (liste des livres)   : http://localhost:3000/books

## Arrêter

```bash
docker compose down          # stoppe et supprime les containers
docker compose down -v       # + supprime le volume MongoDB (données)
```

## Structure

```
Exo2/
├── docker-compose.yml          # orchestration des 3 services + réseau commun
├── bookstore-web-app/          # front Express (node:16)
│   ├── Dockerfile
│   └── routes/inventory.js     # consomme le microservice via node-fetch
└── loopback-bookstore/         # back LoopBack 4 + MongoDB (node:16-slim)
    ├── Dockerfile
    └── src/
        ├── models/book.model.ts
        ├── datasources/lb-micro-book.datasource.ts
        ├── repositories/book.repository.ts
        └── controllers/books.controller.ts
```
