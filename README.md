# DriveSafely

AI-powered платформа для безпечного водіння: аналіз відео з дороги, правила ПДР, тести, новини та AI-помічник.

Репозиторій містить **frontend** (Next.js). Backend API живе окремо в [`drive-safely-node.js`](../drive-safely-node.js).

## Стек

| Частина  | Технології                                    |
| -------- | --------------------------------------------- |
| Frontend | Next.js 16, React 19, TypeScript, CSS Modules |
| Backend  | Express, MongoDB, JWT (cookie), Swagger       |
| i18n     | EN / UK                                       |
| Тема     | Light / Dark                                  |

## Можливості

- **Лендінг** — hero, фічі, how it works, новини, CTA
- **Auth** — реєстрація / логін (cookie через Next.js proxy → backend)
- **AI Analysis** — завантаження відео, обробка, результати з timeline і risk score
- **Traffic Rules** — каталог правил, збережені правила
- **Practice Tests** — тести з питаннями, feedback, результати
- **AI Assistant** — чат з посиланнями на правила
- **News** — офіційні закони + auto-updated RSS
- **Profile** — прогрес, досягнення, streak, активність
- **Favourites** — обрані новини / тести / аналізи / AI
- **Маскот Smarter** — у hero, sidebar, tips, fun fact тощо

## Структура

```
drive-safely/                 # Frontend (цей репозиторій)
├── app/                      # App Router (landing, auth, dashboard)
├── components/               # UI: landing, auth, dashboard
├── lib/                      # api, auth, i18n, tests, analysis, news, progress
├── public/                   # images, favicon, smarter mascot
└── middleware.ts             # захист dashboard-роутів

drive-safely-node.js/         # Backend API
├── src/controllers/
├── src/models/
├── src/routes/
└── src/docs/                 # OpenAPI + Swagger UI
```

## Швидкий старт

### 1. Backend

```bash
cd "../drive-safely-node.js"
npm install
# створіть .env (див. нижче)
npm run seed          # опційно: новини
npm run seed:user     # опційно: демо-користувач
npm run dev           # http://localhost:3002
```

Swagger: [http://localhost:3002/api-docs](http://localhost:3002/api-docs)

### 2. Frontend

```bash
cd "drive-safely"
npm install
npm run dev           # http://localhost:3000
```

## Змінні середовища

### Frontend (`drive-safely`)

Створіть `.env.local`:

```env
# Локальний backend (якщо не задано — Render production URL)
NEXT_PUBLIC_API_URL=http://localhost:3002
# або для server-only proxy:
API_INTERNAL_URL=http://localhost:3002
```

### Backend (`drive-safely-node.js`)

## Основні маршрути (frontend)

| Шлях                | Опис                         |
| ------------------- | ---------------------------- |
| `/`                 | Лендінг                      |
| `/login`, `/signup` | Автентифікація               |
| `/profile`          | Дашборд / профіль            |
| `/ai-analysis`      | Завантаження та аналіз відео |
| `/traffic-rules`    | Правила ПДР                  |
| `/tests`            | Практичні тести              |
| `/assistant`        | AI-помічник                  |
| `/news`             | Новини                       |
| `/saved-rules`      | Збережені правила            |
| `/favorites`        | Обране                       |

## API (backend)

| Method | Path                    | Auth   |
| ------ | ----------------------- | ------ |
| `GET`  | `/api/health`           | —      |
| `POST` | `/api/auth/register`    | —      |
| `POST` | `/api/auth/login`       | —      |
| `POST` | `/api/auth/logout`      | —      |
| `GET`  | `/api/auth/me`          | cookie |
| `GET`  | `/api/news`             | —      |
| `GET`  | `/api/news/:slug`       | —      |
| `GET`  | `/api/users/me/profile` | cookie |

Повна документація: **Swagger** → `http://localhost:3002/api-docs`

## Скрипти frontend

```bash
npm run dev      # розробка
npm run build    # production build
npm run start    # запуск build
npm run lint     # ESLint
```

## Примітки

- Auth: Next.js route `app/api/auth/[...path]` проксує запити на backend і виставляє cookie.
- Прогрес тестів / аналізів / favourites частково зберігається в **localStorage** / **IndexedDB** (відео для replay).
- Маскот: `public/images/smarter/smarter.png`, `minismarter.png` (PNG з прозорістю).

## Ліцензія

ISC (див. backend `package.json`). Приватний pet-проєкт.
