import type {
  AssetsLoaderOptions,
  DudesLayer,
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

export const dudesLayers: Record<DudesLayer, { name: string; src: string }[]> =
  {
    Body: [
      {
        name: 'Default',
        src: 'default-body.png'
      }
    ],
    Eyes: [
      {
        name: 'Default',
        src: 'default-eyes.png'
      }
    ],
    Mouth: [
      {
        name: 'Cat',
        src: 'cat-mouth.png'
      }
    ],
    Cosmetics: [
      {
        name: 'Santa hat',
        src: 'santa-hat-cosmetics.png'
      }
    ]
  }

export const dudesEmotes: string[] = [
  'pepegaGun.gif',
  'lexot.gif',
  'hmm.webp',
  'pepeSmack.gif',
  'pepe.gif'
]
