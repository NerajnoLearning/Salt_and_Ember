# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — type-check (`vue-tsc -b`) then production build
- `npm run preview` — preview production build locally
- `npm run lint` — ESLint with `--fix`
- `npm run format` — Prettier write on `src/`
- `npm test` — Vitest, single run
- `npm run test:watch` — Vitest in watch mode

## Testing

Vitest with jsdom and `@vue/test-utils`. Tests live beside the code they cover as `*.test.ts` (`src/**/*.test.ts`); `globals: true` is set in `vite.config.ts`, but tests import from `vitest` explicitly anyway.

- Test names follow the `should …` convention: `it('should return every food when no search and no tags are given')`.
- Filter/serialization logic lives in `src/lib/` as pure functions with no Vue or router imports, so it can be tested without mounting anything.
- Component tests stub `RouterLink` with `RouterLinkStub` rather than building a real router.
- Use small hand-built fixtures instead of the real `foods` array so menu copy changes don't break tests.

## Architecture

Vue 3 (`<script setup>`, TypeScript) + Vite + Vue Router 4 + Tailwind CSS v4.

- Tailwind is wired in via the `@tailwindcss/vite` plugin (`vite.config.ts`) — no `tailwind.config.js`/PostCSS setup needed; Tailwind is imported directly in `src/style.css`.
- Routing: `src/router/index.ts` defines routes (`/` → `HomeView`, `/about` → `AboutView`, `/food/:id` → lazy-loaded `FoodDetailView`, `/admin` → lazy-loaded `AdminView`) using `createWebHistory`. Views live in `src/views/`, shared components in `src/components/`.
- Menu state (the live, editable dish list) lives in `src/stores/menu.ts` — a module-level `menu = ref<Food[]>` (no Pinia), seeded from `food.ts`, hydrated from `localStorage` (`salt-and-ember:menu`), and persisted via a deep `watch`. Views import the `menu` ref directly plus the `createFood` / `editFood` / `removeFood` / `resetMenu` actions. Pure CRUD transforms live in `src/lib/menu.ts` (`addFood`, `updateFood`, `deleteFood`, `nextId`, `normalizePairings`, `parseStoredMenu`) with no Vue imports, so they're unit-tested in isolation (`src/lib/menu.test.ts`). `deleteFood`/`normalizePairings` strip dangling pairing ids so the store can never violate `food.ts`'s pairing invariant; `parseStoredMenu` repairs rather than rejects corrupt storage. `AdminView.vue` is the CRUD UI (create/edit form + dish list) over these actions.
- Menu filters (search text + selected tags) are held in the URL query string (`/?search=steak&tags=Spicy,Dinner`) so filtered views are shareable and survive refresh. `src/lib/searchParams.ts` owns the Zod schemas for those params — every schema ends in `.catch()` so a hand-edited or stale URL degrades gracefully instead of throwing.
- `src/food.ts` is the app's static data source: a `Food` type, a `foodTags` const array (source of truth for the `FoodTag` union type), and a `foods` array of menu items. Each `Food.image` is a bare filename (e.g. `"burger.jpg"`) resolved against `public/images/` — images are static assets copied from https://github.com/coryhouse/react-restaurant-assets, not imported as modules.
- ESLint config (`eslint.config.ts`) uses the flat config format via `@vue/eslint-config-typescript`'s `defineConfigWithVueTs`, with `eslint-plugin-vue`'s `flat/essential` rules and Prettier conflict rules turned off via `skip-formatting`.
