# syntax=docker/dockerfile:1

FROM node:18-alpine
WORKDIR /marketsim
COPY . .
RUN apk -U upgrade
RUN yarn install && yarn build
CMD ["node", "dist/index.js"]
EXPOSE 3001

