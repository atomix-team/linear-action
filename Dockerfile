FROM node:15-alpine
WORKDIR /action
COPY package.json yarn.lock tsconfig.json ./
RUN yarn install --frozen-lockfile
COPY src src
RUN yarn build

ENTRYPOINT [ "node", "/action/dist/main.js" ]