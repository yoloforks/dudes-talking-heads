import { AnimatedSprite, Container } from 'pixi.js'

interface DudeSpriteContainerParams {
  body: AnimatedSprite
  cosmetics?: AnimatedSprite
  outline: AnimatedSprite
  eyes?: AnimatedSprite
}

export class DudeSpriteContainer {
  view = new Container()

  private body: AnimatedSprite
  private outline: AnimatedSprite
  private eyes?: AnimatedSprite
  private cosmetics?: AnimatedSprite

  constructor({ body, cosmetics, outline, eyes }: DudeSpriteContainerParams) {
    this.body = body
    this.outline = outline

    this.outline.zIndex = 1
    this.body.zIndex = 2

    const sprites = [body, outline]

    if (eyes) {
      this.eyes = eyes
      this.eyes.zIndex = 3
      this.eyes.anchor.set(0.5)
      this.eyes.play()
      sprites.push(eyes)
    }

    if (cosmetics) {
      this.cosmetics = cosmetics
      this.cosmetics.zIndex = 4
      this.cosmetics.anchor.set(0.5)
      this.cosmetics.play()
      sprites.push(cosmetics)
    }

    this.view.addChild(...sprites)
    this.view.sortableChildren = true

    this.body.anchor.set(0.5)
    this.outline.anchor.set(0.5)

    this.body.play()
    this.outline.play()
  }

  update(delta: number): void {
    this.body.update(delta)
    this.outline.update(delta)
    this.eyes?.update(delta)
    this.cosmetics?.update(delta)
  }

  eyesColor(color: string): void {
    if (this.eyes) {
      this.eyes.tint = color
    }
  }

  cosmeticsColor(color: string): void {
    if (this.cosmetics) {
      this.cosmetics.tint = color
    }
  }

  bodyColor(color: string): void {
    this.body.tint = color
  }
}
