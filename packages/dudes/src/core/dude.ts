import { Container } from 'pixi.js'
import type { IPointData } from 'pixi.js'

import { removeInternalDude } from '../composables/use-dudes.js'
import { dudesSettings } from '../composables/use-settings.js'
import { COLLIDER, DELTA_TIME, ROUND, SPRITE_SIZE } from '../constants.js'
import { isValidColor } from '../helpers.js'
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
import type { DudePersonalSettings } from '../types.js'
import type { DudeSpriteTagType } from './sprite-provider.js'

export class Dude {
  name: string
  view = new Container()

  private sprite?: DudeSpriteContainer
  private spriteName: string

  private bodyColor: string
  private eyesColor: string
  private cosmeticsColor: string

  private direction: number
  private animationState?: DudeSpriteTagType

  private nameBox: DudeNameBox
  private messageBox: DudeMessageBox
  private emoteSpitter: DudeEmoteSpitter

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

  private get isJumping() {
    return (
      this.animationState === DudeSpriteTags.Fall ||
      this.animationState === DudeSpriteTags.Jump
    )
  }

  constructor(
    name: string,
    spriteName = 'dude',
    settings?: DudePersonalSettings
  ) {
    this.name = name
    this.spriteName = spriteName

    this.bodyTint(dudesSettings.value.dude.color)
    this.eyesTint(dudesSettings.value.dude.eyesColor)
    this.cosmeticsTint(dudesSettings.value.dude.cosmeticsColor)

    this.view.y =
      -(COLLIDER.y + COLLIDER.height - SPRITE_SIZE / 2) *
      dudesSettings.value.dude.scale

    this.view.x =
      Math.random() *
        (window.innerWidth - SPRITE_SIZE * dudesSettings.value.dude.scale) +
      (SPRITE_SIZE / 2) * dudesSettings.value.dude.scale

    this.direction = Math.random() > 0.5 ? 1 : -1

    this.nameBox = new DudeNameBox(name, settings?.name)
    this.messageBox = new DudeMessageBox(settings?.message)
    this.emoteSpitter = new DudeEmoteSpitter()

    this.view.sortableChildren = true
    this.view.addChild(this.nameBox.view)
    this.view.addChild(this.emoteSpitter.view)
    this.view.addChild(this.messageBox.view)

    this.playAnimation(DudeSpriteTags.Idle)

    this.runIdleAnimationTime = performance.now()
    this.maxRunIdleAnimationTime = Math.random() * 5000
    this.currentLifeTime = dudesSettings.value.dude.maxLifeTime
  }

  jump(): void {
    if (!this.isJumping) {
      this.velocity.x = this.direction * 100
      this.velocity.y = -300

      this.playAnimation(DudeSpriteTags.Jump)
    }
  }

  bodyTint(color: string): void {
    if (!isValidColor(color)) return
    this.bodyColor = color
    this.sprite?.bodyColor(this.bodyColor)
  }

  eyesTint(color: string): void {
    if (!isValidColor(color)) return
    this.eyesColor = color
    this.sprite?.eyesColor(color)
  }

  cosmeticsTint(color: string): void {
    if (!isValidColor(color)) return
    this.cosmeticsColor = color
    this.sprite?.cosmeticsColor(color)
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
      this.velocity.y + (dudesSettings.value.dude.gravity * DELTA_TIME) / ROUND

    const newPosition = {
      x: this.view.position.x + (this.velocity.x * DELTA_TIME) / ROUND,
      y: this.view.position.y + (this.velocity.y * DELTA_TIME) / ROUND
    }

    if (
      newPosition.y +
        (COLLIDER.y + COLLIDER.height - SPRITE_SIZE / 2) *
          dudesSettings.value.dude.scale >
      window.innerHeight
    ) {
      this.velocity.y = 0
      this.velocity.x = 0

      newPosition.y =
        window.innerHeight -
        (COLLIDER.y + COLLIDER.height - SPRITE_SIZE / 2) *
          dudesSettings.value.dude.scale

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
      this.view.position.x += (1 * this.direction * DELTA_TIME * 60) / ROUND

      if (
        this.view.x + (COLLIDER.width / 2) * dudesSettings.value.dude.scale >=
          width ||
        this.view.x - (COLLIDER.width / 2) * dudesSettings.value.dude.scale <= 0
      ) {
        this.direction = -this.direction
        this.velocity.x = -this.velocity.x
        this.sprite?.view.scale.set(
          this.direction * dudesSettings.value.dude.scale,
          dudesSettings.value.dude.scale
        )
      }
    }

    if (this.currentLifeTime > 0) {
      this.currentLifeTime -= DELTA_TIME
    } else {
      if (this.currentOpacityTime > 0) {
        this.currentOpacityTime -= DELTA_TIME
        this.view.alpha = this.currentOpacityTime / this.maxOpacityTime
      } else {
        removeInternalDude(this)
      }
    }

    this.sprite?.update((DELTA_TIME / ROUND) * 60)
    this.emoteSpitter.update()

    this.emoteSpitter.view.position.y =
      this.messageBox.view.position.y - this.messageBox.view.height

    this.messageBox.update()
    this.messageBox.view.position.y =
      this.nameBox.view.position.y -
      this.nameBox.view.height -
      2 * dudesSettings.value.dude.scale

    this.nameBox.update()
  }

  addMessage(message: string): void {
    this.messageBox.add(message)

    this.currentLifeTime = dudesSettings.value.dude.maxLifeTime
    this.currentOpacityTime = this.maxOpacityTime
    this.view.alpha = 1
  }

  spitEmotes(emotes: string[]): void {
    if (!dudesSettings.value.spitter.enabled) return
    this.emoteSpitter.add(emotes)
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
      outline: dudeSprite[DudeSpriteLayers.Outline],
      eyes: dudeSprite[DudeSpriteLayers.Eyes],
      cosmetics: dudeSprite[DudeSpriteLayers.Cosmetics]
    })
    this.sprite.view.scale.set(
      this.direction * dudesSettings.value.dude.scale,
      dudesSettings.value.dude.scale
    )
    this.sprite.bodyColor(this.bodyColor)
    this.sprite.eyesColor(this.eyesColor)
    this.sprite.cosmeticsColor(this.cosmeticsColor)

    this.view.addChild(this.sprite.view)
  }
}
