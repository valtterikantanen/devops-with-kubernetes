FROM node:22-alpine3.20 AS build

WORKDIR /usr/src/app/client

COPY client/package*.json .

RUN npm ci

COPY client/ .

RUN npm run build


FROM node:22-alpine3.20

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY server/package*.json .

RUN npm ci

COPY server/ .

COPY --from=build /usr/src/app/client/dist ./static

CMD ["node", "index.js"]