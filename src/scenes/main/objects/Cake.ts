import * as Matter from "matter-js";
import GameObject from "../../../core/GameObject";

export default class Cake extends GameObject {
  name = "cake";
  height: number;
  width: number;

  setup() {
    this.height = Math.min(this.scene.height * 0.25, 60);
    this.width = Math.min(this.scene.width * 0.4, 200);
    this.body = Matter.Bodies.rectangle(
      this.scene.width / 2,
      this.scene.height - this.scene.height * 0.25 - this.height / 2,
      this.width,
      this.height,
      { isStatic: true }
    );

    this.graphics.beginFill(0xffc75f);
    this.graphics.drawRect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
  }

  update(deltaTime: number) {}
}
