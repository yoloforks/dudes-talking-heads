<script setup lang="ts">
import DudesOverlay from '@twirapp/dudes'
import type { DudesOverlayMethods, DudesSettings } from '@twirapp/dudes/types'
import { onMounted, reactive, ref, watch } from 'vue'
import { dudeAssets, dudeSprites, dudeNames, dudeEmotes, type DudesSprites } from './dude-assets.js'
import { randomNum } from '@zero-dependency/utils'
import { randomRgbColor } from './utils.js'

const dudesRef = ref<DudesOverlayMethods<DudesSprites> | null>(null)

onMounted(async () => {
  if (!dudesRef.value) return
  await dudesRef.value.initDudes()

  for (const dudeName of dudeNames) {
    const dudeSprite = dudeSprites[randomNum(0, dudeSprites.length - 1)]
    const dudeColor = randomRgbColor()
    const dude = dudesRef.value.createDude(dudeName, dudeSprite)
    dude.tint(dudeColor)
  }
})

function spawnDude() {
  if (!dudesRef.value) return

  const randomName = dudeNames[randomNum(0, dudeNames.length - 1)]
  const randomSprite = dudeSprites[randomNum(0, dudeSprites.length - 1)]
  const dude = dudesRef.value.createDude(randomName, randomSprite, {
    messageBox: {
      boxColor: 'lightgreen',
      fill: '#000'
    },
    nameBox: {
      fill: ['red', 'blue', 'green'],
      fillGradientType: 1,
      fillGradientStops: [0.3, 0.5, 1],
      stroke: '#fff',
      strokeThickness: 4
    }
  })
  const randomColor = randomRgbColor()
  dude.tint(randomColor)

  setTimeout(() => {
    if (dude.shouldBeDeleted) return
    const randomEmote = dudeEmotes[randomNum(0, dudeEmotes.length - 1)]
    dude.spitEmotes([`emotes/${randomEmote}.webp`])
  }, 2000)
}

function jumpAllDudes() {
  if (!dudesRef.value) return
  for (const dude of dudesRef.value.dudes.values()) {
    dude.jump()
  }
}

function showMessageAllDudes() {
  if (!dudesRef.value) return
  for (const dude of dudesRef.value.dudes.values()) {
    dude.addMessage("И для юзеров полезно, и для нас, что мы по айди скина сможет всё по нему достать. И для юзеров полезно, и для нас, что мы по айди скина сможет всё по нему достать.")
  }
}

function clearDudes() {
  if (!dudesRef.value) return
  dudesRef.value.clearDudes()
}

const settings = reactive<DudesSettings>({
  messageBox: {
    borderRadius: 5,
    boxColor: 'tomato',
    fontFamily: 'Courier New',
    fontSize: 12,
    padding: 5,
    showTime: 10 * 1000,
    fill: '#000'
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
    dropShadowBlur: 0.1,
    dropShadowDistance: 10,
    dropShadowColor: '#3ac7d9'
  }
})

watch(settings, (settings) => {
  if (!dudesRef.value) return
  dudesRef.value.updateSettings(settings)
})
</script>

<template>
  <div class="controls">
    <button @click="spawnDude">Spawn</button>
    <button @click="showMessageAllDudes">Message</button>
    <button @click="jumpAllDudes">Jump</button>
    <button @click="clearDudes">Clear</button>
    <input v-model="settings.messageBox.boxColor" type="color">
  </div>
  <dudes-overlay ref="dudesRef" :assets="dudeAssets" :settings="settings" />
</template>

<style>
* {
  margin: 0;
  box-sizing: border-box;
}

body {
  overflow: hidden;
  background: #000;
}

.controls {
  position: absolute;
}
</style>
