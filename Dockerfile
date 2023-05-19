FROM dockeronce.azurecr.io/node:18.16.0-alpine3.17 AS build
WORKDIR /app/website
COPY . /app/website
RUN chown root:root . 
RUN npm install
RUN chown root:root . && npm run build-storybook

FROM nginx:alpine
COPY --from=build /app/website/storybook-static/ /var/www
RUN ls -ltra /var/www
# RUN ls -ltra /var/www/themes
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
