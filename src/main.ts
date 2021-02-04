import * as $ from "jquery";
import initGraphics from "./core/boot/graphics";
import initPhysics from "./core/boot/physics";
import initResources from "./core/boot/resources";
import initScenes from "./core/boot/scenes";
import GameContext from "./core/GameContext";

$(async () => {
  const context = new GameContext();

  await initGraphics(context);
  await initPhysics(context);
  await initResources(context);
  await initScenes(context);

  context.run();
});
