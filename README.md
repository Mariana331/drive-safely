# DriveSafely

<p align="center">
  <img src="public/images/smarter/minismarter.png" alt="Smarter mascot" width="120" />
</p>

<p align="center">
  <a href="https://drive-safely.vercel.app/"><img src="https://img.shields.io/badge/Live-drive--safely.vercel.app-2BB7A9?style=for-the-badge&logo=vercel&logoColor=white" alt="Live demo" /></a>
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

AI-powered driver safety platform. Upload road videos for analysis, learn traffic rules, practice with tests, follow news, and track progress — with a friendly **Smarter** mascot throughout the product.

## Palette

| Theme | Accent | Swatch |
| ----- | ------ | ------ |
| Light | `#3B82F6` | ![#3B82F6](https://img.shields.io/badge/-3B82F6?style=flat-square&color=3B82F6) |
| Teal | `#2BB7A9` | ![#2BB7A9](https://img.shields.io/badge/-2BB7A9?style=flat-square&color=2BB7A9) |
| Mauve | `#CFA6B8` | ![#CFA6B8](https://img.shields.io/badge/-CFA6B8?style=flat-square&color=CFA6B8) |
| Dark | `#111827` | ![#111827](https://img.shields.io/badge/-111827?style=flat-square&color=111827) |

<p>
  <img src="https://img.shields.io/badge/Light-%233B82F6-3B82F6?style=for-the-badge" alt="Light" />
  <img src="https://img.shields.io/badge/Teal-%232BB7A9-2BB7A9?style=for-the-badge" alt="Teal" />
  <img src="https://img.shields.io/badge/Mauve-%23CFA6B8-CFA6B8?style=for-the-badge" alt="Mauve" />
  <img src="https://img.shields.io/badge/Dark-%23111827-111827?style=for-the-badge" alt="Dark" />
</p>

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

- Themes: **Light**, **Teal**, **Mauve**, **Dark** (toggle in header / sidebar)
- Languages: English and Ukrainian

## License

Private project.
