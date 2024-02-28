import { AnimatedSprite, SCALE_MODES } from 'pixi.js'
import type { FrameObject } from 'pixi.js'

import { assetsLoader } from './assets-loader.js'

export const DudesLayers = {
  Body: 'Body',
  Eyes: 'Eyes',
  Mouth: 'Mouth',
  Cosmetics: 'Cosmetics'
} as const
const DudesLayersKeys = Object.keys(DudesLayers)
export type DudesLayer = keyof typeof DudesLayers

export const DudeSpriteTags = {
  Idle: 'Idle',
  Jump: 'Jump',
  Fall: 'Fall',
  Land: 'Land',
  Run: 'Run'
} as const
export type DudeSpriteFrameTag = keyof typeof DudeSpriteTags

export type DudeFrameObject = Record<string, FrameObject[]>

class SpriteProvider {
  private spriteTextures = new Map<string, DudeFrameObject>()

  private getSpriteKey(spriteName: string, frameTag: string): string {
    return `${spriteName}.${frameTag}`
  }

  private getAnimatedSprite(spriteKey: string, spriteType: string) {
    const textures = this.spriteTextures.get(spriteKey)
    if (textures) return this.texturesToSprites(textures, spriteType)
    return null
  }

  private texturesToSprites(textures: DudeFrameObject, spriteType: string) {
    const texture = textures[spriteType]
    const sprite = new AnimatedSprite(texture, false)
    sprite.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST
    return sprite
  }

  getSprite(spriteName: string, frameTag: DudeSpriteFrameTag) {
    const sprites: Record<string, AnimatedSprite> = {}

    for (const layerType of DudesLayersKeys) {
      const spriteNameGroup = `${spriteName}.${layerType}`
      const spriteKey = this.getSpriteKey(spriteNameGroup, frameTag)

      const sprite = this.getAnimatedSprite(spriteKey, layerType)
      if (sprite) {
        sprites[layerType] = sprite
        continue
      }

      const assets = assetsLoader.getAssets(spriteName, layerType)
      if (!assets) continue

      const layers = assets.data.meta.layers
      const frame = assets.data.meta.frameTags?.find(
        (tag) => tag.name === frameTag
      )

      if (frame && layers) {
        const textures = Object.fromEntries<FrameObject[]>(
          layers.map((layer) => [layer.name, []])
        )

        for (let i = frame.from; i <= frame.to; i++) {
          for (const layer in textures) {
            const frameKey = layer + '_' + i
            const texture = assets.textures[frameKey]
            if (!texture) continue
            const time = assets.data.frames[frameKey].duration
            textures[layer].push({ texture, time })
          }
        }

        this.spriteTextures.set(spriteKey, textures)
        sprites[layerType] = this.texturesToSprites(textures, layerType)
      }
    }

    return sprites
  }
}

export const spriteProvider = new SpriteProvider()
