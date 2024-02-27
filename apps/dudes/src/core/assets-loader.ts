import { Assets } from 'pixi.js'
import type {
  AssetInitOptions,
  ISpritesheetData,
  ISpritesheetFrameData,
  Spritesheet
} from 'pixi.js'

export interface SpriteFrameData extends ISpritesheetFrameData {
  duration: number
}

export interface SpriteData extends ISpritesheetData {
  frames: Record<string, SpriteFrameData>
  duration: number
}

export interface DudesAsset {
  alias: string
  src: string
}

export type AssetsLoadOptions = Omit<AssetInitOptions, 'manifest'>

export class AssetsLoader {
  bundles: Record<string, Record<string, Spritesheet<SpriteData>>> = {}
  loadOptions: AssetsLoadOptions = {}

  async load(spriteName: string, assets: DudesAsset[]): Promise<void> {
    if (spriteName in this.bundles) {
      return Promise.resolve()
    }

    await Assets.init({
      manifest: {
        bundles: [
          {
            name: spriteName,
            assets
          }
        ]
      },
      ...this.loadOptions
    })
    this.bundles[spriteName] = await Assets.loadBundle(spriteName)
  }
}

export const assetsLoader = new AssetsLoader()
