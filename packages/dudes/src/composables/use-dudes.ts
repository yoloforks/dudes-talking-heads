import { Container } from 'pixi.js'
import { watch } from 'vue'

import { Dude } from '../core/dude.js'
import { dudesSettings } from './use-settings.js'
import type { DudePersonalSettings } from '../types.js'

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

  function createDude(
    name: string,
    sprite: string,
    settings?: DudePersonalSettings
  ): Dude {
    removeDude(name)
    const dude = new Dude(name, sprite, settings)
    dudes.set(name, dude)
    dudesContainer.addChild(dude.view)
    return dude
  }

  function removeDude(name: string): void {
    const dude = dudes.get(name)
    if (!dude) return
    removeInternalDude(dude)
  }

  function clearDudes(): void {
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
    clearDudes
  }
}
