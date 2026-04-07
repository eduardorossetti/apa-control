FROM node:20-slim AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/administrativo/package.json ./apps/administrativo/
COPY config/typescript/package.json ./config/typescript/

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY config/typescript ./config/typescript
COPY apps/administrativo ./apps/administrativo

RUN pnpm --filter @apa-control/administrativo build

FROM nginx:alpine

COPY --from=builder /app/apps/administrativo/dist /usr/share/nginx/html
COPY apps/administrativo/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

