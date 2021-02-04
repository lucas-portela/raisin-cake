import GameContext from "../GameContext";

export default async function initPhysics(context: GameContext) {
  (window as any).decomp = require("poly-decomp"); // Fix 'poly-decomp' not found
}
