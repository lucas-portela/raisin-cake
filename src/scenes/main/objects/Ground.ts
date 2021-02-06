import * as Matter from "matter-js";
import GameObject from "../../../core/GameObject";

export default class Ground extends GameObject {
  name = "ground";
  height: number;

  setup() {
    this.height = Math.min(this.scene.height * 0.35, 300);
    this.body = Matter.Bodies.rectangle(
      this.scene.width / 2,
      this.scene.height - this.height / 2,
      this.scene.width,
      this.height,
      { isStatic: true }
    );

    this.graphics.beginFill(0xda4581);
    this.graphics.drawRect(
      -this.scene.width / 2,
      -this.height / 2,
      this.scene.width,
      this.height
    );
  }

  update(deltaTime: number) {}
}
