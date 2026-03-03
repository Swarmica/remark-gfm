import type {Options as MicromarkOptions} from 'micromark-extension-gfm'

export {default} from './lib/index.js'

export interface FootnoteOptions {
  // To do: next major: change default.
  /**
   * Use a blank line for the first line of footnote definitions
   * (boolean, default: false).
   */
  firstLineBlank?: boolean | null | undefined
}

export interface TableOptions {
  tableCellPadding?: boolean | null | undefined
  tablePipeAlign?: boolean | null | undefined
  stringLength?: ((value: string) => number) | null | undefined
}

export interface MdastOptions extends FootnoteOptions, TableOptions {}

/**
 * Configuration for `remark-gfm`.
 *
 * Currently supports `singleTilde` as a parse option and
 * `firstLineBlank`, `stringLength`, `tableCellPadding`, and `tablePipeAlign`
 * as serialization options.
 */
export interface Options extends MicromarkOptions, MdastOptions {}
