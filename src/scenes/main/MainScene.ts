import * as $ from "jquery";
import * as PIXI from "pixi.js";
import * as Matter from "matter-js";
import GameObject from "src/core/GameObject";
import GameScene from "../../core/GameScene";
import Cake from "./objects/Cake";
import Fruit from "./objects/Fruit";
import Ground from "./objects/Ground";
import levels from "./levels";
import Candle from "./objects/Candle";
import PunchFist from "./objects/PunchFist";
import Ballon from "./objects/Ballon";

export default class MainScene extends GameScene {
  fruitsInScreenHorizontaly = 30; // Parameter used to calculate fruit size
  fruitAverageSize: number;
  lastFruitSpawn: number;
  cake: Cake;
  candle: Candle;
  ground: Ground;
  punchFist: PunchFist;
  points: number;
  gameOver: boolean;
  expectedScreenHeight = 1920;

  punchTimeScale = 0.4;
  hitTimeScale = 0.2;

  spawnSlots = [];

  setup() {
    this.gameOver = false;
    this.points = 0;

    this.timeScale = 1;

    const { world } = this.physics;
    world.gravity.y = (this.height / this.expectedScreenHeight) * 0.001;
    world.gravity.x = 0;

    this.fruitAverageSize = this.width / this.fruitsInScreenHorizontaly;
    for (let i = 0; i < this.fruitsInScreenHorizontaly; i++)
      this.spawnSlots.push({ index: i, gameObject: null });

    this.ground = this.add(new Ground()) as Ground;
    this.add(
      new Ballon().set({
        position: { x: this.width * 0.95, y: this.height * 0.73 },
      })
    );
    this.add(
      new Ballon().set({
        position: { x: this.width * 0.05, y: this.height * 0.73 },
      })
    );
    this.cake = this.add(new Cake()) as Cake;
    this.candle = this.add(new Candle()) as Candle;
    this.punchFist = this.add(new PunchFist()) as PunchFist;

    const table = new PIXI.Sprite(this.context.resources.table.texture);
    const tableScale = (this.width / table.width) * 1.2;
    table.scale.set(tableScale, tableScale);
    table.position.x = this.width / 2 - table.width / 2;
    table.position.y = this.height - table.height - this.ground.height * 0.7;

    this.container.addChildAt(table, 1);

    const bg = new PIXI.Sprite(this.context.resources.background.texture);
    const bgScale = this.width / bg.width;
    bg.scale.set(bgScale, bgScale);
    bg.position.x = this.width / 2 - bg.width / 2;
    bg.position.y = this.height - bg.height - this.ground.height;

    this.container.addChildAt(bg, 0);

    $(window).keydown((evt) => {
      if (evt.code == "KeyA") this.punchFist.direction = 1;
      if (evt.code == "KeyD") this.punchFist.direction = -1;
      this.punchFist.animI = 0;
      this.timeScale = this.punchTimeScale;
    });

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
    const hasGround = objNames.includes("ground");
    const hasPunchFist = objNames.includes("punch-fist");
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
          console.log("Game over!");
          this.physics.world.gravity.y =
            (this.height / this.expectedScreenHeight) * 0.1;
        } else {
          if (hasGround || hasPunchFist)
            setTimeout(() => {
              if (hasGround) {
                Matter.Body.setVelocity(fruit.body, {
                  x:
                    Math.sign(fruit.position.x - this.cake.position.x) *
                    fruit.speed *
                    0.2,
                  y: -fruit.speed * 0.4,
                });
              } else if (hasPunchFist) {
                this.timeScale = this.hitTimeScale;
                Matter.Body.setVelocity(fruit.body, {
                  x:
                    ((this.punchFist.direction *
                      Math.abs(
                        fruit.position.x -
                          (this.punchFist.position.x -
                            (this.punchFist.direction * this.punchFist.width) /
                              2)
                      )) /
                      this.punchFist.width) *
                    fruit.speed *
                    3,
                  y:
                    (1 -
                      Math.abs(fruit.position.x - this.punchFist.position.x) /
                        this.punchFist.width) *
                    -fruit.speed *
                    2,
                });
              }
            }, 10);
        }
      }
    }
  }

  update(deltaTime: number) {
    if (this.punchFist.animI >= this.punchFist.animDuration / 2) {
      this.timeScale = 1;
      if (this.punchFist.animI >= this.punchFist.animDuration) {
        var nextFistY = this.height * 0.3;
        const lowerPossibleY = this.height * 0.58;
        const fruits = this.gameObjects.filter(
          (fruit) =>
            fruit.name == "fruit" &&
            !fruit.body.isStatic &&
            fruit.body.position.y < lowerPossibleY
        );
        if (fruits.length > 0) {
          const lowerFruit = fruits.sort(
            (a, b) => b.position.y - a.position.y
          )[0];
          nextFistY = lowerFruit.position.y;
        }

        this.punchFist.position = {
          x: this.punchFist.position.x,
          y: Math.max(Math.min(nextFistY, lowerPossibleY), this.height * 0.2),
        };
      }
    }
    this.lastFruitSpawn = this.lastFruitSpawn || 0;

    let level = this.gameOver
      ? levels[0]
      : levels.filter((x) => x.time > this.timestamp)[0] ||
        levels[levels.length - 1];

    if (
      this.timeScale == 1 &&
      this.timestamp - this.lastFruitSpawn > level.spawnInterval &&
      level.spawnProbability > Math.random()
    ) {
      const amount = Math.max(Math.round(Math.random() * level.amount), 1);
      for (let i = 0; i < amount; i++) {
        const availableSlots = this.spawnSlots.filter((x) => !x.gameObject);
        console.log(this.gameObjects.length);
        if (availableSlots.length > 0) {
          const slot =
            availableSlots[
              Math.round(Math.random() * (availableSlots.length - 1))
            ];

          const fruit = new Fruit().set({
            size:
              this.fruitAverageSize * 0.3 +
              Math.random() * this.fruitAverageSize * 0.3,
            speed:
              level.minSpeed +
              (level.maxSpeed - level.minSpeed) * Math.random(),
            position: {
              x: this.fruitAverageSize / 2 + this.fruitAverageSize * slot.index,
              y: -this.fruitAverageSize,
            },
          });

          slot.gameObject = fruit;

          this.add(fruit);
        } else break;
      }
      this.lastFruitSpawn = this.timestamp;
    }
  }
}
