import { Container, Graphics, Text, TextMetrics } from 'pixi.js'

import { dudesSettings } from '../composables/use-settings.js'
import { DELTA_TIME } from '../constants.js'

export interface DudeMessageBoxParams {
  /**
   * @default true
   */
  enabled: boolean

  /**
   * @default '#EEE'
   */
  boxColor: string

  /**
   * @default '#333'
   */
  fill: string

  /**
   * @default 20
   */
  fontSize: number

  /**
   * @default 'Arial'
   */
  fontFamily: string

  /**
   * @default 10
   */
  borderRadius: number

  /**
   * @default 10
   */
  padding: number

  /**
   * @default 5_000
   */
  showTime: number
}

export type DudePersonalMessageBoxParams = Partial<
  Pick<DudeMessageBoxParams, 'boxColor' | 'fill'>
>

interface Bound {
  x: number
  y: number
  width: number
  height: number
}

export class DudeMessageBox {
  view = new Container()

  private container = new Container()
  private box: Graphics | null = null
  private text: Text | null = null

  private animationTime = 500
  private currentAnimationTime = 0
  private shift = 30
  private currentShowTime = 0
  private messageQueue: string[] = []

  constructor(private settings?: DudePersonalMessageBoxParams) {
    this.view.zIndex = 3
    this.view.addChild(this.container)
  }

  get params(): DudeMessageBoxParams {
    return this.settings
      ? { ...dudesSettings.value.message, ...this.settings }
      : dudesSettings.value.message
  }

  update(): void {
    if (this.currentAnimationTime >= 0) {
      this.currentAnimationTime -= DELTA_TIME

      this.container.alpha += DELTA_TIME / this.animationTime
      this.container.position.y -=
        (this.shift * DELTA_TIME) / this.animationTime
    } else {
      this.container.alpha = 1
    }

    if (this.currentShowTime <= 0) {
      if (this.container.children.length > 0) {
        this.container.removeChildren()
      }

      this.nextMessage()
    } else {
      this.currentShowTime -= DELTA_TIME
    }
  }

  bounds(): Partial<Bound> {
    return {
      x: this.box?.x,
      y: this.box?.y,
      width: this.box?.width,
      height: this.box?.height
    }
  }

  add(message: string): void {
    if (dudesSettings.value.message.enabled) {
      this.messageQueue.push(message)
    }
  }

  private trim(text: Text): string {
    const metrics = TextMetrics.measureText(text.text, text.style)

    return metrics.lines.length > 4
      ? metrics.lines.slice(0, 4).join(' ').slice(0, -3) + '...'
      : text.text
  }

  private nextMessage(): void {
    if (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()

      if (message) {
        this.show(message)
      }

      this.currentShowTime = dudesSettings.value.message.showTime
      this.currentAnimationTime = this.animationTime
    }
  }

  private show(message: string): void {
    this.text = new Text(message, {
      ...this.params,
      align: 'left',
      breakWords: true,
      wordWrap: true,
      wordWrapWidth: 200
    })

    const { padding, boxColor, borderRadius } = this.params
    this.text.anchor.set(0.5, 1)
    this.text.position.set(0, -padding)
    this.text.text = this.trim(this.text)

    this.box = new Graphics()
    this.box.beginFill(boxColor)
    this.box.drawRoundedRect(
      this.text.x - padding - this.text.width * this.text.anchor.x,
      this.text.y - padding - this.text.height * this.text.anchor.y,
      this.text.width + padding * 2,
      this.text.height + padding * 2,
      borderRadius
    )
    this.box.endFill()

    this.container.alpha = 0
    this.container.position.y = this.shift

    this.container.addChild(this.box, this.text)
  }
}
