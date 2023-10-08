import { Text, Container, TextMetrics, Graphics } from 'pixi.js';

export class DudeMessage {
  public view: Container = new Container();

  private padding: number = 10;
  private borderRadius: number = 10;

  constructor(message: string) {
    const text = new Text(message, {
      fontFamily: 'Arial',
      fontSize: 20,
      fill: 0x333333,
      align: 'left',
      breakWords: true,
      wordWrap: true,
      wordWrapWidth: 200,
    });

    text.anchor.set(0.5, 1);
    text.text = this.trim(text);

    const box = new Graphics();
    box.beginFill(0xeeeeee);
    box.drawRoundedRect(
      (text.x - this.padding) - text.width * text.anchor.x,
      (text.y - this.padding) - text.height * text.anchor.y,
      text.width + this.padding * 2,
      text.height + this.padding * 2,
      this.borderRadius
    );
    box.endFill();

    this.view.addChild(box, text);
  }

  private trim(text: Text): string {
    const metrics = TextMetrics.measureText(text.text, text.style);

    return metrics.lines.length > 4
      ? metrics.lines.slice(0, 4).join(' ').slice(0, -3) + '...'
      : text.text;
  }
}
