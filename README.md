# Dudes

> Animated characters for chatters in your stream.

## Install

```bash
pnpm add @twirapp/dudes
```

## Features

- When a chatter send a meassage, the dude appears with the message box.
- Dude has simple type of animations: idle, run, jump, fall, land.

## Usage

```vue
<script setup lang="ts">
import DudesOverlay from '@twirapp/dudes'
import { DudesOverlayMethods } from '@twirapp/dudes/types'
import { onMounted, ref } from 'vue'

const dudesRef = ref<DudesOverlayMethods<string> | null>(null)

onMounted(async () => {
  if (!dudesRef.value) return
  await dudesRef.value.initDudes(dudeAssets)
})

function spawnDude() {
  if (!dudesRef.value) return
  const dude = dudesRef.value.createDude('VS_Code', 'santa')
  dude.addMessage('Hello')
  dude.tint('red')
}
</script>

<template>
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
</style>
```

## Creating new sprites

It's really easy to create sprites with [Aseprite](https://github.com/aseprite/aseprite)

Sprite size is 32x32.

Example can be found in aseprite folder.

## Contributing

If you'd like to contribute to this project, please feel free to create pull requests.

## Useful links

- [https://0x72.itch.io/pixeldudesmaker](https://0x72.itch.io/pixeldudesmaker)
- [https://masterpose.itch.io/pixelduuuuudesmaker](https://masterpose.itch.io/pixelduuuuudesmaker)
