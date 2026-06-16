# ---- API Gateway (image node:16) ----
FROM node:16

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV PORT=9001
EXPOSE 9001

CMD ["npm", "start"]
