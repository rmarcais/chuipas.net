export default {
  id: "chrono",
  title: "Synchronisation temporelle",
  hud: "Mesure du rapport au temps…",

  render(ctx) {
    const tries = ctx.state.tries ?? 0;

    return `
      <h2 style="margin:0 0 8px 0">Test de précision humaine</h2>
      <p class="muted" style="margin:0 0 14px 0">
        Arrête le chrono à <b>5,0 secondes</b>.<br>
        Tolérance autorisée : <b>± 0,1 s</b>.
      </p>

      <div class="chronoBox">
        <div id="chronoDisplay" class="chronoDisplay">
          0.00
        </div>

        <div class="chronoActions">
          <button class="btnPrimary" id="chronoStart">Démarrer</button>
          <button class="btnGhost" id="chronoReset" disabled>Reset</button>
        </div>
      </div>

      <div class="spacer"></div>
      <p class="muted" id="chronoLog">
        Tentative <b>${tries + 1}</b>. Le temps n’attend personne.
      </p>
    `;
  },

  mount(ctx) {
    const display = document.querySelector("#chronoDisplay");
    const startBtn = document.querySelector("#chronoStart");
    const resetBtn = document.querySelector("#chronoReset");
    const log = document.querySelector("#chronoLog");

    let running = false;
    let startTime = 0;
    let rafId = null;

    const TARGET = 5.0;
    const TOLERANCE = 0.1;

    function format(t) {
      return t.toFixed(2);
    }

    function update() {
      if (!running) return;
      const now = performance.now();
      const elapsed = (now - startTime) / 1000;
      display.textContent = format(elapsed);
      rafId = requestAnimationFrame(update);
    }

    function start() {
      if (running) return;

      running = true;
      startTime = performance.now();
      display.textContent = "0.00";
      startBtn.textContent = "Stop";
      resetBtn.disabled = true;
      log.textContent = "Concentration maximale…";
      ctx.troll("Le temps s’écoule.", 800);

      rafId = requestAnimationFrame(update);
    }

    function stop() {
      if (!running) return;

      running = false;
      cancelAnimationFrame(rafId);

      const elapsed =
        (performance.now() - startTime) / 1000;

      display.textContent = format(elapsed);
      startBtn.textContent = "Démarrer";
      resetBtn.disabled = false;

      ctx.state.tries = (ctx.state.tries ?? 0) + 1;

      const delta = Math.abs(elapsed - TARGET);

      if (delta <= TOLERANCE) {
        ctx.troll("Impressionnant. Beaucoup trop précis.", 1600);
        log.innerHTML = `
          Temps : <b>${format(elapsed)} s</b><br>
          Résultat : <b>VALIDÉ</b>.
        `;
        setTimeout(() => ctx.next(), 1200);
        return;
      }

      if (elapsed < TARGET) {
        ctx.troll("Trop rapide. Le temps n’était pas prêt.", 1400);
        log.innerHTML = `
          ${format(elapsed)} s — <b>trop tôt</b>.<br>
          Reprends ton souffle.
        `;
      } else {
        ctx.troll("Trop tard. Le temps a gagné.", 1400);
        log.innerHTML = `
          ${format(elapsed)} s — <b>trop tard</b>.<br>
          Le temps ne pardonne pas.
        `;
      }

      ctx.shake();
    }

    function reset() {
      running = false;
      cancelAnimationFrame(rafId);
      display.textContent = "0.00";
      log.textContent = "Réinitialisé. Le temps est indulgent.";
      resetBtn.disabled = true;
    }

    startBtn.addEventListener("click", () => {
      running ? stop() : start();
    });

    resetBtn.addEventListener("click", reset);

    return () => {
      cancelAnimationFrame(rafId);
      startBtn.replaceWith(startBtn.cloneNode(true));
      resetBtn.replaceWith(resetBtn.cloneNode(true));
    };
  },
};
