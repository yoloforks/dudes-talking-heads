<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRenderer } from './composables/use-renderer.js'
import { useDudes } from './composables/use-dudes.js'
import { useRaf } from './composables/use-raf.js'
import { assetsLoader, type DudeAsset } from './core/assets-loader.js'
import { useDudesSettings } from './composables/use-settings.js'
import type { DudesOverlayMethods, DudesSettings, SoundAsset } from './types.js'
import { soundsLoader } from './core/sounds-loader'

const props = defineProps<{
  sounds: SoundAsset[]
  assets: DudeAsset[]
  settings: DudesSettings
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { setSettings } = useDudesSettings()
const { renderer, initRenderer } = useRenderer()
const {
  dudes,
  dudesContainer,
  updateDudes,
  createDude,
  removeDude,
  getDude,
  clearDudes
} = useDudes();
const { startRaf } = useRaf(onRender)

watch(() => props.settings, (settings) => {
  setSettings(settings)
}, { deep: true, immediate: true })

function onRender() {
  updateDudes();
  renderer.value?.render(dudesContainer)
}

function onResize() {
  renderer.value?.resize(window.innerWidth, window.innerHeight)
}

async function initDudes() {
  await soundsLoader.load(props.sounds)
  await assetsLoader.load(props.assets)
  initRenderer(canvasRef)
  window.addEventListener('resize', onResize)
  startRaf()
}

defineExpose<DudesOverlayMethods>({
  dudes,
  initDudes,
  getDude,
  createDude,
  removeDude,
  clearDudes,
  updateSettings: setSettings
})
</script>

<template>
  <canvas ref="canvasRef"></canvas>
</template>
