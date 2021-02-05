import { delay } from "lodash";
import * as Matter from "matter-js";
import * as PIXI from "pixi.js";
import GameContext from "./GameContext";

import GameObject from "./GameObject";
import GameSceneI from "./GameSceneI";

export default class GameScene implements GameSceneI {
  name: String;
  context: GameContext;
  gameObjects: GameObject[];
  container: PIXI.Container;
  ticker: PIXI.Ticker;
  _tickerFn: (...params: any[]) => any;
  physics: Matter.Engine;
  timeScale: number = 1;
  _lastDeltaTime = null;
  timestamp = 0;

  get width() {
    return this.context.width;
  }

  get height() {
    return this.context.height;
  }

  add(gameObject: GameObject) {
    this.gameObjects.push(gameObject);
    this.container.addChild(gameObject.graphics);
    gameObject._instantiate(this);
    if (gameObject.body) {
      Matter.World.add(this.physics.world, gameObject.body);
      (gameObject.body as any).gameObject = gameObject;
      const collisionWirefrime = new PIXI.Graphics();
      collisionWirefrime.lineStyle(1, 0xff0000);
      collisionWirefrime.drawPolygon(
        gameObject.body.vertices.map(
          (point) =>
            new PIXI.Point(
              point.x - gameObject.position.x,
              point.y - gameObject.position.y
            )
        )
      );
      gameObject._collisionWirefrime = collisionWirefrime;
    }

    return gameObject;
  }

  debug(value = true) {
    this.gameObjects.forEach((gameObject) => {
      if (gameObject.body && gameObject._collisionWirefrime) {
        if (value) gameObject.graphics.addChild(gameObject._collisionWirefrime);
        else gameObject.graphics.removeChild(gameObject._collisionWirefrime);
      }
    });
  }

  remove(gameObject: GameObject) {
    const i = this.gameObjects.indexOf(gameObject);
    if (i >= 0) {
      console.log("Removing: ", gameObject.name);
      this.gameObjects.splice(i, 1);
      this.container.removeChild(gameObject.graphics);
      if (gameObject.body)
        Matter.World.remove(this.physics.world, gameObject.body);
    }
  }

  _initialize(context: GameContext) {
    this.context = context;
    this.container = new PIXI.Container();
    this.physics = Matter.Engine.create();
    Matter.Engine.run(this.physics);
    Matter.Events.on(this.physics, "collisionStart", () =>
      this._onCollisionStart()
    );
    Matter.Events.on(this.physics, "collisionEnd", () =>
      this._onCollisionEnd()
    );
    this.context.stage.addChild(this.container);
    this.gameObjects = [];
    this.setup();
    this.ticker = this.context.ticker.add(
      (this._tickerFn = () => {
        const deltaTime = (this.ticker.deltaMS / 1000) * this.timeScale;
        this.timestamp += deltaTime;
        this._update(deltaTime);
      })
    );
    this.ticker.maxFPS = 30;
  }

  _onCollisionStart() {
    (this.physics.pairs.collisionStart || []).forEach((collision) => {
      if (collision.bodyA.gameObject)
        collision.bodyA.gameObject.onCollisionStart(
          collision.bodyB.gameObject || collision.bodyB
        );
      if (collision.bodyB.gameObject)
        collision.bodyB.gameObject.onCollisionStart(
          collision.bodyA.gameObject || collision.bodyA
        );

      this.onCollisionStart(
        collision.bodyA.gameObject,
        collision.bodyB.gameObject
      );
    });
  }

  _onCollisionEnd() {
    (this.physics.pairs.collisionEnd || []).forEach((collision) => {
      if (collision.bodyA.gameObject)
        collision.bodyA.gameObject.onCollisionEnd(
          collision.bodyB.gameObject || collision.bodyB
        );
      if (collision.bodyB.gameObject)
        collision.bodyB.gameObject.onCollisionEnd(
          collision.bodyA.gameObject || collision.bodyA
        );

      this.onCollisionEnd(
        collision.bodyA.gameObject || collision.bodyA,
        collision.bodyB.gameObject || collision.bodyB
      );
    });
  }

  _destroy() {
    this.context.stage.removeChild(this.container);
    this.context.ticker.remove(this._tickerFn);
  }

  _update(deltaTime: number) {
    Matter.Engine.update(
      this.physics,
      deltaTime * 1000,
      deltaTime / (this._lastDeltaTime || deltaTime)
    );
    this._lastDeltaTime = deltaTime;
    this.update(deltaTime);
    this.gameObjects.forEach((gameObject) => {
      gameObject._update(deltaTime);
    });
    this.physics.timing.timeScale = this.timeScale;
  }

  onCollisionStart(gameObjectA: GameObject, gameObjectB: GameObject) {}
  onCollisionEnd(gameObjectA: GameObject, gameObjectB: GameObject) {}

  setup() {}

  update(deltaTime: number) {}
}
