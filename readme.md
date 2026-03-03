# Swarmica remark-gfm

This is a fork of remark-gfm

Plugin to support [GFM][] (footnotes, strikethrough, tables, tasklists).

## Install

```sh
npm i @swarmica/remark-gfm
```

## Use

Say our document `example.md` contains:

```markdown
# GFM

## Footnote

A note[^1]

[^1]: Big note.

## Strikethrough

~one~ or ~~two~~ tildes.

## Table

| a | b  |  c |  d  |
| - | :- | -: | :-: |

## Tasklist

* [ ] to do
* [x] done
```

…and our module `example.js` contains:

```js
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {read} from 'to-vfile'
import {unified} from 'unified'

const file = await unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeStringify)
  .process(await read('example.md'))

console.log(String(file))
```

…then running `node example.js` yields:

```html
<h1>GFM</h1>
<h2>Footnote</h2>
<p>A note<sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref aria-describedby="footnote-label">1</a></sup></p>
<h2>Strikethrough</h2>
<p><del>one</del> or <del>two</del> tildes.</p>
<h2>Table</h2>
<table>
<thead>
<tr>
<th>a</th>
<th align="left">b</th>
<th align="right">c</th>
<th align="center">d</th>
</tr>
</thead>
</table>
<h2>Tasklist</h2>
<ul class="contains-task-list">
<li class="task-list-item"><input type="checkbox" disabled> to do</li>
<li class="task-list-item"><input type="checkbox" checked disabled> done</li>
</ul>
<section data-footnotes class="footnotes"><h2 class="sr-only" id="footnote-label">Footnotes</h2>
<ol>
<li id="user-content-fn-1">
<p>Big note. <a href="#user-content-fnref-1" data-footnote-backref class="data-footnote-backref" aria-label="Back to content">↩</a></p>
</li>
</ol>
</section>
```

## API

This package exports no identifiers.
The default export is [`remarkGfm`][api-remark-gfm].

### `unified().use(remarkGfm[, options])`

Add support GFM (footnotes, strikethrough, tables, tasklists).

###### Parameters

* `options` ([`Options`][api-options], optional)
  — configuration

###### Returns

Nothing (`undefined`).

### `Options`

Configuration (TypeScript type).

###### Fields

* `firstLineBlank` (`boolean`, default: `false`)
  — serialize with a blank line for the first line of footnote definitions
* `stringLength` (`((value: string) => number)`, default: `d => d.length`)
  — detect the size of table cells, used when aligning cells
* `singleTilde` (`boolean`, default: `true`)
  — whether to support strikethrough with a single tilde;
  single tildes work on github.com, but are technically prohibited by GFM;
  you can always use 2 or more tildes for strikethrough
* `tablePipeAlign` (`boolean`, default: `true`)
  — whether to align table pipes
* `tableCellPadding` (`boolean`, default: `true`)
  — whether to add a space of padding between table pipes and cells

## Examples

### Example: `singleTilde`

To turn off support for parsing strikethrough with single tildes, pass
`singleTilde: false`:

```js
// …

const file = await unified()
  .use(remarkParse)
  .use(remarkGfm, {singleTilde: false})
  .use(remarkRehype)
  .use(rehypeStringify)
  .process('~one~ and ~~two~~')

console.log(String(file))
```

Yields:

```html
<p>~one~ and <del>two</del></p>
```

### Example: `stringLength`

It’s possible to align tables based on the visual width of cells.
First, let’s show the problem:

```js
import {remark} from 'remark'
import remarkGfm from 'remark-gfm'

const input = `| Alpha | Bravo |
| - | - |
| 中文 | Charlie |
| 👩‍❤️‍👩 | Delta |`

const file = await remark().use(remarkGfm).process(input)

console.log(String(file))
```

The above code shows how remark can be used to format markdown.
The output is as follows:

```markdown
| Alpha    | Bravo   |
| -------- | ------- |
| 中文       | Charlie |
| 👩‍❤️‍👩 | Delta   |
```

To improve the alignment of these full-width characters and emoji, pass a
`stringLength` function that calculates the visual width of cells.
One such algorithm is [`string-width`][string-width].
It can be used like so:

```diff
@@ -1,5 +1,6 @@
 import {remark} from 'remark'
 import remarkGfm from 'remark-gfm'
+import stringWidth from 'string-width'

@@ -10,7 +11,7 @@ async function main() {
 | 👩‍❤️‍👩 | Delta |`

-const file = await remark().use(remarkGfm).process(input)
+const file = await remark()
+  .use(remarkGfm, {stringLength: stringWidth})
+  .process(input)

   console.log(String(file))
```

The output of our code with these changes is as follows:

```markdown
| Alpha | Bravo   |
| ----- | ------- |
| 中文  | Charlie |
| 👩‍❤️‍👩    | Delta   |
```

## Bugs

For bugs present in GFM but not here, or other peculiarities that are
supported, see each corresponding readme:

* [footnote](https://github.com/micromark/micromark-extension-gfm-footnote#bugs)
* strikethrough: n/a
* [table](https://github.com/micromark/micromark-extension-gfm-table#bugs)
* tasklists: n/a

## Authoring

For recommendations on how to author GFM, see each corresponding readme:

* [footnote](https://github.com/micromark/micromark-extension-gfm-footnote#authoring)
* [strikethrough](https://github.com/micromark/micromark-extension-gfm-strikethrough#authoring)
* [table](https://github.com/micromark/micromark-extension-gfm-table#authoring)
* [tasklists](https://github.com/micromark/micromark-extension-gfm-task-list-item#authoring)

## HTML

This plugin does not handle how markdown is turned to HTML.
See [`remark-rehype`][remark-rehype] for how that happens and how to change it.

## CSS

For info on how GitHub styles these features, see each corresponding readme:

* [footnote](https://github.com/micromark/micromark-extension-gfm-footnote#css)
* [strikethrough](https://github.com/micromark/micromark-extension-gfm-strikethrough#css)
* [table](https://github.com/micromark/micromark-extension-gfm-table#css)
* [tasklists](https://github.com/micromark/micromark-extension-gfm-task-list-item#css)

## Syntax

For info on the syntax of these features, see each corresponding readme:

* [footnote](https://github.com/micromark/micromark-extension-gfm-footnote#syntax)
* [strikethrough](https://github.com/micromark/micromark-extension-gfm-strikethrough#syntax)
* [table](https://github.com/micromark/micromark-extension-gfm-table#syntax)
* [tasklists](https://github.com/micromark/micromark-extension-gfm-task-list-item#syntax)

## Syntax tree

For info on the syntax tree of these features, see each corresponding readme:

* [footnote](https://github.com/syntax-tree/mdast-util-gfm-footnote#syntax-tree)
* [strikethrough](https://github.com/syntax-tree/mdast-util-gfm-strikethrough#syntax-tree)
* [table](https://github.com/syntax-tree/mdast-util-gfm-table#syntax-tree)
* [tasklists](https://github.com/syntax-tree/mdast-util-gfm-task-list-item#syntax-tree)

## Types

This package is fully typed with [TypeScript][].
It exports the additional type [`Options`][api-options].

The node types are supported in `@types/mdast` by default.

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line, `remark-gfm@^4`, compatible
with Node.js 16.

This plugin works with `remark-parse` version 11+ (`remark` version 15+).
The previous version (v3) worked with `remark-parse` version 10 (`remark`
version 14).
Before that, v2 worked with `remark-parse` version 9 (`remark` version 13).
Earlier versions of `remark-parse` and `remark` had a `gfm` option that enabled
this functionality, which defaulted to true.

## Security

Use of `remark-gfm` does not involve **[rehype][]** ([hast][]) or user
content so there are no openings for [cross-site scripting (XSS)][wiki-xss]
attacks.

## Related

* [`remark-github`][remark-github]
  — link references to commits, issues, PRs, and users
* [`remark-breaks`][remark-breaks]
  — support breaks without needing spaces or escapes (enters to `<br>`)
* [`remark-frontmatter`][remark-frontmatter]
  — support frontmatter (YAML, TOML, and more)
* [`remark-directive`](https://github.com/remarkjs/remark-directive)
  — support directives
* [`remark-math`](https://github.com/remarkjs/remark-math)
  — support math
* [`remark-mdx`](https://github.com/mdx-js/mdx/tree/main/packages/remark-mdx)
  — support MDX (ESM, JSX, expressions)

## License

[MIT][license]

<!-- Definitions -->

[api-options]: #options

[api-remark-gfm]: #unifieduseremarkgfm-options

[gfm]: https://github.github.com/gfm/

[hast]: https://github.com/syntax-tree/hast

[license]: license

[rehype]: https://github.com/rehypejs/rehype

[remark-breaks]: https://github.com/remarkjs/remark-breaks

[remark-frontmatter]: https://github.com/remarkjs/remark-frontmatter

[remark-github]: https://github.com/remarkjs/remark-github

[remark-rehype]: https://github.com/remarkjs/remark-rehype

[string-width]: https://github.com/sindresorhus/string-width

[typescript]: https://www.typescriptlang.org

[wiki-xss]: https://en.wikipedia.org/wiki/Cross-site_scripting
