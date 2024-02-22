## API
FROM node:20-slim AS base
ENV PNPM_HOME="/home/node/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"
RUN corepack enable

FROM base AS build
WORKDIR /home/node/app
COPY --chown=node:node . .
RUN pnpm install && pnpm build

FROM base AS prod
WORKDIR /home/node/app
USER node
COPY --from=build --chown=node:node /home/node/app/dist /home/node/app/dist
EXPOSE 3001
ENTRYPOINT ["pnpm"]
CMD ["start"]

FROM base AS dev
WORKDIR /home/node/app
USER node
COPY --chown=node:node . .
EXPOSE 3001
ENTRYPOINT [ "pnpm" ]
CMD ["start:dev"]

