# syntax=docker/dockerfile:1

FROM node:18-alpine
WORKDIR /
COPY . .
RUN yarn install
RUN yarn build
CMD ["node", "dist/index.js"]
EXPOSE 3001

