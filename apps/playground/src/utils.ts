import { randomNum } from '@zero-dependency/utils'
import type { DudeSpriteData } from '@twirapp/dudes/types'

export function randomRgbColor(): string {
  return `rgb(${randomNum(0, 255)}, ${randomNum(0, 255)}, ${randomNum(0, 255)})`
}

export function createDudeSprite(
  name: string,
  layers: DudeSpriteData['layers']
) {
  return {
    name,
    layers
  }
}
