# Shared embedding: local validation

This initial validation snapshot was recorded before the candidate branches were published. It covers locally packed core and plugin artifacts. See the linked tracking issues and implementation PRs for current dependency pins and remote CI results; this snapshot does not assert release readiness.

## Test results

| Package | Full local tests | Fuzz cases |
|---|---:|---:|
| template-format-core | 36 | — |
| Mustache | 318 | 431 |
| Handlebars | 348 | 431 |
| Nunjucks | 56 | 426 |

All listed tests passed, with no skipped tests. Consumer package-content checks passed.

Installed-package checks used the actual packed core and three plugins across Node 18/20/22 and Prettier 3.0.0/3.3.3/3.6.2/3.9.6: **48/48 package/configuration runs passed**. Each combination ran all core, Mustache and Nunjucks tests and the 22 Handlebars shared-embedding regressions. The full 348-test Handlebars suite was run locally, not claimed as fully matrix-tested.

The root core package and CommonJS declarations were consumed without its optional Prettier peer. The opt-in adapter and Doc declarations were also consumed with Prettier 3.0.0.

## Real-world corpus and output review

| Corpus | Files | Formatting errors | Non-idempotent files | Changed first-pass outputs |
|---|---:|---:|---:|---:|
| Mustache | 6,251 | 0 | 0 | 0 versus reviewed 0.2.1 tree |
| Classic Handlebars | 1,184 | 0 | 0 | 28 versus published 0.4.0 |
| Handlebars Glimmer/Ember stress (non-target syntax) | 179 | 0 | 0 | Not differential-tested |
| Nunjucks | 1,151 | 0 | 2 existing in published 0.2.0 | 31 versus published 0.2.0 |

The two Nunjucks failures have byte-identical candidate/baseline first-pass outputs and reproduce on both versions. They are tracked separately in [Nunjucks #27](https://github.com/Poliklot/prettier-plugin-nunjucks/issues/27), not skipped or counted as a green corpus run.

All 31 Nunjucks output differences and 27 of 28 Handlebars differences are confined to raw regions. The remaining Handlebars `crisp/partials/comments.hbs` case restores a previously flattened script containing line comments and corrects surrounding element indentation; its new script body is exact source and its second pass is stable.

Review of changed script/style bodies found source-preserving fallback changes plus four static JavaScript bodies that now use native Doc/comment formatting. One Nunjucks file has JS front matter with a literal `<script>` comment; region comparison must exclude front matter before interpreting HTML. Its actual output changes are exact-source fallback inside importmap/style/module bodies, not a front-matter rewrite.

This is bounded regression evidence, not a proof of all runtime template values, all browser HTML tree repair, arbitrary custom parsers, or unsupported template dialects.

## Remaining integration gates

1. Record the published core candidate commit and its implementation PR.
2. Pin consumer integration dependencies and locks to the exact core candidate commit, and verify fresh dependency installation. Local tests currently use an explicitly installed candidate tarball; the unchanged registry range alone does not reproduce them.
3. Commit/push consumers and create cross-linked **draft** PRs. Link each child issue and the parent core PR.
4. Review/merge/release core first under its repository's publishing rules. Replace integration pins with the published registry version and regenerate locks before consumers become ready.
5. Run remote CI/CodeQL and installed-package checks against the final dependency state. No merge or npm publication is authorized by this report.
