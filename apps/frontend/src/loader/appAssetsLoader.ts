import * as PIXI from 'pixi.js';

interface AsepriteFrameData extends PIXI.ISpritesheetFrameData {
  duration: number;
}

interface AsepriteData extends PIXI.ISpritesheetData {
  frames: PIXI.utils.Dict<AsepriteFrameData>;
  duration: number;
}

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

  public getSprite(sheetName: string, tagName: string): PIXI.AnimatedSprite {
    if (!sheetName) {
      throw Error('Sheet is not defined');
    }

    const sheet = this.sheets[sheetName];

    const frameTag = sheet.data.meta.frameTags?.find(
      (tag) => tag.name == tagName
    );

    if (frameTag) {
      const textures = [];

      for (let i = frameTag.from; i <= frameTag.to; i++) {
        const framekey = i.toString();
        const texture = sheet.textures[i];
        const time = sheet.data.frames[framekey].duration;

        textures.push({ texture, time });
      }

      const sprite = new PIXI.AnimatedSprite(textures);
      sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

      return sprite;
    }

    throw Error("Frame tag doesn't exist");
  }
}

export const appAssetsLoader = new AppAssetsLoader();
