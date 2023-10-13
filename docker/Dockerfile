FROM node:lts-bullseye-slim AS build
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init libpq-dev g++ make python3
ENV NODE_ENV development
WORKDIR /usr/src/app
COPY --chown=node:node .. /usr/src/app/

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

RUN npm ci
RUN npm install -g vite
RUN npm run build
RUN rm -rf node_modules
RUN npm ci --only production

FROM node:lts-bullseye-slim
RUN apt-get update && apt-get install -y --no-install-recommends libpq5
ENV NODE_ENV production
ENV PORT 3009
COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=build /entrypoint.sh /entrypoint.sh
USER node
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node --from=build /usr/src/app/build /usr/src/app/build
COPY --chown=node:node --from=build /usr/src/app/package.json /usr/src/app/
EXPOSE 3009
ENTRYPOINT ["/entrypoint.sh"]
