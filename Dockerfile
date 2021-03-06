# Builder pattern
FROM node:10.14.0-alpine AS builder
WORKDIR /app
ADD package.json package.json
ADD . .
RUN rm -f .env
RUN apk add git
RUN npm install react-navigation
RUN npm install
# RUN npm audit fix
RUN npm run build

WORKDIR /app
FROM nginx
#RUN apt-get install -y nginx-plus-module-brotli
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
RUN ["nginx"]
EXPOSE 8080
