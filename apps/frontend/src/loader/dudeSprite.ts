import { AnimatedSprite, Container } from 'pixi.js';

export type InitSettings = {
  direction: number;
  scale: number;
}

export class DudeSprite {
  private body: AnimatedSprite;
  private eyes: AnimatedSprite;

  public view: Container;

  constructor(body: AnimatedSprite, eyes: AnimatedSprite) {
    this.body = body;
    this.eyes = eyes;

    this.body.zIndex = 1;
    this.eyes.zIndex = 2;

    this.view = new Container();
    this.view.addChild(body, eyes);
    this.view.sortableChildren = true;

    this.body.anchor.set(0.5);
    this.eyes.anchor.set(0.5);

    this.body.autoUpdate = false;
    this.body.play();

    this.eyes.autoUpdate = false;
    this.eyes.play();
  }

  public update(delta: number) {
    this.body.update(delta);
    this.eyes.update(delta);
  }

  public tint(color: string) {
    this.body.tint = color;
  }
}
