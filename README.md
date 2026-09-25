# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


Vitest
HTTPS provides encryption between the browser and server.

Only environment variables prefixed with (VITE_) are exposed to client-side code through import.meta.env.
Important security lesson, we must not put secrets in VITE_* variables.
dont do the following
VITE_DATABASE_PASSWORD=abc123
VITE_API_SECRET=xyz456
VITE_PRIVATE_KEY=...

import.meta.env.MODE
import.meta.env.DEV
import.meta.env.PROD
import.meta.env.BASE_URL
import.meta.env.SSR

if (import.meta.env.PROD) {
  console.log("Production");
}

Dynamic import is the mechanism.

Code splitting is the result produced by the bundler.

In your experiment:

Dynamic import()
       ↓
Vite build
       ↓
Separate chunk
       ↓
lazyMessage-xxxxx.js