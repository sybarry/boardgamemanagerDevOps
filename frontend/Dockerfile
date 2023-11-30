# STAGE 1: Build Angular App
FROM docker.io/node:21-alpine as build

WORKDIR /usr/src/app

RUN npm cache clean --force

COPY . .

RUN npm install --force
RUN npm run build


# STAGE 2: Build Nginx container
FROM docker.io/nginx:latest AS ngi

COPY --from=build /usr/src/app/target/classes/static/ /usr/share/nginx/html
COPY nginx.config /etc/nginx/conf.d/default.conf

