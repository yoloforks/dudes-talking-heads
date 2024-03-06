<script setup lang="ts">
import ConfiguratorForm from './components/configurator-form.vue'
import { onMounted, ref, toRaw } from 'vue'
import { Button } from './ui/button'
import { DudeSpriteParams } from '../playground/playground.vue';
import { dudesLayers } from '../playground/constants.js';

const defaultSpriteData: DudeSpriteParams = {
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
}

const dudeSpriteData = ref<DudeSpriteParams>({ ...defaultSpriteData })

const iframeRef = ref<HTMLIFrameElement>()

function sendIframeMessage(type: string, data?: any): void {
  if (!iframeRef.value) return
  iframeRef.value.contentWindow?.postMessage(JSON.stringify({
    type,
    data: toRaw(data)
  }))
}

onMounted(() => {
  window.addEventListener('message', (event) => {
    if (event.data === 'init') {
      sendIframeMessage('spawn')
    }
  })
})

function updateSpriteData(type: 'sprite' | 'colors', sprite: DudeSpriteParams): void {
  sendIframeMessage(`update-${type}`, sprite)
}

function resetSpriteData(): void {
  dudeSpriteData.value = { ...defaultSpriteData }
  updateSpriteData('sprite', dudeSpriteData.value)
  updateSpriteData('colors', dudeSpriteData.value)
}
</script>

<template>
  <div>
    <h3 class="text-lg font-medium">
      Configurator
    </h3>
    <p class="text-sm text-muted-foreground">
      TODO: description
    </p>
  </div>

  <div class="grid grid-flow-col grid-rows-1 gap-4">
    <div class="flex flex-col gap-2">
      <iframe
        ref="iframeRef"
        class="h-full w-full border border-input rounded bg-muted"
        src="overlay.html"
      />

      <div class="flex gap-2">
        <Button size="sm" variant="outline" @click="sendIframeMessage('spawn')">Respawn</Button>
        <Button size="sm" variant="outline" @click="sendIframeMessage('grow')">Grow</Button>
        <Button size="sm" variant="outline" @click="sendIframeMessage('jump')">Jump</Button>
        <Button size="sm" variant="outline" @click="sendIframeMessage('emote')">Emote</Button>
        <Button size="sm" variant="outline" @click="sendIframeMessage('message')">Message</Button>
      </div>
    </div>

    <div>
      <configurator-form
        :initial-values="dudeSpriteData"
        @update-sprite="(data) => updateSpriteData('sprite', data)"
        @update-colors="(data) => updateSpriteData('colors', data)"
        @on-reset="resetSpriteData"
      />
    </div>
  </div>
</template>
