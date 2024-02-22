## Front-end
FROM node:20-slim AS base
ENV PNPM_HOME="/home/node/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"
RUN corepack enable

FROM base AS build
WORKDIR /home/node/app
COPY --chown=node:node . .
RUN pnpm install && pnpm build

FROM nginx:1.25.4-alpine AS prod
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /home/node/app/dist .
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]

FROM base AS dev
WORKDIR /home/node/app
USER node
COPY --chown=node:node . .
EXPOSE 3000
ENTRYPOINT [ "pnpm" ]
CMD ["dev"]
