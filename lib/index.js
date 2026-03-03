/**
 * @import {Root} from 'mdast'
 * @import {Options} from 'remark-gfm'
 * @import {} from 'remark-parse'
 * @import {} from 'remark-stringify'
 * @import {Processor} from 'unified'
 * @import {Extension as FromMarkdownExtension} from 'mdast-util-from-markdown'
 * @import {Options as ToMarkdownExtension} from 'mdast-util-to-markdown'
 */

/**
 * * @typedef {import('micromark-util-types').Extension} Extension
 */

import {
  gfmFootnoteFromMarkdown,
  gfmFootnoteToMarkdown
} from 'mdast-util-gfm-footnote'
import {
  gfmStrikethroughFromMarkdown,
  gfmStrikethroughToMarkdown
} from 'mdast-util-gfm-strikethrough'
import {gfmTableFromMarkdown, gfmTableToMarkdown} from 'mdast-util-gfm-table'
import {
  gfmTaskListItemFromMarkdown,
  gfmTaskListItemToMarkdown
} from 'mdast-util-gfm-task-list-item'
import {gfmTaskListItem} from 'micromark-extension-gfm-task-list-item'
import {gfmTable} from 'micromark-extension-gfm-table'
import {gfmStrikethrough} from 'micromark-extension-gfm-strikethrough'
import {gfmFootnote} from 'micromark-extension-gfm-footnote'
import {combineExtensions} from 'micromark-util-combine-extensions'

/** @type {Options} */
const emptyOptions = {}

/**
 * Create an extension for `mdast-util-from-markdown` to enable GFM (footnotes, strikethrough, tables, tasklists).
 *
 * @returns {Array<FromMarkdownExtension>}
 *   Extension for `mdast-util-from-markdown` to enable GFM (footnotes, strikethrough, tables, tasklists).
 */
function gfmFromMarkdown() {
  return [
    gfmFootnoteFromMarkdown(),
    gfmStrikethroughFromMarkdown(),
    gfmTableFromMarkdown(),
    gfmTaskListItemFromMarkdown()
  ]
}

/**
 * Create an extension for `mdast-util-to-markdown` to enable GFM (footnotes, strikethrough, tables, tasklists).
 *
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns {ToMarkdownExtension}
 *   Extension for `mdast-util-to-markdown` to enable GFM (footnotes, strikethrough, tables, tasklists).
 */
function gfmToMarkdown(options) {
  return {
    extensions: [
      gfmFootnoteToMarkdown(options),
      gfmStrikethroughToMarkdown(),
      gfmTableToMarkdown(options),
      gfmTaskListItemToMarkdown()
    ]
  }
}

/**
 * Create an extension for `micromark` to enable GFM syntax.
 *
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 *
 *   Passed to `micromark-extens-gfm-strikethrough`.
 * @returns {Extension}
 *   Extension for `micromark` that can be passed in `extensions` to enable GFM
 *   syntax.
 */

function gfm(options) {
  return combineExtensions([
    gfmFootnote(),
    gfmStrikethrough(options),
    gfmTable(),
    gfmTaskListItem()
  ])
}

/**
 * Add support GFM (footnotes, strikethrough, tables, tasklists).
 *
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns {undefined}
 *   Nothing.
 */

export default function remarkGfm(options) {
  // @ts-expect-error: TS is wrong about `this`.
  // eslint-disable-next-line unicorn/no-this-assignment
  const self = /** @type {Processor<Root>} */ (this)
  const settings = options || emptyOptions
  const data = self.data()

  const micromarkExtensions =
    data.micromarkExtensions || (data.micromarkExtensions = [])
  const fromMarkdownExtensions =
    data.fromMarkdownExtensions || (data.fromMarkdownExtensions = [])
  const toMarkdownExtensions =
    data.toMarkdownExtensions || (data.toMarkdownExtensions = [])

  micromarkExtensions.push(gfm(settings))
  fromMarkdownExtensions.push(gfmFromMarkdown())
  toMarkdownExtensions.push(gfmToMarkdown(settings))
}
