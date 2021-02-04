import * as PIXI from "pixi.js";
import * as Matter from "matter-js";
import * as _ from "lodash";
import GameSceneI from "./GameSceneI";

export default class GameObject {
  name: String;
  tags: String[];
  body: Matter.Body;
  graphics: PIXI.Graphics;
  _collisionWirefrime: PIXI.Graphics;
  scene: GameSceneI;

  constructor() {
    this.body = null;
    this.graphics = new PIXI.Graphics();
  }

  set(props) {
    if (props.position) {
      this.position = props.position;
      delete props.position;
    }
    _.assign(this, props);
    return this;
  }

  _instantiate(scene) {
    this.scene = scene;
    this.setup();
  }

  _update(deltaTime: number) {
    this.update(deltaTime);
    if (this.body) {
      this.graphics.rotation = this.body.angle;
      this.graphics.position.copyFrom(this.body.position);
    }
  }

  setup() {}

  update(deltaTime: number) {}

  onCollisionStart(gameObject: GameObject) {}

  onCollisionEnd(gameObject: GameObject) {}

  destroy() {
    this.scene.remove(this);
  }

  get position(): { x: number; y: number } {
    return (this.body || this.graphics).position;
  }

  set position(value: { x: number; y: number }) {
    this.graphics.position.copyFrom({ ...this.graphics.position, ...value });
    if (this.body) Matter.Body.setPosition(this.body, value);
  }
}
