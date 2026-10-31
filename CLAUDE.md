# Chalk & Chats: Wix Velo site repo

This repo is connected to a Wix site via Git Integration. It holds **code only**. Page layout,
elements and styling live in Wix's editor and are NOT in this repo.

## Rules

- Package manager is **pnpm**. Don't use npm/yarn. Don't edit `wix.lock` or `.wix/`.
- Never rename or delete files in `src/pages/`; the `name.<id>.js` filename links the file to a
  Wix page. New pages must be created in the Wix editor, then synced.
- Import shared code as `public/...` and `backend/...`, not relative paths.
- Web module permissions are set in `src/backend/permissions.json`, not in the editor.
- Page code uses the Velo `$w` API (no JSX, no bundler, no React). React is a leftover
  devDependency and is unused.
- Pushing to `main` updates the live site's code. Work on a feature branch and open a PR.
  Do not push to `main` directly.

## Commands

- `pnpm dev`: Local Editor (needs Wix login)
- `pnpm lint`, `pnpm format:check` (`pnpm format` to fix)
- `pnpm build:embeds`: builds `embeds/dist/global.css`

## Embeds

`embeds/` holds hand-written CSS/HTML that is manually pasted into Wix (Settings → Custom Code
or an HTML embed element). See `embeds/README.md`. HTML embeds are iframes and don't inherit
global CSS.

## Editor read-only mode

While connected, the Wix online editor is read-only for code but design changes still work.
Design changes only reach this repo when someone clicks Save in the Local Editor, which bumps
`uiVersion` in `wix.config.json`.
