<script setup lang="ts">
import DudesOverlay, { DudesLayers } from '@twirapp/dudes'
import { VTweakpane } from 'v-tweakpane'
import { onMounted, reactive, ref, watch } from 'vue'
import { assetsLoadOptions, dudesSounds, dudesEmotes, dudesLayers } from './constants.js'
import { randomNum } from '@zero-dependency/utils'
import { mapDudeSpriteData, randomRgbColor } from './utils.js'

import type { Pane } from 'tweakpane'
import type { Dude, DudesMethods, DudesTypes } from '@twirapp/dudes/types'

const initialBodyColor = randomRgbColor()

export interface DudeSpriteParams {
  bodySprite: string
  bodyColor: string

  eyesSprite: string
  eyesColor: string

  mouthSprite: string
  mouthColor: string

  hatSprite: string
  hatColor: string

  cosmeticsSprite: string
  cosmeticsColor: string
}

const dudeSpriteParams = reactive<DudeSpriteParams>({
  bodySprite: dudesLayers.Body[0].src,
  bodyColor: initialBodyColor,

  eyesSprite: dudesLayers.Eyes[0].src,
  eyesColor: '#FFF',

  mouthSprite: '',
  mouthColor: '#FFF',

  hatSprite: '',
  hatColor: '#FFF',

  cosmeticsSprite: '',
  cosmeticsColor: '#FFF'
})

const settings = reactive<{
  dude: DudesTypes.DudeParams,
  message: DudesTypes.MessageBoxParams,
  name: DudesTypes.NameBoxParams,
  emotes: DudesTypes.EmotesParams
}>({
  dude: {
    bodyColor: initialBodyColor,
    maxLifeTime: 1000 * 60 * 30,
    growTime: 1000 * 2,
    growMaxScale: 20,
    gravity: 400,
    scale: 4,
    sounds: {
      enabled: true,
      volume: 0.01
    }
  },
  message: {
    enabled: true,
    borderRadius: 5,
    boxColor: '#E6AC0C',
    fontFamily: 'Roboto',
    fontSize: 12,
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

  const dudeName = 'Twir'
  const dudeSprite = mapDudeSpriteData(dudeName, dudeSpriteParams)
  const dude = await dudesRef.value.createDude(dudeName, dudeSprite)
  updateDudeSprite(dude)
})

watch(dudeSpriteParams, () => {
  if (!dudesRef.value) return
  for (const dude of dudesRef.value.dudes.values()) {
    updateDudeSprite(dude as Dude, true)
  }
})

async function spawnDude() {
  if (!dudesRef.value) return

  const dudeName = `Super Dude #${randomNum(0, 100)}`
  const dudeSprite = mapDudeSpriteData(dudeName, dudeSpriteParams)
  const dudeParams = {
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

  const dude = await dudesRef.value.createDude(dudeName, dudeSprite, dudeParams)
  updateDudeSprite(dude)
}

function updateDudeSprite(dude: Dude, force = false) {
  if (force) {
    const spriteData = mapDudeSpriteData(dude.name, dudeSpriteParams)
    dude.updateSpriteData(spriteData)
  }

  dude.updateColor(DudesLayers.Body, dudeSpriteParams.bodyColor)
  dude.updateColor(DudesLayers.Eyes, dudeSpriteParams.eyesColor)
  dude.updateColor(DudesLayers.Mouth, dudeSpriteParams.mouthColor)
  dude.updateColor(DudesLayers.Hat, dudeSpriteParams.hatColor)
  dude.updateColor(DudesLayers.Cosmetics, dudeSpriteParams.cosmeticsColor)
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
    dude.updateIdleAnimationTime(performance.now())
    dude.playAnimation('Run')
  }
}

function idleAllDudes() {
  if (!dudesRef.value) return
  for (const dude of dudesRef.value.dudes.values()) {
    dude.updateIdleAnimationTime(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
    dude.playAnimation('Idle')
  }
}

function showMessageAllDudes() {
  if (!dudesRef.value) return
  for (const dude of dudesRef.value.dudes.values()) {
    dude.addMessage('Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века.')
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
  dudeFolder.addBinding(dudeSpriteParams, 'bodySprite', {
    label: 'Body',
    options: bodySpriteOptions
  })

  dudeFolder.addBinding(dudeSpriteParams, 'bodyColor', {
    label: ''
  })

  dudeFolder.addBlade({ view: 'separator' })

  const eyesSpriteOptions = dudesLayers.Eyes
    .map((layer) => ({ text: layer.name, value: layer.src }))
  eyesSpriteOptions.unshift(hiddenOption)
  dudeFolder.addBinding(dudeSpriteParams, 'eyesSprite', {
    label: 'Eyes',
    options: eyesSpriteOptions
  })

  dudeFolder.addBinding(dudeSpriteParams, 'eyesColor', {
    label: ''
  })

  dudeFolder.addBlade({ view: 'separator' })

  const mouthSpriteOptions = dudesLayers.Mouth
    .map((layer) => ({ text: layer.name, value: layer.src }))
  mouthSpriteOptions.unshift(hiddenOption)
  dudeFolder.addBinding(dudeSpriteParams, 'mouthSprite', {
    label: 'Mouth',
    options: mouthSpriteOptions
  })

  dudeFolder.addBinding(dudeSpriteParams, 'mouthColor', {
    label: ''
  })

  dudeFolder.addBlade({ view: 'separator' })

  const hatSpriteOptions = dudesLayers.Hat
    .map((layer) => ({ text: layer.name, value: layer.src }))
  hatSpriteOptions.unshift(hiddenOption)
  dudeFolder.addBinding(dudeSpriteParams, 'hatSprite', {
    label: 'Hat',
    options: hatSpriteOptions
  })

  dudeFolder.addBinding(dudeSpriteParams, 'hatColor', {
    label: ''
  })

  dudeFolder.addBlade({ view: 'separator' })

  const cosmeticsSpriteOptions = dudesLayers.Cosmetics
    .map((layer) => ({ text: layer.name, value: layer.src }))
  cosmeticsSpriteOptions.unshift(hiddenOption)
  dudeFolder.addBinding(dudeSpriteParams, 'cosmeticsSprite', {
    label: 'Cosmetics',
    options: cosmeticsSpriteOptions
  })

  dudeFolder.addBinding(dudeSpriteParams, 'cosmeticsColor', {
    label: ''
  })

  dudeFolder.addBlade({ view: 'separator' })

  dudeFolder.addBinding(settings.dude.sounds, 'enabled', {
    label: 'Sounds'
  })
  dudeFolder.addBinding(settings.dude.sounds, 'volume', {
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
    <v-tweakpane :pane="{ title: 'Dudes Playground' }" @on-pane-created="onPaneCreated" />
  </Teleport>
  <dudes-overlay ref="dudesRef" :assets-loader-options="assetsLoadOptions" :sounds="dudesSounds" :settings="settings" />
</template>
