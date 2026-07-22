# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — type-check (`vue-tsc -b`) then production build
- `npm run preview` — preview production build locally
- `npm run lint` — ESLint with `--fix`
- `npm run format` — Prettier write on `src/`

No test runner is configured in this project.

## Architecture

Vue 3 (`<script setup>`, TypeScript) + Vite + Vue Router 4 + Tailwind CSS v4.

- Tailwind is wired in via the `@tailwindcss/vite` plugin (`vite.config.ts`) — no `tailwind.config.js`/PostCSS setup needed; Tailwind is imported directly in `src/style.css`.
- Routing: `src/router/index.ts` defines routes (`/` → `HomeView`, `/about` → `AboutView`) using `createWebHistory`. Views live in `src/views/`.
- `src/food.ts` is the app's static data source: a `Food` type, a `foodTags` const array (source of truth for the `FoodTag` union type), and a `foods` array of menu items. Each `Food.image` is a bare filename (e.g. `"burger.jpg"`) resolved against `public/images/` — images are static assets copied from https://github.com/coryhouse/react-restaurant-assets, not imported as modules.
- ESLint config (`eslint.config.ts`) uses the flat config format via `@vue/eslint-config-typescript`'s `defineConfigWithVueTs`, with `eslint-plugin-vue`'s `flat/essential` rules and Prettier conflict rules turned off via `skip-formatting`.
