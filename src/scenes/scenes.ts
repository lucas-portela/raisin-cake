import GameContext from "src/core/GameContext";
import MainScene from "./main/MainScene";

export default function(context: GameContext){
    context.scenes=[
        new MainScene()
    ];
}