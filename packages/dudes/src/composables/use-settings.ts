import { ref, unref } from 'vue'

import { deepMerge } from '../deep-merge.js'
import type { DudesSettings } from '../types.js'

export const dudesSettings = ref({} as DudesSettings)

export function useDudesSettings() {
  function setSettings(newSettings: DudesSettings): void {
    dudesSettings.value = deepMerge(unref(dudesSettings), newSettings)
  }

  return {
    dudesSettings,
    setSettings
  }
}
