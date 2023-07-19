# Stage 1: Build
FROM node:14 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:14 AS run
WORKDIR /app

COPY --from=build /app/dist /app/dist
COPY package*.json ./
RUN npm install --production

EXPOSE 3000
CMD ["node", "dist/server.js"]
