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
      { friction: 0, frictionAir: 0, restitution: 1 }
    );
    this.graphics.beginFill(0x845ec2);
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
