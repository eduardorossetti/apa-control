FROM node:20-slim

RUN apt-get update && apt-get install -y \
  libnss3 \
  libnspr4 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdrm2 \
  libdbus-1-3 \
  libxkbcommon0 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  libgbm1 \
  libasound2 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libcairo2 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxext6 \
  ca-certificates \
  fonts-liberation \
  --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY config/typescript/package.json ./config/typescript/

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY config/typescript ./config/typescript
COPY apps/api ./apps/api

RUN pnpm --filter @apa-control/api build

WORKDIR /app/apps/api

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/server.js"]
