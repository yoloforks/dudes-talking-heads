import { AnimatedSprite, Container } from 'pixi.js'

import { DudesLayers, DudesLayersKeys } from './sprite-provider.js'
import type { DudesLayer } from './sprite-provider.js'

function prepareSprite(sprite: AnimatedSprite, zIndex: number): AnimatedSprite {
  sprite.zIndex = zIndex
  sprite.anchor.set(0.5)
  sprite.play()
  return sprite
}

export class DudeSpriteContainer {
  view = new Container()

  constructor(
    private Body?: AnimatedSprite,
    private Eyes?: AnimatedSprite,
    private Mouth?: AnimatedSprite,
    private Hat?: AnimatedSprite,
    private Cosmetics?: AnimatedSprite
  ) {
    const sprites = []

    if (Body) {
      this.Body = prepareSprite(Body, 1)
      sprites.push(this.Body)
    }

    if (Eyes) {
      this.Eyes = prepareSprite(Eyes, 2)
      sprites.push(this.Eyes)
    }

    if (Mouth) {
      this.Mouth = prepareSprite(Mouth, 2)
      sprites.push(this.Mouth)
    }

    if (Hat) {
      this.Hat = prepareSprite(Hat, 3)
      sprites.push(this.Hat)
    }

    if (Cosmetics) {
      this.Cosmetics = prepareSprite(Cosmetics, 4)
      sprites.push(this.Cosmetics)
    }

    this.view.addChild(...sprites)
    this.view.sortableChildren = true
  }

  update(delta: number): void {
    for (const layer of DudesLayersKeys) {
      const layerKey = layer as keyof typeof DudesLayers
      this[layerKey]?.update(delta)
    }
  }

  setColor(type: DudesLayer, color: string): void {
    if (!this[type]) return
    this[type]!.tint = color
  }
}
