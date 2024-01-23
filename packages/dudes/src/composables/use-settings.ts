import { ref } from 'vue'

import type { DudesSettings } from '../types.js'

export const dudesSettings = ref<DudesSettings>({
  messageBox: {
    boxColor: '#eee',
    fill: '#333',
    fontSize: 20,
    fontFamily: 'Arial',
    borderRadius: 10,
    padding: 10,
    showTime: 10_000
  },
  nameBox: {
    fontFamily: 'Arial',
    fontSize: 18,
    fill: '#fff',
    lineJoin: 'round',
    strokeThickness: 4,
    stroke: '#000',
    fillGradientStops: [0],
    fillGradientType: 0,
    fontStyle: 'normal',
    fontVariant: 'normal',
    fontWeight: 'normal',
    dropShadow: false,
    dropShadowAlpha: 1,
    dropShadowAngle: 0,
    dropShadowBlur: 1,
    dropShadowDistance: 1,
    dropShadowColor: '#3ac7d9'
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
