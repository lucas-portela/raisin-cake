import * as PIXI from "pixi.js";
import GameContext from "../GameContext";

export default async function initGraphics(context: GameContext) {
  context.width = window.outerWidth;
  context.height = window.outerHeight;
  context.pixiApp = new PIXI.Application({
    backgroundColor: 0x000000,
    width: context.width,
    height: context.height,
    antialias: false,
  });
  context.stage = context.pixiApp.stage;
  context.ticker = context.pixiApp.ticker;

  document.body.appendChild(context.pixiApp.view);
}
