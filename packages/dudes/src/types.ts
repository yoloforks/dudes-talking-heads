import type { DudeAsset } from './core/assets-loader.js'
import type {
  DudeMessageBoxStyles,
  DudePersonalMessageBoxStyles
} from './core/dude-message-box.js'
import type {
  DudeNameBoxStyles,
  DudePersonalNameBoxStyles
} from './core/dude-name-box.js'
import type { Dude } from './core/dude.js'

export type DudesOverlayMethods<T extends string> = {
  dudes: Map<string, Dude>
  initDudes: () => Promise<void>
  getDude: (name: string) => Dude | undefined
  createDude: (name: string, sprite: T, settings?: DudePersonalStyles) => Dude
  removeDude: (name: string) => void
  clearDudes: () => void
  updateSettings: (settings: DudesSettings) => void
}

export type DudePersonalStyles = Partial<{
  messageBox: DudePersonalMessageBoxStyles
  nameBox: DudePersonalNameBoxStyles
}>

export type DudesSettings = {
  messageBox: DudeMessageBoxStyles
  nameBox: DudeNameBoxStyles
}

export type { DudeAsset, DudeMessageBoxStyles, DudeNameBoxStyles }
