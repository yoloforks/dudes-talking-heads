import { Container, utils } from 'pixi.js';
import { appAssetsLoader } from '../loader/appAssetsLoader';
import { Connection, Message } from '../connection/connection';
import { Dude } from './entities/Dude';
import { config } from './config';
import tinycolor from 'tinycolor2';

export class World {
  private connection = new Connection();

  public stage: Container = new Container();
  public dudes: utils.Dict<Dude> = {};

  public async init() {
    await appAssetsLoader.load();

    this.connection.init();
    this.connection.onMessage((data) => this.handleMessage(data));
  }

  public update() {
    for (const id in this.dudes) {
      this.dudes[id].update();

      if (this.dudes[id].shouldBeDeleted) {
        this.deleteDude(id, this.dudes[id]);
      }
    }
  }

  private handleMessage(data: Message) {
    if (!this.dudes[data.userId]) {
      const chatter = config.chatters[data.name];
      const sprite = chatter ? chatter.sprite : 'dude';
      const dude = new Dude(data.name, sprite);
      this.addDude(data.userId, dude);
    }

    const dude = this.dudes[data.userId];

    const message = data.message.trim();
    const array = message.split(' ').filter((item) => item != '');
    const command = array[0];
    const value = array[1];

    if (command == '!jump') {
      dude.jump();
    } else if (command == '!color') {
      const color = tinycolor(value);

      if (color.isValid()) {
        dude.tint(value, true);
      }
    } else {
      dude.addMessage(data.message);
    }

    dude.tint(data.color);
  }

  public addDude(id: string, dude: Dude) {
    this.dudes[id] = dude;
    this.stage.addChild(dude.view);
  }

  public deleteDude(id: string, dude: Dude) {
    delete this.dudes[id];
    this.stage.removeChild(dude.view);
  }
}
