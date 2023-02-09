FROM dockeronce.azurecr.io/node:18.13.0-alpine3.17 AS build
WORKDIR /app/website
COPY . /app/website
RUN npm install
RUN npm install -g npm@latest
RUN npm run build-storybook

FROM nginx:alpine
COPY --from=build /app/website/storybook-static/ /var/www
RUN ls -ltra /var/www
# RUN ls -ltra /var/www/themes
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
