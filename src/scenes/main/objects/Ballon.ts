import * as PIXI from "pixi.js";
import * as Matter from "matter-js";
import GameObject from "../../../core/GameObject";

export default class Ballon extends GameObject {
  name = "ballon";
  animI: number;
  initialY: number;
  animStepSize: number;

  setup() {
    const size = Math.min(this.scene.width * 0.2);

    const leftBallon = this.position.x > this.scene.width / 2;

    const sprite = new PIXI.Sprite(
      leftBallon
        ? this.scene.context.resources.ballon2.texture
        : this.scene.context.resources.ballon1.texture
    );
    const spriteScale = size / sprite.width;
    sprite.scale.set(spriteScale, spriteScale);
    sprite.position.set(-sprite.width * 0.5, -sprite.height);

    this.graphics.addChild(sprite);

    this.animI = leftBallon ? Math.PI * 0.7 : Math.PI * 0.3;
    this.initialY = this.position.y;
    this.animStepSize = Math.PI * (leftBallon ? 0.5 : 0.4);
  }

  update(deltaTime: number) {
    if ((this.scene as any).gameOver)
      this.position.y -= this.scene.height * 0.01;
    else {
      this.animI += deltaTime * this.animStepSize;
      this.position.y =
        this.initialY + Math.sin(this.animI) * this.scene.height * 0.01;
    }
  }
}
