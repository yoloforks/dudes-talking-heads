import { Container, Graphics, Text, TextMetrics } from 'pixi.js'
import { watch } from 'vue'
import type { WatchStopHandle } from 'vue'

import { dudesSettings } from '../composables/use-settings.js'
import { FIXED_DELTA_TIME } from '../constants.js'

export interface DudeMessageBoxStyles {
  /**
   * @default '#eeeeee'
   */
  boxColor: string

  /**
   * @default '#333333'
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
   * @default 10_000
   */
  showTime: number
}

export type DudePersonalMessageBoxStyles = Pick<
  DudeMessageBoxStyles,
  'boxColor' | 'fill'
>

interface Bound {
  x: number
  y: number
  width: number
  height: number
}

export class DudeMessageBox {
  view = new Container()
  stopWatchGlobalStyles?: WatchStopHandle

  private container = new Container()
  private box: Graphics | null = null
  private text: Text | null = null
  private styles: DudeMessageBoxStyles

  private animationTime = 500
  private currentAnimationTime = 0
  private shift = 30
  private currentShowTime = 0
  private messageQueue: string[] = []

  constructor(personalStyles?: DudePersonalMessageBoxStyles) {
    this.view.addChild(this.container)

    if (personalStyles) {
      this.updateStyle({
        ...dudesSettings.value.messageBox,
        ...personalStyles
      })
      return
    }

    this.stopWatchGlobalStyles = watch(
      () => dudesSettings.value.messageBox,
      (value) => this.updateStyle(value),
      { immediate: true }
    )
  }

  update(): void {
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
        this.container.removeChildren()
      }

      this.nextMessage()
    } else {
      this.currentShowTime -= FIXED_DELTA_TIME
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
    this.messageQueue.push(message)
  }

  private updateStyle(styles: DudeMessageBoxStyles): void {
    this.styles = styles
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

      this.currentShowTime = this.styles.showTime
      this.currentAnimationTime = this.animationTime
    }
  }

  private show(message: string): void {
    this.text = new Text(message, {
      ...this.styles,
      align: 'left',
      breakWords: true,
      wordWrap: true,
      wordWrapWidth: 200
    })

    const { padding } = this.styles
    this.text.anchor.set(0.5, 1)
    this.text.position.set(0, -padding)
    this.text.text = this.trim(this.text)

    this.box = new Graphics()
    this.box.beginFill(this.styles.boxColor)
    this.box.drawRoundedRect(
      this.text.x - padding - this.text.width * this.text.anchor.x,
      this.text.y - padding - this.text.height * this.text.anchor.y,
      this.text.width + padding * 2,
      this.text.height + padding * 2,
      this.styles.borderRadius
    )
    this.box.endFill()

    this.container.alpha = 0
    this.container.position.y = this.shift

    this.container.addChild(this.box, this.text)
  }
}
