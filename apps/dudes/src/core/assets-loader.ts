import { Assets, BaseTexture, Spritesheet } from 'pixi.js'
import type {
  AssetInitOptions,
  ISpritesheetData,
  ISpritesheetFrameData
} from 'pixi.js'

import { isBase64 } from '../helpers.js'
import type { DudesTypes } from '../types.js'

export interface SpriteFrameData extends ISpritesheetFrameData {
  duration: number
}

export interface SpriteData extends ISpritesheetData {
  frames: Record<string, SpriteFrameData>
}

export interface DudesAsset {
  alias: string
  src: string
}

export type AssetsLoaderOptions = Omit<AssetInitOptions, 'manifest'>

async function loadSprite(assetData: DudesAsset) {
  const frames = Object.fromEntries(
    Array.from({ length: 9 }, (_, index) => {
      const frame = {
        frame: { x: index * 32, y: 0, w: 32, h: 32 },
        rotated: false,
        trimmed: false,
        spriteSourceSize: { x: 0, y: 0, w: 32, h: 32 },
        sourceSize: { w: 32, h: 32 },
        duration: index < 3 ? 300 : 100
      }

      return [`${assetData.alias}_${index}`, frame]
    })
  )

  const spritesheet: SpriteData = {
    frames,
    meta: {
      format: 'RGBA8888',
      size: { w: 288, h: 32 },
      scale: '1',
      frameTags: [
        {
          name: 'Idle',
          from: 0,
          to: 2,
          direction: 'forward'
        },
        {
          name: 'Jump',
          from: 3,
          to: 3,
          direction: 'forward'
        },
        {
          name: 'Fall',
          from: 4,
          to: 4,
          direction: 'forward'
        },
        {
          name: 'Land',
          from: 5,
          to: 5,
          direction: 'forward'
        },
        {
          name: 'Run',
          from: 6,
          to: 8,
          direction: 'forward'
        }
      ],
      layers: [
        { name: assetData.alias, opacity: 255, blendMode: 'normal' }]
    }
  }

  if (isBase64(assetData.src)) {
    const baseTexture = BaseTexture.from(assetData.src)
    return new Spritesheet(baseTexture, spritesheet)
  }

  const texture = await Assets.load(assetData.src)
  return new Spritesheet(texture, spritesheet)
}

export class AssetsLoader {
  private bundles: Record<string, Record<string, Spritesheet<SpriteData>>> = {}

  getAssets(
    spriteName: string,
    layerType: string
  ): Spritesheet<SpriteData> | undefined {
    return this.bundles?.[spriteName]?.[layerType]
  }

  async init(loadOptions: AssetsLoaderOptions = {}): Promise<void> {
    await Assets.init({ ...loadOptions })
  }

  async unload(spriteName: string): Promise<void> {
    if (!this.bundles[spriteName]) return
    await Assets.unloadBundle(spriteName)
    delete this.bundles[spriteName]
  }

  async load(spriteData: DudesTypes.SpriteData): Promise<void> {
    if (this.bundles[spriteData.name]) return
    for (const layer of spriteData.layers) {
      const sprite = await loadSprite(layer)
      await sprite.parse()

      this.bundles[spriteData.name] ??= {}
      this.bundles[spriteData.name][layer.alias] = sprite
    }
  }
}

export const assetsLoader = new AssetsLoader()
