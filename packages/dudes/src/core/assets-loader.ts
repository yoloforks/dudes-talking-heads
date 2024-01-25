import { Assets, utils } from 'pixi.js'
import type {
  ISpritesheetData,
  ISpritesheetFrameData,
  Spritesheet
} from 'pixi.js'

interface AsepriteFrameData extends ISpritesheetFrameData {
  duration: number
}

interface AsepriteData extends ISpritesheetData {
  frames: utils.Dict<AsepriteFrameData>
  duration: number
}

export interface DudeAsset {
  alias: string
  src: string
}

export class AssetsLoader {
  assets: utils.Dict<Spritesheet<AsepriteData>> = {}

  private isLoaded = false

  async load(assets: DudeAsset[]): Promise<void> {
    if (this.isLoaded) return

    await Assets.init({
      manifest: {
        bundles: [
          {
            name: 'main',
            assets
          }
        ]
      }
    })
    this.assets = await Assets.loadBundle('main')
    this.isLoaded = true
  }
}

export const assetsLoader = new AssetsLoader()
