import * as PIXI from 'pixi.js';
import { appAssetsLoader } from '../../loader/appAssetsLoader';
import { DudeMessage } from './DudeMessage';
import { renderer } from '../../main';
import { DudeSprite } from '../../loader/dudeSprite';

export enum AnimationState {
  Idle = 'Idle',
  Run = 'Run',
  Jump = 'Jump',
  Land = 'Land',
  Fall = 'Fall',
}

type Collider = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export class Dude {
  private name: string;
  private messages: string[] = [];

  private spriteName: string = 'dude';

  private currentScale: number = 4;

  private direction: number = 1;

  private collider: Collider = {
    x: 9,
    y: 8,
    width: 14,
    height: 16,
  };

  private spriteSize: number = 32;

  private animationState?: AnimationState;

  private sprite?: DudeSprite;

  private color: string = '#969696';

  private currentMessage?: PIXI.Container;

  public view: PIXI.Container = new PIXI.Container();

  private maxMessageTime: number = 10000;
  private currentMessageTime: number = 0;

  private velocity: PIXI.IPointData = {
    x: 0,
    y: 0,
  };

  private gravity: number = 400;

  private landAnimationTime?: number;
  private maxLandAnimationTime: number = 200;

  private runIdleAnimationTime?: number;
  private maxRunIdleAnimdationTime?: number;

  private maxLifeTime: number = 1000 * 60 * 5;
  private currentLifeTime: number = this.maxLifeTime;

  private maxOpacityTime: number = 5000;
  private currentOpacityTime: number = this.maxOpacityTime;

  public shouldBeDeleted: boolean = false;

  private isJumping = () =>
    this.animationState == AnimationState.Fall ||
    this.animationState == AnimationState.Jump;

  constructor(name: string, sprite?: string) {
    this.name = name;
    this.spriteName = sprite ?? this.spriteName;

    const width = renderer.width;

    this.view.y =
      -(this.collider.y + this.collider.height - this.spriteSize / 2) *
      this.currentScale;
    this.view.x =
      Math.random() * (width - this.spriteSize * this.currentScale) +
      (this.spriteSize / 2) * this.currentScale;

    this.direction = Math.random() > 0.5 ? 1 : -1;

    this.view.addChild(this.getNameText());

    this.playAnimation(AnimationState.Idle);

    this.runIdleAnimationTime = performance.now();
    this.maxRunIdleAnimdationTime = Math.random() * 5000;
  }

  private getNameText(): PIXI.Text {
    const text = new PIXI.Text(this.name, {
      fontFamily: 'Arial',
      fontSize: 18,
      fill: 0xffffff,
      align: 'center',
      lineJoin: 'round',
      strokeThickness: 4,
      stroke: 'black',
    });

    text.anchor.set(0.5, 0.5);
    text.position.y = (-this.spriteSize / 2 + 4) * this.currentScale;
    text.zIndex = 100;

    return text;
  }

  jump() {
    if (!this.isJumping()) {
      this.velocity.x = this.direction * 100;
      this.velocity.y = -300;

      this.playAnimation(AnimationState.Jump);
    }
  }

  tint(color: string) {
    if (color) {
      this.color = color;
    }

    this.sprite?.tint(color);
  }

  update() {
    const now = performance.now();
    const fixedDeltaTime = 0.02 * 1000;

    if (
      this.landAnimationTime &&
      now - this.landAnimationTime > this.maxLandAnimationTime
    ) {
      this.playAnimation(AnimationState.Idle);
      this.landAnimationTime = undefined;
    }

    if (
      this.runIdleAnimationTime &&
      this.maxRunIdleAnimdationTime &&
      now - this.runIdleAnimationTime > this.maxRunIdleAnimdationTime &&
      (this.animationState == AnimationState.Run ||
        this.animationState == AnimationState.Idle)
    ) {
      if (this.animationState == AnimationState.Idle) {
        this.playAnimation(AnimationState.Run);
      } else {
        this.playAnimation(AnimationState.Idle);
      }

      this.runIdleAnimationTime = now;
      this.maxRunIdleAnimdationTime = Math.random() * 5000;
    }

    this.velocity.y = this.velocity.y + (this.gravity * fixedDeltaTime) / 1000;

    const newPosition = {
      x: this.view.position.x + (this.velocity.x * fixedDeltaTime) / 1000,
      y: this.view.position.y + (this.velocity.y * fixedDeltaTime) / 1000,
    };

    if (
      newPosition.y +
        (this.collider.y + this.collider.height - this.spriteSize / 2) *
          this.currentScale >
      renderer.height
    ) {
      this.velocity.y = 0;
      this.velocity.x = 0;

      newPosition.y =
        renderer.height -
        (this.collider.y + this.collider.height - this.spriteSize / 2) *
          this.currentScale;

      if (this.animationState == AnimationState.Fall) {
        this.playAnimation(AnimationState.Land);
        this.landAnimationTime = now;
      }
    }

    this.view.position.set(newPosition.x, newPosition.y);

    if (this.velocity.y > 0) {
      this.playAnimation(AnimationState.Fall);
    }

    const width = renderer.width;

    if (this.animationState != AnimationState.Idle) {
      this.view.position.x += (1 * this.direction * fixedDeltaTime * 60) / 1000;

      if (
        this.view.x + (this.collider.width / 2) * this.currentScale >= width ||
        this.view.x - (this.collider.width / 2) * this.currentScale <= 0
      ) {
        this.direction = -this.direction;
        this.velocity.x = -this.velocity.x;
        this.sprite?.view.scale.set(this.direction * this.currentScale, this.currentScale);
      }
    }

    if (this.currentMessageTime <= 0) {
      if (this.messages.length > 0) {
        this.currentMessageTime = this.maxMessageTime;

        const message = this.messages.shift();

        if (message) {
          this.showMessage(message);
        }
      } else {
        this.hideMessage();
      }
    } else if (this.currentMessageTime > 0) {
      this.currentMessageTime -= fixedDeltaTime;
    }

    if (this.currentLifeTime > 0) {
      this.currentLifeTime -= fixedDeltaTime;
    } else {
      if (this.currentOpacityTime > 0) {
        this.currentOpacityTime -= fixedDeltaTime;
        this.view.alpha = this.currentOpacityTime / this.maxOpacityTime;
      } else {
        this.shouldBeDeleted = true;
      }
    }

    this.sprite?.update((fixedDeltaTime / 1000) * 60);
  }

  hideMessage() {
    if (this.currentMessage) {
      this.view.removeChild(this.currentMessage);
    }
  }

  showMessage(text: string) {
    const message = new DudeMessage(text);
    message.view.position.y = (-this.spriteSize / 2 - 4) * this.currentScale;

    if (this.currentMessage) {
      this.view.removeChild(this.currentMessage);
    }

    this.currentMessage = message.view;
    this.view.addChild(this.currentMessage);

    this.currentLifeTime = this.maxLifeTime;
  }

  addMessage(message: string) {
    this.messages.push(message);
  }

  async playAnimation(state: AnimationState) {
    if (this.animationState == state) {
      return;
    }

    this.animationState = state;

    if (this.sprite) {
      this.view.removeChild(this.sprite.view);
    }

    const dudeSprite = appAssetsLoader.getSprite(this.spriteName, state);
    this.sprite = new DudeSprite(dudeSprite.body, dudeSprite.eyes);
    this.sprite.view.scale.set(this.direction * this.currentScale, this.currentScale);
    this.sprite.tint(this.color);

    this.view.addChild(this.sprite.view);
  }
}
