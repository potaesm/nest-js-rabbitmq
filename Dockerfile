###############################
# BUILD FOR LOCAL DEVELOPMENT #
###############################

FROM node:16-alpine As development
ARG PORT=3000
ENV PORT=$PORT

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node yarn.lock ./

RUN yarn install --immutable

COPY --chown=node:node . .

USER node

########################
# BUILD FOR PRODUCTION #
########################

FROM node:16-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node nest-cli.json ./
COPY --chown=node:node yarn.lock ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN yarn run build

ENV NODE_ENV=production

RUN yarn install --immutable --prod && yarn cache clean

USER node

##############
# PRODUCTION #
##############

FROM node:16-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

WORKDIR "/dist"
CMD ["node", "./main.js"]

EXPOSE $PORT

# docker run --rm -d --hostname my-rabbit --name rabbitmq-server -p 8080:15672 -p 5672:5672 -e RABBITMQ_DEFAULT_USER=user -e RABBITMQ_DEFAULT_PASS=password rabbitmq:3-management
# Get IPAddress of RabbitMQContainer
# docker inspect <RabbitMQContainerId>
# docker build -t nest-js-rabbitmq:latest .
# docker run --rm -d -p 80:3000 --name nest-js-rabbitmq --env-file .env nest-js-rabbitmq:latest