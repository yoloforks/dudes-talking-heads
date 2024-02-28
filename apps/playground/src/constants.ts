import type {
  AssetsLoaderOptions,
  DudesAsset,
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
  basePath: location.href + 'custom/',
  defaultSearchParams: {
    ts: Date.now()
  }
}

export const dudesAssets: Record<DudesLayer, DudesAsset> = {
  Body: {
    alias: 'Body',
    src: 'body.json'
  },
  Eyes: {
    alias: 'Eyes',
    src: 'eyes.json'
  },
  Mouth: {
    alias: 'Mouth',
    src: 'mouth.json'
  },
  Cosmetics: {
    alias: 'Cosmetics',
    src: 'cosmetics.json'
  }
}

export const dudesEmotes: string[] = [
  'pepegaGun.gif',
  'lexot.gif',
  'hmm.webp',
  'pepeSmack.gif',
  'pepe.gif'
]
