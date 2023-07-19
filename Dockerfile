# Stage 1: Build the react application
FROM node:14 AS build

WORKDIR /app

# Copy package files and install dependencies
COPY ./client/package*.json ./
RUN npm install

# Copy the rest of the client app files
COPY ./client/ .

# Build the app
RUN npm run build

# Stage 2: Serve app with nginx server
FROM nginx:stable-alpine

# Copy build files from build stage
COPY --from=build /app/build /usr/share/nginx/html

