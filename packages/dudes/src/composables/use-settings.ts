import { ref, unref, watch } from 'vue'

import { deepMerge } from '../deep-merge.js'
import type { DudesSettings } from '../types.js'

export const dudesSettings = ref({} as DudesSettings)

export function useDudesSettings() {
  function setSettings(newSettings: DudesSettings): void {
    dudesSettings.value = deepMerge(unref(dudesSettings), newSettings)
  }

  watch(() => dudesSettings.value, (settings) => {
    if (settings.nameBox.strokeThickness === 0) {
      delete settings.nameBox.strokeThickness
    }

    if (settings.nameBox.dropShadowBlur === 0) {
      delete settings.nameBox.dropShadowBlur
    }

    if (settings.nameBox.dropShadow === false) {
      delete settings.nameBox.dropShadow
    }
  })

  return {
    dudesSettings,
    setSettings
  }
}
