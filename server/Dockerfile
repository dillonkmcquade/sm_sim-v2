# syntax=docker/dockerfile:1

FROM node:18-alpine
WORKDIR /marketsim/server
COPY . .
RUN apk -U upgrade
RUN apk add curl

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"
RUN npm install --global pnpm

RUN pnpm install && pnpm build
CMD ["pnpm", "start:prod"]
