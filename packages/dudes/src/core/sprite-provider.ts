import { AnimatedSprite, SCALE_MODES } from 'pixi.js'
import type { FrameObject, Texture } from 'pixi.js'

import { assetsLoader } from './assets-loader.js'

export type DudeAnimatedSprite = {
  [layer in DudeSpriteLayerType]: AnimatedSprite
}

export type DudeTexture = {
  [layer in DudeSpriteLayerType]: Texture[]
}

export const DudeSpriteLayers = {
  Body: 'Body',
  Eyes: 'Eyes'
} as const

export type DudeSpriteLayerType = keyof typeof DudeSpriteLayers

export const DudeSpriteTags = {
  Idle: 'Idle',
  Jump: 'Jump',
  Fall: 'Fall',
  Land: 'Land',
  Run: 'Run',
  Die: 'Die'
} as const

export type DudeSpriteTagType = keyof typeof DudeSpriteTags

export function getSprite(
  sheetName: string,
  spriteTag: DudeSpriteTagType
): DudeAnimatedSprite | null {
  if (!sheetName) {
    console.error('Sheet is not defined', { sheetName })
    return null
  }

  const sheet = assetsLoader.sheets[sheetName]
  const frameTag = sheet.data.meta.frameTags?.find(
    (tag) => tag.name === spriteTag
  )
  const layers = sheet.data.meta.layers

  if (frameTag && layers) {
    const textures = Object.fromEntries<FrameObject[]>(
      layers.map((layer) => [layer.name, []])
    )

    for (let i = frameTag.from; i <= frameTag.to; i++) {
      const framekey = i.toString()

      for (const layer in textures) {
        const texture = sheet.textures[layer + '_' + i]
        const time = sheet.data.frames[layer + '_' + framekey].duration

        textures[layer].push({ texture: texture, time: time })
      }
    }

    const entries = Object.entries(textures).map((entry) => {
      const sprite = new AnimatedSprite(entry[1])
      sprite.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST
      return [entry[0], sprite]
    })

    return Object.fromEntries(entries)
  }

  console.error('Frame tag or layers not found', {
    spriteTag,
    frameTag,
    layers
  })
  return null
}
