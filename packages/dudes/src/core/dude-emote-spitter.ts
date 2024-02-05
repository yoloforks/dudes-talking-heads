import { AnimatedGIF } from '@pixi/gif'
import { Container } from 'pixi.js'

import { dudesSettings } from '../composables/use-settings.js'
import { DELTA_TIME, ROUND } from '../constants.js'

export interface DudeEmoteSpitterParams {
  enabled: boolean
}

const emotesCache = new Map<string, ArrayBuffer>()

export class DudeEmoteSpitter {
  view = new Container()

  private emotes: AnimatedGIF[] = []
  private gapTime = ROUND
  private currentGapTime = 0
  private moveSpeed = 50
  private alphaSpeed = 1
  private scaleSpeed = 0.5

  async add(url: string): Promise<void> {
    if (!dudesSettings.value.spitter.enabled) return
    this.view.zIndex = 1

    const buffer = await this.loadEmote(url)
    const sprite = AnimatedGIF.fromBuffer(buffer)
    sprite.anchor.set(0.5, 0.5)
    sprite.scale.set(0, 0)
    this.emotes.push(sprite)
  }

  private async loadEmote(url: string) {
    const cachedEmote = emotesCache.get(url)
    if (cachedEmote) return cachedEmote

    const response = await fetch(url)
    const buffer = await response.arrayBuffer()
    emotesCache.set(url, buffer)
    return buffer
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
