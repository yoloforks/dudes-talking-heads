import { Container } from 'pixi.js'

import { Dude } from '../core/dude.js'
import type { DudePersonalStyles } from '../types.js'

const dudes = new Map<string, Dude>()
const dudesContainer = new Container()

export const useDudes = () => {
  function updateDudes(): void {
    for (const [name, dude] of dudes.entries()) {
      dude.update()

      if (dude.shouldBeDeleted) {
        removeDude(name)
      }
    }
  }

  function getDude(name: string): Dude | undefined {
    return dudes.get(name) as Dude
  }

  function createDude(
    name: string,
    sprite: string,
    settings?: DudePersonalStyles
  ): Dude {
    const hasExistingDude = getDude(name)
    if (hasExistingDude) {
      removeDude(name)
    }

    const dude = new Dude(name, sprite, settings)
    dudes.set(name, dude)
    dudesContainer.addChild(dude.view)
    return dude
  }

  function removeDude(name: string): void {
    const dude = dudes.get(name) as Dude | undefined
    if (!dude) return
    dude.cleanUp()
    dudes.delete(name)
    dudesContainer.removeChild(dude.view)
  }

  function clearDudes(): void {
    for (const name of dudes.keys()) {
      removeDude(name)
    }
  }

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