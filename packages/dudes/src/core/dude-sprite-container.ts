import { AnimatedSprite, Container } from 'pixi.js'

interface DudeSpriteContainerParams {
  body: AnimatedSprite
  eyes: AnimatedSprite
}

export class DudeSpriteContainer {
  view = new Container()

  private body: AnimatedSprite
  private eyes: AnimatedSprite

  constructor({ body, eyes }: DudeSpriteContainerParams) {
    this.body = body
    this.eyes = eyes

    this.body.zIndex = 1
    this.eyes.zIndex = 2

    this.view.addChild(body, eyes)
    this.view.sortableChildren = true

    this.body.anchor.set(0.5)
    this.eyes.anchor.set(0.5)

    this.body.autoUpdate = false
    this.body.play()

    this.eyes.autoUpdate = false
    this.eyes.play()
  }

  update(delta: number): void {
    this.body.update(delta)
    this.eyes.update(delta)
  }

  color(color: string): void {
    this.body.tint = color
  }
}
