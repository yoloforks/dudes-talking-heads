import { Container } from 'pixi.js'
import { unref, watch } from 'vue'
import type { IPointData } from 'pixi.js'
import type { WatchStopHandle } from 'vue'

import { dudesSettings } from '../composables/use-settings.js'
import { FIXED_DELTA_TIME } from '../constants.js'
import { DudeEmoteSpitter } from './dude-emote-spitter.js'
import { DudeMessageBox } from './dude-message-box.js'
import { DudeNameBox } from './dude-name-box.js'
import { DudeSpriteContainer } from './dude-sprite-container.js'
import {
  DudeSpriteLayers,
  DudeSpriteTags,
  getSprite
} from './sprite-provider.js'
import type { DudeParams, DudePersonalStyles } from '../types.js'
import type { DudeSpriteTagType } from './sprite-provider.js'

type Collider = {
  x: number
  y: number
  width: number
  height: number
}

export class Dude {
  public dudeName: string
  private spriteName: string
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
  private sprite?: DudeSpriteContainer
  private emoteSpitter = new DudeEmoteSpitter()
  public view = new Container()

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
  public shouldBeDeleted = false

  private color: string
  private params!: DudeParams
  private stopWatchDudeParams: WatchStopHandle | undefined

  private get isJumping() {
    return (
      this.animationState == DudeSpriteTags.Fall ||
      this.animationState == DudeSpriteTags.Jump
    )
  }

  constructor(name: string, sprite = 'dude', settings?: DudePersonalStyles) {
    this.dudeName = name
    this.spriteName = sprite
    this.color = unref(dudesSettings.value.dude.color)

    this.stopWatchDudeParams = watch(
      () => dudesSettings.value.dude,
      (params) => (this.params = params),
      { immediate: true }
    )

    this.message = new DudeMessageBox(settings?.messageBox)

    const width = window.innerWidth

    this.view.y =
      -(this.collider.y + this.collider.height - this.spriteSize / 2) *
      this.params.scale
    this.view.x =
      Math.random() * (width - this.spriteSize * this.params.scale) +
      (this.spriteSize / 2) * this.params.scale

    this.direction = Math.random() > 0.5 ? 1 : -1

    this.name = new DudeNameBox(name, settings?.nameBox)
    this.name.view.position.y =
      -(this.spriteSize / 2 - this.collider.y + 2) * this.params.scale

    this.view.sortableChildren = true
    this.emoteSpitter.view.zIndex = 1
    this.message.view.zIndex = 3
    this.message.view.position.y =
      this.name.view.position.y - this.name.view.height - 2 * this.params.scale

    this.view.addChild(this.name.view)
    this.view.addChild(this.emoteSpitter.view)
    this.view.addChild(this.message.view)

    this.playAnimation(DudeSpriteTags.Idle)

    this.runIdleAnimationTime = performance.now()
    this.maxRunIdleAnimationTime = Math.random() * 5000
    this.currentLifeTime = dudesSettings.value.dude.maxLifeTime
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

  tint(spriteColor: string): void {
    // validate color
    const option = new Option()
    option.style.color = spriteColor
    if (option.style.color === '' || spriteColor === 'transparent') return

    this.color = spriteColor
    this.sprite?.color(this.color)
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
      (this.animationState == DudeSpriteTags.Run ||
        this.animationState == DudeSpriteTags.Idle)
    ) {
      if (this.animationState == DudeSpriteTags.Idle) {
        this.playAnimation(DudeSpriteTags.Run)
      } else {
        this.playAnimation(DudeSpriteTags.Idle)
      }

      this.runIdleAnimationTime = now
      this.maxRunIdleAnimationTime = Math.random() * 5000
    }

    this.velocity.y =
      this.velocity.y + (this.params.gravity * FIXED_DELTA_TIME) / 1000

    const newPosition = {
      x: this.view.position.x + (this.velocity.x * FIXED_DELTA_TIME) / 1000,
      y: this.view.position.y + (this.velocity.y * FIXED_DELTA_TIME) / 1000
    }

    if (
      newPosition.y +
        (this.collider.y + this.collider.height - this.spriteSize / 2) *
          this.params.scale >
      window.innerHeight
    ) {
      this.velocity.y = 0
      this.velocity.x = 0

      newPosition.y =
        window.innerHeight -
        (this.collider.y + this.collider.height - this.spriteSize / 2) *
          this.params.scale

      if (this.animationState == DudeSpriteTags.Fall) {
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
        (1 * this.direction * FIXED_DELTA_TIME * 60) / 1000

      if (
        this.view.x + (this.collider.width / 2) * this.params.scale >= width ||
        this.view.x - (this.collider.width / 2) * this.params.scale <= 0
      ) {
        this.direction = -this.direction
        this.velocity.x = -this.velocity.x
        this.sprite?.view.scale.set(
          this.direction * this.params.scale,
          this.params.scale
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
        this.shouldBeDeleted = true
      }
    }

    this.sprite?.update((FIXED_DELTA_TIME / 1000) * 60)
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

    this.sprite = new DudeSpriteContainer({
      body: dudeSprite[DudeSpriteLayers.Body],
      eyes: dudeSprite[DudeSpriteLayers.Eyes]
    })
    this.sprite.view.scale.set(
      this.direction * this.params.scale,
      this.params.scale
    )
    this.sprite.color(this.color)

    this.view.addChild(this.sprite.view)
  }
}
