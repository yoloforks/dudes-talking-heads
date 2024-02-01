import { Text } from 'pixi.js'
import { watch } from 'vue'
import type { ITextStyle } from 'pixi.js'
import type { WatchStopHandle } from 'vue'

import { dudesSettings } from '../composables/use-settings.js'

export interface DudeNameBoxStyles {
  // font
  /**
   * @default 'Arial'
   */
  fontFamily: ITextStyle['fontFamily']
  /**
   * @default 18
   */
  fontSize: ITextStyle['fontSize']
  /**
   * Available values: 'normal', 'italic'
   * @default 'normal'
   */
  fontStyle: ITextStyle['fontStyle']
  /**
   * Available values: 'normal', 'small-caps'
   * @default 'normal'
   */
  fontVariant: ITextStyle['fontVariant']
  /**
   * Available values: 'normal', 'bold', 'bolder', 'lighter'
   * @default 'normal'
   */
  fontWeight: ITextStyle['fontWeight']

  // fill
  /**
   * @default '#fff'
   */
  fill: ITextStyle['fill']
  /**
   * Available values: vertical - 0, horizontal - 1
   * @default 0
   */
  fillGradientType: ITextStyle['fillGradientType']
  /**
   * Minimum value is 0, maximum value is 1
   */
  fillGradientStops: ITextStyle['fillGradientStops']

  // stroke
  /**
   * @default '#000'
   */
  stroke: ITextStyle['stroke']
  /**
   * @default 4
   */
  strokeThickness?: ITextStyle['strokeThickness']
  /**
   * Available values: 'round', 'bevel', 'miter'
   * @default 'round'
   */
  lineJoin: ITextStyle['lineJoin']

  // drop shadow
  /**
   * @default false
   */
  dropShadow: ITextStyle['dropShadow']
  /**
   * @default 1
   */
  dropShadowAlpha: ITextStyle['dropShadowAlpha']
  /**
   * @default 0
   */
  dropShadowAngle: ITextStyle['dropShadowAngle']
  /**
   * @default 1
   */
  dropShadowBlur: ITextStyle['dropShadowBlur']
  /**
   * @default '#3ac7d9'
   */
  dropShadowColor: ITextStyle['dropShadowColor']

  /**
   * @default 1
   */
  dropShadowDistance: ITextStyle['dropShadowDistance']
}

export type DudePersonalNameBoxStyles = Partial<
  Pick<
    DudeNameBoxStyles,
    | 'stroke'
    | 'strokeThickness'
    | 'fill'
    | 'fillGradientType'
    | 'fillGradientStops'
  >
>

export class DudeNameBox {
  view: Text
  stopWatchGlobalStyles?: WatchStopHandle

  constructor(name: string, personalStyle?: DudePersonalNameBoxStyles) {
    this.view = new Text(name)
    this.view.anchor.set(0.5, 1)
    this.view.zIndex = 100

    if (personalStyle) {
      if (personalStyle.strokeThickness === 0) {
        delete personalStyle.strokeThickness
      }

      this.updateStyle({
        ...dudesSettings.value.nameBox,
        ...personalStyle
      })
      return
    }

    this.stopWatchGlobalStyles = watch(
      () => dudesSettings.value.nameBox,
      (value) => this.updateStyle(value),
      { immediate: true }
    )
  }

  private updateStyle(settings: Partial<DudeNameBoxStyles>): void {
    this.view.style = {
      ...settings,
      align: 'center'
    }
  }
}
