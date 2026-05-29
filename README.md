# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Project Layout

- Frontend: the Vite app at the repository root (`src/`, `public/`, `index.html`).
- Backend: Firebase Functions and API code in `backend/`.
- Deployment: `firebase.json` wires hosting to the frontend build output and routes API requests to the backend function.

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

## Environment

- Copy `.env.example` to `.env` and fill your own secret values locally.
- Do NOT commit `.env`; it's ignored by `.gitignore` to avoid leaking secrets.
- If Firebase env vars are missing, the app falls back to local demo login so email/password testing still works in the browser.

## Demo accounts

- Admin: `admin@freshhire.com` / `admin1234`  
- Demo user: `demo@freshhire.com` / `demo1234`  

To test quickly, sign up with the demo user credentials via the login page — the app will create the user and save a profile in Firestore.

## GitHub Pages deploy

This repo can also publish the frontend to GitHub Pages as a static site.

- The Pages workflow is in `.github/workflows/github-pages.yml`.
- It builds the app with `VITE_USE_HASH_ROUTER=true` and sets `VITE_BASE_PATH` to the repository name so routes and assets work on Pages.
- GitHub Pages is frontend-only; Firebase Functions, Auth, and Firestore still need Firebase hosting if you want the full app backend.

