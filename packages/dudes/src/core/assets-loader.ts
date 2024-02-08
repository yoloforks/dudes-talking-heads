import { Assets } from 'pixi.js'
import type {
  AssetInitOptions,
  ISpritesheetData,
  ISpritesheetFrameData,
  Spritesheet,
  utils
} from 'pixi.js'

export interface SpriteFrameData extends ISpritesheetFrameData {
  duration: number
}

export interface SpriteData extends ISpritesheetData {
  frames: utils.Dict<SpriteFrameData>
  duration: number
}

export interface DudeAsset {
  alias: string
  src: string
}

export type AssetsLoadOptions = Omit<AssetInitOptions, 'manifest'>

export class AssetsLoader {
  assets: utils.Dict<Spritesheet<SpriteData>> = {}

  private isLoaded = false

  async load(
    assets: DudeAsset[],
    loadOptions: AssetsLoadOptions = {}
  ): Promise<void> {
    if (this.isLoaded) return

    await Assets.init({
      manifest: {
        bundles: [
          {
            name: 'main',
            assets
          }
        ]
      },
      ...loadOptions
    })
    this.assets = await Assets.loadBundle('main')
    this.isLoaded = true
  }
}

export const assetsLoader = new AssetsLoader()
