FROM node:18-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
RUN apk -U upgrade
RUN apk add curl

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"
RUN npm install --global pnpm@latest

USER node
COPY --chown=node:node . .
RUN pnpm install
CMD ["pnpm", "dev", "--host"]
