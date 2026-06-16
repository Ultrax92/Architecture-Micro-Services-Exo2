const express = require('express');
const {createProxyMiddleware} = require('http-proxy-middleware');

const app = express();

const PORT = process.env.PORT || 9001;

// URL des microservices (noms de containers sur le reseau Docker commun)
const INVENTORY_URL = process.env.INVENTORY_URL || 'http://localhost:3000';
const ORDER_URL = process.env.ORDER_URL || 'http://localhost:3001';
const PAYMENT_URL = process.env.PAYMENT_URL || 'http://localhost:3002';

// IMPORTANT : pas de body-parser ici. La gateway ne fait que relayer le flux
// brut des requetes (sinon les POST/PATCH avec corps JSON seraient bloques).

// Endpoint de sante de la gateway (utilise par le healthcheck Docker)
app.get('/health', (req, res) => {
  res.json({status: 'ok', service: 'api-gateway'});
});

// /inventory/*  ->  inventory-service (on retire le prefixe : /inventory/books -> /books)
app.use(
  createProxyMiddleware('/inventory', {
    target: INVENTORY_URL,
    changeOrigin: true,
    pathRewrite: {'^/inventory': ''},
  }),
);

// /orders/*  ->  order-service (chemin conserve : la ressource exposee est /orders)
app.use(
  createProxyMiddleware('/orders', {
    target: ORDER_URL,
    changeOrigin: true,
  }),
);

// /payments/*  ->  payment-service (chemin conserve : la ressource exposee est /payments)
app.use(
  createProxyMiddleware('/payments', {
    target: PAYMENT_URL,
    changeOrigin: true,
  }),
);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API Gateway en ecoute sur le port ${PORT}`);
  console.log(`  /inventory/* -> ${INVENTORY_URL}`);
  console.log(`  /orders/*    -> ${ORDER_URL}`);
  console.log(`  /payments/*  -> ${PAYMENT_URL}`);
});
