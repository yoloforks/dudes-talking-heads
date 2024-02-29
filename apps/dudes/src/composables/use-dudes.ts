import { Container } from 'pixi.js'
import { watch } from 'vue'

import { assetsLoader } from '../core/assets-loader.js'
import { Dude } from '../core/dude.js'
import { dudesSettings } from './use-settings.js'
import type { DudesTypes } from '../types.js'

const dudes = new Map<string, Dude>()
const dudesContainer = new Container()

export function removeInternalDude(dude: Dude) {
  dudes.delete(dude.name)
  dudesContainer.removeChild(dude.view)
  assetsLoader.unload(dude.spriteData.name)
}

export const useDudes = () => {
  function updateDudes(): void {
    for (const dude of dudes.values()) {
      dude.update()
    }
  }

  function getDude(name: string): Dude | undefined {
    return dudes.get(name) as Dude
  }

  async function createDude(
    name: string,
    spriteData: DudesTypes.SpriteData,
    params?: DudesTypes.IndividualDudeParams
  ): Promise<Dude> {
    removeDude(name)
    const dude = new Dude(name, spriteData, params)
    await dude.init()
    dudes.set(name, dude)
    dudesContainer.addChild(dude.view)
    return dude
  }

  function removeDude(name: string): void {
    const dude = dudes.get(name)
    if (!dude) return
    removeInternalDude(dude)
  }

  function removeAllDudes(): void {
    for (const name of dudes.keys()) {
      removeDude(name)
    }
  }

  watch(
    () => dudesSettings.value.dude.scale,
    (scale) => {
      for (const dude of dudes.values()) {
        dude.updateScale(scale, true)
      }
    }
  )

  return {
    dudes,
    dudesContainer,
    getDude,
    createDude,
    removeDude,
    updateDudes,
    removeAllDudes
  }
}
