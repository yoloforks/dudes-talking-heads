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
  Outline: 'Outline',
  Eyes: 'Eyes',
  Cosmetics: 'Cosmetics'
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

  const asset = assetsLoader.assets[sheetName]
  const layers = asset.data.meta.layers
  const frameTag = asset.data.meta.frameTags?.find(
    (tag) => tag.name === spriteTag
  )

  if (frameTag && layers) {
    const textures = Object.fromEntries<FrameObject[]>(
      layers.map((layer) => [layer.name, []])
    )

    for (let i = frameTag.from; i <= frameTag.to; i++) {
      for (const layer in textures) {
        const frameKey = layer + '_' + i
        const texture = asset.textures[frameKey]
        if (!texture) continue
        const time = asset.data.frames[frameKey].duration
        textures[layer].push({ texture, time })
      }
    }

    const entries = Object.entries(textures).map(([name, texture]) => {
      if (!texture.length) return []
      const sprite = new AnimatedSprite(texture, false)
      sprite.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST
      return [name, sprite]
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
