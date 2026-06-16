# BookStore — Architecture Microservices & Conteneurisation

Évolution de l'application BookStore vers une **architecture microservices** complète,
orchestrée avec Docker Compose. Le front-end ne communique qu'avec une **API Gateway**,
qui route vers trois microservices LoopBack 4 partageant une instance MongoDB.

## Architecture

```
                         ┌─────────────────────┐
   navigateur ─────────► │  bookstore-web-app  │  (Express + EJS, port 8082)
                         └──────────┬──────────┘
                                    │  (uniquement vers la gateway)
                         ┌──────────▼──────────┐
                         │     api-gateway     │  (Express proxy, port 9001)
                         └──┬───────┬───────┬──┘
              /inventory/*  │       │ /orders/*   │ /payments/*
                  ┌─────────▼──┐ ┌──▼─────────┐ ┌─▼──────────────┐
                  │ inventory  │ │   order    │ │    payment     │
                  │  service   │ │  service   │ │    service     │
                  │ (LB4 :3000)│ │ (LB4 :3001)│ │  (LB4 :3002)   │
                  └─────┬──────┘ └─────┬──────┘ └───────┬────────┘
                        └──────────────┼────────────────┘
                                ┌──────▼──────┐
                                │    mongo    │  (instance unique, port 27017)
                                │  collections: books / orders / payments
                                └─────────────┘
```

| Service             | Rôle                                  | Image          | Port  | Collection |
| ------------------- | ------------------------------------- | -------------- | ----- | ---------- |
| `bookstore-web-app` | Front Express + EJS                   | `node:16`      | 8082  | —          |
| `api-gateway`       | Point d'entrée unique (reverse proxy) | `node:16`      | 9001  | —          |
| `inventory-service` | Catalogue des livres                  | `node:16-slim` | 3000  | `books`    |
| `order-service`     | Commandes                             | `node:16-slim` | 3001  | `orders`   |
| `payment-service`   | Paiements                             | `node:16-slim` | 3002  | `payments` |
| `mongo`             | Base de données partagée              | `mongo:latest` | 27017 | —          |

### Routage de l'API Gateway

Le front n'appelle **que** la gateway (`GATEWAY_URL=http://api-gateway:9001`) :

| Appel front (gateway)      | Microservice cible        | Endpoint réel      |
| -------------------------- | ------------------------- | ------------------ |
| `/inventory/books[/...]`   | inventory-service (:3000) | `/books[/...]`     |
| `/orders[/...]`            | order-service (:3001)     | `/orders[/...]`    |
| `/payments[/...]`          | payment-service (:3002)   | `/payments[/...]`  |

## Modèles (CRUD complet via Swagger sur chaque service)

- **Book** : `title`, `author`, `price`, `stock`
- **Order** : `customerName`, `orderDate`, `totalAmount`, `status`
- **Payment** : `orderId`, `amount`, `paymentDate`, `paymentMethod`, `status`

## Démarrage

Une seule commande lance toute la stack :

```bash
docker compose up --build
```

Le démarrage est ordonné via des **healthchecks** :
`mongo` → microservices → `api-gateway` → front.

## URLs

| Élément                         | URL                                   |
| ------------------------------- | ------------------------------------- |
| Front (livres / commandes / paiements) | http://localhost:8082          |
| API Gateway (santé)             | http://localhost:9001/health          |
| Inventory — Swagger             | http://localhost:3000/explorer        |
| Order — Swagger                 | http://localhost:3001/explorer        |
| Payment — Swagger               | http://localhost:3002/explorer        |

Exemples via la gateway : `http://localhost:9001/inventory/books`,
`http://localhost:9001/orders`, `http://localhost:9001/payments`.

## Arrêt

```bash
docker compose down        # stoppe et supprime les containers
docker compose down -v     # + supprime le volume MongoDB (données)
```

## Configuration (.env)

Les ports et le nom de la base sont paramétrables dans [.env](.env) :

```env
MONGO_DB=bookstore
INVENTORY_PORT=3000
ORDER_PORT=3001
PAYMENT_PORT=3002
GATEWAY_PORT=9001
FRONT_PORT=8082
```

## Points couverts (bonus inclus)

- ✅ 3 microservices LoopBack 4 indépendants (model, datasource, repository, controllers, Swagger)
- ✅ API Gateway comme point d'entrée unique
- ✅ Front EJS : CRUD livres + commandes + paiements (via la gateway)
- ✅ Dockerfile par service + `docker compose up`
- ✅ Instance MongoDB unique partagée, **une collection par service**
- ✅ Bonus : `.env`, réseau Docker dédié (`bookstore-net`), volume persistant (`mongo-data`),
  healthchecks sur tous les services, documentation README

## Structure

```
Exo2/
├── docker-compose.yml          # orchestration des 6 services
├── .env                        # variables (ports, db)
├── api-gateway/                # Express + http-proxy-middleware (node:16)
├── bookstore-web-app/          # front Express + EJS (node:16)
│   ├── routes/{inventory,orders,payments}.js
│   └── views/{inventory,book,edit}.ejs, views/orders/*, views/payments/*
├── inventory-service/          # LoopBack 4 — Book (node:16-slim)
├── order-service/              # LoopBack 4 — Order (node:16-slim)
└── payment-service/            # LoopBack 4 — Payment (node:16-slim)
```
