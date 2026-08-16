# DriveSafely

AI-powered driver safety platform. Upload road videos for analysis, learn traffic rules, practice with tests, follow news, and track progress — with a friendly Smarter mascot throughout the product.

## Stack

- **Next.js** 16 (App Router)
- **React** 19
- **TypeScript**
- Companion API: [`drive-safely-node.js`](../drive-safely-node.js) (Express)

## Features

- Landing page with EN / UK localization and multiple themes
- Auth (login / sign up) via API proxy
- AI video analysis flow (upload → processing → results)
- Traffic rules browser with saved rules & favourites
- Practice tests with sessions and results
- AI assistant for road situations
- News feed (including RSS-backed articles)
- Profile & progress dashboard
- Info pages linked from the footer (about, help, privacy, terms, etc.)

## Project structure

```
app/                 # Routes (landing, auth, dashboard, API proxies)
components/          # UI: landing, dashboard, auth, theme, i18n
lib/                 # API clients, i18n, theme, progress, news, tests
public/              # Static assets (images, favicon)
middleware.ts        # Route protection for private pages
```

## Getting started

Requirements: **Node.js** 20+.

```bash
npm install
npm run dev
```

App: [https://drive-safely.vercel.app/](https://drive-safely.vercel.app/)

For full auth, analysis, and API-backed features, run the backend from `drive-safely-node.js` in parallel. API docs (Swagger) are available when the API server is running at [https://drive-safely-node-js-1.onrender.com/api-docs/](https://drive-safely-node-js-1.onrender.com/api-docs/).

## Scripts

| Command         | Description             |
| --------------- | ----------------------- |
| `npm run dev`   | Development server      |
| `npm run build` | Production build        |
| `npm start`     | Start production server |
| `npm run lint`  | ESLint                  |

## Themes & language

- Themes: Light, Teal, Mauve, Dark (toggle in header / sidebar)
- Languages: English and Ukrainian

## License

Private project.
