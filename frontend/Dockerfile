FROM docker.io/node:12.14-alpine as build

WORKDIR /dist/src/app


RUN npm cache clean --force

COPY . .

RUN npm install
RUN npm run build --prod



### STAGE 2:RUN 
FROM  docker.io/nginx:latest AS ngi
COPY --from=build /dist/src/app/dist/inde.html /usr/share/nginx/html
COPY /nginx.config /etc/nginx/conf.d/default.conf
EXPOSE 80
