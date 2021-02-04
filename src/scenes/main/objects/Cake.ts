import * as PIXI from "pixi.js";
import * as Matter from "matter-js";
import GameObject from "../../../core/GameObject";

export default class Cake extends GameObject {
  name = "cake";
  height: number;
  width: number;

  setup() {
    this.width = Math.min(this.scene.width * 0.8, 400);
    this.height = this.width * 0.25;
    this.body = Matter.Bodies.rectangle(
      this.scene.width / 2,
      this.scene.height - this.scene.height * 0.25 - this.height / 2,
      this.width,
      this.height,
      { isStatic: true }
    );

    const ch1 = 0.5;
    const ch2 = 0.0;
    const ch3 = -0.5;
    const cw1 = 0.45;
    const cw2 = 0.3;

    Matter.Body.setVertices(this.body, [
      { x: -this.width * cw1, y: this.height * ch1 },
      { x: this.width * cw1, y: this.height * ch1 },
      { x: this.width * cw1, y: this.height * ch2 },
      { x: this.width * cw2, y: this.height * ch2 },
      { x: this.width * cw2, y: this.height * ch3 },
      { x: -this.width * cw2, y: this.height * ch3 },
      { x: -this.width * cw2, y: this.height * ch2 },
      { x: -this.width * cw1, y: this.height * ch2 },
    ]);

    const sprite = new PIXI.Sprite(this.scene.context.resources.cake.texture);
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
