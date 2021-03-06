FROM node:12.22.1-alpine3.12 AS build
WORKDIR /app/website
COPY . /app/website
RUN npm install
RUN npm run build-storybook

FROM nginx:alpine
COPY --from=build /app/website/storybook-static/ /var/www
RUN ls -ltra /var/www
RUN ls -ltra /var/www/themes
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
