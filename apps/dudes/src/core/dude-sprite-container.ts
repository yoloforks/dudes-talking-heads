import { AnimatedSprite, Container } from 'pixi.js'

export class DudeSpriteContainer {
  view = new Container()

  constructor(
    private body: AnimatedSprite,
    private eyes?: AnimatedSprite,
    private cosmetics?: AnimatedSprite
  ) {
    const sprites = [body]

    this.body = body
    body.zIndex = 1
    body.anchor.set(0.5)
    body.play()

    if (eyes) {
      this.eyes = eyes
      eyes.zIndex = 2
      eyes.anchor.set(0.5)
      eyes.play()
      sprites.push(eyes)
    }

    if (cosmetics) {
      this.cosmetics = cosmetics
      cosmetics.zIndex = 3
      cosmetics.anchor.set(0.5)
      cosmetics.play()
      sprites.push(cosmetics)
    }

    this.view.addChild(...sprites)
    this.view.sortableChildren = true

    this.body.play()
    this.eyes?.play()
    this.cosmetics?.play()
  }

  update(delta: number): void {
    this.body.update(delta)
    this.eyes?.update(delta)
    this.cosmetics?.update(delta)
  }

  tint(color: string): void {
    this.body.tint = color
  }
}
