import type {
  AssetsLoaderOptions,
  DudeSpriteData,
  SoundAsset
} from '@twirapp/dudes/types'

export const dudesSounds: SoundAsset[] = [
  {
    alias: 'jump',
    src: './sounds/jump.mp3'
  }
]

export const assetsLoadOptions: AssetsLoaderOptions = {
  basePath: location.href + 'sprites/',
  defaultSearchParams: {
    ts: Date.now()
  }
}

const body = {
  alias: 'Body',
  src: 'custom/body.json'
}

const eyes = {
  alias: 'Eyes',
  src: 'custom/eyes.json'
}

const mouth = {
  alias: 'Mouth',
  src: 'custom/mouth.json'
}

const cosmetics = {
  alias: 'Cosmetics',
  src: 'custom/cosmetics.json'
}

export const dudesSpriteNames = {
  Dude: 'dude',
  Santa: 'santa',
  DudeWithoutEyes: 'dude-without-eyes',
  SantaWithoutEyes: 'santa-without-eyes',
  DudeWithMouth: 'dude-with-mouth'
} as const

export const dudesSprites: DudeSpriteData[] = [
  {
    name: dudesSpriteNames.Dude,
    layers: [
      body,
      eyes
    ]
  },
  {
    name: dudesSpriteNames.DudeWithoutEyes,
    layers: [
      body
    ]
  },
  {
    name: dudesSpriteNames.Santa,
    layers: [
      body,
      eyes,
      cosmetics
    ]
  },
  {
    name: dudesSpriteNames.SantaWithoutEyes,
    layers: [
      body,
      cosmetics
    ]
  },
  {
    name: dudesSpriteNames.DudeWithMouth,
    layers: [
      body,
      eyes,
      mouth
    ]
  }
]

// export const dudeAssets: DudesAsset[] = [
//   {
//     alias: 'dude',
//     src: 'dude/dude.json'
//   },
//   {
//     alias: 'sith',
//     src: 'sith/sith.json'
//   },
//   {
//     alias: 'agent',
//     src: 'agent/agent.json'
//   },
//   {
//     alias: 'girl',
//     src: 'girl/girl.json'
//   },
//   {
//     alias: 'cat',
//     src: 'cat/cat.json'
//   },
//   {
//     alias: 'santa',
//     src: 'santa/santa.json'
//   }
// ]

export const dudesEmotes: string[] = [
  'pepegaGun.gif',
  'lexot.gif',
  'hmm.webp',
  'pepeSmack.gif',
  'pepe.gif'
]
