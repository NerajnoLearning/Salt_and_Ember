# Salt & Ember 🔥

A restaurant menu app for the fictional **Salt & Ember** kitchen — browse the menu, search dishes by name or tag, and dive into a detail page for every item with pairing recommendations.

Built at **Nebraska Codes 2026** (Cory House workshop).

## Features

- **Menu grid** — 21 dishes with images, prices, descriptions, and tags
- **Search** — filter by dish name or tag (e.g. `spicy`, `vegetarian`), case-insensitive
- **Tag filtering** — a chip row for all nine tags; select any number and dishes matching *any* of them show (OR), combined with the search text (AND)
- **Shareable views** — filters live in the URL (`/?search=steak&tags=Spicy,Dinner`), so they survive refresh and can be shared; back/forward navigation stays in sync
- **Tested** — Vitest covers the `filterFoods` matching logic and the `FoodCard` component
- **Detail pages** — `/food/:id` for every dish with a richer description and a "Pairs well with" section linking to recommended dishes
- **Runtime validation with Zod**
  - Menu data is parsed at module load — malformed entries fail fast with a clear error
  - Pairing ids are checked (`superRefine`) to reference real, different dishes
  - URL input (`?search=`, `?tags=`, `/food/:id`) is validated; bad values fall back gracefully instead of crashing — an unknown tag in `?tags=` is dropped, not fatal

## Tech Stack

| Tool | Purpose |
| --- | --- |
| [Vue 3](https://vuejs.org/) | UI framework (`<script setup>` SFCs) |
| [TypeScript](https://www.typescriptlang.org/) | Type safety (`vue-tsc` for type-checking) |
| [Vite](https://vite.dev/) | Dev server and build tooling |
| [Vue Router 4](https://router.vuejs.org/) | Client-side routing |
| [Tailwind CSS v4](https://tailwindcss.com/) | Styling via the `@tailwindcss/vite` plugin — no config file needed |
| [Zod](https://zod.dev/) | Runtime schema validation |
| [Vitest](https://vitest.dev/) + [@vue/test-utils](https://test-utils.vuejs.org/) | Unit and component tests (jsdom) |

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`vue-tsc -b`) then build for production |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Vitest in watch mode |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | ESLint with `--fix` |
| `npm run format` | Prettier write on `src/` |

## Project Structure

```
src/
├── food.ts              # Menu data + Zod schemas (single source of truth for types)
├── router/index.ts      # Routes: / (menu), /about, /food/:id (detail)
├── lib/
│   ├── filterFoods.ts   # Pure search + tag matching (unit tested)
│   └── searchParams.ts  # Zod schemas for ?search= and ?tags=
├── components/
│   └── FoodCard.vue     # Menu card, shared by the grid and the pairings list
├── views/
│   ├── HomeView.vue     # Menu grid + search bar + tag chips
│   ├── FoodDetailView.vue  # Dish detail + pairings
│   └── AboutView.vue
└── style.css            # Tailwind import + theme (Fraunces display font, ember palette)
public/images/           # Dish photos (static assets)
```

## Credits

- Food data and images adapted from [coryhouse/react-restaurant-assets](https://github.com/coryhouse/react-restaurant-assets)
- Workshop: Cory House, Nebraska Codes 2026
