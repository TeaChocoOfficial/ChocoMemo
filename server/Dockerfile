FROM node:20-alpine AS build

RUN npm i -g pnpm

WORKDIR /usr/src/app

COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

RUN pnpm install

COPY . .

RUN pnpm build

FROM node:20-alpine AS production

RUN npm i -g pnpm

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

RUN pnpm install --prod

COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
