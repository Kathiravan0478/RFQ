# RFQ Auction Dashboard (Frontend)

Vite + React + Tailwind dashboard scaffold for an RFQ Auction system, designed for **seamless integration with a FastAPI + MongoDB microservices backend**.

## Tech

- React + TypeScript (Vite)
- Tailwind CSS (dark mode via `class`)
- React Router
- TanStack Query + Axios (strict separation of UI vs API layer)
- Zustand (stores `authStatus` + `userRole`)

## Run locally

```bash
npm install
npm run dev
```

### Full stack (Docker, repos stay separate)

Use the sibling folder **`rfq-local-stack/`** (same parent directory as this repo): it contains a `docker-compose.yml` that builds **this app** and **rfqqbe** together. See `rfq-local-stack/README.md`.

### Environment

Create `.env` (optional):

```bash
VITE_API_BASE_URL=http://localhost:8000
```

## What’s implemented

- **Auth & RBAC state**: `src/state/authStore.ts`
  - Stores `authStatus`, `userRole`, `token`, `userId`
  - `LoginPage` calls `POST /auth/login` and `PUT /auth/profile` (terms consent); `RegisterPage` calls `POST /auth/register`.
- **Theme toggle**: `src/state/theme.tsx` + `src/components/ThemeToggle.tsx`
  - `system | light | dark` with Tailwind `dark` class on `<html>`
- **RBAC UI differentiation**: `src/components/RoleGuard.tsx`
  - Sets `<html data-role="admin|seller|buyer">` to drive role palette
- **Dashboard layout**: `src/layout/DashboardLayout.tsx`
  - Sidebar + Topbar (Theme toggle + Notification Center button)
- **Pages**
  - `src/pages/LoginPage.tsx` / `RegisterPage.tsx`
  - `src/pages/DashboardPage.tsx` (seller create draft, admin approve drafts, live list for buyer/admin)
  - `src/pages/AuctionDetailsPage.tsx` (auction from API, bid table + place bid for buyers)
- **Notification system (demo)**:
  - `src/components/NotificationToast.tsx` + `src/state/notifications.ts`
  - Simulates backend alerts; replace with WS/SSE + real events

## API layer (for backend integration)

All HTTP calls are centralized in `src/api/*` using `src/api/apiClient.ts`:

- `src/api/auth.ts`: `/auth/login`, `/auth/me`
- `src/api/auctions.ts`: `/auctions`, `/auctions/:eventId`
- `src/api/bids.ts`: `/bids` (list + create)

See `docs/backend-integration.md` for the contract the frontend expects.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
