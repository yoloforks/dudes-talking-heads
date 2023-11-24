import { Container, Sprite } from 'pixi.js';
import { Constants } from '../constants';

export class DudeEmoteSpitter {
  public view: Container = new Container();

  private emotes: Sprite[] = [];

  private currentTime = 0;
  private maxDelay = 1;

  private moveSpeed = 50 / 1000;
  private alphaSpeed = 0.5 / 1000;
  private scaleSpeed = 0.5 / 1000;

  public add(url: string) {
    const sprite = Sprite.from(url);
    sprite.anchor.set(0.5, 1);
    sprite.position.set(0, -100);
    sprite.scale.set(0, 0);
    this.emotes.push(sprite);
  }

  public update() {
    for (const child of this.view.children) {
      const position = child.position;
      const scale = child.scale;
      child.position.set(
        position.x,
        position.y - this.moveSpeed * Constants.fixedDeltaTime
      );
      child.alpha -= this.alphaSpeed * Constants.fixedDeltaTime;
      child.scale.set(
        scale.x + this.scaleSpeed * Constants.fixedDeltaTime,
        scale.y + this.scaleSpeed * Constants.fixedDeltaTime
      );

      if (child.alpha <= 0) {
        this.view.removeChild(child);
      }
    }

    this.currentTime += Constants.fixedDeltaTime / 1000;

    if (this.currentTime > this.maxDelay && this.emotes.length > 0) {
      const sprite = this.emotes.shift();
      this.view.addChild(sprite!);
      this.currentTime = 0;
    }
  }
}
