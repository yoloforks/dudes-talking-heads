import { Container } from 'pixi.js'
import { ref } from 'vue'

import { Dude } from '../core/dude.js'

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

  function createDude(name: string, sprite: string): Dude {
    const hasExistingDude = getDude(name)
    if (hasExistingDude) {
      removeDude(name)
    }

    const dude = new Dude(name, sprite)
    dudes.set(name, dude)
    dudesContainer.addChild(dude.view)
    return dude
  }

  function removeDude(name: string) {
    const dude = dudes.get(name) as Dude | undefined
    if (!dude) return
    dudes.delete(name)
    dudesContainer.removeChild(dude.view)
  }

  function clearDudes(): void {
    for (const name of dudes.keys()) {
      removeDude(name)
    }
  }

  return {
    dudesContainer,
    getDude,
    createDude,
    removeDude,
    updateDudes,
    clearDudes
  }
}
