import { Text } from 'pixi.js'
import type { ITextStyle } from 'pixi.js'

import { dudesSettings } from '../composables/use-settings.js'
import { COLLIDER, SPRITE_SIZE } from '../constants.js'

export interface DudeNameBoxParams {
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
   * @default '#FFF'
   */
  fill: ITextStyle['fill']
  /**
   * Available values: vertical - 0, horizontal - 1
   * @default 0
   */
  fillGradientType: ITextStyle['fillGradientType']
  /**
   * Minimum value is 0, maximum value is 1
   * @default [0]
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
  strokeThickness: ITextStyle['strokeThickness']
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
   * Recommended range value is 0 to Math.PI * 2
   * @default 0
   */
  dropShadowAngle: ITextStyle['dropShadowAngle']
  /**
   * @default 0.1
   */
  dropShadowBlur: ITextStyle['dropShadowBlur']
  /**
   * @default '#3EC7d9'
   */
  dropShadowColor: ITextStyle['dropShadowColor']

  /**
   * @default 10
   */
  dropShadowDistance: ITextStyle['dropShadowDistance']
}

export type DudePersonalNameBoxParams = Partial<
  Pick<
    DudeNameBoxParams,
    | 'stroke'
    | 'strokeThickness'
    | 'fill'
    | 'fillGradientType'
    | 'fillGradientStops'
  >
>

export class DudeNameBox {
  view: Text

  constructor(
    name: string,
    private settings?: DudePersonalNameBoxParams
  ) {
    this.view = new Text(name)
    this.view.anchor.set(0.5, 1)
    this.view.zIndex = 100
  }

  update(): void {
    this.view.position.y =
      -(SPRITE_SIZE / 2 - COLLIDER.y + 2) * dudesSettings.value.dude.scale

    const params = this.settings
      ? { ...dudesSettings.value.name, ...this.settings }
      : dudesSettings.value.name

    this.updateStyle(params)
  }

  private updateStyle(settings: Partial<DudeNameBoxParams>): void {
    this.view.style = {
      ...settings,
      align: 'center'
    }
  }
}
