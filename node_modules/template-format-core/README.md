# template-format-core

Shared core utilities for template-formatting plugins.

This package is intentionally dialect-neutral. It provides source range helpers, HTML-ish tag metadata, whitespace helpers, template expression tokenization, and dialect contracts that formatter plugins can build on.

## Install

```sh
npm install template-format-core
```

## Modules

```ts
import { normalizeInput, withRange } from 'template-format-core/source';
import { voidElements } from 'template-format-core/html/tags';
import { normalizeInlineText } from 'template-format-core/text/whitespace';
import { parseTemplateExpression } from 'template-format-core/template/expression';
import type { TemplateDialect } from 'template-format-core/template/dialect';
```

The root export also re-exports all public modules:

```ts
import { parseTemplateExpression, type TemplateDialect } from 'template-format-core';
```

## Intended consumers

- `@poliklot/prettier-plugin-handlebars`
- future `prettier-plugin-mustache`

## Release

Publishing is manual:

```sh
npm publish --access public
```

## Shared embedding work

See [shared embedding architecture and cross-repository dependencies](docs/shared-embedding.md). This source work depends on [the core tracking issue](https://github.com/Poliklot/template-format-core/issues/2).
