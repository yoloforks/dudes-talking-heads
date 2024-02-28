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

export type AssetsLoaderOptions = Omit<AssetInitOptions, 'manifest'>

export class AssetsLoader {
  private bundles: Record<string, Record<string, Spritesheet<SpriteData>>> = {}

  getAssets(
    spriteName: string,
    layerType: string
  ): Spritesheet<SpriteData> | undefined {
    return this.bundles[spriteName][layerType]
  }

  async init(loadOptions: AssetsLoaderOptions = {}): Promise<void> {
    await Assets.init({ ...loadOptions })
  }

  async unload(spriteName: string): Promise<void> {
    await Assets.unloadBundle(spriteName)
    delete this.bundles[spriteName]
  }

  async load(spriteName: string, assets: DudesAsset[]): Promise<void> {
    if (spriteName in this.bundles) return
    Assets.addBundle(spriteName, assets)
    this.bundles[spriteName] = await Assets.loadBundle(spriteName)
  }
}

export const assetsLoader = new AssetsLoader()
