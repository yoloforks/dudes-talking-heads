import { AnimatedGIF } from '@pixi/gif'
import { Container, Sprite } from 'pixi.js'

import { DELTA_TIME, ROUND } from '../constants.js'

export interface DudeEmoteSpitterParams {
  enabled: boolean
}

const emotesCache = new Map<string, ArrayBuffer>()

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export class DudeEmoteSpitter {
  view = new Container()

  private emotes: Sprite[] = []
  private gapTime = ROUND
  private currentGapTime = 0
  private moveSpeed = 50
  private alphaSpeed = 1
  private scaleSpeed = 0.5

  async add(urls: string[]): Promise<void> {
    for (const url of urls) {
      try {
        this.view.zIndex = 1
        const sprite = await this.loadSprite(url)
        this.addSprite(sprite)
        await sleep(400)
      } catch (err) {
        console.error(err)
      }
    }
  }

  private addSprite(sprite: Sprite): void {
    sprite.anchor.set(0.5, 0.5)
    sprite.scale.set(0, 0)
    this.emotes.push(sprite)
  }

  private bufferToSprite(buffer: ArrayBuffer): Sprite {
    const sprite = AnimatedGIF.fromBuffer(buffer, { fps: 60 })
    return sprite
  }

  private async loadSprite(url: string): Promise<Sprite> {
    if (!url.endsWith('.gif')) {
      const sprite = Sprite.from(url)
      return sprite
    }

    const cachedEmote = emotesCache.get(url)
    if (cachedEmote) return this.bufferToSprite(cachedEmote)

    const response = await fetch(url)
    const buffer = await response.arrayBuffer()
    emotesCache.set(url, buffer)
    const sprite = this.bufferToSprite(buffer)
    return sprite
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
