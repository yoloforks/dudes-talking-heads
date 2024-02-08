import type {
  AssetsLoadOptions,
  DudeAsset,
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

export const dudeNames = [
  'Dude',
  'Sith',
  'Agent',
  'Girl',
  'Cat',
  'Santa'
]

export const dudeSounds: SoundAsset[] = [
  {
    alias: 'jump',
    src: './sounds/jump.mp3'
  }
]

export const assetsLoadOptions: AssetsLoadOptions = {
  basePath: location.origin + '/sprites/',
  defaultSearchParams: {
    ts: Date.now()
  }
}

export const dudeAssets: DudeAsset[] = [
  {
    alias: 'dude',
    src: 'dude/dude.json'
  },
  {
    alias: 'sith',
    src: 'sith/sith.json'
  },
  {
    alias: 'agent',
    src: 'agent/agent.json'
  },
  {
    alias: 'girl',
    src: 'girl/girl.json'
  },
  {
    alias: 'cat',
    src: 'cat/cat.json'
  },
  {
    alias: 'santa',
    src: 'santa/santa.json'
  }
]

export const dudeEmotes: string[] = [
  'pepegaGun.gif',
  'lexot.gif',
  'hmm.webp',
  'pepeSmack.gif',
  'pepe.gif'
]
