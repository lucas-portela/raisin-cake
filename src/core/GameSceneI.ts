import * as Matter from "matter-js";
import * as PIXI from "pixi.js";
import GameContext from "./types/GameContext";

import GameObject from "./GameObject";

export default interface GameSceneI {
  context: GameContext;
  gameObjects: GameObject[];
  container: PIXI.Container;
  ticker: PIXI.Ticker;
  timeScale: number;
  physics: Matter.Engine;
  width: number;
  height: number;

  add(gameObject: GameObject);

  remove(gameObject: GameObject);
}
