FROM node:22-alpine3.20

WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

COPY package*.json ./

RUN npm ci

COPY . .

CMD ["node", "index.js"]