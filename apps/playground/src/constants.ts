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
        name: 'Dude',
        src: 'body/dude.png'
      },
      {
        name: 'Cat',
        src: 'body/cat.png'
      },
      {
        name: 'Devil',
        src: 'body/devil.png'
      }
    ],
    Eyes: [
      {
        name: 'Dude',
        src: 'eyes/dude.png'
      },
      {
        name: 'Toned glasses',
        src: 'eyes/toned-glasses.png'
      },
      {
        name: 'Smart guy glasses',
        src: 'eyes/smart-guy-glasses.png'
      }
    ],
    Mouth: [
      {
        name: 'Cat',
        src: 'mouth/cat.png'
      },
      {
        name: 'Mexican moustache',
        src: 'mouth/mexican-moustache.png'
      }
    ],
    Hat: [
      {
        name: 'Santa hat',
        src: 'cosmetics/santa-hat.png'
      },
      {
        name: 'Cowboy hat',
        src: 'cosmetics/cowboy-hat.png'
      },
      {
        name: 'Girl ribbon',
        src: 'cosmetics/girl-ribbon.png'
      }
    ],
    Cosmetics: [
      {
        name: 'Gun',
        src: 'cosmetics/gun.png'
      },
      {
        name: 'Lightsaber',
        src: 'cosmetics/lightsaber.png'
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
