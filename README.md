# Админ-панель для центрального офиса

## Инструкция по запуску

### 1. Клонирование репозитория
```bash
git clone https://github.com/zipenok1/task-betnetix.git
```

### 2. Установка зависимостей
```bash
npm install
```

### 3. Настройка переменных окружения
Создайте файл `.env` в корне проекта

### 4. Запуск базы данных
```bash
docker-compose up -d
```

### 5. Применение миграций
```bash
npx prisma migrate deploy
```

### 6. Запуск приложения
При первом запуске автоматически создается root-пользователь:
- Email: `root@example.com`
- Пароль: `root123`

---

## Описание API

### Авторизация

#### POST /auth/login
Вход по email и паролю.

**Входные данные:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Выходные данные:**
```json
{
  "access_token": "string",
  "refresh_token": "string"
}
```

#### POST /auth/logout
Завершение текущей сессии.

**Заголовки:** `Authorization: Bearer <access_token>`

**Выходные данные:**
```json
{
  "message": "сессия завершена"
}
```

#### POST /auth/refresh
Обновление JWT.

**Входные данные:**
```json
{
  "refresh_token": "string"
}
```

**Выходные данные:**
```json
{
  "access_token": "string"
}
```

---

### Администраторы (только root)

#### GET /admins
Список администраторов.

**Заголовки:** `Authorization: Bearer <access_token>`

**Выходные данные:**
```json
[
    {
      "id": "uuid",
      "name": "string",
      "email": "string",
      "role": "root | manager"
    }
]
```

#### POST /admins
Создать менеджера.

**Заголовки:** `Authorization: Bearer <access_token>`

**Входные данные:**
```json
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```

**Выходные данные:**
```json
{
  "message": "manager {name} создан"
}
```

#### PATCH /admins/:id/password
Смена пароля менеджера.

**Заголовки:** `Authorization: Bearer <access_token>`

**Входные данные:**
```json
{
  "password": "string"
}
```

**Выходные данные:**
```json
{
  "message": "пароль успешно изменен"
}
```

#### DELETE /admins/:id
Удалить менеджера.

**Заголовки:** `Authorization: Bearer <access_token>`

**Выходные данные:**
```json
{
  "message": "manager {name} удален"
}
```

---

### Владельцы магазинов

#### GET /shops-owners
Список владельцев.

**Заголовки:** `Authorization: Bearer <access_token>`

**Выходные данные:**
```json
[
    {
      "id": "uuid",
      "name": "string",
      "phone": "string"
    }
]
```

#### GET /shops-owners/:id
Карточка владельца.

**Заголовки:** `Authorization: Bearer <access_token>`

**Выходные данные:**
```json
{
    "id": "uuid",
    "name": "string",
    "phone": "string",
    "email": "string | null",
    "shops": [
        {
            "id": "uuid",
            "name": "string",
            "address": "string"
        }
    ]
}
```

#### POST /shops-owners
Создать владельца.

**Заголовки:** `Authorization: Bearer <access_token>`

**Входные данные:**
```json
{
    "name": "string",
    "phone": "string",
    "email": "string"
}
```

**Выходные данные:**
```json
{
    "message": "владелец {name} создан"
}
```

#### PATCH /shops-owners/:id
Изменить владельца.

**Заголовки:** `Authorization: Bearer <access_token>`

**Входные данные:**
```json
{
    "name": "string",
    "phone": "string",
    "email": "string"
}
```

**Выходные данные:**
```json
{
    "message": "данные успешно изменены"
}
```

#### DELETE /shops-owners/:id
Удалить владельца.

**Заголовки:** `Authorization: Bearer <access_token>`

**Выходные данные:**
```json
{
    "message": "владелец удален"
}
```

---

### Магазины

#### GET /shops
Список магазинов.

**Заголовки:** `Authorization: Bearer <access_token>`

**Выходные данные:**
```json
[
    {
        "id": "uuid",
        "name": "string",
        "address": "string",
        "login": "string",
        "owner": {
            "id": "uuid",
            "name": "string"
        }
    }
]
```

#### GET /shops/:id
Карточка магазина.

**Заголовки:** `Authorization: Bearer <access_token>`

**Выходные данные:**
```json
{
    "id": "uuid",
    "name": "string",
    "address": "string",
    "login": "string",
    "legalDetails": "object | null",
    "owner": {
        "id": "uuid",
        "name": "string",
        "phone": "string",
        "email": "string | null"
    },
    "terminals": []
}
```

#### POST /shops
Создать магазин.

**Заголовки:** `Authorization: Bearer <access_token>`

**Входные данные:**
```json
{
    "name": "string",
    "address": "string",
    "login": "string",
    "password": "string",
    "ownerId": "uuid",
    "legalDetails": "(опционально)"
}
```

**Выходные данные:**
```json
{
    "message": "магазин {name} создан"
}
```

#### PATCH /shops/:id/credentials
Изменить логин/пароль магазина.

**Заголовки:** `Authorization: Bearer <access_token>`

**Входные данные:**
```json
{
    "login": "string (опционально)",
    "password": "string (опционально)"
}
```

**Выходные данные:**
```json
{
    "message": "учетные данные обновлены"
}
```

### Терминалы (root + manager)

#### GET /terminals
Список терминалов.

**Заголовки:** `Authorization: Bearer <access_token>`

**Выходные данные:**
```json
[
    {
        "id": "uuid",
        "mac": "string",
        "status": "active | inactive",
        "lastHeartbeat": "datetime | null",
        "shop": {
            "id": "uuid",
            "name": "string",
            "login": "string"
        }
    }
]
GET /terminals/:id
Карточка терминала.

Заголовки: Authorization: Bearer <access_token>

Выходные данные:

json
{
    "id": "uuid",
    "mac": "string",
    "status": "active | inactive",
    "lastHeartbeat": "datetime | null",
    "shop": {
        "id": "uuid",
        "name": "string",
        "login": "string",
        "address": "string"
    }
}
PATCH /terminals/:id/status
Обновить статус терминала вручную.

Заголовки: Authorization: Bearer <access_token>

Входные данные:

json
{
    "status": "active | inactive"
}
Выходные данные:

json
{
    "id": "uuid",
    "mac": "string",
    "status": "active | inactive",
    "updatedAt": "datetime"
}
POST /terminals/alive
Heartbeat от терминала (обновление статуса «активный»). Публичный эндпоинт.

Входные данные:

json
{
    "mac": "string",
    "shopLogin": "string",
    "shopPassword": "string"
}
Выходные данные:

json
{
    "id": "uuid",
    "mac": "string",
    "status": "active",
    "lastHeartbeat": "datetime"
}

Заявки на подключение терминалов (root + manager)
GET /requests
Список заявок.

Заголовки: Authorization: Bearer <access_token>

Выходные данные:

json
[
    {
        "id": "uuid",
        "mac": "string",
        "status": "pending | approved | rejected",
        "comment": "string | null",
        "createdAt": "datetime",
        "shop": {
            "id": "uuid",
            "name": "string",
            "login": "string",
            "address": "string"
        }
    }
]
POST /requests
Создать заявку(для тестирования).

Заголовки: Authorization: Bearer <access_token>

Входные данные:

json
{
    "mac": "string",
    "shopId": "uuid",
    "comment": "string (опционально)"
}

PATCH /requests/:id/approve
Одобрить заявку → создать терминал.

Заголовки: Authorization: Bearer <access_token>

Выходные данные:

json
{
    "message": "заявка одобрена, терминал создан"
}

PATCH /requests/:id/reject
Отклонить заявку.

Заголовки: Authorization: Bearer <access_token>

Выходные данные:

json
{
    "message": "заявка отклонена"
}
POST /requests/:id/comment
Добавить комментарий к заявке.

Заголовки: Authorization: Bearer <access_token>

Входные данные:

json
{
    "comment": "string"
}
Выходные данные:

json
{
    "id": "uuid",
    "mac": "string",
    "status": "pending | approved | rejected",
    "comment": "string",
    "updatedAt": "datetime"
}