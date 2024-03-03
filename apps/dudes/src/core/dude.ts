import { Container } from 'pixi.js'
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
  DudesFrameTags,
  DudesLayers,
  DudesLayersKeys,
  spriteProvider
} from './sprite-provider.js'
import type { DudesTypes } from '../types.js'
import type { DudesLayer, DudeSpriteFrameTag } from './sprite-provider.js'

type Direction = 1 | -1

export class Dude {
  view = new Container()

  private colors: Record<DudesLayer, string> = {
    Body: dudesSettings.value.dude.bodyColor,
    Eyes: '#FFF',
    Mouth: '#FFF',
    Hat: '#FFF',
    Cosmetics: '#FFF'
  }
  private direction: Direction
  private currentFrameTag?: DudeSpriteFrameTag

  private sprite?: DudeSpriteContainer
  private nameBox: DudeNameBox
  private messageBox: DudeMessageBox
  private emoteSpitter: DudeEmoteSpitter

  private velocity: IPointData = {
    x: 0,
    y: 0
  }

  private landAnimationTime: number | null = null
  private maxLandAnimationTime = 200

  private idleAnimationTime?: number
  private maxIdleAnimationTime?: number

  private isGrowing: boolean
  private growingTime: number

  private currentLifeTime = dudesSettings.value.dude.maxLifeTime
  private maxOpacityTime = 5000
  private currentOpacityTime = this.maxOpacityTime
  private scale = dudesSettings.value.dude.scale

  constructor(
    public name: string,
    public spriteData: DudesTypes.SpriteData,
    private individualParams?: DudesTypes.IndividualDudeParams
  ) {
    this.jump = this.jump.bind(this)
  }

  async init(): Promise<void> {
    if (this.sprite) return

    await assetsLoader.load(this.spriteData)

    this.view.y = -(COLLIDER.y + COLLIDER.height - SPRITE_SIZE / 2) * this.scale
    this.view.x =
      Math.random() * (window.innerWidth - SPRITE_SIZE * this.scale) +
      (SPRITE_SIZE / 2) * this.scale

    this.nameBox = new DudeNameBox(this.name, this.individualParams?.name)
    this.messageBox = new DudeMessageBox(this.individualParams?.message)
    this.emoteSpitter = new DudeEmoteSpitter()

    this.view.sortableChildren = true
    this.view.addChild(this.nameBox.view)
    this.view.addChild(this.messageBox.view)
    this.view.addChild(this.emoteSpitter.view)

    this.updateDirection()
    this.updateIdleAnimationTime(performance.now())

    this.playAnimation(DudesFrameTags.Idle)
  }

  jump(): void {
    if (this.currentFrameTag !== DudesFrameTags.Jump) {
      this.velocity.x = this.direction * 100
      this.velocity.y = -300

      this.playAnimation(DudesFrameTags.Jump)
      return
    }

    requestAnimationFrame(this.jump)
  }

  addMessage(message: string): void {
    this.messageBox.add(message)

    this.currentLifeTime = dudesSettings.value.dude.maxLifeTime
    this.currentOpacityTime = this.maxOpacityTime
    this.view.alpha = 1
  }

  addEmotes(emotes: string[]): void {
    if (!dudesSettings.value.emotes.enabled) return
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

    if (this.currentFrameTag === frameTag && !force) return
    this.currentFrameTag = frameTag

    if (this.sprite) {
      this.view.removeChild(this.sprite.view)
    }

    const { enabled: soundEnabled, volume } = dudesSettings.value.dude.sounds
    if (soundEnabled && frameTag === 'Jump') {
      soundsLoader.play('jump', volume)
    }

    this.sprite = new DudeSpriteContainer([
      dudeSprite[DudesLayers.Body],
      dudeSprite[DudesLayers.Eyes],
      dudeSprite[DudesLayers.Mouth],
      dudeSprite[DudesLayers.Hat],
      dudeSprite[DudesLayers.Cosmetics]
    ])
    this.sprite.view.scale.set(this.direction * this.scale, this.scale)

    for (const layer of DudesLayersKeys) {
      const layerKey = layer as DudesLayer
      this.sprite?.setColor(DudesLayers[layerKey], this.colors[layerKey])
    }

    this.view.addChild(this.sprite.view)
  }

  update(): void {
    const now = performance.now()

    if (
      this.landAnimationTime &&
      now - this.landAnimationTime > this.maxLandAnimationTime
    ) {
      this.playAnimation(DudesFrameTags.Idle)
      this.landAnimationTime = null
    }

    if (
      this.idleAnimationTime &&
      this.maxIdleAnimationTime &&
      now - this.idleAnimationTime > this.maxIdleAnimationTime &&
      (this.currentFrameTag === DudesFrameTags.Run ||
        this.currentFrameTag === DudesFrameTags.Idle)
    ) {
      if (this.currentFrameTag === DudesFrameTags.Idle) {
        this.playAnimation(DudesFrameTags.Run)
      } else {
        this.playAnimation(DudesFrameTags.Idle)
      }

      this.updateIdleAnimationTime(now)
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

      if (this.currentFrameTag === DudesFrameTags.Fall) {
        this.playAnimation(DudesFrameTags.Land)
        this.landAnimationTime = now
      }
    }

    this.view.position.set(newPosition.x, newPosition.y)

    if (this.velocity.y > 0) {
      this.playAnimation(DudesFrameTags.Fall)
    }

    const width = window.innerWidth
    const isCollidingMore =
      this.view.x + (COLLIDER.width / 2) * this.scale >= width
    const isCollidingLess = this.view.x - (COLLIDER.width / 2) * this.scale <= 0

    if (this.isGrowing) {
      if (this.scale <= dudesSettings.value.dude.growMaxScale) {
        this.updateScale(0.1)

        if (isCollidingMore) {
          this.updateDirection(1)
        }

        if (isCollidingLess) {
          this.updateDirection(-1)
        }
      }

      this.growingTime -= DELTA_TIME
    }

    if (this.growingTime <= 0 && this.scale > dudesSettings.value.dude.scale) {
      this.isGrowing = false
      this.updateScale(-0.01)
    }

    if (isCollidingMore || isCollidingLess) {
      this.updateDirection(-this.direction)
      // this.direction = -this.direction
      this.velocity.x = -this.velocity.x
      this.view.position.x += (this.direction * DELTA_TIME * 60) / ROUND

      if (Math.random() >= 0.7) {
        this.updateScale()
      }
    }

    if (
      this.currentFrameTag !== DudesFrameTags.Idle ||
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

  updateDirection(direction?: Direction): void {
    this.direction = direction ?? Math.random() > 0.5 ? 1 : -1
  }

  updateColor(layer: DudesLayer, color: string): void {
    if (!isValidColor(color) || !this.sprite?.[layer]) return
    this.colors[layer] = color
    this.sprite.setColor(layer, color)
  }

  updateScale(scale?: number, force = false): void {
    if (scale) {
      if (force) {
        this.scale = scale
      } else {
        this.scale += scale
      }
    }

    this.sprite?.view.scale.set(this.direction * this.scale, this.scale)
  }

  updateIdleAnimationTime(time: number, maxTime?: number): void {
    this.idleAnimationTime = time
    this.maxIdleAnimationTime = maxTime ?? Math.random() * 5000
  }

  async updateSpriteData(spriteData: DudesTypes.SpriteData): Promise<void> {
    spriteData.name += '-' + Date.now()
    await assetsLoader.load(spriteData)

    assetsLoader.unload(this.spriteData.name)
    spriteProvider.unloadTextures(this.spriteData.name)
    this.spriteData = spriteData

    this.playAnimation('Idle', true)
  }
}
