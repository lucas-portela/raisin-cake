import * as PIXI from "pixi.js";
import * as Matter from "matter-js";
import GameObject from "../../../core/GameObject";

export default class Cloud extends GameObject {
  name = "cloud";
  speed: number;
  texture: PIXI.Texture;
  scale: number;
  width: number;
  startX: number;
  endX: number;

  setup() {
    const sprite = new PIXI.Sprite(this.texture);
    sprite.scale.set(this.scale, this.scale);
    this.width = sprite.width;

    this.graphics.addChild(sprite);

    this.startX = -this.scene.width * 0.5;
    this.endX = this.scene.width * 1.5;
    this.speed = this.scene.width * 0.1;

    // this.position.x = this.startX + (this.endX - this.startX) * Math.random();
  }

  update(deltaTime: number) {
    this.graphics.position.x += this.speed * deltaTime;
    if (this.graphics.position.x > this.endX)
      this.graphics.position.x = this.startX;
  }
}
