FROM node:14

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install

COPY ./src ./src

RUN npm run build

EXPOSE 3000

CMD [ "node", "dist/server.js" ]
