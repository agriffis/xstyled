/* eslint-disable no-continue, no-loop-func, no-cond-assign */
import { trex } from '@xstyled/util'
import { propGetters } from './propGetters'

const PROP_REGEXP = trex('gx')`
  (\s*)              # leading whitespace
  ([^&{}:;\n]+)      # property name
  :\s*               # colon, whitespace
  ([^&{}:;\n]+)      # property value
  (\s*);             # trailing whitespace, semicolon
`

const IMPORTANT_REGEXP = trex('x')`
  \s*!important\s*   # important flag, surrounding whitespace
`

export function transform(rawValue: any) {
  if (typeof rawValue !== 'string') return rawValue
  let matches
  let lastIndex = 0
  const values = []
  while ((matches = PROP_REGEXP.exec(rawValue))) {
    const [, start, prop, propValue, end] = matches
    const getter = (propGetters as any)[prop]
    if (getter) {
      const hasImportant = IMPORTANT_REGEXP.test(propValue)
      const cleanValue = propValue.replace(IMPORTANT_REGEXP, '')
      values.push(rawValue.slice(lastIndex, matches.index))
      values.push(
        (p: object) =>
          `${start}${prop}: ${getter(cleanValue)(p)}${
            hasImportant ? ' !important' : ''
          };${end}`,
      )
      lastIndex = matches.index + matches[0].length
    }
  }
  values.push(rawValue.slice(lastIndex, rawValue.length))
  return values
}
