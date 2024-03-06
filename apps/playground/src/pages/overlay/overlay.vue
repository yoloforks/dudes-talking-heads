<script setup lang="ts">
import { assetsLoadOptions, dudesLayers, dudesSounds } from '@/pages/playground/constants'
import { createDudeSprite } from '@/utils'
import DudesOverlay, { DudesLayers } from '@twirapp/dudes'
import { onMounted, ref } from 'vue'

import type { Dude, DudesTypes, DudesMethods } from '@twirapp/dudes/types';
import type { DudeSpriteParams } from '@/pages/playground/playground.vue'

const spriteParams = ref<DudeSpriteParams>({
  body: dudesLayers.Body[0].src,
  bodyColor: '#E6AC0C',

  eyes: dudesLayers.Eyes[0].src,
  eyesColor: '#FFF',

  mouth: '',
  mouthColor: '#FFF',

  hat: '',
  hatColor: '#FFF',

  cosmetics: '',
  cosmeticsColor: '#FFF'
})
const dudesRef = ref<DudesMethods>()

const dudesSettings = ref<{
  dude: Partial<DudesTypes.DudeStyles>
}>({
  dude: {
    gravity: 1000,
    scale: 6,
    growTime: 1000 * 5,
    growMaxScale: 10,
    maxLifeTime: Number.MAX_SAFE_INTEGER
  }
})

onMounted(async () => {
  if (!dudesRef.value) return
  await dudesRef.value.initDudes()

  window.addEventListener('message', onMessage)
  window.parent.postMessage('init')
})

interface MessageData<T = unknown> {
  type: string
  data: T
}

const dudeName = 'Twir'

async function onMessage(event: MessageEvent<string>) {
  if (!dudesRef.value) return

  const { type, data } = JSON.parse(event.data) as MessageData<DudeSpriteParams>

  let dude = dudesRef.value.dudes.get(dudeName)

  if (type === 'spawn' || !dude) {
    const sprite = createDudeSprite(spriteParams.value)
    dude = await dudesRef.value.createDude({
      id: dudeName,
      name: dudeName,
      sprite
    })

    await updateDudeSprite(dude)
    updateDudeColors(dude)
  }

  if (type === 'update-sprite') {
    spriteParams.value = data
    await updateDudeSprite(dude)
  }

  if (type === 'update-colors') {
    spriteParams.value = data
    updateDudeColors(dude)
  }

  if (type === 'jump') {
    dude.jump()
  }

  if (type === 'grow') {
    dude.grow()
  }

  if (type === 'leave') {
    dude.leave()
  }

  if (type === 'emote') {
    dude.addEmotes(['emotes/oh.webp'])
  }

  if (type === 'message') {
    dude.addMessage('Hello there!')
  }
}

async function updateDudeSprite(dude: Dude): Promise<void> {
  const spriteData = createDudeSprite(spriteParams.value)
  await dude.updateSpriteData(spriteData)
}

function updateDudeColors(dude: Dude): void {
  dude.updateColor(DudesLayers.Body, spriteParams.value.bodyColor)
  dude.updateColor(DudesLayers.Eyes, spriteParams.value.eyesColor)
  dude.updateColor(DudesLayers.Mouth, spriteParams.value.mouthColor)
  dude.updateColor(DudesLayers.Hat, spriteParams.value.hatColor)
  dude.updateColor(DudesLayers.Cosmetics, spriteParams.value.cosmeticsColor)
}

</script>

<template>
  <dudes-overlay
    ref="dudesRef"
    :settings="dudesSettings"
    :assets-loader-options="assetsLoadOptions"
    :sounds="dudesSounds"
  />
</template>
