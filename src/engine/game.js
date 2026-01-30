import { LEVELS } from "./registry.js";
import { createHelpers } from "./helpers.js";
import { animateSwap, setHud, setWindowHtml, setWindowTitle } from "./ui.js";
import { initMusic, unlockAndPlay } from "./music.js";

const STORAGE_KEY = "chuipas.levelIndex.v1";

export function createGame() {
    window.addEventListener("chuipas:restart", () => restart());

window.addEventListener("chuipas:about", () => {
  helpers.troll("À propos");
});
  const helpers = createHelpers();

  let levelIndex = 0;
  let cleanup = null;

  const state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { levelIndex: 0, perLevel: {} };
    } catch {
      return { levelIndex: 0, perLevel: {} };
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function ctxFor(level) {
    state.perLevel[level.id] ??= {};
    return {
      state: state.perLevel[level.id],
      troll: helpers.troll,
      shake: helpers.shake,
      rand: helpers.rand,
      next,
      restart,
    };
  }

  async function show(index) {
    const level = LEVELS[index];
    if (!level) return;

    if (typeof cleanup === "function") cleanup();
    cleanup = null;

    await animateSwap();

    setWindowTitle(level.title ?? "Niveau ???");
    const fakeProgress = Math.min(0.92, 0.18 + index * 0.27);
    setHud(level.hud ?? "Vérification en cours…", fakeProgress);

    setWindowHtml(level.render(ctxFor(level)));

    const maybeCleanup = level.mount?.(ctxFor(level));
    if (typeof maybeCleanup === "function") cleanup = maybeCleanup;

    state.levelIndex = index;
    saveState();
  }

  function next() {
    levelIndex = Math.min(LEVELS.length - 1, levelIndex + 1);
    show(levelIndex);
  }

  function restart() {
    levelIndex = 0;
    state.levelIndex = 0;
    state.perLevel = {};
    saveState();
    show(0);
  }

  function start() {
    initMusic();

    const unlock = () => {
        unlockAndPlay();
        window.removeEventListener("click", unlock);
    };
    window.addEventListener("click", unlock);

    show(levelIndex);
    helpers.troll("Connexion au secret de l’humanité…");

    window.addEventListener("chuipas:fakeProgress", () => {
        helpers.troll(
            "Tu te doutes bien que cette progression ne correspond à rien ?", 4000
        );
    });

  }

  return { start, next, restart };
}
