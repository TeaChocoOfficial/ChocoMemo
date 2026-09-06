FROM node:20-alpine

# ติดตั้ง pnpm
RUN npm i -g pnpm

WORKDIR /usr/src/app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install

COPY . .

EXPOSE 3000

# ใช้ shell form
CMD ["pnpm", "dev"]