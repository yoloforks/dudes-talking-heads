<script setup lang="ts">
import DudesOverlay from '@twirapp/dudes'
import { DudesOverlayMethods } from '@twirapp/dudes/types'
import { onMounted, ref } from 'vue';
import { dudeAssets, dudeSprites, dudeNames, dudeEmotes } from './dude-assets.js'
import { randomNum } from '@zero-dependency/utils'

function randomRgbColor(): string {
  return `rgb(${randomNum(0, 255)}, ${randomNum(0, 255)}, ${randomNum(0, 255)})`
}

type Sprites = typeof dudeSprites[number]

const dudesRef = ref<DudesOverlayMethods<Sprites> | null>(null)

onMounted(async () => {
  if (!dudesRef.value) return
  await dudesRef.value.initDudes(dudeAssets)
})

function spawnDude() {
  if (!dudesRef.value) return

  const randomName = dudeNames[randomNum(0, dudeNames.length - 1)]
  const randomSprite = dudeSprites[randomNum(0, dudeSprites.length - 1)]
  const dude = dudesRef.value.createDude(randomName, randomSprite)
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
</script>

<template>
  <div class="controls">
    <button @click="spawnDude">Spawn</button>
    <button @click="showMessageAllDudes">Message</button>
    <button @click="jumpAllDudes">Jump</button>
    <button @click="clearDudes">Clear</button>
  </div>
  <dudes-overlay ref="dudesRef" />
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
