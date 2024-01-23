import { Container, Graphics, Text, TextMetrics } from 'pixi.js'
import { watch } from 'vue'
import type { WatchStopHandle } from 'vue'

import { dudesSettings } from '../composables/use-settings.js'
import { FIXED_DELTA_TIME } from '../constants.js'

export interface DudeMessageBoxSettings {
  /**
   * @default '#eeeeee'
   */
  boxColor: string

  /**
   * @default '#333333'
   */
  textColor: string

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
   * @default 10_000
   */
  showTime: number
}

export class DudeMessageBox {
  public view: Container = new Container()
  private container: Container = new Container()
  private box?: Graphics
  private text?: Text

  private animationTime = 500
  private currentAnimationTime = 0
  private shift = 30
  private currentShowTime = 0
  private messageQueue: string[] = []

  public watchStopSettings: WatchStopHandle
  private settings!: DudeMessageBoxSettings

  constructor() {
    this.view.addChild(this.container)

    this.watchStopSettings = watch(
      () => dudesSettings.value.messageBox,
      (value) => (this.settings = value),
      { immediate: true }
    )
  }

  private trim(text: Text): string {
    const metrics = TextMetrics.measureText(text.text, text.style)

    return metrics.lines.length > 4
      ? metrics.lines.slice(0, 4).join(' ').slice(0, -3) + '...'
      : text.text
  }

  public update() {
    if (this.currentAnimationTime >= 0) {
      this.currentAnimationTime -= FIXED_DELTA_TIME

      this.container.alpha += FIXED_DELTA_TIME / this.animationTime
      this.container.position.y -=
        (this.shift * FIXED_DELTA_TIME) / this.animationTime
    } else {
      this.container.alpha = 1
    }

    if (this.currentShowTime <= 0) {
      if (this.container.children.length > 0) {
        this.removeMessage()
      }

      if (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift()

        if (message) {
          this.show(message)
        }

        this.currentShowTime = this.settings.showTime
        this.currentAnimationTime = this.animationTime
      }
    } else {
      this.currentShowTime -= FIXED_DELTA_TIME
    }
  }

  public bounds() {
    return {
      x: this.box?.x,
      y: this.box?.y,
      width: this.box?.width,
      height: this.box?.height
    }
  }

  public add(message: string) {
    this.messageQueue.push(message)
  }

  private show(message: string): void {
    const { fontFamily, fontSize, textColor, boxColor, padding, borderRadius } =
      this.settings

    this.text = new Text(message, {
      fontFamily,
      fontSize,
      fill: textColor,
      align: 'left',
      breakWords: true,
      wordWrap: true,
      wordWrapWidth: 200
    })

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

  private removeMessage(): void {
    const intervalId = setInterval(() => {
      if (!this.box || !this.text) {
        clearInterval(intervalId)
        return
      }

      this.box.alpha -= 0.1
      this.text.alpha -= 0.1

      if (this.box.alpha <= 0) {
        clearInterval(intervalId)
        this.container.removeChildren()
      }
    }, 100)
  }
}
