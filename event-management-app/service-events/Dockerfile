FROM node:22-alpine

WORKDIR /app

COPY service-events/package.json service-events/pnpm-lock.yaml* ./service-events/
WORKDIR /app/service-events
RUN corepack enable && pnpm install --prod

WORKDIR /app
COPY service-events/src ./service-events/src
COPY shared ./shared

EXPOSE 3001

WORKDIR /app/service-events
CMD ["pnpm", "start"]
