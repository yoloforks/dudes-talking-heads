<script setup lang="ts">
import DudesOverlay from '@twirapp/dudes'
import { VTweakpane } from 'v-tweakpane'
import { onMounted, reactive, ref } from 'vue'
import { assetsLoadOptions, dudeAssets, dudeSprites, dudeSounds, dudeNames, dudeEmotes, type DudesSprites } from './constants.js'
import { randomNum, capitalize } from '@zero-dependency/utils'
import { randomRgbColor } from './utils.js'

import type { Pane } from 'tweakpane'
import type { Dude, DudesMethods, DudesTypes } from '@twirapp/dudes/types'

const playgroundParams = ref<{
  isRandomColor: boolean,
  selectedSprite: DudesSprites
}>({
  isRandomColor: false,
  selectedSprite: dudeSprites[0]
})

const settings = reactive<{
  dude: DudesTypes.DudeParams,
  message: DudesTypes.MessageBoxParams,
  name: DudesTypes.NameBoxParams,
  spitter: DudesTypes.EmoteSpitterParams
}>({
  dude: {
    visibleName: true,
    color: '#969696',
    eyesColor: '#FFFFFF',
    cosmeticsColor: '#FFFFFF',
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
  spitter: {
    enabled: true
  }
})

const dudesRef = ref<DudesMethods | null>(null)

onMounted(async () => {
  if (!dudesRef.value) return
  await dudesRef.value.initDudes()

  if (import.meta.env.DEV) {
    const dude = dudesRef.value.createDude('Тwir', dudeSprites[0])
    dude.bodyTint('#6441A5')
  } else {
    for (const dudeName of dudeNames) {
      const dudeSprite = dudeSprites[randomNum(0, dudeSprites.length - 1)]
      const dudeColor = randomRgbColor()
      const dude = dudesRef.value.createDude(dudeName, dudeSprite)
      dude.bodyTint(dudeColor)
    }
  }
})

function spawnDude() {
  if (!dudesRef.value) return

  const name = dudeNames[randomNum(0, dudeNames.length - 1)]
  const dude = dudesRef.value.createDude(
    `Super ${name} #${randomNum(0, 100)}`,
    playgroundParams.value.selectedSprite,
    {
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
  )

  const color = playgroundParams.value.isRandomColor
    ? randomRgbColor()
    : settings.dude.color

  dude.bodyTint(color)

  setTimeout(() => {
    spitEmote(dude)
  }, 2000)
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
  dude.spitEmotes([`emotes/${emoteName}`])
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
  dudeFolder.addBinding(playgroundParams.value, 'selectedSprite', {
    label: 'Sprite',
    options: dudeSprites.map(sprite => ({
      text: capitalize(sprite),
      value: sprite
    })),
  })
  dudeFolder.addBinding(settings.dude.sounds, 'enabled', {
    label: 'Sounds'
  })
  dudeFolder.addBinding(settings.dude.sounds, 'volume', {
    label: 'Sounds volume',
    min: 0.01,
    max: 1,
    step: 0.01
  })
  dudeFolder.addBinding(playgroundParams.value, 'isRandomColor', {
    label: 'Random sprite color'
  }).on('change', ({ value }) => color.disabled = value)

  const color = dudeFolder.addBinding(settings.dude, 'color', {
    label: 'Sprite color'
  })
  dudeFolder.addBinding(settings.dude, 'eyesColor', {
    label: 'Eyes color'
  })
  dudeFolder.addBinding(settings.dude, 'cosmeticsColor', {
    label: 'Cosmetics color'
  })
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
    step: 0.1
  })
  dudeFolder.addBinding(settings.dude, 'growTime', {
    label: 'Grow time',
    min: 1000 * 1,
    max: 1000 * 60 * 60,
    step: 1000
  })
  dudeFolder.addBinding(settings.dude, 'growMaxScale', {
    label: 'Grow max scale',
    min: 4,
    max: 24,
    step: 0.1
  })

  dudeFolder.addBlade({ view: 'separator' })
  dudeFolder.addButton({ title: 'Spawn' }).on('click', spawnDude)
  dudeFolder.addButton({ title: 'Jump' }).on('click', jumpAllDudes)
  dudeFolder.addButton({ title: 'Grow' }).on('click', growAllDudes)
  dudeFolder.addButton({ title: 'Show message' }).on('click', showMessageAllDudes)
  dudeFolder.addButton({ title: 'Spit emote' }).on('click', spitEmotesAllDudes)
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
  nameBoxFolder.addBinding(settings.dude, 'visibleName', {
    label: 'enabled'
  })
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

  const spitterFolder = pane.addFolder({ title: 'Spitter', expanded: false })
  spitterFolder.addBinding(settings.spitter, 'enabled')
}
</script>

<template>
  <Teleport to="body">
    <v-tweakpane :pane="{ title: 'Dudes Playground' }" @on-pane-created="onPaneCreated" />
  </Teleport>
  <dudes-overlay
    ref="dudesRef"
    :assets-load-options="assetsLoadOptions"
    :assets="dudeAssets"
    :sounds="dudeSounds"
    :settings="settings"
  />
</template>
