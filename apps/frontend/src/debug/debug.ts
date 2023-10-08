import { Text } from 'pixi.js';
import { World } from '../world/World';
import { Dude } from '../world/entities/Dude';

export class Debug {
  private readonly logs: string[] = [];

  public view: Text;
  public world: World;

  constructor(world: World) {
    this.view = new Text();
    this.view.position.set(10, 10);

    this.world = world;
    this.world.stage.addChild(this.view);

    this.generateDudes();
  }

  public log(text: string | number) {
    if (this.logs.length > 10) {
      this.logs.shift();
    }

    this.logs.push(text.toString());

    this.view.text = this.logs.join('\n');
  }

  public generateDudes() {
    for (let i = 0; i < 1000; i++) {
      setTimeout(() => {
        const dude = new Dude('bot');
        this.world.addDude('bot ' + i, dude);
      }, 10 * i);
    }
  }
}
