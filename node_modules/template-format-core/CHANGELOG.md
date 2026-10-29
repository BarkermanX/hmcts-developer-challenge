# Changelog

## 0.2.0 - 2026-09-13

### Shared embedded-language safety

* Add dialect-neutral placeholder planning and HTML language/boundary APIs, plus an optional `template-format-core/prettier` adapter. Root imports do not load Prettier. Source-consumption builds are supported through `prepare`.
* Keep JS/CSS embedding conservative: validate template substitution contexts and alternative Doc layouts, preserve caller parser behavior, and retain exact source on fallback.
* Add Prettier 3 compatibility tests and keep the Prettier peer optional for neutral core imports.
* See `docs/shared-embedding.md`, [implementation PR #3](https://github.com/Poliklot/template-format-core/pull/3), and Poliklot/template-format-core#2 for the coordinated dependency and release gates.

## 0.1.1 - 2026-06-03

- Added `typesVersions` so subpath imports resolve under classic TypeScript `moduleResolution: "node"`.

## 0.1.0 - 2026-06-03

- Initial public core package.
- Added source range helpers.
- Added HTML-ish tag metadata.
- Added whitespace helpers.
- Added template expression tokenization helpers.
- Added template dialect contracts for parser/printer integrations.
