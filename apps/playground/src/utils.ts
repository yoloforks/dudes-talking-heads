import { DudesLayers } from '@twirapp/dudes'
import { randomNum, rgbToHex } from '@zero-dependency/utils'
import type { DudesLayer, DudesTypes } from '@twirapp/dudes/types'
import type { UnwrapNestedRefs } from 'vue'

import type { DudeSpriteParams } from './App.vue'

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
  const layers = {
    [DudesLayers.Body]: spriteParams.bodySprite,
    [DudesLayers.Eyes]: spriteParams.eyesSprite,
    [DudesLayers.Mouth]: spriteParams.mouthSprite,
    [DudesLayers.Hat]: spriteParams.hatSprite,
    [DudesLayers.Cosmetics]: spriteParams.cosmeticsSprite
  }

  const sprite: DudesTypes.SpriteData = {
    name,
    layers: Object.entries(layers)
      .map(([layer, src]) => ({ layer: layer as DudesLayer, src }))
      .filter((layer) => layer.src)
  }

  return sprite
}

const CHAR_RANGE = {
  emoticons: [0x1f600, 0x1f64f],
  food: [0x1f32d, 0x1f37f],
  animals: [0x1f400, 0x1f4d3],
  expressions: [0x1f910, 0x1f92f]
}

type NamedCharRange = keyof typeof CHAR_RANGE

export function randomEmoji(range: NamedCharRange): string {
  const [max, min] = CHAR_RANGE[range]
  const codePoint = Math.floor(Math.random() * (max - min) + min)
  return String.fromCodePoint(codePoint)
}
