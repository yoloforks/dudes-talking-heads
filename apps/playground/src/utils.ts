import { randomNum } from '@zero-dependency/utils'
import type { DudesLayer, DudeSpriteData } from '@twirapp/dudes/types'

export function randomRgbColor(): string {
  return `rgb(${randomNum(0, 255)}, ${randomNum(0, 255)}, ${randomNum(0, 255)})`
}

export function mapDudeSprite(
  name: string,
  layers: Record<DudesLayer, string>
) {
  const sprite: DudeSpriteData = {
    name,
    layers: Object.entries(layers)
      .map(([layer, src]) => ({ alias: layer, src }))
      .filter((layer) => layer.src)
  }

  return sprite
}
