import * as PIXI from "pixi.js";
import * as Matter from "matter-js";
import GameObject from "../../../core/GameObject";

export default class Candle extends GameObject {
  name = "candle";
  height: number;
  width: number;

  setup() {
    this.width = Math.min(this.scene.width * 0.15, 80);
    this.height = this.width;

    this.body = Matter.Bodies.rectangle(
      this.scene.width / 2,
      this.scene.height - this.scene.height * 0.25 - this.height * 1.6,
      this.width,
      this.height,
      { isStatic: true }
    );

    const sprite = new PIXI.Sprite(this.scene.context.resources.candle.texture);
    const spriteScale = this.width / sprite.width;
    sprite.scale.set(spriteScale, spriteScale);
    sprite.position.set(-sprite.width * 0.5, -sprite.height * 0.5);

    this.graphics.addChild(sprite);

    // this.graphics.beginFill(0xffc75f);
    // this.graphics.drawRect(
    //   -this.width / 2,
    //   -this.height / 2,
    //   this.width,
    //   this.height
    // );
  }

  update(deltaTime: number) {}
}
