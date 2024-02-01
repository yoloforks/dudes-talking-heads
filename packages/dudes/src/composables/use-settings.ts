import { ref, unref } from 'vue'

import { deepMerge } from '../deep-merge.js'
import type { DudesSettings } from '../types.js'

export const dudesSettings = ref<DudesSettings>({
  dude: {
    color: '#969696',
    maxLifeTime: 1000 * 60 * 30,
    gravity: 400,
    scale: 4,
    sounds: {
      enabled: true,
      volume: 0.01
    }
  },
  messageBox: {
    enabled: true,
    borderRadius: 5,
    boxColor: '#EEE',
    fontFamily: 'Arial',
    fontSize: 20,
    padding: 10,
    showTime: 5 * 1000,
    fill: '#333'
  },
  nameBox: {
    fontFamily: 'Arial',
    fontSize: 18,
    fill: '#FFF',
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
    dropShadowBlur: 0.1,
    dropShadowDistance: 10,
    dropShadowColor: '#3EC7d9'
  }
})

export function useDudesSettings() {
  function updateSettings(newSettings: DudesSettings): void {
    dudesSettings.value = deepMerge(unref(dudesSettings), newSettings)
  }

  return {
    dudesSettings,
    updateSettings
  }
}
