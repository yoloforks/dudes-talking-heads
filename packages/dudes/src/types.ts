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
import type { SoundAsset, SoundType } from './core/sounds-loader.js'

export interface DudesOverlayMethods {
  dudes: Map<string, Dude>
  initDudes: () => Promise<void>
  getDude: (name: string) => Dude | undefined
  createDude: (
    name: string,
    sprite: string,
    settings?: DudePersonalSettings
  ) => Dude
  removeDude: (name: string) => void
  clearDudes: () => void
  updateSettings: (settings: DudesSettings) => void
}

export type DudePersonalParams = Partial<
  Pick<DudeParams, 'color' | 'scale' | 'gravity'> & {
    sprite: string
  }
>

export type DudePersonalSettings = Partial<{
  dude: DudePersonalParams
  messageBox: DudePersonalMessageBoxStyles
  nameBox: DudePersonalNameBoxStyles
}>

export interface DudeParams {
  /**
   * @default 1800000 // FIXED_ROUND * 60 * 30 - 30 minutes
   */
  maxLifeTime: number
  /**
   * @default 400
   */
  gravity: number
  /**
   * Color fallback for dudes
   * @default '#969696'
   */
  color: string
  /**
   * @default 4
   */
  scale: number

  sounds: {
    /**
     * @default true
     */
    enabled: boolean
    /**
     * @default 0.01 // 1%
     */
    volume: number
  }
}

export interface DudesSettings {
  dude: DudeParams
  messageBox: DudeMessageBoxStyles
  nameBox: DudeNameBoxStyles
}

export type {
  Dude,
  DudeAsset,
  DudeMessageBoxStyles,
  DudeNameBoxStyles,
  SoundAsset,
  SoundType
}
