FROM node:22-bookworm

WORKDIR /api

COPY . ./

RUN yarn

EXPOSE 8080

CMD [ "sh", "-c", "yarn migrate && yarn start" ]