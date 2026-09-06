# Blog-2.0 — project instructions

## Context and documentation
- This is an Astro portfolio and blog in English, Spanish and Japanese.
- Read [README.md](README.md) for setup and commands, and [docs/architecture.md](docs/architecture.md) before changing boundaries.
- For visual changes, consult [design.md](design.md). Preserve the existing visual language unless a redesign is requested.
- This file is the shared project contract for AI tools. Tool-specific files should only adapt/link to it, not duplicate rules.

## Development
- Use Node from `.nvmrc` and the exact Bun version in `package.json`. Install with `bun install --frozen-lockfile`; maintain only `bun.lock`.
- Prefer Astro for static rendering; add React hydration only for actual interactivity. This project is not Next.js.
- Keep related UI and behavior together. Do not introduce empty Domain/Application/Infrastructure layers or bulk-move `src` to imitate a template.
- Existing content collections use `src/content/config.ts`. Migrate APIs only as an explicit, separately tested change.
- Use `src/services/i18n.ts` and `src/i18n/translations.ts` for shared translations; keep feature-specific copy near its feature.
- `src/server/` owns external server adapters and secrets; `src/client/` owns browser adapters. Browser imports must never reach `src/server/`.
- `src/features/comments/` owns provider-neutral rules/use cases and the repository contract. Routes map HTTP; server adapters implement persistence. Neither may import UI components.
- Use `src/features/blog/routes.ts` for article URLs, language alternates and comment identities. Comment keys must never be derived from normalized URLs.
- Keep `src/data/blog-legacy-routes.json` as the compatibility ledger; do not delete redirects or rename existing content files without a migration plan. Preserve content and hidden project state.

## Validation and delivery
- Run `bun run check`, `bun run test:unit`, `bun run build`, `bun run test:build` and `bun run test:e2e` for repository-wide changes. `bun run test` runs unit + E2E; build-artifact checks require a fresh build.
- Test browser-visible behavior, not incidental styling classes. Mock external submissions; never send test contact messages or write to production Supabase.
- Check affected pages in all three languages and at mobile/desktop widths for UI changes. Automated tests do not replace visual or deployment verification.
- Keep documentation, validation setup, and behavioral refactors in separately reviewable units; aim for no more than 20 files per unit.
- Do not create branches, worktrees, commits, pushes or deployments without explicit user authorization. Preserve unrelated changes.
- Report exact checks and remaining limitations; do not claim a build validates the deployed API integrations.

## Design and tooling
- `src/styles/editorial.css` is an ordered import manifest. Preserve layer and rule order when splitting CSS; keep responsive overrides after the rules they override.
- `tokens.css` is active; `design.md` and `.hallmark/` preserve design context. Do not remove them as generic AI clutter.
- Tracked Claude/OpenCode tooling and root skill links have been retired. Any ignored `.claude/` or `.agents/` content is private/local, not a project build prerequisite.
- Do not recreate vendor-specific instruction copies. Add an adapter to this file only when a tool actually needs one.
