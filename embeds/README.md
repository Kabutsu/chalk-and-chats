# Embeds

Hand-written HTML/CSS that is **pasted into Wix**; Wix does not read this folder.

- `css/*.css` – global styles. `pnpm build:embeds` concatenates them (in filename order) into
  `dist/global.css`. Paste that into Wix: Settings → Custom Code → add `<style>…</style>` in
  the Head, applied to All pages.
- `html/*.html` – self-contained sections for an HTML embed element. An HTML embed is an
  iframe, so it does NOT inherit the global CSS; give each file its own `<style>`.

After changing anything here, re-paste the result into Wix and note it in the PR.
