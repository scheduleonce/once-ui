FROM node:8.11.4 AS build
WORKDIR /app/website
COPY . /app/website
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/website/storybook-static /var/www
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
