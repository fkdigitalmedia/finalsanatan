# Performance Checklist

Run before every release. Nothing here changes behaviour; each item is a guard.

## Frontend

- [ ] No new top-level import of a heavy library in a route file (charts, PDF, maps) —
      load it with `React.lazy` / dynamic `import()` behind `<ClientOnly>`.
- [ ] Route components are **not** exported from route files (breaks code splitting).
- [ ] Images: explicit `width`/`height`, `loading="lazy"` below the fold, `decoding="async"`.
- [ ] The LCP image (and only it) is preloaded in that route's `head().links` with
      `fetchpriority="high"`.
- [ ] Fonts: `font-display: swap`, preconnect to the font origin, subset where possible.
- [ ] Lists longer than ~100 rows are paginated or virtualised.

## React

- [ ] Expensive derivations wrapped in `useMemo`; callbacks passed to memoised children in
      `useCallback`.
- [ ] `React.memo` on pure leaf components that render inside frequently updating parents.
- [ ] No object/array literal passed as a context value without memoisation.
- [ ] Search/autocomplete inputs are debounced (250–350 ms).

## Data

- [ ] Every list query is paginated and projects explicit columns.
- [ ] Read-mostly config goes through `cache("config")`.
- [ ] Repeated identical loads use `remember()` so they coalesce.
- [ ] New filter+sort combination has a matching composite index.

## API

- [ ] New read routes declare `cacheTtlMs` and `cacheTags` when the data is shareable.
- [ ] Private data routes declare `minRole` (which switches the cache key to per-user).
- [ ] Response payloads stay lean — no accidental full-row dumps.

## Server

- [ ] No blocking work in SSR that could run client-side after hydration.
- [ ] Heavy work (PDF, AI, bulk email) runs through a queue, not inside a request.
- [ ] Server functions read `process.env` inside `.handler()`, never at module scope.
- [ ] `.functions.ts` files stay thin — helpers live in `.server.ts` modules.

## Verification

- [ ] `bunx vitest run` — full suite green.
- [ ] Typecheck clean.
- [ ] Admin → System → Performance: no budget in `critical`.
- [ ] `/api/public/status` returns `ok` for every component.
- [ ] Lighthouse on the **published** URL (not the preview iframe):
      Performance ≥ 95, Accessibility ≥ 95, Best Practices 100, SEO 100.
