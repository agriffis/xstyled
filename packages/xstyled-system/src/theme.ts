import { Screens, States, Props } from './types'
import { mediaMinWidth, getBreakpointMin } from './media'
import { XCache } from './cache'
import { DEV, warn } from '@xstyled/util'

type PropsScreens<T extends Props> = T['theme'] extends { screens: Screens }
  ? T['theme']['screens']
  : Screens

export const getScreens = <T extends Props>(props: T): PropsScreens<T> => {
  return (props.theme && props.theme.screens
    ? props.theme.screens
    : {}) as PropsScreens<T>
}

type PropsStates<T extends Props> = T['theme'] extends { states: States }
  ? T['theme']['states']
  : Screens

export const getStates = <T extends Props>(props: T): PropsStates<T> => {
  const states = (
    props.theme && props.theme.states ? props.theme.states : {}
  ) as PropsStates<T>

  // Warn if at-rules aren't at the end, since they don't increase specificity
  // by themselves but might need to override something that does.
  // See https://github.com/gregberge/xstyled/issues/288
  if (DEV) {
    let seenAtRule = false
    for (const value in states) {
      const selector = states[value]
      if (typeof selector === 'string' && selector[0] === '@') {
        seenAtRule = true
      } else if (seenAtRule) {
        warn('theme.states should have at-rules at the end!')
        break
      }
    }
  }

  return states
}

type PropsScreensVariants<T extends Props> = {
  [P in keyof PropsScreens<T>]: string | null
}

export type PropsVariants<T extends Props> = PropsScreensVariants<T> &
  PropsStates<T>

export const getVariants = <T extends Props>(props: T): PropsVariants<T> => {
  const screens = getScreens(props)
  const states = getStates(props)
  const medias = {} as PropsScreensVariants<T>
  for (const value in screens) {
    medias[value] = mediaMinWidth(getBreakpointMin(screens, value))
  }
  return { ...states, ...medias }
}

export const getCachedVariants = <T extends Props>(
  props: T,
  cache: XCache<PropsVariants<T>>,
): PropsVariants<T> => {
  if (cache.has('_variants')) return cache.get('_variants') as PropsVariants<T>
  const states = getVariants(props)
  cache.set('_variants', states)
  return states
}
