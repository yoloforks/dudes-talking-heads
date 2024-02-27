import { AnimatedSprite, Container } from 'pixi.js'

function prepareSprite(sprite: AnimatedSprite, zIndex: number): AnimatedSprite {
  sprite.zIndex = zIndex
  sprite.anchor.set(0.5)
  sprite.play()
  return sprite
}

export class DudeSpriteContainer {
  view = new Container()

  constructor(
    private body?: AnimatedSprite,
    private eyes?: AnimatedSprite,
    private mouth?: AnimatedSprite,
    private cosmetics?: AnimatedSprite
  ) {
    const sprites = []

    if (body) {
      this.body = prepareSprite(body, 1)
      sprites.push(this.body)
    }

    if (eyes) {
      this.eyes = prepareSprite(eyes, 2)
      sprites.push(this.eyes)
    }

    if (mouth) {
      this.mouth = prepareSprite(mouth, 2)
      sprites.push(this.mouth)
    }

    if (cosmetics) {
      this.cosmetics = prepareSprite(cosmetics, 3)
      sprites.push(this.cosmetics)
    }

    this.view.addChild(...sprites)
    this.view.sortableChildren = true
  }

  update(delta: number): void {
    this.body?.update(delta)
    this.eyes?.update(delta)
    this.mouth?.update(delta)
    this.cosmetics?.update(delta)
  }

  tint(color: string): void {
    if (!this.body) return
    this.body.tint = color
  }
}
