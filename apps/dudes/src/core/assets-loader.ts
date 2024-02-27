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
  bundles: Record<string, Record<string, Spritesheet<SpriteData>>> = {}

  async init(loadOptions: AssetsLoaderOptions = {}): Promise<void> {
    await Assets.init({ ...loadOptions })
  }

  async load(spriteName: string, assets: DudesAsset[]): Promise<void> {
    Assets.addBundle(spriteName, assets)
    this.bundles[spriteName] = await Assets.loadBundle(spriteName)
  }
}

export const assetsLoader = new AssetsLoader()
