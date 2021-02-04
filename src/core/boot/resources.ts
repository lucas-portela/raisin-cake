import * as $ from "jquery";
import * as PIXI from "pixi.js";
import resources from "src/resources";
import GameContext from "../GameContext";

export default async function initResources(context: GameContext) {
  context.loader = PIXI.Loader.shared;

  resources.forEach((resource) => {
    context.loader.add(resource.name, resource.url);
  });

  $("#resource-loading-screen").show();
  $("#resource-loading-screen .value").css("width", "0%");

  context.loader.onProgress.add(() => {
    const relativeProgress = context.loader.progress / resources.length;
    $("#resource-loading-screen .value").css(
      "width",
      relativeProgress.toFixed(2) + "%"
    );
  });

  await new Promise((resolve) => {
    context.loader.load(async (_, resources) => {
      context.resources = resources;
      $("#resource-loading-screen .value").css("width", "100%");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      $("#resource-loading-screen").fadeOut(1000);
      resolve();
    });
  });
}
