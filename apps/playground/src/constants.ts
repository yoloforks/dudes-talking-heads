import type {
  AssetsLoadOptions,
  DudesAsset,
  DudeSpriteData,
  SoundAsset
} from '@twirapp/dudes/types'

export const dudeSprites = [
  'dude',
  'sith',
  'agent',
  'girl',
  'cat',
  'santa'
] as const

export type DudesSprites = (typeof dudeSprites)[number]

export const dudeNames = dudeSprites.map((name) => {
  return name.charAt(0).toUpperCase() + name.slice(1)
})

export const dudeSounds: SoundAsset[] = [
  {
    alias: 'jump',
    src: './sounds/jump.mp3'
  }
]

export const assetsLoadOptions: AssetsLoadOptions = {
  basePath: location.href + 'sprites/',
  defaultSearchParams: {
    ts: Date.now()
  }
}

export const santaSpriteData: DudeSpriteData = {
  name: 'santa',
  layers: [
    {
      alias: 'Body',
      src: 'custom/body.json'
    },
    {
      alias: 'Eyes',
      src: 'custom/eyes.json'
    },
    {
      alias: 'Cosmetics',
      src: 'custom/cosmetics.json'
    }
  ]
}

export const dudeAssets: DudesAsset[] = [
  {
    alias: 'dude.Body',
    src: 'custom/body.json'
  },
  {
    alias: 'dude.Eyes',
    src: 'custom/eyes.json'
  },
  {
    alias: 'dude.Cosmetics',
    src: 'custom/cosmetics.json'
  }
  // {
  //   alias: 'dude',
  //   src: 'dude/dude.json'
  // },
  // {
  //   alias: 'sith',
  //   src: 'sith/sith.json'
  // },
  // {
  //   alias: 'agent',
  //   src: 'agent/agent.json'
  // },
  // {
  //   alias: 'girl',
  //   src: 'girl/girl.json'
  // },
  // {
  //   alias: 'cat',
  //   src: 'cat/cat.json'
  // },
  // {
  //   alias: 'santa',
  //   src: 'santa/santa.json'
  // }
]

export const dudeEmotes: string[] = [
  'pepegaGun.gif',
  'lexot.gif',
  'hmm.webp',
  'pepeSmack.gif',
  'pepe.gif'
]
