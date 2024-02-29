import { Text } from 'pixi.js'

import { dudesSettings } from '../composables/use-settings.js'
import { SPRITE_SIZE } from '../constants.js'
import type { DudesTypes } from '../types.js'

export class DudeNameBox {
  view: Text

  constructor(
    name: string,
    private individualParams?: DudesTypes.IndividualNameBoxParams
  ) {
    this.view = new Text(name)
    this.view.anchor.set(0.5, 1)
    this.view.zIndex = 100
  }

  update(scale: number): void {
    this.view.visible = dudesSettings.value.name.enabled
    this.view.position.y = -((SPRITE_SIZE * scale) / 2)

    const params = this.individualParams
      ? { ...dudesSettings.value.name, ...this.individualParams }
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
