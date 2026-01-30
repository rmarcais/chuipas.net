import { createShell } from "./engine/ui.js";
import { createGame } from "./engine/game.js";

const app = document.querySelector("#app");
createShell(app);

const game = createGame();
game.start();
