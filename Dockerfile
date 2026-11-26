FROM dockeronce.azurecr.io/node:26.13.1-alpine3.24 AS build
WORKDIR /app/website
COPY . /app/website
RUN chown root:root .
RUN npm install --global pnpm@12.17.0
RUN pnpm install --frozen-lockfile
RUN chown root:root . && pnpm run build-storybook

FROM nginx:alpine
COPY --from=build /app/website/storybook-static/ /var/www
RUN ls -ltra /var/www
# RUN ls -ltra /var/www/themes
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]










