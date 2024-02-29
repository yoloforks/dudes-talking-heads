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
        src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASAAAAAgCAYAAACy9KU0AAAAAXNSR0IArs4c6QAAAVVJREFUeJzt3EFuwyAQBVCoehnfuCfLpoehC9ep1UYuWDhD7PckVjb+I0CjbEhKAAAAAAAAAEAnueHdcuC3qVO7B0etfXR+pOjzf8r82iJLKW35OeeW71fV0Pj+S2xAS37tHhyw9iPkR4o+/6fNf68Jv91uTeEppVRKSTnnUlNE3eeaF6BX9hD5LXvQee2HyN85r8vZCz7/p86vaUDRTr0B/Ku5+S+s//jeoguADbua/33y3Lj2/nriCTQgIIwGBITRgIAwGhAQRgMCwmhAQBgNCAijAQFhNCAgjAYEhHmV2/BXz0/p+1rCNE0R2VH51ZkH1xK9/xfP//hMaT4MZZHmOzb38efZPKeL5U5PS/7eC4wj5q9LqRxHicgve/WqJXr/y8+dtofjUV1H5W+twXrU5rd2qPVXf8/detbL1fOvKvLvONZG3f9nZjvnAAAAAAAAADCmLynTrb5yQ6D8AAAAAElFTkSuQmCC'
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
