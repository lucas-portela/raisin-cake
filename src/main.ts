import * as $ from "jquery";
import initGraphics from "./core/boot/graphics";
import initPhysics from "./core/boot/physics";
import GameContext from "./core/GameContext";
import MainScene from "./scenes/main/MainScene";
import initScenes from "./scenes/scenes";

$(()=>{
    const context = new GameContext();
    
    initGraphics(context);
    initPhysics(context);
    initScenes(context);

    context.run();
});
