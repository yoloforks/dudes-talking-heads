import type { DudeAsset } from '@twirapp/dudes/types'

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

export const dudeAssets: DudeAsset[] = [
  {
    alias: 'dude',
    src: './sprites/dude/dude.json'
  },
  {
    alias: 'sith',
    src: './sprites/sith/sith.json'
  },
  {
    alias: 'agent',
    src: './sprites/agent/agent.json'
  },
  {
    alias: 'girl',
    src: './sprites/girl/girl.json'
  },
  {
    alias: 'cat',
    src: './sprites/cat/cat.json'
  },
  {
    alias: 'santa',
    src: './sprites/santa/santa.json'
  }
]

export const dudeEmotes: string[] = [
  'gandon',
  'hii',
  'pupsik',
  'uuh',
  'vahui',
  'xdd'
]