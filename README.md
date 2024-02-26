# Dudes

> Animated dudes for chatters in your stream

## Install

```bash
pnpm add @twirapp/dudes
```

## Usage

```vue
<script setup lang="ts">
import DudesOverlay from '@twirapp/dudes'
import { SoundAsset, DudesAsset, AssetsLoadOptions, DudesSettings, DudesMethods } from '@twirapp/dudes/types'
import { onMounted, ref } from 'vue'

const dudeSounds: SoundAsset[] = [
  {
    alias: 'jump',
    src: './sounds/jump.mp3'
  }
]

const assetsLoadOptions: AssetsLoadOptions = {
  // sprites/dude/dude.json is used
  basePath: location.href + 'sprites/',
  defaultSearchParams: {
    ts: Date.now()
  }
}

const dudesAssets: DudesAsset[] = [
  {
    alias: 'dude',
    src: 'dude/dude.json'
  }
]

const settings = ref<DudesSettings>({
  // override default settings
})

const dudesRef = ref<DudesMethods | null>(null)

onMounted(async () => {
  if (!dudesRef.value) return
  await dudesRef.value.initDudes()
  dudesRef.value.createDude('Dude', 'dude')
})
</script>

<template>
  <dudes-overlay
    ref="dudesRef"
    :assets-load-options="assetsLoadOptions"
    :assets="dudesAssets"
    :sounds="dudeSounds"
    :settings="settings"
  />
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
</style>
```

## Creating new sprites

It's really easy to create sprites with [Aseprite](https://github.com/aseprite/aseprite)

Sprite size is 32x32.

Example can be found in [sprites](apps/playground/public/sprites) folder.

## Useful links

- [https://0x72.itch.io/pixeldudesmaker](https://0x72.itch.io/pixeldudesmaker)
- [https://masterpose.itch.io/pixelduuuuudesmaker](https://masterpose.itch.io/pixelduuuuudesmaker)
