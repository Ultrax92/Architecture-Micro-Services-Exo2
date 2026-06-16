# Intégration d'un Front-End Express avec un Microservice LoopBack

Application **bookstore** (front Express + EJS) connectée à un microservice **LoopBack 4**
exposant une ressource `Book` reliée à **MongoDB**. L'ensemble est conteneurisé avec Docker.

## Fonctionnalités (CRUD complet via l'API LoopBack)

Le front consomme les endpoints REST du microservice :

| Action front (Express)        | Requête envoyée à l'API LoopBack | Opération   |
| ----------------------------- | -------------------------------- | ----------- |
| `GET /`                       | `GET /books`                     | Lister      |
| `GET /book/:id`               | `GET /books/{id}`                | Consulter   |
| `POST /add`                   | `POST /books`                    | Créer       |
| `GET /edit/:id` + `POST /edit/:id` | `PATCH /books/{id}`         | Modifier    |
| `POST /delete/:id`            | `DELETE /books/{id}`             | Supprimer   |

Après création / modification / suppression, l'utilisateur est redirigé vers la liste
avec un **message de confirmation** (`?msg=created|updated|deleted`).

## Architecture (microservices conteneurisés)

| Service              | Rôle                                    | Image de base   | Port host |
| -------------------- | --------------------------------------- | --------------- | --------- |
| `mongo`              | Base de données                         | `mongo:latest`  | 27017     |
| `loopback-bookstore` | Microservice back (API REST LoopBack 4) | `node:16-slim`  | 3000      |
| `bookstore-web-app`  | Front Express + EJS (consomme l'API)    | `node:16`       | 8080      |

Les trois containers sont sur le même réseau Docker (`bookstore-net`), ce qui permet de se
joindre par **nom de container** plutôt que par adresse IP :

- le front appelle le back via `http://loopback-bookstore:3000` (`BACKEND_URL`)
- le back se connecte à Mongo via l'hôte `mongo` (`MONGO_HOST`)

Le nom du projet/stack Docker est `archi-micro-services-exo2`.

## Lancer la stack

```bash
docker compose up --build
```

## URLs

- Front bookstore (CRUD livres) : http://localhost:8080
- API back (explorer Swagger)    : http://localhost:3000/explorer
- API back (liste des livres)    : http://localhost:3000/books

## Arrêter

```bash
docker compose down          # stoppe et supprime les containers
docker compose down -v       # + supprime le volume MongoDB (données)
```

## Structure

```
Exo2/
├── docker-compose.yml              # orchestration des 3 services + réseau commun
├── bookstore-web-app/              # front Express + EJS (node:16)
│   ├── Dockerfile
│   ├── routes/inventory.js         # CRUD : consomme l'API via node-fetch
│   └── views/
│       ├── inventory.ejs           # liste + formulaire d'ajout + actions
│       ├── book.ejs                # page de consultation d'un livre
│       └── edit.ejs                # formulaire de modification
└── loopback-bookstore/             # back LoopBack 4 + MongoDB (node:16-slim)
    ├── Dockerfile
    └── src/
        ├── models/book.model.ts            # Book (id ObjectId, title, author)
        ├── datasources/lb-micro-book.datasource.ts
        ├── repositories/book.repository.ts
        └── controllers/books.controller.ts # CRUD /books (GET/POST/PUT/PATCH/DELETE)
```

> Note : le modèle `Book` utilise un id `string` mappé sur l'`ObjectId` de MongoDB, ce qui
> permet de cibler chaque livre par son id pour la consultation, la modification et la
> suppression depuis le front.
