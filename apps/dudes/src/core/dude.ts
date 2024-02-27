import { Container } from 'pixi.js'
import { watch } from 'vue'
import type { IPointData } from 'pixi.js'

import { removeInternalDude } from '../composables/use-dudes.js'
import { dudesSettings } from '../composables/use-settings.js'
import { COLLIDER, DELTA_TIME, ROUND, SPRITE_SIZE } from '../constants.js'
import { isValidColor } from '../helpers.js'
import { assetsLoader } from './assets-loader.js'
import { DudeEmoteSpitter } from './dude-emote-spitter.js'
import { DudeMessageBox } from './dude-message-box.js'
import { DudeNameBox } from './dude-name-box.js'
import { DudeSpriteContainer } from './dude-sprite-container.js'
import { soundsLoader } from './sounds-loader.js'
import {
  DudeSpriteLayers,
  DudeSpriteTags,
  spriteProvider
} from './sprite-provider.js'
import type { DudesAsset, DudesTypes } from '../types.js'
import type { DudeSpriteFrameTag } from './sprite-provider.js'

export interface DudeSpriteData {
  name: string
  layers: DudesAsset[]
}

export class Dude {
  view = new Container()

  private bodyColor: string
  private direction: number
  private animationState?: DudeSpriteFrameTag

  private sprite?: DudeSpriteContainer
  private nameBox: DudeNameBox
  private messageBox: DudeMessageBox
  private emoteSpitter: DudeEmoteSpitter

  private velocity: IPointData = {
    x: 0,
    y: 0
  }

  private landAnimationTime: number | null
  private maxLandAnimationTime = 200

  private idleAnimationTime?: number
  private maxIdleAnimationTime?: number

  private isGrowing: boolean
  private growingTime: number

  private currentLifeTime: number
  private maxOpacityTime = 5000
  private currentOpacityTime = this.maxOpacityTime
  private scale: number

  constructor(
    public name: string,
    private spriteData: DudeSpriteData,
    private individualParams?: DudesTypes.IndividualDudeParams
  ) {}

  async init(): Promise<void> {
    if (this.currentLifeTime) return

    await assetsLoader.load(this.spriteData.name, this.spriteData.layers)

    this.tint(dudesSettings.value.dude.color)

    watch(
      () => dudesSettings.value.dude.scale,
      (scale) => {
        this.scale = scale
      },
      { immediate: true }
    )

    this.view.y = -(COLLIDER.y + COLLIDER.height - SPRITE_SIZE / 2) * this.scale

    this.view.x =
      Math.random() * (window.innerWidth - SPRITE_SIZE * this.scale) +
      (SPRITE_SIZE / 2) * this.scale

    this.direction = Math.random() > 0.5 ? 1 : -1

    this.nameBox = new DudeNameBox(this.name, this.individualParams?.name)
    this.visibleName(dudesSettings.value.dude.visibleName)

    this.messageBox = new DudeMessageBox(this.individualParams?.message)
    this.emoteSpitter = new DudeEmoteSpitter()

    this.view.sortableChildren = true
    this.view.addChild(this.nameBox.view)
    this.view.addChild(this.emoteSpitter.view)
    this.view.addChild(this.messageBox.view)

    this.playAnimation(DudeSpriteTags.Idle)

    this.idleAnimationTime = performance.now()
    this.maxIdleAnimationTime = Math.random() * 5000
    this.currentLifeTime = dudesSettings.value.dude.maxLifeTime
  }

  visibleName(visible: boolean): void {
    this.nameBox.visible(visible)
  }

  jump(): void {
    const tryJump = () => {
      if (this.animationState !== DudeSpriteTags.Jump) {
        this.velocity.x = this.direction * 100
        this.velocity.y = -300

        this.playAnimation(DudeSpriteTags.Jump)
        return
      }

      requestAnimationFrame(tryJump)
    }

    tryJump()
  }

  tint(color: string): void {
    if (!isValidColor(color)) return
    this.bodyColor = color
    this.sprite?.tint(this.bodyColor)
  }

  update(): void {
    const now = performance.now()

    if (
      this.landAnimationTime &&
      now - this.landAnimationTime > this.maxLandAnimationTime
    ) {
      this.playAnimation(DudeSpriteTags.Idle)
      this.landAnimationTime = null
    }

    if (
      this.idleAnimationTime &&
      this.maxIdleAnimationTime &&
      now - this.idleAnimationTime > this.maxIdleAnimationTime &&
      (this.animationState === DudeSpriteTags.Run ||
        this.animationState === DudeSpriteTags.Idle)
    ) {
      if (this.animationState === DudeSpriteTags.Idle) {
        this.playAnimation(DudeSpriteTags.Run)
      } else {
        this.playAnimation(DudeSpriteTags.Idle)
      }

      this.idleAnimationTime = now
      this.maxIdleAnimationTime = Math.random() * 5000
    }

    this.velocity.y =
      this.velocity.y + (dudesSettings.value.dude.gravity * DELTA_TIME) / ROUND

    const newPosition = {
      x: this.view.position.x + (this.velocity.x * DELTA_TIME) / ROUND,
      y: this.view.position.y + (this.velocity.y * DELTA_TIME) / ROUND
    }

    if (
      newPosition.y +
        (COLLIDER.y + COLLIDER.height - SPRITE_SIZE / 2) * this.scale >
      window.innerHeight
    ) {
      this.velocity.y = 0
      this.velocity.x = 0

      newPosition.y =
        window.innerHeight -
        (COLLIDER.y + COLLIDER.height - SPRITE_SIZE / 2) * this.scale

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
    const isCollidingMore =
      this.view.x + (COLLIDER.width / 2) * this.scale >= width
    const isCollidingLess = this.view.x - (COLLIDER.width / 2) * this.scale <= 0

    if (this.isGrowing) {
      if (this.scale <= dudesSettings.value.dude.growMaxScale) {
        this.updateScale(0.1)

        if (isCollidingMore) {
          this.direction = 1
        }

        if (isCollidingLess) {
          this.direction = -1
        }
      }

      this.growingTime -= DELTA_TIME
    }

    if (this.growingTime <= 0 && this.scale > dudesSettings.value.dude.scale) {
      this.isGrowing = false
      this.updateScale(-0.01)
    }

    if (isCollidingMore || isCollidingLess) {
      this.direction = -this.direction
      this.velocity.x = -this.velocity.x
      this.updateScale()
    }

    if (
      this.animationState !== DudeSpriteTags.Idle ||
      (this.isGrowing && this.scale < dudesSettings.value.dude.growMaxScale)
    ) {
      this.view.position.x += (this.direction * DELTA_TIME * 60) / ROUND
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
      this.nameBox.view.position.y - this.nameBox.view.height - 2 * this.scale

    this.nameBox.update(this.scale)
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

  grow(): void {
    if (this.isGrowing) return
    this.growingTime = dudesSettings.value.dude.growTime
    this.isGrowing = true
  }

  async playAnimation(
    frameTag: DudeSpriteFrameTag,
    force = false
  ): Promise<void> {
    const dudeSprite = spriteProvider.getSprite(this.spriteData.name, frameTag)
    if (!dudeSprite) return

    if (this.animationState === frameTag && !force) return
    this.animationState = frameTag

    if (this.sprite) {
      this.view.removeChild(this.sprite.view)
    }

    const { enabled: soundEnabled, volume } = dudesSettings.value.dude.sounds
    if (soundEnabled && frameTag === 'Jump') {
      soundsLoader.play('jump', volume)
    }

    this.sprite = new DudeSpriteContainer(
      dudeSprite[DudeSpriteLayers.Body],
      dudeSprite[DudeSpriteLayers.Eyes],
      dudeSprite[DudeSpriteLayers.Mouth],
      dudeSprite[DudeSpriteLayers.Cosmetics]
    )
    this.sprite.view.scale.set(this.direction * this.scale, this.scale)
    this.sprite.tint(this.bodyColor)

    this.view.addChild(this.sprite.view)
  }

  private updateScale(scale?: number): void {
    if (scale) {
      this.scale += scale
    }

    this.sprite?.view.scale.set(this.direction * this.scale, this.scale)
  }
}
