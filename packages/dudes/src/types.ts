import type { AssetsLoadOptions, DudeAsset } from './core/assets-loader.js'
import type { DudeEmoteSpitterParams } from './core/dude-emote-spitter.js'
import type {
  DudeMessageBoxParams,
  DudePersonalMessageBoxParams
} from './core/dude-message-box.js'
import type {
  DudeNameBoxParams,
  DudePersonalNameBoxParams
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

export type DudePersonalParams = Partial<Pick<DudeParams, 'color'>>

export type DudePersonalSettings = Partial<{
  message: DudePersonalMessageBoxParams
  name: DudePersonalNameBoxParams
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
   * @default '#ffffff'
   */
  eyesColor: string

  /**
   * @default '#ffffff'
   */
  cosmeticsColor: string

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
  message: DudeMessageBoxParams
  name: DudeNameBoxParams
  spitter: DudeEmoteSpitterParams
}

export type {
  Dude,
  DudeAsset,
  DudeMessageBoxParams,
  DudeNameBoxParams,
  SoundAsset,
  SoundType,
  AssetsLoadOptions
}
