import GameScene from "./GameScene";

export default class GameContext {
  pixiApp: PIXI.Application;
  stage: PIXI.Container;
  ticker: PIXI.Ticker;
  width: number;
  height: number;
  scenes: GameScene[];
  scene: GameScene;
  loader: PIXI.Loader;
  resources: any;

  run() {
    if (this.scenes.length == 0) throw "GameContext has no scenes!";
    this.setScene(this.scenes[0].name);
  }

  setScene(name: String) {
    if (this.scene) this.scene._destroy();
    this.scene = this.scenes.find((x) => x.name == name);
    this.scene._initialize(this);
  }
}
