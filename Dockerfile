# dockeronce.azurecr.io/once-ui:qa
FROM node:10.15.3-alpine

RUN mkdir -p /once-ui
WORKDIR /once-ui

# Install app dependencies
COPY package*.json /once-ui/

# Install the build dependencies and remove after npm install to save 
RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++ \
    && npm install \
    && apk del build-dependencies

COPY . /once-ui

EXPOSE 9000

CMD npm run storybook
