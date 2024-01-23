import { ref } from 'vue'

import type { DudesSettings } from '../types.js'

export const dudesSettings = ref<DudesSettings>({
  messageBox: {
    boxColor: '#eee',
    textColor: '#333',
    fontSize: 20,
    fontFamily: 'Arial',
    borderRadius: 10,
    padding: 10,
    showTime: 10_000
  }
})

export function useDudesSettings() {
  function setSettings(newSettings: DudesSettings) {
    dudesSettings.value = newSettings
  }

  return {
    dudesSettings,
    setSettings
  }
}
