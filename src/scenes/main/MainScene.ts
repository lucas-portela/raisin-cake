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
import Cloud from "./objects/Cloud";
import questions from "./questions";

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

  question: String = null;
  answer: String = null;
  typed: String = null;
  started: boolean;

  punchQueue: number;
  lastSetDisplay: number;

  setup() {
    this.started = false;
    this.gameOver = false;
    this.points = 0;
    this.punchQueue = 0;

    this.timeScale = 1;

    const { world } = this.physics;
    world.gravity.y = (this.height / this.expectedScreenHeight) * 0.001;
    world.gravity.x = 0;

    this.fruitAverageSize = this.width / this.fruitsInScreenHorizontaly;
    for (let i = 0; i < this.fruitsInScreenHorizontaly; i++)
      this.spawnSlots.push({ index: i, gameObject: null });

    const bg = new PIXI.Sprite(this.context.resources.background.texture);
    const bgScale = this.width / bg.width;
    bg.scale.set(bgScale, bgScale);

    const table = new PIXI.Sprite(this.context.resources.table.texture);
    const tableScale = (this.width / table.width) * 1.3;
    table.scale.set(tableScale, tableScale);

    this.ground = this.add(new Ground()) as Ground;
    this.add(
      new Cloud().set({
        scale: bgScale,
        texture: this.context.resources.cloud1.texture,
        position: { x: this.width * 0.5, y: this.height * 0.1 },
      })
    );
    this.add(
      new Cloud().set({
        scale: bgScale,
        texture: this.context.resources.cloud2.texture,
        position: { x: -this.width * 0.5, y: this.height * 0.05 },
      })
    );
    this.add(
      new Cloud().set({
        scale: bgScale,
        texture: this.context.resources.cloud3.texture,
        position: { x: this.width * 1.2, y: this.height * 0.15 },
      })
    );
    this.add(
      new Cloud().set({
        scale: bgScale,
        speed: this.width * 0.03,
        texture: this.context.resources.cloud4.texture,
        position: { x: -this.width * 1.2, y: this.height * 0.18 },
      })
    );
    this.add(
      new Cloud().set({
        scale: bgScale,
        speed: this.width * 0.03,
        texture: this.context.resources.cloud5.texture,
        position: { x: -this.width * 0.2, y: this.height * 0.15 },
      })
    );
    this.add(
      new Ballon().set({
        ground: this.ground,
        position: { x: this.width * 0.95, y: this.ground.height * 1.85 },
      })
    );
    this.add(
      new Ballon().set({
        ground: this.ground,
        position: { x: this.width * 0.05, y: this.ground.height * 1.85 },
      })
    );
    this.cake = this.add(new Cake().set({ ground: this.ground })) as Cake;
    this.candle = this.add(new Candle().set({ ground: this.ground })) as Candle;
    this.punchFist = this.add(new PunchFist()) as PunchFist;

    table.position.x = this.width / 2 - table.width / 2;
    table.position.y = this.height - table.height - this.ground.height * 0.75;

    this.container.addChildAt(table, 1);

    bg.position.x = this.width / 2 - bg.width / 2;
    bg.position.y = this.height - bg.height - this.ground.height;

    this.container.addChildAt(bg, 0);

    this.container.position.y = -bg.position.y * 0.8;

    $("#main-scene-gui .keyboard .key").hide();

    const scene = this;
    $("#main-scene-gui .keyboard .key").click(function () {
      if (scene.gameOver || scene.question == null) return;
      const key = $(this).text();
      if (key == "?") {
        scene.setDisplay(scene.question);
        scene.typed = "";
      } else if (key == "×") {
        scene.typed = scene.typed.slice(0, Math.max(scene.typed.length - 1, 0));
        $("#main-scene-gui .keyboard .display .value").html(scene.typed);
      } else {
        scene.typed += key.toUpperCase();
        $("#main-scene-gui .keyboard .display .value").html(scene.typed);
        if (scene.typed == scene.answer) {
          scene.firePunch();
          scene.question = null;
          scene.typed = null;
          scene.answer = null;
          $("#main-scene-gui .keyboard .display .value").html("");
        }
      }
    });

    $("#play-btn").click(() => {
      this.start();
    });

    $("#restart-btn").click(() => {
      window.location.reload();
    });
  }

  async start() {
    if (this.started) return;
    $("#game-title").fadeOut(1000);
    $("#play-btn").fadeOut(1000);
    this.started = true;
  }

  addPoints() {
    this.points++;
    $("#points").html(this.points);
    $("#points").show();
  }

  showKeys(keys: String) {
    keys = keys.toUpperCase();
    console.log(keys);
    $("#main-scene-gui .keyboard").show();
    $("#main-scene-gui .keyboard .key").each(function () {
      if ($(this).hasClass("fixed") || keys.includes($(this).text()))
        $(this).show();
      else $(this).hide();
    });

    const width = $("#main-scene-gui .keyboard").width();
    const height = $("#main-scene-gui .keyboard").height();
    const scale = Math.min(
      this.width / width,
      (this.ground.height * 0.75) / height
    );
    $("#main-scene-gui .keyboard").css({
      left: "50vw",
      bottom: (this.ground.height * 0.35).toFixed(2) + "px",
      transform: `translate(-50%, 50%) scale(${scale},${scale})`,
    });
  }

  async setDisplay(text: String) {
    const startTime = Date.now();
    this.lastSetDisplay = startTime;
    text = text.toUpperCase();
    for (var i = 1; i <= text.length; i++) {
      if (this.lastSetDisplay > startTime) break;
      $("#main-scene-gui .keyboard .display .value").html(text.slice(0, i));
      await new Promise((resolve) =>
        setTimeout(resolve, 10 + 100 * Math.random())
      );
    }
  }

  setQuestion(question: String, answer: String, wrongAnswers: String[]) {
    this.question = question;
    this.typed = "";
    this.showKeys(
      answer.toString() +
        (false && wrongAnswers.length > 0
          ? wrongAnswers[Math.floor(wrongAnswers.length * Math.random())].slice(
              0,
              Math.round(answer.length * 0.2)
            )
          : "")
    );
    this.answer = answer.toUpperCase().replace(/\s/g, "");
    this.setDisplay(this.question);
  }

  firePunch() {
    if (
      this.punchFist.animI < this.punchFist.animDuration &&
      this.punchFist.animI > 0
    ) {
      this.punchQueue++;
      return;
    }
    this.punchFist.animI = 0;
    this.timeScale = this.punchTimeScale;
    var nextFistY = this.height * 0.05;
    const lowerPossibleY = this.height * 0.5;
    const fruits = this.gameObjects.filter(
      (fruit) =>
        fruit.name == "fruit" &&
        !fruit.body.isStatic &&
        fruit.body.position.y < lowerPossibleY
    );
    if (fruits.length > 0) {
      const lowerFruit = fruits.sort((a, b) => b.position.y - a.position.y)[0];
      this.punchFist.direction =
        lowerFruit.position.x < this.width / 2 ? 1 : -1;
      nextFistY = lowerFruit.position.y;
    }

    this.punchFist.position = {
      x: this.punchFist.position.x,
      y: Math.max(Math.min(nextFistY, lowerPossibleY), this.height * 0.05),
    };
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
          if (!this.gameOver) {
            this.gameOver = true;
            this.setDisplay("game over!");
            $("#restart-btn").show();
            this.physics.world.gravity.y =
              (this.height / this.expectedScreenHeight) * 0.1;
          }
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
                this.addPoints();
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
    if (!this.started) return;
    if (this.container.position.y > 0) {
      this.container.position.y -= 50 * deltaTime;
      this.timestamp = 0;
      return;
    }
    if (!this.gameOver && this.question == null) {
      const question = questions[Math.floor(Math.random() * questions.length)];
      this.setQuestion(
        question.question,
        question.answer,
        question.wrongAnswers
      );
    }
    if (this.punchFist.animI >= this.punchFist.animDuration / 2) {
      if (this.punchQueue == 0) this.timeScale = 1;
      else if (this.punchFist.animI >= this.punchFist.animDuration * 0.7) {
        this.punchFist.animI = 0;
        this.punchQueue--;
        this.firePunch();
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
        // console.log(this.gameObjects.length);
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

          setTimeout(() => this.add(fruit, 11), 100);
        } else break;
      }
      this.lastFruitSpawn = this.timestamp;
    }
  }
}
