import { Container, Sprite } from 'pixi.js'

import { FIXED_DELTA_TIME, FIXED_ROUND } from '../constants.js'

export class DudeEmoteSpitter {
  view = new Container()

  private emotes: Sprite[] = []
  private gapTime = FIXED_ROUND
  private currentGapTime = 0
  private moveSpeed = 50
  private alphaSpeed = 1
  private scaleSpeed = 0.5

  add(url: string): void {
    const sprite = Sprite.from(url)
    sprite.anchor.set(0.5, 0.5)
    sprite.scale.set(0, 0)
    this.emotes.push(sprite)
  }

  update(): void {
    for (const child of this.view.children) {
      child.position.y -= (FIXED_DELTA_TIME * this.moveSpeed) / FIXED_ROUND
      child.scale.x += (FIXED_DELTA_TIME * this.scaleSpeed) / FIXED_ROUND
      child.scale.y += (FIXED_DELTA_TIME * this.scaleSpeed) / FIXED_ROUND

      if (child.scale.x > 1) {
        child.alpha -= (FIXED_DELTA_TIME * this.alphaSpeed) / FIXED_ROUND
      }

      if (child.alpha <= 0) {
        this.view.removeChild(child)
      }
    }

    if (this.currentGapTime >= 0) {
      this.currentGapTime -= FIXED_DELTA_TIME
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
