<script setup lang="ts">
import DudesOverlay, { DudesFrameTags, DudesLayers } from '@twirapp/dudes'
import { VTweakpane } from 'v-tweakpane'
import { onMounted, reactive, ref, watch } from 'vue'
import { assetsLoadOptions, dudesSounds, dudesEmotes, dudesLayers, dudesMessages } from './constants.js'
import { randomNum } from '@zero-dependency/utils'
import { createDudeSprite, randomEmoji, randomRgbColor } from '@/utils.js'

import type { Pane } from 'tweakpane'
import type { Dude, DudesMethods, DudesStyles, DudesTypes } from '@twirapp/dudes/types'

const initialBodyColor = randomRgbColor()

export interface DudeSpriteParams {
  body: string
  bodyColor: string

  eyes: string
  eyesColor: string

  mouth: string
  mouthColor: string

  hat: string
  hatColor: string

  cosmetics: string
  cosmeticsColor: string
}

const spriteParams = reactive<DudeSpriteParams>({
  body: dudesLayers.Body[0].src,
  bodyColor: initialBodyColor,

  eyes: dudesLayers.Eyes[0].src,
  eyesColor: '#FFF',

  mouth: '',
  mouthColor: '#FFF',

  hat: '',
  hatColor: '#FFF',

  cosmetics: '',
  cosmeticsColor: '#FFF'
})

const settings = reactive<{
  dude: DudesTypes.DudeStyles,
  sounds: DudesTypes.DudeSounds,
  message: DudesTypes.MessageBoxStyles,
  name: DudesTypes.NameBoxStyles,
  emotes: DudesTypes.EmotesStyles
}>({
  dude: {
    bodyColor: initialBodyColor,
    maxLifeTime: 1000 * 60 * 30,
    growTime: 1000 * 2,
    growMaxScale: 20,
    gravity: 400,
    scale: 4
  },
  sounds: {
    enabled: true,
    volume: 0.01
  },
  message: {
    enabled: true,
    borderRadius: 5,
    boxColor: '#E6AC0C',
    fontFamily: 'Roboto',
    fontSize: 14,
    padding: 5,
    showTime: 5 * 1000,
    fill: '#333333'
  },
  name: {
    enabled: true,
    fontFamily: 'Roboto',
    fontSize: 18,
    fill: '#FFFFFF',
    lineJoin: 'round',
    strokeThickness: 4,
    stroke: '#333333',
    fillGradientStops: [0],
    fillGradientType: 0,
    fontStyle: 'normal',
    fontVariant: 'normal',
    fontWeight: 400,
    dropShadow: false,
    dropShadowAlpha: 1,
    dropShadowAngle: 0,
    dropShadowBlur: 0.1,
    dropShadowDistance: 10,
    dropShadowColor: '#3AC7D9'
  },
  emotes: {
    enabled: true
  }
})

const dudesRef = ref<DudesMethods | null>(null)

onMounted(async () => {
  if (!dudesRef.value) return
  await dudesRef.value.initDudes()

  const name = 'Twir'
  const sprite = createDudeSprite(spriteParams)

  await dudesRef.value.createDude({
    id: name,
    name,
    sprite
  })
})

watch(spriteParams, () => {
  if (!dudesRef.value) return
  for (const dude of dudesRef.value.dudes.values()) {
    updateDudeSprite(dude as Dude, true)
  }
})

async function spawnDude() {
  if (!dudesRef.value) return

  const name = `Super Dude #${randomNum(0, 100)}`
  const sprite = createDudeSprite(spriteParams)
  const styles: DudesStyles = {
    message: {
      boxColor: 'lightgreen',
      fill: '#000000'
    },
    name: {
      fill: ['rgb(131, 58, 180)', 'rgb(253, 29, 29)', 'rgb(252, 176, 69)'],
      fillGradientType: 1,
      fillGradientStops: [0.3, 0.6, 1],
      stroke: '#ffffff',
      strokeThickness: 4
    }
  }

  const dude = await dudesRef.value.createDude({
    id: name,
    name,
    sprite,
    styles
  })

  updateDudeSprite(dude)
}

async function updateDudeSprite(dude: Dude, force = false) {
  if (force) {
    const spriteData = createDudeSprite(spriteParams)
    await dude.updateSpriteData(spriteData)
  }

  dude.updateColor(DudesLayers.Body, spriteParams.bodyColor)
  dude.updateColor(DudesLayers.Eyes, spriteParams.eyesColor)
  dude.updateColor(DudesLayers.Mouth, spriteParams.mouthColor)
  dude.updateColor(DudesLayers.Hat, spriteParams.hatColor)
  dude.updateColor(DudesLayers.Cosmetics, spriteParams.cosmeticsColor)
}

function jumpAllDudes() {
  if (!dudesRef.value) return
  for (const dude of dudesRef.value.dudes.values()) {
    dude.jump()
  }
}

function growAllDudes() {
  if (!dudesRef.value) return
  for (const dude of dudesRef.value.dudes.values()) {
    dude.grow()
  }
}

function runAllDudes() {
  if (!dudesRef.value) return
  for (const dude of dudesRef.value.dudes.values()) {
    dude.updateIdleAnimationTime({ time: performance.now() })
    dude.playAnimation(DudesFrameTags.Run)
  }
}

function idleAllDudes() {
  if (!dudesRef.value) return
  for (const dude of dudesRef.value.dudes.values()) {
    dude.updateIdleAnimationTime({
      time: Number.MAX_SAFE_INTEGER,
      maxTime: Number.MAX_SAFE_INTEGER
    })
    dude.playAnimation(DudesFrameTags.Idle)
  }
}

function leaveAllDudes() {
  if (!dudesRef.value) return
  for (const dude of dudesRef.value.dudes.values()) {
    dude.leave()
  }
}

function showMessageAllDudes() {
  if (!dudesRef.value) return
  for (const dude of dudesRef.value.dudes.values()) {
    const message = dudesMessages[randomNum(0, dudesMessages.length - 1)]
      .replace('{name}', dude.config.name)
    const emoji = randomEmoji('emoticons')
    dude.addMessage(`${message} ${emoji}`)
  }
}

function showEmotesAllDudes() {
  if (!dudesRef.value) return
  for (const dude of dudesRef.value.dudes.values()) {
    showEmotes(dude as Dude)
  }
}

function showEmotes(dude: Dude) {
  const emoteName = dudesEmotes[randomNum(0, dudesEmotes.length - 1)]
  dude.addEmotes([`emotes/${emoteName}`])
}

function clearDudes() {
  if (!dudesRef.value) return
  dudesRef.value.removeAllDudes()
}

function onPaneCreated(pane: Pane) {
  const fonts = {
    'Roboto': 'Roboto',
    'Arial': 'Arial',
    'Times New Roman': 'Times New Roman',
    'Courier New': 'Courier New',
    'Verdana': 'Verdana'
  }

  const dudeFolder = pane.addFolder({ title: 'Dude' })

  const hiddenOption = { text: 'Hidden', value: '' }
  const bodySpriteOptions = dudesLayers.Body
    .map((layer) => ({ text: layer.name, value: layer.src }))
  bodySpriteOptions.unshift(hiddenOption)
  dudeFolder.addBinding(spriteParams, 'body', {
    label: 'Body',
    options: bodySpriteOptions
  })

  dudeFolder.addBinding(spriteParams, 'bodyColor', {
    label: ''
  })

  dudeFolder.addBlade({ view: 'separator' })

  const eyesSpriteOptions = dudesLayers.Eyes
    .map((layer) => ({ text: layer.name, value: layer.src }))
  eyesSpriteOptions.unshift(hiddenOption)
  dudeFolder.addBinding(spriteParams, 'eyes', {
    label: 'Eyes',
    options: eyesSpriteOptions
  })

  dudeFolder.addBinding(spriteParams, 'eyesColor', {
    label: ''
  })

  dudeFolder.addBlade({ view: 'separator' })

  const mouthSpriteOptions = dudesLayers.Mouth
    .map((layer) => ({ text: layer.name, value: layer.src }))
  mouthSpriteOptions.unshift(hiddenOption)
  dudeFolder.addBinding(spriteParams, 'mouth', {
    label: 'Mouth',
    options: mouthSpriteOptions
  })

  dudeFolder.addBinding(spriteParams, 'mouthColor', {
    label: ''
  })

  dudeFolder.addBlade({ view: 'separator' })

  const hatSpriteOptions = dudesLayers.Hat
    .map((layer) => ({ text: layer.name, value: layer.src }))
  hatSpriteOptions.unshift(hiddenOption)
  dudeFolder.addBinding(spriteParams, 'hat', {
    label: 'Hat',
    options: hatSpriteOptions
  })

  dudeFolder.addBinding(spriteParams, 'hatColor', {
    label: ''
  })

  dudeFolder.addBlade({ view: 'separator' })

  const cosmeticsSpriteOptions = dudesLayers.Cosmetics
    .map((layer) => ({ text: layer.name, value: layer.src }))
  cosmeticsSpriteOptions.unshift(hiddenOption)
  dudeFolder.addBinding(spriteParams, 'cosmetics', {
    label: 'Cosmetics',
    options: cosmeticsSpriteOptions
  })

  dudeFolder.addBinding(spriteParams, 'cosmeticsColor', {
    label: ''
  })

  dudeFolder.addBlade({ view: 'separator' })

  dudeFolder.addBinding(settings.sounds, 'enabled', {
    label: 'Sounds'
  })
  dudeFolder.addBinding(settings.sounds, 'volume', {
    label: 'Volume',
    min: 0.01,
    max: 1,
    step: 0.01
  })

  dudeFolder.addBlade({ view: 'separator' })

  dudeFolder.addBinding(settings.dude, 'growTime', {
    label: 'Grow time',
    min: 1000 * 1,
    max: 1000 * 60 * 60,
    step: 1000
  })
  dudeFolder.addBinding(settings.dude, 'growMaxScale', {
    label: 'Grow max scale',
    min: 4,
    max: 32,
    step: 0.1
  })

  dudeFolder.addBlade({ view: 'separator' })

  dudeFolder.addBinding(settings.dude, 'gravity', {
    label: 'Gravity',
    min: 10,
    max: 10000,
    step: 1
  })
  dudeFolder.addBinding(settings.dude, 'maxLifeTime', {
    label: 'Max life time on screen',
    min: 1000 * 1,
    max: 1000 * 60 * 60
  })
  dudeFolder.addBinding(settings.dude, 'scale', {
    label: 'Scale',
    min: 1,
    max: 24,
    step: 0.1,
  })

  dudeFolder.addBlade({ view: 'separator' })

  dudeFolder.addButton({ title: 'Spawn' }).on('click', spawnDude)
  dudeFolder.addButton({ title: 'Jump' }).on('click', jumpAllDudes)
  dudeFolder.addButton({ title: 'Grow' }).on('click', growAllDudes)
  dudeFolder.addButton({ title: 'Run' }).on('click', runAllDudes)
  dudeFolder.addButton({ title: 'Idle' }).on('click', idleAllDudes)
  dudeFolder.addButton({ title: 'Leave' }).on('click', leaveAllDudes)
  dudeFolder.addButton({ title: 'Show message' }).on('click', showMessageAllDudes)
  dudeFolder.addButton({ title: 'Show emote' }).on('click', showEmotesAllDudes)
  dudeFolder.addButton({ title: 'Clear' }).on('click', clearDudes)

  const messageBoxFolder = pane.addFolder({ title: 'Message', expanded: false })
  messageBoxFolder.addBinding(settings.message, 'enabled')
  messageBoxFolder.addBinding(settings.message, 'fill')
  messageBoxFolder.addBinding(settings.message, 'boxColor')
  messageBoxFolder.addBinding(settings.message, 'fontFamily', {
    options: fonts
  })
  messageBoxFolder.addBinding(settings.message, 'fontSize', {
    min: 10,
    max: 64,
    step: 1
  })
  messageBoxFolder.addBinding(settings.message, 'borderRadius', {
    min: 0,
    max: 64,
    step: 1
  })
  messageBoxFolder.addBinding(settings.message, 'padding', {
    min: 0,
    max: 64,
    step: 1
  })
  messageBoxFolder.addBinding(settings.message, 'showTime', {
    min: 1000,
    max: 1000 * 10
  })

  const nameBoxFolder = pane.addFolder({ title: 'Name', expanded: false })
  nameBoxFolder.addBinding(settings.name, 'enabled')
  nameBoxFolder.addBinding(settings.name, 'fill')
  nameBoxFolder.addBinding(settings.name, 'fontFamily', {
    options: fonts
  })
  nameBoxFolder.addBinding(settings.name, 'fontSize', {
    min: 10,
    max: 64,
    step: 1
  })
  nameBoxFolder.addBinding(settings.name, 'fontStyle', {
    options: {
      normal: 'normal',
      italic: 'italic'
    }
  })
  nameBoxFolder.addBinding(settings.name, 'fontVariant', {
    options: {
      normal: 'normal',
      'small-caps': 'small-caps'
    }
  })
  nameBoxFolder.addBinding(settings.name, 'fontWeight', {
    options: [100, 200, 300, 400, 500, 600, 700, 800, 900].map((weight) => ({
      text: `${weight}`,
      value: weight
    }))
  })
  nameBoxFolder.addBinding(settings.name, 'stroke')
  nameBoxFolder.addBinding(settings.name, 'strokeThickness', {
    min: 0,
    max: 10,
    step: 1
  })
  nameBoxFolder.addBinding(settings.name, 'dropShadow')
  nameBoxFolder.addBinding(settings.name, 'dropShadowColor')
  nameBoxFolder.addBinding(settings.name, 'dropShadowDistance', {
    min: 0,
    max: 32,
    step: 0.1
  })
  nameBoxFolder.addBinding(settings.name, 'dropShadowAlpha', {
    min: 0,
    max: 1,
    step: 0.01
  })
  nameBoxFolder.addBinding(settings.name, 'dropShadowBlur', {
    min: 0,
    max: 1,
    step: 0.01
  })
  nameBoxFolder.addBinding(settings.name, 'dropShadowAngle', {
    min: 0,
    max: Math.PI * 2
  })

  const emoteFolder = pane.addFolder({ title: 'Emote', expanded: false })
  emoteFolder.addBinding(settings.emotes, 'enabled')
}
</script>

<template>
  <Teleport to="body">
    <v-tweakpane
      style="overflow-y: scroll;"
      :pane="{ title: 'Dudes Playground' }"
      @on-pane-created="onPaneCreated"
    />
  </Teleport>
  <dudes-overlay
    ref="dudesRef"
    :assets-loader-options="assetsLoadOptions"
    :sounds="dudesSounds"
    :settings="settings"
  />
</template>
