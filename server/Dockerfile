# syntax=docker/dockerfile:1

FROM node:18-alpine
WORKDIR /marketsim
COPY . .
RUN apk -U upgrade

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"
RUN npm install --global pnpm

RUN pnpm install && pnpm build
CMD ["node", "dist/index.js"]
EXPOSE 3001

