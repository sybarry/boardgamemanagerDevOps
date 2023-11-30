# STAGE 1: Build Angular App
FROM docker.io/node:12.14-alpine as build

WORKDIR /usr/src/app

RUN npm cache clean --force

COPY . .

RUN npm install --force
RUN npm run build --prod

# STAGE 2: Build Nginx container
FROM docker.io/nginx:latest AS ngi

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY nginx.config /etc/nginx/conf.d/default.conf
EXPOSE 80
