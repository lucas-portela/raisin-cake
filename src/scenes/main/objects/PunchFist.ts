import * as $ from "jquery";
import * as PIXI from "pixi.js";
import * as Matter from "matter-js";
import GameObject from "../../../core/GameObject";

export default class PunchFist extends GameObject {
  name = "punch-fist";
  height: number;
  width: number;
  direction: number = 1;
  animI: number;
  animState: number;
  animDuration: number = 2;

  setup() {
    this.width = this.scene.width * 0.8;
    this.height = this.width * 0.15;
    this.body = Matter.Bodies.rectangle(
      0,
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

    this.animI = this.animDuration;
  }

  update(deltaTime: number) {
    this.animI += deltaTime * 1;
    const startX =
      this.direction == 1
        ? -this.width * 0.55
        : this.scene.width + this.width * 0.55;
    const destX =
      this.direction == 1 ? this.scene.width * 0.25 : this.scene.width * 0.75;
    const deltaX = destX - startX;
    const animI = Math.min(this.animI, this.animDuration);
    const easing =
      animI < this.animDuration / 2
        ? this.easeOutBack(animI / (this.animDuration / 2))
        : 1 -
          this.easeOutBack(
            (animI - this.animDuration / 2) / (this.animDuration / 2)
          );
    const animV = startX + deltaX * easing;

    // Matter.Body.translate(this.body, {
    //   x: animV - this.position.x,
    //   y: 0,
    // });

    this.position = {
      x: animV,
      y: this.position.y,
    };
    this.graphics.scale.x = -this.direction;
  }

  easeOutBack(x: number): number {
    const c1 = 1.70158;
    const c3 = c1 + 1;

    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  }

  easeOutCubic(x: number): number {
    return x < 0.5
      ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
      : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
  }
}
