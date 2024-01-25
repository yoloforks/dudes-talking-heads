<script setup lang="ts">
import DudesOverlay from '@twirapp/dudes'
import { VTweakpane } from 'v-tweakpane'
import type { Dude, DudesOverlayMethods, DudesSettings } from '@twirapp/dudes/types'
import { onMounted, reactive, ref, watch } from 'vue'
import { dudeAssets, dudeSprites, dudeSounds, dudeNames, dudeEmotes, type DudesSprites } from './constants.js'
import { randomNum } from '@zero-dependency/utils'
import { randomRgbColor } from './utils.js'
import type { Pane } from 'tweakpane'

const playgroundParams = ref({
  isRandomColor: false
})

const settings = reactive<DudesSettings>({
  dude: {
    color: '#969696',
    maxLifeTime: 1000 * 60 * 30,
    gravity: 400,
    scale: 4,
    sounds: {
      enabled: true,
      volume: 0.01
    }
  },
  messageBox: {
    borderRadius: 5,
    boxColor: '#e6ac0c',
    fontFamily: 'Courier New',
    fontSize: 12,
    padding: 5,
    showTime: 5 * 1000,
    fill: '#333333'
  },
  nameBox: {
    fontFamily: 'Arial',
    fontSize: 18,
    fill: '#ffffff',
    lineJoin: 'round',
    strokeThickness: 4,
    stroke: '#333333',
    fillGradientStops: [0],
    fillGradientType: 0,
    fontStyle: 'normal',
    fontVariant: 'normal',
    fontWeight: 'normal',
    dropShadow: false,
    dropShadowAlpha: 1,
    dropShadowAngle: 0,
    dropShadowBlur: 0.1,
    dropShadowDistance: 10,
    dropShadowColor: '#3ac7d9'
  }
})

const dudesRef = ref<DudesOverlayMethods<DudesSprites> | null>(null)

watch(settings, (settings) => {
  if (!dudesRef.value) return
  dudesRef.value.updateSettings(settings)
})

onMounted(async () => {
  if (!dudesRef.value) return
  await dudesRef.value.initDudes()

  for (const dudeName of dudeNames) {
    const dudeSprite = dudeSprites[randomNum(0, dudeSprites.length - 1)]
    const dudeColor = randomRgbColor()
    const dude = dudesRef.value.createDude(dudeName, dudeSprite)
    dude.tint(dudeColor)
  }
})

function spawnDude() {
  if (!dudesRef.value) return

  const name = dudeNames[randomNum(0, dudeNames.length - 1)]
  const sprite = dudeSprites[randomNum(0, dudeSprites.length - 1)]
  const dude = dudesRef.value.createDude(`Super ${name} #${randomNum(0, 100)}`, sprite, {
    messageBox: {
      boxColor: 'lightgreen',
      fill: '#000000'
    },
    nameBox: {
      fill: ['rgb(131, 58, 180)', 'rgb(253, 29, 29)', 'rgb(252, 176, 69)'],
      fillGradientType: 1,
      fillGradientStops: [0.3, 0.6, 1],
      stroke: '#ffffff',
      strokeThickness: 4
    }
  })
  const color = playgroundParams.value.isRandomColor
    ? randomRgbColor()
    : settings.dude.color
  dude.tint(color)

  setTimeout(() => {
    if (dude.shouldBeDeleted) return
    spitEmote(dude)
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
    dude.addMessage('Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века.')
  }
}

function spitEmotesAllDudes() {
  if (!dudesRef.value) return
  for (const dude of dudesRef.value.dudes.values()) {
    spitEmote(dude as Dude)
  }
}

function spitEmote(dude: Dude) {
  const emoteName = dudeEmotes[randomNum(0, dudeEmotes.length - 1)]
  dude.spitEmotes([`emotes/${emoteName}.webp`])
}

function clearDudes() {
  if (!dudesRef.value) return
  dudesRef.value.clearDudes()
}

function onPaneCreated(pane: Pane) {
  const fonts = {
    'Arial': 'Arial',
    'Times New Roman': 'Times New Roman',
    'Courier New': 'Courier New',
    'Verdana': 'Verdana'
  }

  const dudeFolder = pane.addFolder({ title: 'Dude' })
  dudeFolder.addBinding(playgroundParams.value, 'isRandomColor', {
    label: 'Random color'
  })
  dudeFolder.addBinding(settings.dude.sounds, 'enabled', {
    label: 'Sounds'
  })
  dudeFolder.addBinding(settings.dude.sounds, 'volume', {
    min: 0.01,
    max: 1,
    step: 0.01
  })
  dudeFolder.addBinding(settings.dude, 'color')
  dudeFolder.addBinding(settings.dude, 'gravity', {
    min: 10,
    max: 1000
  })
  dudeFolder.addBinding(settings.dude, 'maxLifeTime', {
    min: 1000 * 1,
    max: 1000 * 60 * 60
  })
  dudeFolder.addBinding(settings.dude, 'scale', {
    min: 1,
    max: 24
  })

  const messageBoxFolder = pane.addFolder({ title: 'Message' })
  messageBoxFolder.addBinding(settings.messageBox, 'fill')
  messageBoxFolder.addBinding(settings.messageBox, 'boxColor')
  messageBoxFolder.addBinding(settings.messageBox, 'fontSize', {
    min: 10,
    max: 64
  })
  messageBoxFolder.addBinding(settings.messageBox, 'borderRadius', {
    min: 0,
    max: 64
  })
  messageBoxFolder.addBinding(settings.messageBox, 'padding', {
    min: 0,
    max: 64
  })
  messageBoxFolder.addBinding(settings.messageBox, 'showTime', {
    min: 1000,
    max: 1000 * 10
  })
  messageBoxFolder.addBinding(settings.messageBox, 'fontFamily', {
    options: fonts
  })

  const nameBoxFolder = pane.addFolder({ title: 'Name' })
  nameBoxFolder.addBinding(settings.nameBox, 'fill')
  nameBoxFolder.addBinding(settings.nameBox, 'fontFamily', {
    options: fonts
  })
  nameBoxFolder.addBinding(settings.nameBox, 'fontSize', {
    min: 10,
    max: 64
  })
  nameBoxFolder.addBinding(settings.nameBox, 'fontStyle', {
    options: {
      normal: 'normal',
      italic: 'italic'
    }
  })
  nameBoxFolder.addBinding(settings.nameBox, 'fontVariant', {
    options: {
      normal: 'normal',
      'small-caps': 'small-caps'
    }
  })
  nameBoxFolder.addBinding(settings.nameBox, 'fontWeight', {
    options: {
      normal: 'normal',
      bold: 'bold',
      lighter: 'lighter'
    }
  })
  nameBoxFolder.addBinding(settings.nameBox, 'stroke')
  nameBoxFolder.addBinding(settings.nameBox, 'strokeThickness', {
    min: 0,
    max: 10
  })
  nameBoxFolder.addBinding(settings.nameBox, 'dropShadow')
  nameBoxFolder.addBinding(settings.nameBox, 'dropShadowColor')
  nameBoxFolder.addBinding(settings.nameBox, 'dropShadowDistance', {
    min: 0,
    max: 32,
    step: 0.1
  })
  nameBoxFolder.addBinding(settings.nameBox, 'dropShadowAlpha', {
    min: 0,
    max: 1,
    step: 0.01
  })
  nameBoxFolder.addBinding(settings.nameBox, 'dropShadowBlur', {
    min: 0,
    max: 1,
    step: 0.01
  })
  nameBoxFolder.addBinding(settings.nameBox, 'dropShadowAngle', {
    min: 0,
    max: Math.PI * 2
  })

  pane.addBlade({ view: 'separator' })

  pane.addButton({ title: 'Spawn dude' }).on('click', spawnDude)
  pane.addButton({ title: 'Jump all dudes' }).on('click', jumpAllDudes)
  pane.addButton({ title: 'Show message all dudes' }).on('click', showMessageAllDudes)
  pane.addButton({ title: 'Spit emote all dudes' }).on('click', spitEmotesAllDudes)
  pane.addButton({ title: 'Clear dudes' }).on('click', clearDudes)
}
</script>

<template>
  <v-tweakpane :pane="{ title: 'Dudes Playground' }" @on-pane-created="onPaneCreated" />
  <dudes-overlay ref="dudesRef" :assets="dudeAssets" :sounds="dudeSounds" :settings="settings" />
</template>
