import type { DudeAsset } from './core/assets-loader.js'
import type { DudeMessageBoxSettings } from './core/dude-message-box.js'
import type { Dude } from './core/dude.js'

export type DudesOverlayMethods<T extends string> = {
  dudes: Map<string, Dude>
  initDudes: () => Promise<void>
  getDude: (name: string) => Dude | undefined
  createDude: (name: string, sprite: T) => Dude
  removeDude: (name: string) => void
  clearDudes: () => void
  updateSettings: (settings: DudesSettings) => void
}

export type DudesSettings = {
  messageBox: DudeMessageBoxSettings
}

export type { DudeAsset, DudeMessageBoxSettings }
