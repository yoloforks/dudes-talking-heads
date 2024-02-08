<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRenderer } from './composables/use-renderer.js'
import { useDudes } from './composables/use-dudes.js'
import { useRaf } from './composables/use-raf.js'
import { assetsLoader, type DudeAsset, type AssetsLoadOptions } from './core/assets-loader.js'
import { useDudesSettings } from './composables/use-settings.js'
import { soundsLoader } from './core/sounds-loader.js'
import type { DudesOverlayMethods, DudesSettings, SoundAsset } from './types.js'

const props = defineProps<{
  sounds: SoundAsset[]
  assets: DudeAsset[]
  assetsLoadOptions?: AssetsLoadOptions
  settings?: DudesSettings
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { updateSettings } = useDudesSettings()
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
  if (!settings) return
  updateSettings(settings)
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
  await assetsLoader.load(props.assets, props.assetsLoadOptions)
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
  updateSettings,
})
</script>

<template>
  <canvas ref="canvasRef"></canvas>
</template>
