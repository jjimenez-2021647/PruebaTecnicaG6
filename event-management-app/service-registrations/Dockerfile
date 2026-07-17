FROM node:22-alpine

WORKDIR /app

COPY service-registrations/package.json service-registrations/pnpm-lock.yaml* ./service-registrations/
WORKDIR /app/service-registrations
RUN corepack enable && pnpm install --prod

WORKDIR /app
COPY service-registrations/src ./service-registrations/src
COPY shared ./shared

EXPOSE 3002

WORKDIR /app/service-registrations
CMD ["pnpm", "start"]
