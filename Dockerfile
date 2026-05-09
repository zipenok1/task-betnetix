FROM node:20-alpine AS builder

WORKDIR /app

# Копируем package.json и prisma схему
COPY package*.json ./
COPY prisma ./prisma/

# Устанавливаем зависимости
RUN npm ci

# 🔧 ГЕНЕРИРУЕМ PRISMA CLIENT (самое важное!)
RUN npx prisma generate

# Копируем остальной код
COPY . .

# Собираем проект
RUN npm run build

# ---------- Продакшн образ ----------
FROM node:20-alpine

WORKDIR /app

# Копируем зависимости и собранный проект
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated ./src/generated

# 🔧 ЕЩЕ РАЗ генерируем Prisma Client (для продакшн-образа)
RUN npx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]