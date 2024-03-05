import { AnimatedSprite, Container } from 'pixi.js'

import { DudesLayersKeys } from './sprite-provider.js'
import type { DudesLayer } from './sprite-provider.js'

export class DudeSpriteContainer {
  readonly view = new Container()

  private Body?: AnimatedSprite
  private Eyes?: AnimatedSprite
  private Mouth?: AnimatedSprite
  private Hat?: AnimatedSprite
  private Cosmetics?: AnimatedSprite

  constructor(animatedSprites: AnimatedSprite[]) {
    animatedSprites.forEach((sprite, index) => {
      if (!sprite) return

      const layer = sprite.name as DudesLayer
      sprite.zIndex = index + 1
      sprite.anchor.set(0.5)
      sprite.play()
      this.view.addChild(sprite)
      this[layer] = sprite
    })
  }

  update(delta: number): void {
    for (const layer of DudesLayersKeys) {
      const layerKey = layer as DudesLayer
      this[layerKey]?.update(delta)
    }
  }

  setColor(layer: DudesLayer, color: string): void {
    if (!this[layer]) return
    this[layer]!.tint = color
  }
}
