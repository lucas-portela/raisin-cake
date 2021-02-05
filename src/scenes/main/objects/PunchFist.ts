import * as PIXI from "pixi.js";
import * as Matter from "matter-js";
import GameObject from "../../../core/GameObject";

export default class PunchFist extends GameObject {
  name = "punch-fist";
  height: number;
  width: number;
  direction: number = 1;

  setup() {
    this.width = this.scene.width * 0.8;
    this.height = this.width * 0.15;
    this.body = Matter.Bodies.rectangle(
      this.width * 0.25,
      this.scene.height * 0.4,
      this.width,
      this.height,
      { isStatic: true, friction: 0 }
    );

    const sprite = new PIXI.Sprite(
      this.scene.context.resources.punchFist.texture
    );
    const spriteScale = this.width / sprite.width;
    sprite.scale.set(spriteScale, spriteScale);
    sprite.position.set(-sprite.width * 0.5, -sprite.height * 0.35);

    this.graphics.addChild(sprite);

    this.graphics.scale.x = -this.direction;
  }

  update(deltaTime: number) {}
}
