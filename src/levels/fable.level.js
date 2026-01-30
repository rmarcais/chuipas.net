export default {
  id: "fable",
  title: "Le lièvre et la tortue",
  hud: "Analyse de la sagesse populaire…",

  render() {
    return `
      <h2 style="margin:0 0 8px 0">Le lièvre et la tortue</h2>
      <p class="muted" style="margin:0 0 14px 0">
        Objectif : <b>faire gagner la tortue</b>.
      </p>

      <div class="fableBox">
        <div class="raceTrack">
          <div class="lane grass">
            <div class="runner hare" id="hare">🐇</div>
            <div class="finish"></div>
          </div>

          <div class="lane dirt">
            <div class="runner turtle" id="turtle">🐢</div>
            <div class="finish"></div>
          </div>
        </div>

        <div class="countdown" id="countdown"></div>

        <div class="raceActions">
          <button class="btnPrimary" id="startRace">Démarrer</button>
        </div>
      </div>

      <div class="spacer"></div>
      <p class="muted" id="raceLog" style="margin:0">
        Astuce : spamme la touche <span class="kbd">ESPACE</span>.
      </p>

      <div class="fableOverlay" id="fableOverlay" aria-hidden="true">
        <div class="fableFail">
          <div class="fableFace">😬</div>
          <p class="failText">
            <b>Non.</b><br>
            As-tu bien compris les règles ?
          </p>
          <button class="btnGhost" id="retryRace">Recommencer</button>
        </div>
      </div>
    `;
  },

  mount(ctx) {
    const hare = document.querySelector("#hare");
    const turtle = document.querySelector("#turtle");
    const startBtn = document.querySelector("#startRace");
    const log = document.querySelector("#raceLog");
    const overlay = document.querySelector("#fableOverlay");
    const retryBtn = document.querySelector("#retryRace");
    const countdownEl = document.querySelector("#countdown");

    const TURTLE_SPEED = 0.28;
    const HARE_PRESSES_TO_WIN = 4.5;

    let hareX = 0;
    let turtleX = 0;

    let hareFinishX = 0;
    let turtleFinishX = 0;

    let HARE_BOOST = 0;

    let running = false;
    let finished = false;
    let countdownRunning = false;
    let interval = null;

    function updatePositions() {
      hare.style.transform = `translateX(${hareX}px)`;
      turtle.style.transform = `translateX(${turtleX}px)`;
    }

    function getFinishX(runnerEl) {
      const lane = runnerEl.parentElement;
      const finish = lane.querySelector(".finish");

      const laneRect = lane.getBoundingClientRect();
      const finishRect = finish.getBoundingClientRect();
      const runnerRect = runnerEl.getBoundingClientRect();

      const finishLeftInLane = finishRect.left - laneRect.left;
      return finishLeftInLane - runnerRect.width / 2;
    }

    function computeFinishAndBoost() {
      hareFinishX = getFinishX(hare);
      turtleFinishX = getFinishX(turtle);
      HARE_BOOST = hareFinishX / HARE_PRESSES_TO_WIN;
    }

    function startCountdown() {
      if (countdownRunning) return;

      computeFinishAndBoost();

      countdownRunning = true;
      startBtn.disabled = true;

      const steps = [
        "Tu es prêt ?",
        "Mets ton doigt sur la touche ESPACE",
        "GOGOGOGOGO !",
      ];

      let i = 0;
      countdownEl.textContent = steps[i];
      countdownEl.classList.add("show");

      const next = () => {
        i++;
        if (i < steps.length) {
          countdownEl.textContent = steps[i];
          setTimeout(next, 900);
        } else {
          countdownEl.classList.remove("show");
          startRace();
        }
      };

      setTimeout(next, 1000);
    }

    function startRace() {
      running = true;
      finished = false;

      log.textContent = "PLUS VITE ! PLUS FORT !";
      ctx.troll("C’est maintenant.", 700);

      interval = setInterval(() => {
        turtleX += TURTLE_SPEED;

        if (turtleX >= turtleFinishX) {
          turtleX = turtleFinishX;
          updatePositions();
          winTurtle();
          return;
        }

        updatePositions();
      }, 16);
    }

    function onKey(e) {
      if (!running || finished) return;
      if (e.code !== "Space") return;

      e.preventDefault();

      hareX += HARE_BOOST;

      if (hareX >= hareFinishX) {
        hareX = hareFinishX;
        updatePositions();
        lose();
        return;
      }

      updatePositions();
    }

    function lose() {
      finished = true;
      running = false;
      clearInterval(interval);

      ctx.shake();
      ctx.troll("Le lièvre gagne. Bravo ?", 1400);

      setTimeout(() => {
        overlay.classList.add("show");
        overlay.setAttribute("aria-hidden", "false");
      }, 600);
    }

    function winTurtle() {
      finished = true;
      running = false;
      clearInterval(interval);

      ctx.troll("La tortue gagne. Sage décision.", 1600);
      setTimeout(() => ctx.next(), 1200);
    }

    function reset() {
      hareX = 0;
      turtleX = 0;
      updatePositions();

      overlay.classList.remove("show");
      overlay.setAttribute("aria-hidden", "true");

      clearInterval(interval);
      interval = null;

      running = false;
      finished = false;
      countdownRunning = false;

      startBtn.disabled = false;
      log.innerHTML = `Astuce : spamme la touche <span class="kbd">ESPACE</span>. (réfléchis bien)`;
    }

    startBtn.addEventListener("click", startCountdown);
    retryBtn.addEventListener("click", reset);
    window.addEventListener("keydown", onKey, { passive: false });

    updatePositions();

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", onKey);
      startBtn.replaceWith(startBtn.cloneNode(true));
      retryBtn.replaceWith(retryBtn.cloneNode(true));
    };
  },
};
