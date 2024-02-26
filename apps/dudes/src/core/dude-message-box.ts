import { gsap } from 'gsap'
import { Container, Graphics, Text, TextMetrics } from 'pixi.js'

import { dudesSettings } from '../composables/use-settings.js'
import { DELTA_TIME } from '../constants.js'
import type { DudesTypes } from '../types.js'

const ANIMATION_TIME = 500

const ARROW_WIDTH = 25
const ARROW_HEIGHT = 10
const ARROW_HALF_WIDTH = ARROW_WIDTH / 2

export class DudeMessageBox {
  view = new Container()

  private container = new Container()
  private box: Graphics | null = null
  private text: Text | null = null
  private showAnimation: gsap.core.Timeline
  private hideAnimation: gsap.core.Tween | null = null

  private currentAnimationTime = 0
  private currentShowTime = 0
  private messageQueue: string[] = []

  constructor(
    private individualParams?: DudesTypes.IndividualMessageBoxParams
  ) {
    this.view.zIndex = 3
    this.view.addChild(this.container)

    const timeline = gsap.timeline({
      paused: true
    })

    timeline.to(this.container, {
      duration: 0.5,
      alpha: 1,
      ease: 'sine.in'
    })

    timeline.to(this.container, {
      duration: 1.5,
      y: -20,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    this.showAnimation = timeline
  }

  get params(): DudesTypes.MessageBoxParams {
    return this.individualParams
      ? { ...dudesSettings.value.message, ...this.individualParams }
      : dudesSettings.value.message
  }

  update(): void {
    if (this.currentAnimationTime >= 0) {
      this.currentAnimationTime -= DELTA_TIME
    }

    if (this.currentShowTime <= 0) {
      if (
        this.container.children.length > 0 &&
        !this.hideAnimation?.isActive()
      ) {
        this.showNextMessage()
      }

      this.showMessage()
    } else {
      this.currentShowTime -= DELTA_TIME
    }
  }

  add(message: string): void {
    if (!message.length || !dudesSettings.value.message.enabled) return
    this.messageQueue.push(message.trim())
  }

  private setText(text: string): void {
    if (!this.text) return

    const metrics = TextMetrics.measureText(text, this.text.style)

    this.text.text =
      metrics.lines.length > 4
        ? metrics.lines.slice(0, 4).join(' ').slice(0, -3) + '...'
        : text
  }

  private showMessage(): void {
    if (this.messageQueue.length !== 1 || this.showAnimation.isActive()) return

    const message = this.messageQueue.shift()
    if (message) {
      this.show(message)
      this.showAnimation.play(0)
    }

    this.container.alpha = 0
    this.currentShowTime = dudesSettings.value.message.showTime
    this.currentAnimationTime = ANIMATION_TIME
  }

  private showNextMessage(): void {
    if (this.messageQueue.length > 0 && this.text) {
      const message = this.messageQueue.shift()
      if (message) {
        this.container.removeChildren()
        this.show(message)
        this.currentShowTime = dudesSettings.value.message.showTime
        this.currentAnimationTime = ANIMATION_TIME
      }

      return
    }

    this.hideAnimation = gsap.to(this.container, {
      alpha: 0,
      duration: 0.5,
      ease: 'sine.out',
      onComplete: () => {
        this.hideAnimation?.kill()
        this.hideAnimation = null
        this.showAnimation.pause()
        this.container.removeChildren()
      }
    })
  }

  private show(message: string): void {
    this.text = new Text('', {
      ...this.params,
      align: 'left',
      breakWords: true,
      wordWrap: true,
      wordWrapWidth: 200
    })

    const { padding, boxColor, borderRadius } = this.params
    this.text.anchor.set(0.5, 1)
    this.text.position.set(0, -padding)
    this.setText(message)

    this.box = new Graphics()
    this.box.beginFill(boxColor)

    const arrowX = this.box.x + this.box.width / 2
    const arrowY = this.box.y + this.box.height

    this.box.lineTo(arrowX, arrowY + ARROW_HEIGHT)
    this.box.lineTo(arrowX + ARROW_HALF_WIDTH, arrowY)

    this.box.drawRoundedRect(
      this.text.x - padding - this.text.width * this.text.anchor.x,
      this.text.y - padding - this.text.height * this.text.anchor.y,
      this.text.width + padding * 2,
      this.text.height + padding * 2,
      borderRadius
    )
    this.box.endFill()

    this.container.addChild(this.box, this.text)
  }
}
