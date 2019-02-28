# dockeronce.azurecr.io/once-ui:qa
FROM node:slim
RUN apt-get update
RUN apt-get install -y build-essential

RUN mkdir -p /once-ui
ADD ./ /once-ui
WORKDIR /once-ui
RUN npm install

EXPOSE 9000

CMD npm run storybook