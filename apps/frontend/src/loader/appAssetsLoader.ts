import * as PIXI from 'pixi.js';

interface AsepriteFrameData extends PIXI.ISpritesheetFrameData {
  duration: number;
}

interface AsepriteData extends PIXI.ISpritesheetData {
  frames: PIXI.utils.Dict<AsepriteFrameData>;
  duration: number;
}

export type DudeSprite = {
  body: PIXI.AnimatedSprite,
  eyes: PIXI.AnimatedSprite,
};

const manifest = {
  bundles: [
    {
      name: 'main',
      assets: [
        {
          alias: 'dude',
          src: '/user/sprites/dude/dude.json',
        },
        {
          alias: 'sith',
          src: '/user/sprites/sith/sith.json',
        },
        {
          alias: 'agent',
          src: '/user/sprites/agent/agent.json',
        },
      ],
    },
  ],
};

export class AppAssetsLoader {
  private sheets: PIXI.utils.Dict<PIXI.Spritesheet<AsepriteData>> = {};

  private isLoaded: boolean = false;

  async load() {
    if (!this.isLoaded) {
      await PIXI.Assets.init({ manifest });
      this.sheets = await PIXI.Assets.loadBundle('main');
      this.isLoaded = true;
    }
  }

  public getSprite(sheetName: string, tagName: string): DudeSprite {
    if (!sheetName) {
      throw Error('Sheet is not defined');
    }

    const sheet = this.sheets[sheetName];

    const frameTag = sheet.data.meta.frameTags?.find(
      (tag) => tag.name == tagName
    );

    if (frameTag) {
      const bodyTextures = [];
      const eyesTextures = [];

      for (let i = frameTag.from; i <= frameTag.to; i++) {
        const framekey = i.toString();

        const bodyTexture = sheet.textures['Body_' + i];
        const eyesTexture = sheet.textures['Eyes_' + i];

        const bodytime = sheet.data.frames['Body_' + framekey].duration;
        const eyestime = sheet.data.frames['Eyes_' + framekey].duration;

        bodyTextures.push({ texture: bodyTexture, time: bodytime });
        eyesTextures.push({ texture: eyesTexture, time: eyestime });
      }

      const bodySprite = new PIXI.AnimatedSprite(bodyTextures);
      bodySprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
      
      const eyesSprite = new PIXI.AnimatedSprite(eyesTextures);
      eyesSprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

      return {
        body: bodySprite,
        eyes: eyesSprite,
      };
    }

    throw Error("Frame tag doesn't exist");
  }
}

export const appAssetsLoader = new AppAssetsLoader();
