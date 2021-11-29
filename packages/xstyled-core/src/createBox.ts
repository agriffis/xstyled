import { system } from '@agriffis/xstyled-system'

export function createBox(): (string | typeof system)[] {
  return [`&&{`, system, `}`]
}
createBox.meta = system.meta
