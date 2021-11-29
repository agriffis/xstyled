import { createGlobalStyle } from 'styled-components'
import { getPreflightStyles } from '@agriffis/xstyled-system'

export const Preflight = createGlobalStyle(({ theme }) =>
  getPreflightStyles(theme),
)
