import { Container } from 'pixi.js'
import { watch } from 'vue'

import { Dude } from '../core/dude.js'
import { dudesSettings } from './use-settings.js'
import type { DudeSpriteData } from '../core/dude.js'
import type { DudesTypes } from '../types.js'

const dudes = new Map<string, Dude>()
const dudesContainer = new Container()

export function removeInternalDude(dude: Dude) {
  dudes.delete(dude.name)
  dudesContainer.removeChild(dude.view)
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
    spriteData: DudeSpriteData,
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
    () => dudesSettings.value.dude.visibleName,
    (isVisible) => {
      for (const dude of dudes.values()) {
        dude.visibleName(isVisible)
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
