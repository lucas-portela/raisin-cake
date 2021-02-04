import * as PIXI from "pixi.js";
import scenes from "src/scenes";
import GameContext from "../GameContext";

export default async function initScenes(context: GameContext) {
  context.scenes = scenes;
}
