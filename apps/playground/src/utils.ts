import { randomNum, rgbToHex } from '@zero-dependency/utils'
import type { DudesLayer, DudesTypes } from '@twirapp/dudes/types'
import type { UnwrapNestedRefs } from 'vue'

import { DudeSpriteParams } from './App.vue'

export function randomRgbColor(): string {
  return rgbToHex({
    r: randomNum(0, 255),
    g: randomNum(0, 255),
    b: randomNum(0, 255)
  })
}

export function mapDudeSpriteData(
  name: string,
  spriteParams: UnwrapNestedRefs<DudeSpriteParams>
) {
  const layers: Record<DudesLayer, string> = {
    Body: spriteParams.bodySprite,
    Eyes: spriteParams.eyesSprite,
    Mouth: spriteParams.mouthSprite,
    Hat: spriteParams.hatSprite,
    Cosmetics: spriteParams.cosmeticsSprite
  }

  const sprite: DudesTypes.SpriteData = {
    name,
    layers: Object.entries(layers)
      .map(([layer, src]) => ({ alias: layer, src }))
      .filter((layer) => layer.src)
  }

  return sprite
}
