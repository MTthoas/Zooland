FROM node:14

WORKDIR /app

COPY ./server/package*.json ./
COPY ./server/tsconfig*.json ./
RUN npm install

COPY ./server/src ./src

RUN npm run build

EXPOSE 8080
EXPOSE 3000

CMD [ "node", "dist/server.js" ]
