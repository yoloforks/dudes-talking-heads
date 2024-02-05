import { Container } from 'pixi.js'
import { unref, watch } from 'vue'
import type { IPointData } from 'pixi.js'
import type { WatchStopHandle } from 'vue'

import { removeInternalDude } from '../composables/use-dudes.js'
import { dudesSettings } from '../composables/use-settings.js'
import { FIXED_DELTA_TIME, FIXED_ROUND } from '../constants.js'
import { DudeEmoteSpitter } from './dude-emote-spitter.js'
import { DudeMessageBox } from './dude-message-box.js'
import { DudeNameBox } from './dude-name-box.js'
import { DudeSpriteContainer } from './dude-sprite-container.js'
import { soundsLoader } from './sounds-loader.js'
import {
  DudeSpriteLayers,
  DudeSpriteTags,
  getSprite
} from './sprite-provider.js'
import type { DudeParams, DudePersonalSettings } from '../types.js'
import type { DudeSpriteTagType } from './sprite-provider.js'

type Collider = {
  x: number
  y: number
  width: number
  height: number
}

export class Dude {
  dudeName: string
  view = new Container()

  /** @internal */
  private sprite?: DudeSpriteContainer
  private spriteName: string
  private spriteScale: number
  private spriteGravity: number
  private spriteColor: string
  private spriteSize = 32
  private direction: number
  private animationState?: DudeSpriteTagType

  private collider: Collider = {
    x: 8,
    y: 3,
    width: 16,
    height: 22
  }

  private name: DudeNameBox
  private message: DudeMessageBox
  private emoteSpitter = new DudeEmoteSpitter()

  private velocity: IPointData = {
    x: 0,
    y: 0
  }

  private landAnimationTime?: number
  private maxLandAnimationTime = 200

  private runIdleAnimationTime?: number
  private maxRunIdleAnimationTime?: number

  private currentLifeTime: number
  private maxOpacityTime = 5000
  private currentOpacityTime = this.maxOpacityTime

  private params: DudeParams
  private stopWatchDudeParams: WatchStopHandle | undefined

  private get isJumping() {
    return (
      this.animationState === DudeSpriteTags.Fall ||
      this.animationState === DudeSpriteTags.Jump
    )
  }

  constructor(name: string, sprite = 'dude', settings?: DudePersonalSettings) {
    this.stopWatchDudeParams = watch(
      () => dudesSettings.value.dude,
      (params) => (this.params = params),
      { immediate: true }
    )

    const { color, gravity, scale } = unref(dudesSettings.value.dude)

    this.dudeName = name
    this.spriteName = sprite
    this.spriteColor = settings?.dude?.color ?? color
    this.spriteScale = settings?.dude?.scale ?? scale
    this.spriteGravity = settings?.dude?.gravity ?? gravity

    this.message = new DudeMessageBox(settings?.messageBox)

    this.view.y =
      -(this.collider.y + this.collider.height - this.spriteSize / 2) *
      this.spriteScale
    this.view.x =
      Math.random() * (window.innerWidth - this.spriteSize * this.spriteScale) +
      (this.spriteSize / 2) * this.spriteScale

    this.direction = Math.random() > 0.5 ? 1 : -1

    this.name = new DudeNameBox(name, settings?.nameBox)
    this.name.view.position.y =
      -(this.spriteSize / 2 - this.collider.y + 2) * this.spriteScale

    this.view.sortableChildren = true
    this.emoteSpitter.view.zIndex = 1
    this.message.view.zIndex = 3
    this.message.view.position.y =
      this.name.view.position.y - this.name.view.height - 2 * this.spriteScale

    this.view.addChild(this.name.view)
    this.view.addChild(this.emoteSpitter.view)
    this.view.addChild(this.message.view)

    this.playAnimation(DudeSpriteTags.Idle)

    this.runIdleAnimationTime = performance.now()
    this.maxRunIdleAnimationTime = Math.random() * 5000
    this.currentLifeTime = dudesSettings.value.dude.maxLifeTime
  }

  get color() {
    return this.spriteColor
  }

  cleanUp(): void {
    this.stopWatchDudeParams?.()
    this.message.stopWatchGlobalStyles?.()
    this.name.stopWatchGlobalStyles?.()
  }

  jump(): void {
    if (!this.isJumping) {
      this.velocity.x = this.direction * 100
      this.velocity.y = -300

      this.playAnimation(DudeSpriteTags.Jump)
    }
  }

  tint(color: string): void {
    // validate color
    const option = new Option()
    option.style.color = color
    if (option.style.color === '' || color === 'transparent') return

    this.spriteColor = color
    this.sprite?.color(this.spriteColor)
  }

  update(): void {
    const now = performance.now()

    if (
      this.landAnimationTime &&
      now - this.landAnimationTime > this.maxLandAnimationTime
    ) {
      this.playAnimation(DudeSpriteTags.Idle)
      this.landAnimationTime = undefined
    }

    if (
      this.runIdleAnimationTime &&
      this.maxRunIdleAnimationTime &&
      now - this.runIdleAnimationTime > this.maxRunIdleAnimationTime &&
      (this.animationState === DudeSpriteTags.Run ||
        this.animationState === DudeSpriteTags.Idle)
    ) {
      if (this.animationState === DudeSpriteTags.Idle) {
        this.playAnimation(DudeSpriteTags.Run)
      } else {
        this.playAnimation(DudeSpriteTags.Idle)
      }

      this.runIdleAnimationTime = now
      this.maxRunIdleAnimationTime = Math.random() * 5000
    }

    this.velocity.y =
      this.velocity.y + (this.spriteGravity * FIXED_DELTA_TIME) / FIXED_ROUND

    const newPosition = {
      x:
        this.view.position.x +
        (this.velocity.x * FIXED_DELTA_TIME) / FIXED_ROUND,
      y:
        this.view.position.y +
        (this.velocity.y * FIXED_DELTA_TIME) / FIXED_ROUND
    }

    if (
      newPosition.y +
        (this.collider.y + this.collider.height - this.spriteSize / 2) *
          this.spriteScale >
      window.innerHeight
    ) {
      this.velocity.y = 0
      this.velocity.x = 0

      newPosition.y =
        window.innerHeight -
        (this.collider.y + this.collider.height - this.spriteSize / 2) *
          this.spriteScale

      if (this.animationState === DudeSpriteTags.Fall) {
        this.playAnimation(DudeSpriteTags.Land)
        this.landAnimationTime = now
      }
    }

    this.view.position.set(newPosition.x, newPosition.y)

    if (this.velocity.y > 0) {
      this.playAnimation(DudeSpriteTags.Fall)
    }

    const width = window.innerWidth

    if (this.animationState != DudeSpriteTags.Idle) {
      this.view.position.x +=
        (1 * this.direction * FIXED_DELTA_TIME * 60) / FIXED_ROUND

      if (
        this.view.x + (this.collider.width / 2) * this.spriteScale >= width ||
        this.view.x - (this.collider.width / 2) * this.spriteScale <= 0
      ) {
        this.direction = -this.direction
        this.velocity.x = -this.velocity.x
        this.sprite?.view.scale.set(
          this.direction * this.spriteScale,
          this.spriteScale
        )
      }
    }

    if (this.currentLifeTime > 0) {
      this.currentLifeTime -= FIXED_DELTA_TIME
    } else {
      if (this.currentOpacityTime > 0) {
        this.currentOpacityTime -= FIXED_DELTA_TIME
        this.view.alpha = this.currentOpacityTime / this.maxOpacityTime
      } else {
        removeInternalDude(this)
      }
    }

    this.sprite?.update((FIXED_DELTA_TIME / FIXED_ROUND) * 60)
    this.emoteSpitter.update()

    this.emoteSpitter.view.position.y =
      this.message.view.position.y - this.message.view.height

    this.message.update()
  }

  addMessage(message: string): void {
    this.message.add(message)

    this.currentLifeTime = this.params.maxLifeTime
    this.currentOpacityTime = this.maxOpacityTime
    this.view.alpha = 1
  }

  spitEmotes(emotes: string[]): void {
    for (const emote of emotes) {
      this.emoteSpitter.add(emote)
    }
  }

  async playAnimation(state: DudeSpriteTagType): Promise<void> {
    const dudeSprite = getSprite(this.spriteName, state)
    if (!dudeSprite) return

    if (this.animationState === state) return
    this.animationState = state

    if (this.sprite) {
      this.view.removeChild(this.sprite.view)
    }

    const { enabled: soundEnabled, volume } = dudesSettings.value.dude.sounds
    if (soundEnabled && state === 'Jump') {
      soundsLoader.play('jump', volume)
    }

    this.sprite = new DudeSpriteContainer({
      body: dudeSprite[DudeSpriteLayers.Body],
      eyes: dudeSprite[DudeSpriteLayers.Eyes]
    })
    this.sprite.view.scale.set(
      this.direction * this.spriteScale,
      this.spriteScale
    )
    this.sprite.color(this.spriteColor)

    this.view.addChild(this.sprite.view)
  }
}
