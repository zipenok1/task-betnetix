FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache netcat-openbsd

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./

RUN npm ci

RUN npx prisma generate

COPY . .

RUN npm run build

# ---------- Продакшн образ ----------
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache netcat-openbsd

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/tsconfig.json ./

RUN npx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "until nc -z postgres 5432; do echo 'Waiting for postgres...'; sleep 2; done; echo 'Postgres is ready!'; npx prisma migrate deploy; echo 'Migrations applied!'; node dist/main"]