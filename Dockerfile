FROM node:18-alpine AS base

RUN npm i -g pnpm

FROM base AS dependency

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm i

FROM base AS build

WORKDIR /app
COPY . .
COPY --from=dependency /app/node_modules ./node_modules
RUN pnpm run build
RUN pnpm prune --prod

FROM base AS release

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.env ./.env

EXPOSE 3000
CMD ["node", "dist/main.js"]