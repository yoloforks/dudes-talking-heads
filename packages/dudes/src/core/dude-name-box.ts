import { Text } from 'pixi.js'

import { dudesSettings } from '../composables/use-settings.js'
import { COLLIDER, SPRITE_SIZE } from '../constants.js'

export interface DudeNameBoxParams {
  // font
  /**
   * @default 'Arial'
   */
  fontFamily: string
  /**
   * @default 18
   */
  fontSize: number
  /**
   * Available values: 'normal', 'italic', 'oblique'
   * @default 'normal'
   */
  fontStyle: string
  /**
   * Available values: 'normal', 'small-caps'
   * @default 'normal'
   */
  fontVariant: string
  /**
   * Available values: 100, 200, 300, 400, 500, 600, 700, 800, 900
   * @default 400
   */
  fontWeight: number

  // fill
  /**
   * @default '#FFFFFF'
   */
  fill: string | string[]
  /**
   * Available values: vertical - 0, horizontal - 1
   * @default 0
   */
  fillGradientType: number
  /**
   * Minimum value is 0, maximum value is 1
   * @default [0]
   */
  fillGradientStops: number[]

  // stroke
  /**
   * @default '#000000'
   */
  stroke: string
  /**
   * @default 4
   */
  strokeThickness: number
  /**
   * Available values: 'round', 'bevel', 'miter'
   * @default 'round'
   */
  lineJoin: string

  // drop shadow
  /**
   * @default false
   */
  dropShadow: boolean
  /**
   * @default 1
   */
  dropShadowAlpha: number
  /**
   * Recommended range value is 0 to Math.PI * 2
   * @default 0
   */
  dropShadowAngle: number
  /**
   * @default 0.1
   */
  dropShadowBlur: number
  /**
   * @default '#3EC7D9'
   */
  dropShadowColor: string

  /**
   * @default 10
   */
  dropShadowDistance: number
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

  visible(visible: boolean): void {
    this.view.visible = visible
  }

  update(scale: number): void {
    this.view.position.y = -((SPRITE_SIZE * scale) / 2)

    const params = this.settings
      ? { ...dudesSettings.value.name, ...this.settings }
      : dudesSettings.value.name

    this.updateStyle(params)
  }

  private updateStyle(settings: Record<string, any>): void {
    this.view.style = {
      ...settings,
      align: 'center'
    }
  }
}
