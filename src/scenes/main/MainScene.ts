import * as PIXI from "pixi.js";
import * as Matter from "matter-js";
import GameObject from "src/core/GameObject";
import GameScene from "../../core/GameScene";
import Cake from "./objects/Cake";
import Fruit from "./objects/Fruit";
import Ground from "./objects/Ground";
import levels from "./levels";

export default class MainScene extends GameScene {
  fruitsInScreenHorizontaly = 30; // Parameter used to calculate fruit size
  fruitAverageSize: number;
  lastFruitSpawn: number;
  cake: Cake;
  ground: Ground;
  points: number;
  gameOver: boolean;
  expectedScreenHeight = 1920;

  spawnSlots = [];

  setup() {
    this.gameOver = false;
    this.points = 0;

    this.timeSpeed = 1;

    const { world } = this.physics;
    world.gravity.y = (this.height / this.expectedScreenHeight) * 0.001;
    world.gravity.x = 0;

    this.fruitAverageSize = this.width / this.fruitsInScreenHorizontaly;
    for (let i = 0; i < this.fruitsInScreenHorizontaly; i++)
      this.spawnSlots.push({ index: i, gameObject: null });

    this.ground = this.add(new Ground()) as Ground;
    this.cake = this.add(new Cake()) as Cake;

    const bg = new PIXI.Sprite(this.context.resources.background.texture);
    const bgScale = this.width / bg.width;
    bg.scale.set(bgScale, bgScale);
    bg.position.x = this.width / 2 - bg.width / 2;
    bg.position.y = this.height - bg.height - this.ground.height;

    this.container.addChildAt(bg, 0);

    // this.debug();
  }

  releaseSlot(fruit: GameObject) {
    const slot = this.spawnSlots.find((x) => x.gameObject == fruit);
    if (slot) slot.gameObject = null;
  }

  onCollisionStart(gameObjectA: GameObject, gameObjectB: GameObject) {
    const objNames = [gameObjectA.name, gameObjectB.name];
    const hasFruits = objNames.includes("fruit");
    const hasCake = objNames.includes("cake");
    [gameObjectA, gameObjectB].forEach(
      (gameObject) => gameObject.name == "fruit" && this.releaseSlot(gameObject)
    );
    if (hasFruits) {
      const fruit = [gameObjectA, gameObjectB].find(
        (x) => x.name == "fruit"
      ) as Fruit;

      if (gameObjectA.name != gameObjectB.name) {
        if (hasCake) {
          Matter.Body.setStatic(fruit.body, true);
          this.gameOver = true;
          this.physics.world.gravity.y =
            (this.height / this.expectedScreenHeight) * 0.1;
        } else {
          setTimeout(
            () =>
              Matter.Body.setVelocity(fruit.body, {
                x:
                  Math.sign(fruit.position.x - this.cake.position.x) *
                  fruit.speed,
                y: -fruit.speed * 0.2,
              }),
            10
          );
        }
      }
      // fruit.destroy();
    }
  }

  update(deltaTime: number) {
    this.lastFruitSpawn = this.lastFruitSpawn || 0;

    let level = this.gameOver
      ? levels[0]
      : levels.filter((x) => x.time > this.timestamp)[0] ||
        levels[levels.length - 1];

    if (
      this.timestamp - this.lastFruitSpawn > level.spawnInterval &&
      level.spawnProbability > Math.random()
    ) {
      const availableSlots = this.spawnSlots.filter((x) => !x.gameObject);
      console.log(this.gameObjects.length);
      if (availableSlots.length > 0) {
        const slot =
          availableSlots[
            Math.round(Math.random() * (availableSlots.length - 1))
          ];

        const fruit = new Fruit().set({
          size:
            this.fruitAverageSize * 0.5 +
            Math.random() * this.fruitAverageSize * 0.3,
          speed:
            level.minSpeed + (level.maxSpeed - level.minSpeed) * Math.random(),
          position: {
            x: this.fruitAverageSize / 2 + this.fruitAverageSize * slot.index,
            y: -this.fruitAverageSize,
          },
        });

        slot.gameObject = fruit;

        this.add(fruit);
        this.lastFruitSpawn = this.timestamp;
      }
    }
  }
}
