import { AnimatedSprite, SCALE_MODES } from 'pixi.js'
import type { FrameObject } from 'pixi.js'

import { assetsLoader } from './assets-loader.js'

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
export type DudeSpriteFrameTag = keyof typeof DudeSpriteTags

export type DudeFrameObject = Record<string, FrameObject[]>

class SpriteProvider {
  private spriteTextures = new Map<string, DudeFrameObject>()

  private getSpriteKey(spriteName: string, frameTag: string): string {
    return `${spriteName}.${frameTag}`
  }

  private getAnimatedSprite(spriteKey: string) {
    const textures = this.spriteTextures.get(spriteKey)
    if (textures) return this.texturesToSprites(textures)
    return null
  }

  private texturesToSprites(textures: DudeFrameObject) {
    const sprites = {} as Record<DudeSpriteFrameTag, AnimatedSprite>

    for (const [name, texture] of Object.entries(textures)) {
      if (!texture.length) continue
      const sprite = new AnimatedSprite(texture, false)
      sprite.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST
      sprites[name as DudeSpriteFrameTag] = sprite
    }

    return sprites
  }

  getSprite(
    spriteName: string,
    frameTag: DudeSpriteFrameTag
  ): Record<string, AnimatedSprite> | null {
    const spriteKey = this.getSpriteKey(spriteName, frameTag)
    const sprite = this.getAnimatedSprite(spriteKey)
    if (sprite) return sprite

    const assets = assetsLoader.assets[spriteName]
    if (!assets) {
      console.error('sprite is not defined:', spriteName)
      return null
    }

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
      return this.texturesToSprites(textures)
    }

    return null
  }
}

export const spriteProvider = new SpriteProvider()
