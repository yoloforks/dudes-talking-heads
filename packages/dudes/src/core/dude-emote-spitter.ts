import { AnimatedGIF } from '@pixi/gif'
import { Sprite, Container } from 'pixi.js'

import { dudesSettings } from '../composables/use-settings.js'
import { DELTA_TIME, ROUND } from '../constants.js'

export interface DudeEmoteSpitterParams {
  enabled: boolean
}

const emotesCache = new Map<string, ArrayBuffer>()

export class DudeEmoteSpitter {
  view = new Container()

  private emotes: Sprite[] = []
  private gapTime = ROUND
  private currentGapTime = 0
  private moveSpeed = 50
  private alphaSpeed = 1
  private scaleSpeed = 0.5

  add(url: string): void {
    if (!dudesSettings.value.spitter.enabled) return
    this.view.zIndex = 1
    const sprite = this.loadSprite(url)
    if (sprite) {
      this.addSprite(sprite)
    }
  }

  private addSprite(sprite: Sprite): void {
    sprite.anchor.set(0.5, 0.5)
    sprite.scale.set(0, 0)
    this.emotes.push(sprite)
  }

  private bufferToSprite(buffer: ArrayBuffer): Sprite {
    const sprite = AnimatedGIF.fromBuffer(buffer)
    return sprite
  }

  private loadSprite(url: string): Sprite | undefined {
    if (!url.endsWith('.gif')) {
      const sprite = Sprite.from(url)
      return sprite
    }

    const cachedEmote = emotesCache.get(url)
    if (cachedEmote) return this.bufferToSprite(cachedEmote)

    fetch(url)
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        emotesCache.set(url, buffer)
        const sprite = this.bufferToSprite(buffer)
        this.addSprite(sprite)
      })
  }

  update(): void {
    for (const child of this.view.children) {
      child.position.y -= (DELTA_TIME * this.moveSpeed) / ROUND
      child.scale.x += (DELTA_TIME * this.scaleSpeed) / ROUND
      child.scale.y += (DELTA_TIME * this.scaleSpeed) / ROUND

      if (child.scale.x > 1) {
        child.alpha -= (DELTA_TIME * this.alphaSpeed) / ROUND
      }

      if (child.alpha <= 0) {
        this.view.removeChild(child)
      }
    }

    if (this.currentGapTime >= 0) {
      this.currentGapTime -= DELTA_TIME
    } else {
      if (this.emotes.length > 0) {
        const sprite = this.emotes.shift()
        if (!sprite) return
        this.view.addChild(sprite)
        this.currentGapTime = this.gapTime
      }
    }
  }
}
