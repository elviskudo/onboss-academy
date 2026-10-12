## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Content (MDX)

Chapters live at `src/content/chapters/{langId}/NN-slug.mdx`. Schema: `title, description, order, quiz[{q,options,answer,explain}], example{code}`.

Hard rules (violations = 500 on the page):

- **Never write MDX through an unquoted shell heredoc** — backticks get eaten by command substitution. Use the Write tool or Python.
- Every file using `<TryIt>` needs `import TryIt from '../../../components/TryIt.astro';` as the FIRST line after frontmatter, preceded by a blank line.
- `<TryIt>` props: `lang`, `runtime`, `pistonName` (see `src/data/languages.ts`), `code={`...`}` — the template literal MUST have a matching closing backtick before `} />`.
- Quiz `answer` is the 0-based option index; vary indices (don't make everything `0`).
- Quote every quiz option string in YAML — bare `12`/`null`/`Error` parse as number/null/object and fail the schema.

Validate before finishing:

```
python3 scripts/check_content.py
npx astro build
```
