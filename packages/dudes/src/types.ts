import type { DudeAsset } from './core/assets-loader.js'
import type { Dude } from './core/dude.js'

export type DudesOverlayMethods<T extends string> = {
  dudes: Map<string, Dude>
  initDudes: (dudeAssets: DudeAsset[]) => Promise<void>
  getDude: (name: string) => Dude | undefined
  createDude: (name: string, sprite: T) => Dude
  removeDude: (name: string) => void
  clearDudes: () => void
}

export type { DudeAsset }
