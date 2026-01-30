export default {
  id: "rps",
  title: "Pierre / Feuille / Ciseaux",
  hud: "Arbitrage de conflits primitifs…",

  render() {
    return `
      <h2 style="margin:0 0 8px 0">Pierre / Feuille / Ciseaux</h2>
      <p class="muted" style="margin:0 0 14px 0">
        Fais <b>3 points</b> minimum pour passer.
      </p>

      <div class="rpsTop">
        <div class="rpsScore">
          <div><span class="muted">Toi</span> <b id="youScore">0</b></div>
          <div class="muted">—</div>
          <div><span class="muted">Jeu</span> <b id="cpuScore">0</b></div>
        </div>

        <button class="btnGhost" id="rpsReset">
          Reset
        </button>
      </div>

      <div class="rpsArena">
        <div class="rpsHands">
          <div class="rpsHand">
            <div class="muted">Toi</div>
            <div class="rpsPick" id="youPick">—</div>
          </div>
          <div class="rpsHand">
            <div class="muted">Jeu</div>
            <div class="rpsPick" id="cpuPick">—</div>
          </div>
        </div>

        <div class="rpsResult" id="rpsResult"></div>

        <!-- Overlay countdown façon "fable" -->
        <div class="rpsOverlay" id="rpsOverlay" aria-hidden="true">
          <div class="rpsOverlayText" id="rpsOverlayText"></div>
        </div>
      </div>

      <div class="spacer"></div>

      <div class="rpsChoices">
        <button class="btnPrimary rpsBtn" id="pickRock">🪨 Pierre</button>
        <button class="btnPrimary rpsBtn" id="pickPaper">📄 Feuille</button>
        <button class="btnPrimary rpsBtn" id="pickScissors">✂️ Ciseaux</button>
      </div>

      <div class="spacer"></div>
      <p class="muted" id="rpsHint" style="margin:0">
        Choisis ton arme.
      </p>
    `;
  },

  mount(ctx) {

    let score = { you: 0, cpu: 0 };
    let locked = false;

    const youScoreEl = document.querySelector("#youScore");
    const cpuScoreEl = document.querySelector("#cpuScore");
    const resetBtn = document.querySelector("#rpsReset");

    const youPickEl = document.querySelector("#youPick");
    const cpuPickEl = document.querySelector("#cpuPick");
    const resultEl = document.querySelector("#rpsResult");
    const hintEl = document.querySelector("#rpsHint");

    const rockBtn = document.querySelector("#pickRock");
    const paperBtn = document.querySelector("#pickPaper");
    const scBtn = document.querySelector("#pickScissors");

    const overlay = document.querySelector("#rpsOverlay");
    const overlayText = document.querySelector("#rpsOverlayText");

    const TARGET_POINTS = 3;

    const CHOICES = [
      { id: "rock", label: "Pierre", icon: "🪨" },
      { id: "paper", label: "Feuille", icon: "📄" },
      { id: "scissors", label: "Ciseaux", icon: "✂️" },
    ];

    const beats = {
      rock: "scissors",
      paper: "rock",
      scissors: "paper",
    };

    let timers = [];
    const clearTimers = () => {
      timers.forEach(clearTimeout);
      timers = [];
    };

    function setLocked(v) {
      locked = v;
      rockBtn.disabled = v;
      paperBtn.disabled = v;
      scBtn.disabled = v;
      resetBtn.disabled = v;

      hintEl.textContent = v ? "Patiente…" : "Choisis ton arme.";
    }

    function updateScoreUI() {
      youScoreEl.textContent = String(score.you);
      cpuScoreEl.textContent = String(score.cpu);
    }

    function renderPick(el, choice) {
      el.textContent = choice ? `${choice.icon} ${choice.label}` : "—";
    }

    function pickCpu() {
      const i = Math.floor(Math.random() * CHOICES.length);
      return CHOICES[i];
    }

    function outcome(you, cpu) {
      if (you === cpu) return "draw";
      if (beats[you] === cpu) return "win";
      return "lose";
    }

    function didWin() {
      return score.you >= TARGET_POINTS;
    }

    function showOverlay(textHtml) {
      overlayText.innerHTML = textHtml;
      overlay.classList.add("show");
      overlay.setAttribute("aria-hidden", "false");
    }

    function hideOverlay() {
      overlay.classList.remove("show");
      overlay.setAttribute("aria-hidden", "true");
    }

    function finishLevel() {
      setLocked(true);
      resultEl.textContent = "OK. Tu passes.";
      ctx.troll("Très bien. Niveau validé.", 1400);
      timers.push(setTimeout(() => ctx.next(), 900));
    }

    function playRound(youChoice) {
      if (locked) return;

      clearTimers();
      setLocked(true);

      resultEl.textContent = "";
      renderPick(youPickEl, null);
      renderPick(cpuPickEl, null);

      const cpuChoice = pickCpu();

      const steps = ["3", "2", "1", "PIERRE<br>FEUILLE<br>CISEAUX !"];
      let i = 0;

      showOverlay(steps[i]);

      const tick = () => {
        i++;
        if (i < steps.length) {
          showOverlay(steps[i]);
          timers.push(setTimeout(tick, 650));
          return;
        }

        hideOverlay();
        renderPick(youPickEl, youChoice);
        renderPick(cpuPickEl, cpuChoice);

        const res = outcome(youChoice.id, cpuChoice.id);

        if (res === "draw") {
          resultEl.textContent = "Égalité.";
          ctx.troll("Égalité.", 800);
        } else if (res === "win") {
          score.you += 1;
          updateScoreUI();
          resultEl.textContent = "+1 point pour toi.";
          ctx.troll("Point pour toi.", 900);
        } else {
          score.cpu += 1;
          updateScoreUI();
          resultEl.textContent = "+1 point pour le jeu.";
          ctx.troll("Le jeu marque.", 900);
        }

        if (didWin()) {
          timers.push(setTimeout(() => finishLevel(), 450));
          return;
        }

        timers.push(setTimeout(() => setLocked(false), 550));
      };

      timers.push(setTimeout(tick, 650));
    }

    function onReset() {
      clearTimers();
      hideOverlay();

      score = { you: 0, cpu: 0 };
      updateScoreUI();

      renderPick(youPickEl, null);
      renderPick(cpuPickEl, null);
      resultEl.textContent = "";
      setLocked(false);

      ctx.troll("Remise à zéro.", 900);
    }

    rockBtn.addEventListener("click", () => playRound(CHOICES[0]));
    paperBtn.addEventListener("click", () => playRound(CHOICES[1]));
    scBtn.addEventListener("click", () => playRound(CHOICES[2]));
    resetBtn.addEventListener("click", onReset);

    updateScoreUI();
    setLocked(false);
    hideOverlay();

    return () => {
      clearTimers();
      hideOverlay();
      rockBtn.replaceWith(rockBtn.cloneNode(true));
      paperBtn.replaceWith(paperBtn.cloneNode(true));
      scBtn.replaceWith(scBtn.cloneNode(true));
      resetBtn.replaceWith(resetBtn.cloneNode(true));
    };
  },
};
