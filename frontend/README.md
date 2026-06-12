# Wellness Hub — Frontend

A React + TypeScript single-page application built with Vite. This document covers the folder structure, architectural decisions, data flow, and conventions used throughout the codebase.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Folder Structure](#folder-structure)
- [Architecture Overview](#architecture-overview)
- [Layer Breakdown](#layer-breakdown)
  - [Models (Domain Types)](#1-models-domain-types)
  - [Data Layer](#2-data-layer)
  - [Store (Redux)](#3-store-redux)
  - [Use Cases](#4-use-cases)
  - [Components](#5-components)
  - [Containers (Pages)](#6-containers-pages)
- [Data Flow](#data-flow)
- [Search Strategy](#search-strategy)
- [State Management](#state-management)
- [Routing](#routing)
- [Styling](#styling)
- [Conventions and Patterns](#conventions-and-patterns)

---

## Quick Start

```bash
npm install
cp .env.example .env   # fill in VITE_API_URL and VITE_TYPESENSE_SEARCH_KEY
npm run dev            # http://localhost:5173
npm run build          # production build
npm run lint           # ESLint
```

---

## Folder Structure

```
frontend/
├── public/                        # Static assets (favicon, icons, images)
│   ├── favicon.svg
│   ├── icons.svg
│   └── meditation.png
│
├── src/
│   ├── App.tsx                    # Root component — mounts router + navbar
│   ├── App.css
│   ├── index.css                  # Tailwind imports + custom component classes
│   ├── main.tsx                   # Entry point — Redux Provider + PersistGate
│   └── assets/
│
│   └── app/
│       ├── models/                # Domain-facing TypeScript interfaces
│       │   ├── index.ts
│       │   ├── comment.model.ts
│       │   ├── protocol.model.ts
│       │   ├── review.model.ts
│       │   ├── thread.model.ts
│       │   ├── typesense.model.ts
│       │   ├── user.model.ts
│       │   ├── vote.model.ts
│       │   ├── sort.model.ts
│       │   ├── search.model.ts
│       │   └── ui.model.ts        # Props interfaces for UI components
│       │
│       ├── data/
│       │   ├── models/            # Infrastructure-level interfaces and API config
│       │   │   ├── api.ts         # Axios instance + Typesense client + API helpers
│       │   │   ├── wellness-platform.model.ts   # Canonical API response shapes
│       │   │   ├── protocol.model.ts
│       │   │   ├── thread.model.ts
│       │   │   ├── comment.model.ts
│       │   │   ├── review.model.ts
│       │   │   ├── protocol.datasource.interface.ts
│       │   │   ├── protocol.repository.interface.ts
│       │   │   ├── thread.datasource.interface.ts
│       │   │   ├── thread.repository.interface.ts
│       │   │   ├── comment.datasource.interface.ts
│       │   │   ├── comment.repository.interface.ts
│       │   │   ├── auth.datasource.interface.ts
│       │   │   ├── auth.repository.interface.ts
│       │   │   └── index.ts
│       │   │
│       │   ├── datasources/       # Raw API calls (Axios)
│       │   │   ├── index.ts
│       │   │   ├── protocol/protocol.datasource.ts
│       │   │   ├── thread/thread.datasource.ts
│       │   │   ├── comment/comment.datasource.ts
│       │   │   └── auth/auth.datasource.ts
│       │   │
│       │   ├── repositories/      # Repository pattern wraps datasources
│       │   │   ├── index.ts       # Instantiates all repositories (DI root)
│       │   │   ├── protocol/protocol.repository.ts
│       │   │   ├── thread/thread.repository.ts
│       │   │   ├── comment/comment.repository.ts
│       │   │   └── auth/auth.repository.ts
│       │   │
│       │   ├── store/
│       │   │   ├── store-setup.ts          # configureStore, persistor, typed hooks
│       │   │   ├── index.ts
│       │   │   ├── reducers/               # Redux slices (state + actions)
│       │   │   │   ├── index.ts
│       │   │   │   ├── protocol.reducer.ts
│       │   │   │   ├── thread.reducer.ts
│       │   │   │   ├── comment.reducer.ts
│       │   │   │   └── auth.reducer.ts
│       │   │   ├── effects/                # Async thunks
│       │   │   │   ├── index.ts
│       │   │   │   ├── protocol.effects.ts
│       │   │   │   ├── thread.effects.ts
│       │   │   │   ├── comment.effects.ts
│       │   │   │   └── auth.effects.ts
│       │   │   └── selectors/
│       │   │       ├── index.ts
│       │   │       ├── protocol.selectors.ts
│       │   │       ├── thread.selectors.ts
│       │   │       ├── comment.selectors.ts
│       │   │       └── auth.selectors.ts
│       │   │
│       │   └── errors/
│       │       ├── domain-error.ts         # Maps Axios errors to domain errors
│       │       └── wellness-platform.errors.ts
│       │
│       ├── usecases/              # Business logic — orchestrates dispatch calls
│       │   ├── index.ts
│       │   ├── protocol.usecase.ts
│       │   ├── threads.usecase.ts
│       │   ├── comment.usecase.ts
│       │   └── auth.usecase.ts
│       │
│       ├── components/            # Reusable presentational UI pieces
│       │   ├── auth/
│       │   │   └── auth-shell.tsx
│       │   ├── layout/
│       │   │   ├── navbar.tsx
│       │   │   ├── page-shell.tsx
│       │   │   └── two-column-layout.tsx
│       │   ├── protocols/
│       │   │   ├── protocol-card.tsx
│       │   │   ├── protocol-list.tsx
│       │   │   ├── protocol-stats.tsx
│       │   │   └── review-form.tsx
│       │   ├── threads/
│       │   │   ├── thread-card.tsx
│       │   │   ├── thread-list.tsx
│       │   │   └── new-thread-form.tsx
│       │   ├── comments/
│       │   │   ├── comment-node.tsx        # Recursive nested comment renderer
│       │   │   └── new-comment-form.tsx
│       │   ├── search/
│       │   │   ├── index.ts
│       │   │   ├── filter-header.tsx
│       │   │   ├── search-bar.tsx
│       │   │   └── sort-bar.tsx
│       │   └── ui/                         # Generic design-system atoms
│       │       ├── avatar.tsx
│       │       ├── card-skeleton.tsx
│       │       ├── empty-state.tsx
│       │       ├── modal.tsx
│       │       ├── review-item.tsx
│       │       ├── skeleton.tsx
│       │       ├── spinner.tsx
│       │       ├── stars.tsx
│       │       ├── tag.tsx
│       │       └── vote-buttons.tsx
│       │
│       ├── containers/            # Page-level components (route targets)
│       │   ├── home-page.tsx
│       │   ├── protocol-detail-page.tsx
│       │   ├── new-protocol-page.tsx
│       │   └── login-page.tsx
│       │
│       ├── hooks/
│       │   ├── index.ts
│       │   └── use-debounce.hook.ts
│       │
│       └── utils/
│           └── helpers.ts         # isHit, toSlug, stringToArray, arrayToString
│
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── eslint.config.js
```

---

## Architecture Overview

The frontend follows a **layered clean architecture** adapted for React and Redux. Dependencies only flow inward — components never call the API directly, and the store never knows about the UI.

```
┌─────────────────────────────────────────────┐
│           Containers (Pages)                │  Route targets, orchestrate UX
├─────────────────────────────────────────────┤
│               Components                    │  Presentational, receive props only
├─────────────────────────────────────────────┤
│               Use Cases                     │  Business logic, dispatch thunks
├──────────────────────┬──────────────────────┤
│     Redux Store      │   Typesense Client   │  State + async side effects
│  (reducers/effects)  │   (search-only)      │
├──────────────────────┴──────────────────────┤
│              Repositories                   │  Interface over data sources
├─────────────────────────────────────────────┤
│              Datasources                    │  Raw Axios HTTP calls
├─────────────────────────────────────────────┤
│           Laravel REST API                  │  External backend
└─────────────────────────────────────────────┘
```

---

## Layer Breakdown

### 1. Models (Domain Types)

There are **two sets of model files** and the distinction is intentional.

`src/app/models/` contains what the application domain cares about — the shapes that components and use cases work with (`Protocol`, `Review`, `Thread`, and all component prop interfaces like `StarsProps`, `VoteButtonsProps`).

`src/app/data/models/` contains infrastructure concerns: API request/response shapes, repository interfaces, datasource interfaces, the Axios instance, and the Typesense client config. `wellness-platform.model.ts` is the canonical source of truth for API response shapes.

Components import from `app/models/` only. This separation means the UI stays decoupled from the transport layer.

---

### 2. Data Layer

#### Datasources

The lowest layer. Each class is responsible for one resource and makes raw Axios calls. All errors pass through `toDomainError()` which maps HTTP status codes to typed error classes — `UnauthorizedError`, `NotFoundError`, `ValidationError`, `ServerError`.

```ts
async getProtocol(slug: string | number): Promise<Protocol> {
  try {
    const res = await api.get<Protocol>(`/protocols/${slug}`);
    return res.data;
  } catch (error) {
    throw toDomainError(error); // always a WellnessPlatformErrors.DomainError
  }
}
```

The Axios instance (`api`) is configured in `data/models/api.ts` with a request interceptor that attaches the bearer token from `localStorage` on every call.

#### Repositories

A thin delegation layer that wraps datasources. The repository pattern makes it possible to swap the data source (e.g. a mock for testing) without touching any other code. Repositories are injected into the Redux store as `extraArgument` and accessed from thunks via `extra`:

```ts
// store-setup.ts
middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({ thunk: { extraArgument: repositories } })

// Inside a thunk:
const protocol = await extra.protocolRepository.getProtocol(slug);
```

All repositories are instantiated in `data/repositories/index.ts` — the single dependency injection root.

---

### 3. Store (Redux)

Built with **Redux Toolkit**. Four slices:

| Slice | Manages |
|---|---|
| `protocols` | Protocol list, current protocol detail, reviews, protocol-linked threads |
| `threads` | Thread list, current thread, vote state |
| `comments` | Comments keyed by `threadId`, full nested reply tree |
| `auth` | Authenticated user, token, loading and error state |

The `auth` slice is persisted to `localStorage` via **redux-persist** (whitelist: `user`, `token`). All other slices are in-memory only and reset on page refresh.

#### Effects (Async Thunks)

Thunks follow a consistent three-step pattern:

1. Dispatch a `start` action to set loading state
2. Call the repository method via `extra`
3. On success dispatch a `success` action; on failure dispatch a `failure` action with the error message

```ts
export const fetchProtocol = createAsyncThunk<void, string | number, ThunkApi>(
  "protocols/fetchOne",
  async (slug, { dispatch, extra }) => {
    dispatch(protocolActions.fetchProtocolStart());
    try {
      const protocol = await extra.protocolRepository.getProtocol(slug);
      dispatch(protocolActions.fetchProtocolSuccess(protocol));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load protocol";
      dispatch(protocolActions.fetchProtocolFailure(message));
    }
  },
);
```

#### Selectors

Plain selector functions in `data/store/selectors/`. Always use these in components — never access `state.protocols.items` directly. This keeps components decoupled from the internal state shape.

#### Typed Hooks

Use `useAppDispatch` and `useAppSelector` (exported from `store-setup.ts`) everywhere instead of the plain Redux hooks. They carry full TypeScript types automatically.

---

### 4. Use Cases

Use cases are plain classes that accept `dispatch` in their constructor and expose intent-readable methods. They are the **only** place allowed to dispatch thunks. Containers instantiate a use case and call its methods:

```ts
// In a container:
const usecase = new ProtocolsUsecase(dispatch);
usecase.loadAll(slug);           // fetches protocol + reviews + threads
usecase.createReview(slug, {…});
usecase.deleteReview(id);
```

This keeps containers free of dispatch boilerplate and makes every action's intent explicit. Use cases can also coordinate cross-slice side effects — `ThreadsUsecase.createThread` for example dispatches both the thread creation AND prepends the new thread into the parent protocol's thread list.

---

### 5. Components

Purely presentational. Components receive data and callbacks via props and never touch the store directly.

**`ui/`** — generic design-system atoms with no domain knowledge: Avatar, Stars, Spinner, Modal, Tag, VoteButtons, Skeleton, EmptyState, CardSkeleton.

**`protocols/`** — ProtocolCard, ProtocolList, ReviewForm, ProtocolStats.

**`threads/`** — ThreadCard, ThreadList, NewThreadForm.

**`comments/`** — CommentNode (recursive), NewCommentForm.

**`search/`** — FilterHeader (search bar + sort bar combined), SearchBar, SortBar.

**`layout/`** — Navbar, PageShell (max-width wrapper), TwoColumnLayout (main + sticky sidebar grid).

**`auth/`** — AuthShell (shared card + branding wrapper for auth pages).

#### CommentNode — recursive rendering

Comments support arbitrary nesting. `CommentNode` renders itself recursively for each reply array. `MAX_DEPTH = 4` caps the visual indentation, and each depth level gets a distinct border color from `DEPTH_COLORS` in `utils/helpers.ts`.

---

### 6. Containers (Pages)

Containers are the route targets. They are the only components allowed to read from the Redux store via selectors and to call use cases. They compose components and pass data down as props.

| Container | Route | Responsibility |
|---|---|---|
| `HomePage` | `/` | Protocol list with search, sort, and pagination |
| `ProtocolDetailPage` | `/protocols/:slug` | Full protocol view — content, threads tab, reviews tab, modals |
| `NewProtocolPage` | `/protocols/new` | Protocol creation form |
| `LoginPage` | `/login` | Authentication form |

---

## Data Flow

### Reading data (list page)

```
HomePage mounts
  → useEffect calls ProtocolsUsecase.execute(params)
    → dispatches fetchProtocols thunk
      → protocolActions.fetchProtocolsStart()  →  listLoading: true
      → extra.protocolRepository.getProtocols(params)
        → ProtocolDatasource  →  GET /api/protocols
      → protocolActions.fetchProtocolsSuccess({ items, meta })
  → useAppSelector(selectProtocolList) returns items
  → ProtocolList renders ProtocolCard for each item
```

### Writing data (submit a review)

```
ReviewForm.onSubmit fires
  → ProtocolDetailPage.handleReviewSubmit(data)
    → ProtocolsUsecase.createReview(slug, payload)
      → dispatches createReview thunk
        → protocolActions.addReviewStart()
        → extra.protocolRepository.createReview(protocolId, payload)
          → POST /api/protocols/:id/reviews
        → protocolActions.addReviewSuccess(review)   ← upserts into reviews[]
  → useEffect watches reviewSucceeded → renders success state
```

---

## Search Strategy

The app uses a **dual-source search strategy** controlled by whether a query string is present.

**Browse mode (no query)** — data comes from the Laravel API through Redux. Supports server-side pagination via the `page` and `per_page` params. Results are stored in the `protocols` slice.

**Search mode (with query)** — the frontend queries **Typesense directly** using a search-only API key (`VITE_TYPESENSE_SEARCH_KEY`). Results bypass Redux entirely and live in local component state. This gives instant, typo-tolerant results without a backend round-trip.

```ts
const isSearching = !!debouncedQuery;
const protocols   = isSearching ? tsHits    : dbProtocols;
const loading     = isSearching ? tsLoading : dbLoading;
```

`useDebounce` (300 ms) prevents a Typesense request on every keystroke.

Because both `Protocol` (API shape) and `TypesenseHit<TypesenseProtocolDocument>` (Typesense shape) are valid list items, the `isHit()` type guard in `utils/helpers.ts` is used in every component that handles both:

```ts
const authorName = isHit(protocol)
  ? protocol.document.author_name
  : protocol.author?.name;
```

---

## State Management

| Concern | Where |
|---|---|
| Server data (protocols, threads, reviews, comments) | Redux slices |
| Auth token and current user | Redux — persisted to `localStorage` |
| Typesense search results | Local `useState` inside `HomePage` |
| UI state (active tab, modal open/closed, form values) | Local `useState` in containers or components |
| Derived/computed values | Selector functions in `data/store/selectors/` |

---

## Routing

**React Router v7** (`react-router` package). Routes are declared in `App.tsx`:

```
/                     →  HomePage
/protocols/new        →  NewProtocolPage
/protocols/:slug      →  ProtocolDetailPage
/login                →  LoginPage
```

The navbar links to `/threads`, `/search`, and `/register` — route entries for these can be added to `App.tsx` as those pages are built out.

---

## Styling

**Tailwind CSS v4** with a custom theme in `tailwind.config.ts`.

**Color tokens**
- `stone` — neutral backgrounds and text
- `sage` — primary brand green (buttons, active states, accents)
- `amber-400` — star ratings

**Component classes** defined in `src/index.css` under `@layer components`:
`.card`, `.card-hover`, `.btn-primary`, `.btn-ghost`, `.btn-vote-up`, `.btn-vote-down`, `.input`, `.textarea`, `.tag`

**Animation utilities**: `animate-fade-up`, `animate-fade-in`, `animate-slide-in`, `animate-pulse-soft` with stagger delay classes `.stagger-1` through `.stagger-5` for cascading list animations.

`clsx` is used throughout for conditional and composed class strings.

---

## Conventions and Patterns

**File naming** — `kebab-case.tsx` for components, `kebab-case.hook.ts` for hooks, `kebab-case.usecase.ts` for use cases, `kebab-case.model.ts` for type files.

**Barrel exports** — every folder has an `index.ts` that re-exports all public members, keeping import paths short: `import { Stars } from '../ui'`.

**Error handling** — datasources always throw a `WellnessPlatformErrors.DomainError` subclass. Thunks catch these and dispatch failure actions with `err.message`. Components read error strings from selectors and display them inline.

**`isHit()` type guard** — required in any component that can receive either a direct API object or a Typesense hit. Never assume which shape is present; always guard first.

**`stringToArray` / `arrayToString`** — helpers in `utils/helpers.ts` for converting between comma-separated tag strings (form inputs) and `string[]` (API payloads).

**Soft deletes on comments** — deleting a comment marks it `is_deleted: true` and replaces `body` with `"[deleted]"` in the Redux tree. `CommentNode` renders a placeholder style for deleted comments while keeping their replies intact and visible.

**Auth token flow** — the Axios instance reads `auth_token` from `localStorage` on every request via a request interceptor. redux-persist keeps the Redux `auth` slice in sync so the token survives page refreshes without re-login.

**Typed `ThunkApi`** — defined in `store-setup.ts` and used as the third generic on every `createAsyncThunk`. It types both `dispatch` and `extra` (the repository bag) so thunks get full autocomplete and type safety.
