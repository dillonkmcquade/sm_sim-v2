FROM node:18-alpine
WORKDIR /marketsim/client
COPY . .
RUN apk -U upgrade
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"
RUN npm install --global pnpm
RUN pnpm install
CMD ["pnpm", "start"]
