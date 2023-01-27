FROM node:18 AS builder

RUN npm i -g pnpm

WORKDIR /app
COPY . .

RUN pnpm i
RUN pnpm run build

FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=builder /app ./

EXPOSE 3000
CMD ["pnpm", "start:prod"]