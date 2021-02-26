/* eslint-disable no-continue, no-loop-func, no-cond-assign */
import { trex } from '@xstyled/util'
import { mediaGetters } from './mediaGetters'
import { propGetters } from './propGetters'

// prop name is an ident: word chars, underscore and dash.
const PROP_CHAR = trex('s')`[-\w]`

// prop value consists of non-semis unless backslash-escaped.
const VALUE_CHAR = trex('s')`(?:\\.|[^\\;])`

const PROP_REGEXP = trex('gsx')`
  (${PROP_CHAR}+)    # capture prop name
  (\s*:\s*)          # colon & whitespace
  (?=\S)             # prop value starts with non-whitespace
  (${VALUE_CHAR}*?)  # capture prop value (non-greedy)
  (\s*!important)?   # capture !important
  (\s*;)             # semi & whitespace
`

// simplistic but workable media query value.
const MEDIA_CHAR = trex('s')`[^{]`

const MEDIA_REGEXP = trex('gsx')`
  (@media\b\s*)      # start of media query
  (?=\S)             # value starts with non-whitespace
  (${MEDIA_CHAR}+?)  # capture queries (non-greedy)
  (\s*\{)            # brace & whitespace
`

const MATCH_REGEXP = trex('gsx')`
  (?:${PROP_REGEXP}|${MEDIA_REGEXP})
`

export function transform(rawValue: any) {
  if (typeof rawValue !== 'string') return rawValue
  let matches
  let lastIndex = 0
  const values = []
  while ((matches = MATCH_REGEXP.exec(rawValue))) {
    const [, prop, colon, value, imp, semi, media, query, brace] = matches
    if (media) {
      values.push(rawValue.slice(lastIndex, matches.index))
      values.push(media)
      mediaTransform(query).forEach((v) => values.push(v))
      values.push(brace)
      lastIndex = matches.index + matches[0].length
    } else {
      const getter = (propGetters as any)[prop]
      if (getter) {
        values.push(rawValue.slice(lastIndex, matches.index))
        values.push(
          (p: object) =>
            `${prop}${colon}${getter(value)(p)}${imp || ''}${semi}`,
        )
        lastIndex = matches.index + matches[0].length
      }
    }
  }
  values.push(rawValue.slice(lastIndex, rawValue.length))
  return values
}

// media query prop/value pairs such as (min-width: 1024px)
const QUERY_REGEXP = trex('gsx')`
  (\(\s*)            # open paren, whitespace
  (${PROP_CHAR}+)    # capture prop name
  (\s*:\s*)          # colon & whitespace
  ([^\)]*?)          # capture prop value (non-greedy)
  (\s*\))            # close paren, whitespace
`

function mediaTransform(rawValue: string) {
  let matches
  let lastIndex = 0
  const values = []
  while ((matches = QUERY_REGEXP.exec(rawValue))) {
    const [, open, prop, colon, value, close] = matches
    const getter = (mediaGetters as any)[prop]
    if (getter) {
      values.push(rawValue.slice(lastIndex, matches.index))
      values.push(
        (p: object) => `${open}${prop}${colon}${getter(value)(p)}${close}`,
      )
      lastIndex = matches.index + matches[0].length
    }
  }
  values.push(rawValue.slice(lastIndex, rawValue.length))
  return values
}
