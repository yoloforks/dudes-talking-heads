<script setup lang="ts">
import { ref } from 'vue'
import { useRenderer } from './composables/use-renderer.js';
import { useDudes } from './composables/use-dudes.js';
import { useRaf } from './composables/use-raf.js';
import { assetsLoader, type DudeAsset } from './core/assets-loader.js';
import type { DudesOverlayMethods } from './types.js';

const canvasRef = ref<HTMLCanvasElement | null>(null)

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

function onRender() {
  updateDudes();
  renderer.value?.render(dudesContainer);
}

function onResize() {
  renderer.value?.resize(window.innerWidth, window.innerHeight);
}

async function initDudes(dudeAssets: DudeAsset[]) {
  await assetsLoader.load(dudeAssets)
  initRenderer(canvasRef)
  window.addEventListener('resize', onResize)
  startRaf()
}

defineExpose<DudesOverlayMethods<string>>({
  dudes,
  initDudes,
  getDude,
  createDude,
  removeDude,
  clearDudes
})
</script>

<template>
  <canvas ref="canvasRef"></canvas>
</template>
