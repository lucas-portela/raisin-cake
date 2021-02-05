import * as PIXI from "pixi.js";
import * as Matter from "matter-js";
import GameObject from "../../../core/GameObject";

export default class Fruit extends GameObject {
  name = "fruit";
  size: number = 0;
  speed: number = 0;

  setup() {
    this.body = Matter.Bodies.circle(
      this.position.x,
      this.position.y,
      this.size,
      {
        friction: 0,
        frictionAir: 0,
        restitution: 0.5,
        mass: 3,
        angle: Math.random() * Math.PI,
      }
    );

    // const sprite = new PIXI.Sprite(this.scene.context.resources.raisin.texture);
    // const spriteScale = (this.size / sprite.width) * 1.9;
    // sprite.scale.set(spriteScale, spriteScale);
    // sprite.position.set(-sprite.width * 0.5, -sprite.height * 0.5);
    // this.graphics.addChild(sprite);

    this.graphics.beginFill(0x3e2664);
    this.graphics.drawCircle(0, 0, this.size);

    Matter.Body.setVelocity(this.body, { x: 0, y: this.speed });
  }

  update(deltaTime: number) {
    if (
      this.position.x < this.size ||
      this.position.x > this.scene.width + this.size
    )
      this.destroy();
    // console.log(this.body.position);
    // this.body.position.y+=deltaTime*10;
  }
}
